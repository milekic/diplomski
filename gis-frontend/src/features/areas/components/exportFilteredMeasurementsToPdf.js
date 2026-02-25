import formatMeasuredTime from "../../../shared/utils/formatMeasuredTime";
import formatMeasurementValue from "./formatMeasurementValue";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildRowsHtml(measurements = []) {
  if (!Array.isArray(measurements) || measurements.length === 0) {
    return `
      <tr>
        <td colspan="3" class="empty">Nema podataka za izabrane filtere.</td>
      </tr>
    `;
  }

  return measurements
    .map((measurement) => {
      const eventTypeName = escapeHtml(measurement?.eventTypeName ?? "-");
      const valueText = escapeHtml(
        formatMeasurementValue(measurement?.value, measurement?.unit)
      );
      const measuredTimeText = escapeHtml(
        formatMeasuredTime(measurement?.measuredAtUtc)
      );

      return `
        <tr>
          <td>${eventTypeName}</td>
          <td>${valueText}</td>
          <td>${measuredTimeText}</td>
        </tr>
      `;
    })
    .join("");
}

function buildDocumentHtml({ areaName, measurements }) {
  const nowText = new Intl.DateTimeFormat("bs-BA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());

  return `
    <!doctype html>
    <html lang="bs">
      <head>
        <meta charset="utf-8" />
        <title>Izvoz mjerenja - ${escapeHtml(areaName)}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #1f2937;
            margin: 24px;
          }

          h1 {
            font-size: 20px;
            margin: 0 0 8px 0;
          }

          .meta {
            margin-bottom: 16px;
            font-size: 13px;
            color: #4b5563;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
          }

          th, td {
            border: 1px solid #d1d5db;
            padding: 8px;
            text-align: left;
            vertical-align: top;
          }

          th {
            background: #f3f4f6;
          }

          .empty {
            text-align: center;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <h1>Detalji oblasti - filtrirana mjerenja</h1>
        <div class="meta"><strong>Oblast:</strong> ${escapeHtml(areaName)}</div>
        <div class="meta"><strong>Vrijeme izvoza:</strong> ${escapeHtml(nowText)}</div>

        <table>
          <thead>
            <tr>
              <th>Tip događaja</th>
              <th>Vrijednost</th>
              <th>Vrijeme</th>
            </tr>
          </thead>
          <tbody>
            ${buildRowsHtml(measurements)}
          </tbody>
        </table>
      </body>
    </html>
  `;
}

export default function exportFilteredMeasurementsToPdf({
  areaName = "-",
  measurements = [],
}) {
  const html = buildDocumentHtml({ areaName, measurements });
  const htmlBlob = new Blob([html], { type: "text/html" });
  const htmlBlobUrl = URL.createObjectURL(htmlBlob);

  const printFrame = document.createElement("iframe");
  printFrame.setAttribute("aria-hidden", "true");
  printFrame.style.position = "fixed";
  printFrame.style.width = "0";
  printFrame.style.height = "0";
  printFrame.style.border = "0";
  printFrame.style.right = "0";
  printFrame.style.bottom = "0";
  document.body.appendChild(printFrame);

  let cleanedUp = false;
  const cleanup = () => {
    if (cleanedUp) return;
    cleanedUp = true;
    URL.revokeObjectURL(htmlBlobUrl);
    printFrame.remove();
  };

  printFrame.onload = () => {
    const printWindow = printFrame.contentWindow;
    if (!printWindow) {
      cleanup();
      return;
    }

    printWindow.onafterprint = cleanup;
    printWindow.focus();
    printWindow.print();

    
    window.setTimeout(cleanup, 3000);
  };

  printFrame.src = htmlBlobUrl;

  return true;
}
