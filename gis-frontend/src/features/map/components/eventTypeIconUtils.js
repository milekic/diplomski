import apiClient from "../../../shared/api/apiClient";
import { iconForEventTypeName } from "./eventIcons";

export async function loadEventTypeMetaById() {
  try {
    const res = await apiClient.get("/eventtypes");
    const list = Array.isArray(res.data) ? res.data : [];

    const iconById = {};
    const nameById = {};
    const unitById = {};

    for (const et of list) {
      const id = et.id ?? et.Id;
      const name = et.name ?? et.Name;
      const unit = et.unit ?? et.Unit;
      if (id != null) {
        const numericId = Number(id);
        iconById[numericId] = iconForEventTypeName(name);
        nameById[numericId] = name ?? "-";
        unitById[numericId] = unit ?? "";
      }
    }

    return { iconById, nameById, unitById };
  } catch {
    return { iconById: {}, nameById: {}, unitById: {} };
  }
}

export async function loadEventTypeIconById() {
  const { iconById } = await loadEventTypeMetaById();
  return iconById;
}
