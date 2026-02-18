import { useEffect, useMemo, useState } from "react";
import { Tree } from "antd";
import { getVisibleAreas } from "./visibleAreasApi";

export default function LayersTree({ onLayersChange }) {
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [areas, setAreas] = useState([]);

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

      
      if (onLayersChange) {
        const monitoredIds = monitoredKeys
          .map((k) => Number(k.replace("area-", "")))
          .filter(Number.isFinite);

        onLayersChange(monitoredIds);
      }
    } catch (e) {
      //console.error("Ne mogu učitati oblasti (/areas/visible):", e);
      setAreas([]);
      setCheckedKeys([]);
    }
  })();
}, []);


  const treeData = useMemo(() => {
    const globalAreas = areas
      .filter((a) => a.isGlobal)
      .map((a) => ({
        title: a.name,         
        key: `area-${a.id}`,   
        isLeaf: true,
      }));

    const myAreas = areas
      .filter((a) => !a.isGlobal)
      .map((a) => ({
        title: a.name,
        key: `area-${a.id}`,
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

  const onCheck = (newCheckedKeys) => {
    setCheckedKeys(newCheckedKeys);

    if (onLayersChange) {
      const areaIds = newCheckedKeys
        .filter((k) => typeof k === "string" && k.startsWith("area-"))
        .map((k) => Number(k.replace("area-", "")))
        .filter((id) => Number.isFinite(id));

      onLayersChange(areaIds);
    }
  };

  return (
    <Tree
      style={{ fontSize: "17px" }}
      checkable
      defaultExpandAll
      checkedKeys={checkedKeys}
      onCheck={onCheck}
      treeData={treeData}
    />
  );
}
