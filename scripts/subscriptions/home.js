var t = String($server.title || "");
if (/🇷🇺|Россия|\bRussia\b/i.test(t)) return false;
var flag = (t.match(/[\u{1F1E6}-\u{1F1FF}]{2}/u) || [""])[0];
var hidden = "🇳🇬 🇨🇦 🇬🇧 🇺🇦 🇮🇱 🇦🇺 🇸🇬 🇧🇷 🇲🇽 🇵🇹 🇲🇾 🇯🇵 🇰🇷 🇿🇦 🇭🇰 🇦🇷 🇨🇴 🇮🇳 🇦🇪 🇵🇪 🇬🇷 🇰🇬 🇧🇭 🇰🇿 🇸🇦 🇹🇭 🇶🇦 🇨🇷 🇪🇨 🇮🇩 🇵🇰 🇮🇶 🇮🇸 🇨🇱 🇬🇪 🇺🇿 🇲🇰 🇭🇷 🇨🇾 🇰🇭 🇧🇩 🇹🇼 🇵🇭 🇦🇱 🇧🇦 🇦🇿 🇧🇾 🇨🇳 🇦🇶 🇹🇯 🇪🇬 🇲🇳 🇧🇳 🇱🇰 🇸🇸 🇱🇮 🇺🇸 🇹🇷";

var name = t.replace(flag, "").trim();
var old = name.match(/^(⚡{1,3})Дом \[(.*)\]$/);
var level = old ? old[1].length : (/⚡/.test(name) ? 2 : 1);
if (old) name = old[2];
var hy = /(?:hysteria|хайстерия|хистерия|гистерия)(?:[\s_-]*(?:v(?:ersion)?[\s_-]*)?\d+(?:\.\d+)*|\s*[\[(]\s*v?\d+(?:\.\d+)*\s*[\])])?|\bhy(?:s)?[\s_-]*\d+(?:\.\d+)*/i;
var type = typeof $server.type === "string" ? $server.type.trim() : "";
var hysteria = level === 3 || hy.test(name) || hy.test(type);
var annotated = /\||\([^)]*\S[^)]*\)|\[[^\]]*\S[^\]]*\]/.test(name);
var special = level > 1 || hysteria || (type && !/^vless(?:\s*\/\s*udp)?$/i.test(type)) || /\bxhttp\b/i.test(name) || annotated;
if (/работы|torrent/i.test(name)) return false;
if (!special && flag && hidden.indexOf(flag) >= 0) return false;
if (hysteria) level = 3;
name = name.replace(/[\u{1F1E6}-\u{1F1FF}⚡]/gu, "")
  .replace(new RegExp(hy.source, "gi"), "")
  .replace(/\(\s*\)|\[\s*\]/g, "")
  .replace(/\bADS\b/gi, "").replace(/,/g, " ")
  .replace(/^[\s|;:_–—-]+|[\s|;:_–—-]+$/g, "")
  .replace(/\s+/g, " ").trim();
$server.title = (flag ? flag + " " : "") + "⚡".repeat(level) + "Дом [" + name + "]";
return true;
