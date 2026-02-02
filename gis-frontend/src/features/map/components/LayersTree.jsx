import { useState } from "react";
import { Tree } from "antd";

// hardkodovano
const treeData = [
  {
    title: "Globalne mape",
    key: "admin",
    children: [
      { title: "Gradska 2", key: "gradska2" },
      { title: "Katastarska parcela", key: "kat_parcela" },
      { title: "Granica opštine", key: "granica_opstine" },
      { title: "Katastarska opština", key: "kat_opstina" },
    ],
  },
  {
    title: "Moje mape",
    key: "objekti",
    children: [
      { title: "Planirani", key: "obj_planirani" },
      { title: "Postojeći", key: "obj_postojeci" },
    ],
  },
];

export default function LayersTree({ onLayersChange }) {
  const [checkedKeys, setCheckedKeys] = useState([]);

  const onCheck = (newCheckedKeys) => {
    setCheckedKeys(newCheckedKeys);

    // callback ka parentu (dashboardu) ako želiš dalje povezivanje
    if (onLayersChange) onLayersChange(newCheckedKeys);
  };

  return (
    <div>
      <Tree
        style={{ fontSize: "17px" }}
        checkable
        defaultExpandAll
        checkedKeys={checkedKeys}
        onCheck={onCheck}
        treeData={treeData}
      />
    </div>
  );
}
