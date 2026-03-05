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

export function buildStackedBars(rows, chartHeightPx = 340) {
  if (!Array.isArray(rows) || rows.length === 0) return [];

  const maxTotal = rows.reduce(
    (max, row) => (row.totalCount > max ? row.totalCount : max),
    0
  );

  if (maxTotal <= 0) {
    return rows.map((row) => ({
      ...row,
      totalHeight: 0,
      normalHeight: 0,
      criticalHeight: 0,
    }));
  }

  return rows.map((row) => {
    const totalHeight = Math.round((row.totalCount / maxTotal) * chartHeightPx);
    const normalHeight = safeScalePart(row.normalCount, row.totalCount, totalHeight);
    const criticalHeight = safeScalePart(
      row.criticalCount,
      row.totalCount,
      totalHeight
    );

    return {
      ...row,
      totalHeight,
      normalHeight,
      criticalHeight,
    };
  });
}
