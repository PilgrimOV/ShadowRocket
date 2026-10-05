// Shared source; build.cjs embeds this function into the five pasteable filters.
function subscriptionNames(servers, mode, allowUsTurkey) {
  var vocabulary = {
    NL:"Нидерланды",
    DE:"Германия",
    FR:"Франция",
    AT:"Австрия",
    FI:"Финляндия",
    SE:"Швеция",
    CH:"Швейцария",
    NO:"Норвегия",
    HU:"Венгрия",
    SK:"Словакия",
    SI:"Словения",
    RO:"Румыния",
    PL:"Польша",
    CZ:"Чехия",
    DK:"Дания",
    EE:"Эстония",
    ES:"Испания",
    IT:"Италия",
    IE:"Ирландия",
    LT:"Литва",
    LV:"Латвия",
    LU:"Люксембург",
    MD:"Молдова",
    RS:"Сербия",
    TR:"Турция",
    US:"США",
    RU:"Россия",
    BY:"Беларусь",
    JP:"Япония",
    BE:"Бельгия",
    BG:"Болгария",
    GB:"Великобритания",
    HR:"Хорватия",
    KZ:"Казахстан",
    NG:"Нигерия",
    CA:"Канада",
    UA:"Украина",
    IL:"Израиль",
    AU:"Австралия",
    SG:"Сингапур",
    BR:"Бразилия",
    MX:"Мексика",
    PT:"Португалия",
    MY:"Малайзия",
    KR:"Южная Корея",
    ZA:"Южно-Африканская Республика",
    HK:"Гонконг",
    AR:"Аргентина",
    CO:"Колумбия",
    IN:"Индия",
    AE:"Объединённые Арабские Эмираты",
    PE:"Перу",
    GR:"Греция",
    KG:"Кыргызстан",
    BH:"Бахрейн",
    SA:"Саудовская Аравия",
    TH:"Таиланд",
    QA:"Катар",
    CR:"Коста-Рика",
    EC:"Эквадор",
    ID:"Индонезия",
    PK:"Пакистан",
    IQ:"Ирак",
    IS:"Исландия",
    CL:"Чили",
    GE:"Грузия",
    UZ:"Узбекистан",
    MK:"Северная Македония",
    CY:"Кипр",
    KH:"Камбоджа",
    BD:"Бангладеш",
    TW:"Тайвань",
    PH:"Филиппины",
    AL:"Албания",
    BA:"Босния и Герцеговина",
    AZ:"Азербайджан",
    CN:"Китай",
    AQ:"Антарктида",
    TJ:"Таджикистан",
    EG:"Египет",
    MN:"Монголия",
    BN:"Бруней",
    LK:"Шри-Ланка",
    SS:"Южный Судан",
    LI:"Лихтенштейн",
    VN:"Вьетнам"
  };
  var extraNames = {
    RU:"Russia", BY:"Белоруссия|Belarus", JP:"Japan",
    US:"USA|United States|United States of America", GB:"Great Britain|UK",
    NL:"Netherlands|Holland|Голландия", KR:"South Korea",
    KG:"Киргизия", ZA:"ЮАР|Южная Африка", AE:"ОАЭ|UAE",
    CZ:"Czech Republic", BA:"Bosnia|Босния", MK:"Македония|Macedonia", MD:"Молдавия",
    CN:"China", TR:"Turkey|Türkiye", HK:"Hong Kong",
    TW:"Taiwan", VN:"Vietnam"
  };
  var countries = {}, codes = Object.keys(vocabulary), letters = "A-Za-zА-Яа-яЁё", locales;
  try { locales = [new Intl.DisplayNames(["ru"], {type:"region"}), new Intl.DisplayNames(["en"], {type:"region"})]; } catch (_) {}
  function escape(s) { return s.replace(/[.*+?^{}()|[\]\\$]/g, "\\$&"); }
  function countryInfo(code) {
    if (!code) return null;
    if (countries[code]) return countries[code];
    var names = (extraNames[code] || "").split("|"), full;
    if (locales) {
      try { full = locales[0].of(code); names.push(full, locales[1].of(code)); } catch (_) {}
    }
    var label = vocabulary[code] || full || code;
    names.push(label);
    names = names.filter(Boolean).sort(function (a, b) { return b.length - a.length; });
    return countries[code] = {label:label.replace(/[\[\](){}]/g, ""), pattern:new RegExp("(^|[^" + letters + "])(?:" +
      names.map(escape).join("|") + ")(?=$|[^" + letters + "])", "gi")};
  }
  var blocked = mode !== "street" ? ("NG CA GB UA IL AU SG BR MX PT MY JP KR ZA HK AR CO IN AE PE GR KG BH KZ SA TH QA CR EC ID PK IQ IS CL GE UZ MK HR CY KH BD TW PH AL BA AZ BY CN AQ TJ EG MN BN LK SS LI" +
    (allowUsTurkey ? "" : " US TR")).split(" ") : [];
  var flags = /[\u{1F1E6}-\u{1F1FF}]{2}/u;
  var hySource = "(?:\\bhysteria|хайстерия|хистерия|гистерия)(?:[\\s_:/-]*(?:(?:v(?:ersion|er)?)[\\s_-]*)?\\d+(?:\\.\\d+)*|\\s*[\\[(]\\s*v?\\d+(?:\\.\\d+)*\\s*[\\])])?|\\bhy(?:s)?(?:[\\s_-]*\\d+(?:\\.\\d+)*)?\\b";
  var protocols = /\b(?:vless|vmess|trojan|shadowsocks|ss|tuic|wireguard|socks[45]?|naive|xhttp|grpc|quic|reality|xtls)(?:[\s_-]*v?\d+(?:\.\d+)*)?\b/gi;
  var ordinary = /^(?:vless(?:\s*\/\s*udp)?|none|tcp|ws|websocket|http|http2|tls)$/i;
  var material = "(?:gold|silver|platinum|magnetit|magnetite|copper|cooper|lead|obsidian|bronze|cobalt|золото|серебро|платина|медь|свинец|кобальт|бронза|магнетит|обсидиан)";
  var aliases = new RegExp("[\\[(]\\s*" + material + "\\s*[\\])]", "gi");
  var cities = /\b(?:Amsterdam|Vienna|Sofia|Brussels|Paris|Prague|Frankfurt|Berlin|Copenhagen|Oulu|Zagreb|Budapest|Dublin|Istanbul|Almaty|Vilnius|Madrid|Milan|New York|NY|Oslo|Warsaw|Stockholm|Los Angeles|LA|Houston|Miami|San Jose|Zurich|Washington)\b|Амстердам|Вена|София|Брюссель|Париж|Прага|Франкфурт|Берлин|Копенгаген|Оулу|Загреб|Будапешт|Дублин|Стамбул|Алматы|Вильнюс|Мадрид|Милан|Нью-Йорк|Осло|Варшава|Стокгольм|Лос-Анджелес|Хьюстон|Майами|Сан-Хосе|Цюрих|Вашингтон/gi;

  function text(value) { return typeof value === "string" ? value.trim() : ""; }
  function stripCountry(s, country) {
    if (!countries[country]) return s;
    if (s.trim().toUpperCase() === country) return "";
    return s.replace(countries[country].pattern, "$1");
  }
  function tidy(s) {
    return s.replace(/[\u{1F1E6}-\u{1F1FF}⚡✅🔑]/gu, "")
      .replace(/[\[\](){}]/g, " ")
      .replace(/[,|;·]+/g, " ").replace(/^[\s:_–—-]+|[\s:_–—-]+$/g, "")
      .replace(/\s+[–—-]\s+/g, " ").replace(/\s+/g, " ").trim();
  }
  function unavailable(s) {
    s = s.replace(/(?:тех[.\s_-]*работы|технические\s+работы)[\s:—–-]*(?:завершены|окончены|закончены|отменены)/gi, "")
      .replace(/\b(?:maintenance|outage|downtime)[\s:—–-]*(?:completed|finished|over|resolved|cancelled)\b/gi, "")
      .replace(/\b(?:no|without)\s+(?:maintenance|outage|downtime)\b/gi, "");
    return /не\s*работает|не\s*работают|тех[.\s_-]*работы|технические\s+работы|недоступ(?:ен|на|но|ны)|на\s+обслуживании|\b(?:offline|down|unavailable|maintenance|outage|not[\s-]+working|out[\s-]+of[\s-]+service)\b/i.test(s);
  }
  function countryOf(flag, s) {
    if (flag) return Array.from(flag).map(function (c) { return String.fromCharCode(c.codePointAt(0) - 0x1F1E6 + 65); }).join("");
    s = s.replace(protocols, "");
    if (/^[A-Z]{2}$/.test(s.trim()) && vocabulary[s.trim()]) return s.trim();
    for (var i = 0; i < codes.length; i++) {
      var pattern = countryInfo(codes[i]).pattern;
      pattern.lastIndex = 0;
      if (pattern.test(s)) return codes[i];
    }
    return "";
  }
  function countryLabel(code) {
    var info = countryInfo(code);
    return info ? info.label : "?";
  }
  function render(server, index) {
    var original = String(server.title || "").replace(/[\uFE0E\uFE0F\u200B]/g, ""), flag = (original.match(flags) || [""])[0];
    if (unavailable(original)) return null;
    var name = original.replace(flags, "").trim();
    var formatted = name.match(mode === "home" ? /^(⚡{1,3})\s*(Дом)\s+(.+)$/u :
      mode === "mixed" ? /^(✅)\s*(Дом|Улица)\s+(.+)$/u : /^(🔑)\s*(Улица)\s+(.+)$/u);
    var providerLightning = /⚡/.test(name), renderedLevel = 0;
    if (formatted) {
      if (mode === "home") renderedLevel = formatted[1].length;
      providerLightning = mode === "home" ? renderedLevel === 2 : /⚡/.test(formatted[3]);
      name = formatted[3];
    }
    var street = mode === "street";
    if (mode === "mixed") {
      var roleTitle = original.replace(/(?:\b(?:no|non|not|without)[\s_-]*|без\s*)(?:whitelist|street|улиц[аы])/gi, "");
      street = (formatted && formatted[2] === "Улица") || /whitelist/i.test(roleTitle) ||
        /(?:^|[^A-Za-zА-Яа-яЁё])(?:Улица|Street)(?=$|[^A-Za-zА-Яа-яЁё])/i.test(roleTitle);
    }
    var country = countryOf(flag, name);
    countryInfo(country);
    if (formatted && !country) name = name.replace(/^\?\s*/, "");
    if (!street && /^(RU|BY|JP)$/.test(country)) return null;
    var type = text(server.type), transport = text(server.obfs) || text(server.transport);
    var hysteria = renderedLevel === 3 || new RegExp(hySource, "i").test(name + " " + type);
    var metadataSpecial = !!((type && !ordinary.test(type)) || (transport && !ordinary.test(transport)));
    var explicitProtocols = [], protocolSpecial = false;
    if (!street) {
      explicitProtocols = stripCountry(name, country).match(protocols) || [];
      protocolSpecial = explicitProtocols.some(function (p) { return !/^(vless|reality|xtls)$/i.test(p); });
    }
    name = name.replace(aliases, "").replace(/\^~\d+~\^/g, "")
      .replace(new RegExp(hySource, "gi"), "")
      .replace(/\bADS\b/gi, "").replace(/whitelist/gi, "")
      .replace(/(?:^|[^A-Za-zА-Яа-яЁё])(?:Обход|Дом|Улица|Home|Street)(?=$|[^A-Za-zА-Яа-яЁё])/gi, " ");
    name = stripCountry(name, country);
    if (mode === "mixed") name = name.replace(/\bExtra\b/gi, "");
    if (!street) {
      var annotationEvidence = name.replace(protocols, "").replace(cities, "").replace(/\btorrent\b|торрент|для\s+работы/gi, "");
      var annotated = /[|[(][^|[\]()]*[A-Za-zА-Яа-яЁё][^|[\]()]*[|\])]?/.test(annotationEvidence) ||
        /скорост|speed|fast|turbo|protocol|transport|протокол|транспорт/i.test(annotationEvidence) ||
        !!(formatted && new RegExp("[" + letters + "]").test(annotationEvidence));
      var special = providerLightning || hysteria || metadataSpecial || protocolSpecial || annotated;
      if (!special && blocked.indexOf(country) >= 0) return null;
    }

    var labels = [];
    if (mode === "home" || (!street && blocked.indexOf(country) >= 0 && protocolSpecial && !metadataSpecial)) {
      explicitProtocols.forEach(function (p) {
        if (!/^(vless|reality|xtls)$/i.test(p) && labels.indexOf(p.toUpperCase()) < 0) labels.push(p.toUpperCase());
      });
      [type, transport].forEach(function (p) {
        if (p && !ordinary.test(p) && !new RegExp(hySource, "i").test(p) && labels.indexOf(p.toUpperCase()) < 0) labels.push(p.toUpperCase());
      });
    }
    name = name.replace(protocols, "");
    // A title-only protocol is still needed for a Home exception on repeat
    // processing when the app supplies no matching protocol/transport field.
    if (mode === "home" || (!street && blocked.indexOf(country) >= 0 && protocolSpecial && !metadataSpecial)) {
      labels.forEach(function (p) {
        var display = tidy(p);
        if (tidy(name).toLowerCase().indexOf(display.toLowerCase()) < 0) name += " " + display;
      });
    }
    if (mode !== "home" && metadataSpecial) {
      [type, transport].forEach(function (p) {
        if (p && !ordinary.test(p)) name = name.replace(new RegExp("(^|[^" + letters + "])(?:" + escape(p) + ")(?=$|[^" + letters + "])", "gi"), "$1");
      });
    }
    name = tidy(name).replace(/\btorrent\b|торрент/gi, "Торрент");
    if (mode === "home" && country === "DE") name = name.replace(/Торрент(?:\s*🎬)?/g, "Торрент 🎬");
    if (/^(?:#?\d+|резерв)$/i.test(name) || new RegExp("^" + material + "$", "i").test(name)) name = "";
    var ordinal = (name.match(/\s+(\d+)$/) || [])[1] || "";
    if (ordinal) name = name.slice(0, -ordinal.length).trim();
    var level = hysteria ? 3 : providerLightning ? 2 : 1;
    var prefix = (flag ? flag + " " : "") + (mode === "home" ? "⚡".repeat(level) : mode === "mixed" ? "✅" : "🔑") +
      " " + (street ? "Улица" : "Дом") + " " + countryLabel(country);
    var row = {server: server, base: prefix + (name ? " " + name : "") +
      (mode !== "home" && (providerLightning || hysteria) ? " ⚡" : "") + (ordinal ? " " + ordinal : "")};
    if (mode === "home") {
      row.index = index;
      row.level = level;
      row.preferred = level === 3 && country === "NL";
    }
    return row;
  }

  var rows = servers.map(render).filter(function (row) { return row !== null; });
  if (mode === "home") rows.sort(function (a, b) {
    return b.level - a.level || b.preferred - a.preferred || a.index - b.index;
  });
  var reserved = Object.create(null), used = Object.create(null), counts = Object.create(null);
  rows.forEach(function (row) { reserved[row.base] = true; });
  return rows.map(function (row) {
    var key = row.base, title = key, number = counts[key] || 1;
    if (used[title]) {
      do { number++; title = row.base + " " + number; } while (reserved[title] || used[title]);
    }
    counts[key] = number; used[title] = true;
    row.server.title = title;
    return row.server;
  });
}
