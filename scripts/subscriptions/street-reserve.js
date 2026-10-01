var name = String($server.title || "");
var flag = (name.match(/[\u{1F1E6}-\u{1F1FF}]{2}/u) || [""])[0];
var formatted = /🔑\s*Улица\s*\[резерв\]$/i.test(name.trim());
name = name.replace(flag, "").trim()
  .replace(/^🔑\s*(?:Улица\s*\[резерв\]\s*)?/i, "")
  .replace(/\s*🔑\s*Улица\s*\[резерв\]$/i, "").trim();
var lightning = /⚡/.test(name);
name = name.replace(/⚡/g, "").trim();
if (!formatted) name = name.replace(/^Обход(?:\s+|(?=\[)|$)/i, "").trim();
// Only remove a redundant country for the matching flag. Keep unknown text.
var countries = {
  "🇵🇱": "Польша|Poland", "🇩🇪": "Германия|Germany",
  "🇳🇱": "Нидерланды|Netherlands", "🇷🇺": "Россия|Russia"
};
var parts = !formatted && name.match(/^\[([^\]]+)\]\s*[-–—]\s*(.+)$/);
if (parts) {
  var tail = parts[2];
  if (countries[flag]) tail = tail.replace(new RegExp("^(?:" + countries[flag] + ")(?=$|[\\s|·,;])", "i"), "").replace(/^[\s|·,;]+/, "");
  name = parts[1] + (tail ? " · " + tail : "");
}
// Compact protocol labels, preserving versions and future provider annotations.
function compact(s) {
  return s.replace(/\bhysteria(?:[\s_-]*(?:v(?:ersion)?[\s_-]*)?(\d+(?:\.\d+)*))?\b/gi,
    function (_, version) { return "HY" + (version || ""); })
    .replace(/\^~([^~]+)~\^/g, "#$1")
    .replace(/\s*[|·]\s*/g, " · ").replace(/\s+/g, " ").trim();
}
name = compact(name);
var type = typeof $server.type === "string" ? compact($server.type) : "";
var transport = typeof $server.obfs === "string" ? $server.obfs.trim() : "";
if (/^xhttp$/i.test(transport)) transport = "XHTTP";
[type && !/^vless(?:\s*\/\s*udp)?$/i.test(type) ? type : "",
 transport && !/^(?:none|tcp)$/i.test(transport) ? transport : ""].forEach(function (label) {
  if (!label) return;
  var escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (!new RegExp("(^|[^a-z0-9])" + escaped + "($|[^a-z0-9])", "i").test(name)) {
    name += (name ? " · " : "") + label;
  }
});
$server.title = (flag ? flag + " " : "") + (lightning ? "⚡ " : "") + (name || "Без названия") + " 🔑 Улица [резерв]";
return true;
