export function escapeHtml(text: string): string {
  if (!text) return "Unknown";
  if (typeof text !== "string") return String(text);

  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return text.replace(/[&<>"']/g, function (m) {
    return map[m];
  });
}
