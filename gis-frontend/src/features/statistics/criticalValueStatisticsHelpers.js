function toNumberOrZero(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function getRowAreaName(row, index) {
  return row?.areaName ?? row?.AreaName ?? `Oblast ${index + 1}`;
}

function getRowAreaId(row, index) {
  return row?.areaId ?? row?.AreaId ?? `area-${index}`;
}

export function normalizeStatisticsRows(rawRows) {
  const rows = Array.isArray(rawRows) ? rawRows : [];

  return rows.map((row, index) => {
    const criticalCount = toNumberOrZero(row?.criticalCount ?? row?.CriticalCount);
    const normalCount = toNumberOrZero(row?.normalCount ?? row?.NormalCount);
    const totalCount = criticalCount + normalCount;

    return {
      areaId: getRowAreaId(row, index),
      areaName: getRowAreaName(row, index),
      criticalCount,
      normalCount,
      totalCount,
    };
  });
}

function safeScalePart(partValue, totalValue, scaledTotalHeight) {
  if (totalValue <= 0 || scaledTotalHeight <= 0) return 0;
  return Math.round((partValue / totalValue) * scaledTotalHeight);
}

function applyMinimumVisibleHeights({
  normalCount,
  criticalCount,
  totalHeight,
  normalHeight,
  criticalHeight,
}) {
  if (totalHeight <= 0) {
    return { normalHeight: 0, criticalHeight: 0 };
  }

  let nextNormalHeight = normalHeight;
  let nextCriticalHeight = criticalHeight;

  if (normalCount > 0 && nextNormalHeight === 0) nextNormalHeight = 2;
  if (criticalCount > 0 && nextCriticalHeight === 0) nextCriticalHeight = 2;

  const overflow = nextNormalHeight + nextCriticalHeight - totalHeight;
  if (overflow > 0) {
    if (nextNormalHeight >= nextCriticalHeight) {
      nextNormalHeight = Math.max(0, nextNormalHeight - overflow);
    } else {
      nextCriticalHeight = Math.max(0, nextCriticalHeight - overflow);
    }
  }

  return {
    normalHeight: nextNormalHeight,
    criticalHeight: nextCriticalHeight,
  };
}

export function buildStackedBars(rows, chartHeightPx = 340) {
  if (!Array.isArray(rows) || rows.length === 0) return [];

  const maxTotal = rows.reduce(
    (max, row) => (row.totalCount > max ? row.totalCount : max),
    0
  );

  if (maxTotal <= 0) {
    return rows.map((row) => ({
      ...row,
      hasData: false,
      totalHeight: 0,
      normalHeight: 0,
      criticalHeight: 0,
    }));
  }

  return rows.map((row) => {
    const totalHeight = Math.round((row.totalCount / maxTotal) * chartHeightPx);
    const normalHeightRaw = safeScalePart(
      row.normalCount,
      row.totalCount,
      totalHeight
    );
    const criticalHeightRaw = safeScalePart(
      row.criticalCount,
      row.totalCount,
      totalHeight
    );
    const { normalHeight, criticalHeight } = applyMinimumVisibleHeights({
      normalCount: row.normalCount,
      criticalCount: row.criticalCount,
      totalHeight,
      normalHeight: normalHeightRaw,
      criticalHeight: criticalHeightRaw,
    });

    return {
      ...row,
      hasData: row.totalCount > 0,
      totalHeight,
      normalHeight,
      criticalHeight,
    };
  });
}
