import rockfallIcon from "../../../assets/rockfall.png";
import fireIcon from "../../../assets/flammable.png";
import floodIcon from "../../../assets/flood.png";
import temperatureIcon from "../../../assets/temperature.png";
import earthquakeIcon from "../../../assets/earthquake.png";

export const DEFAULT_ICON_URL =
  "https://cdn-icons-png.flaticon.com/512/564/564619.png";

export function iconForEventTypeName(nameRaw) {
  const name = (nameRaw || "").toLowerCase();

  if (name.includes("poplava")) return floodIcon;

  if (name.includes("temperatura")) return temperatureIcon;

  if (name.includes("zemljotres")) return earthquakeIcon;

  if (name.includes("po\u017ear") || name.includes("pozar")) return fireIcon;

  if (name.includes("klizi\u0161te")) return rockfallIcon;

  return DEFAULT_ICON_URL;
}
