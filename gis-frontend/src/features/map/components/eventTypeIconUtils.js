import apiClient from "../../../shared/api/apiClient";
import { iconForEventTypeName } from "./eventIcons";

export async function loadEventTypeIconById() {
  try {
    const res = await apiClient.get("/eventtypes");
    const list = Array.isArray(res.data) ? res.data : [];

    const map = {};
    for (const et of list) {
      const id = et.id ?? et.Id;
      const name = et.name ?? et.Name;
      if (id != null) {
        map[Number(id)] = iconForEventTypeName(name);
      }
    }

    return map;
  } catch {
    return {};
  }
}
