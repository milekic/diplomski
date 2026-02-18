import { useEffect, useMemo, useState } from "react";
import { Tree } from "antd";
import { getVisibleAreas } from "./visibleAreasApi";

export default function LayersTree({ onLayersChange }) {
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [areas, setAreas] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState(["global", "my"]); // <- automatski razgranjeno
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getVisibleAreas();
        const list = Array.isArray(data) ? data : [];
        setAreas(list);

        // auto-check monitored
        const monitoredKeys = list
          .filter((a) => (a.isMonitored ?? a.IsMonitored) === true)
          .map((a) => `area-${a.id ?? a.Id}`);

        setCheckedKeys(monitoredKeys);

        
        setExpandedKeys(["global", "my"]);
        setAutoExpandParent(true);

        if (onLayersChange) {
          const monitoredIds = monitoredKeys
            .map((k) => Number(k.replace("area-", "")))
            .filter(Number.isFinite);

          onLayersChange(monitoredIds);
        }
      } catch (e) {
        setAreas([]);
        setCheckedKeys([]);
        setExpandedKeys(["global", "my"]);
      }
    })();
  }, [onLayersChange]);

  const treeData = useMemo(() => {
    const globalAreas = areas
      .filter((a) => (a.isGlobal ?? a.IsGlobal) === true)
      .map((a) => ({
        title: a.name ?? a.Name,
        key: `area-${a.id ?? a.Id}`,
        isLeaf: true,
      }));

    const myAreas = areas
      .filter((a) => (a.isGlobal ?? a.IsGlobal) !== true)
      .map((a) => ({
        title: a.name ?? a.Name,
        key: `area-${a.id ?? a.Id}`,
        isLeaf: true,
      }));

    return [
      {
        title: "Globalne oblasti",
        key: "global",
        children: globalAreas,
      },
      {
        title: "Moje oblasti",
        key: "my",
        children: myAreas,
      },
    ];
  }, [areas]);

  const onCheck = (newCheckedKeysValue) => {
    const keysArray = Array.isArray(newCheckedKeysValue)
      ? newCheckedKeysValue
      : newCheckedKeysValue?.checked || [];

    setCheckedKeys(keysArray);

    if (onLayersChange) {
      const areaIds = keysArray
        .filter((k) => typeof k === "string" && k.startsWith("area-"))
        .map((k) => Number(k.replace("area-", "")))
        .filter(Number.isFinite);

      onLayersChange(areaIds);
    }
  };

  const onExpand = (newExpandedKeys) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  return (
    <Tree
      style={{ fontSize: "17px" }}
      checkable
      expandedKeys={expandedKeys}
      autoExpandParent={autoExpandParent}
      onExpand={onExpand}
      checkedKeys={checkedKeys}
      onCheck={onCheck}
      treeData={treeData}
    />
  );
}
