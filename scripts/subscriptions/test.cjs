const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const path = require('node:path'), os = require('node:os'), cp = require('node:child_process');
const {views, output} = require('./build.cjs');
const fixtures = [];
function add(name, files, input, titles, ids, repeat = true) {
  fixtures.push({name, files, input: input.map((x, id) => ({id, host: 'synthetic-host', type: 'VLESS', ...x})), titles, ids, repeat});
}
const home = ['home.js', 'home-us-turkey.js'];
const mixed = ['mixed.js', 'mixed-us-turkey.js'];
const all = [...home, ...mixed, 'street-reserve.js'];
const title = x => ({title: x});
add('priority and marker-aware collisions', home, [
  title('🇩🇪 Germany'), title('🇳🇱 ⚡ Netherlands'), title('🇩🇪 Hysteria version 9.1 | Germany'),
  title('🇩🇪 Германия'), title('🇳🇱 Нидерланды HYS4'), title('🇳🇱 ⚡ Нидерланды'),
], ['🇳🇱 ⚡⚡⚡ Дом Нидерланды', '🇩🇪 ⚡⚡⚡ Дом Германия', '🇳🇱 ⚡⚡ Дом Нидерланды',
    '🇳🇱 ⚡⚡ Дом Нидерланды 2', '🇩🇪 ⚡ Дом Германия', '🇩🇪 ⚡ Дом Германия 2'], [4,2,1,5,0,3]);
add('cities and Torrent survive', home, [title('🇺🇸 ⚡ United States — Washington'), title('🇩🇪 Германия Torrent')],
  ['🇺🇸 ⚡⚡ Дом США Washington', '🇩🇪 ⚡ Дом Германия Торрент 🎬'], [0,1]);
add('Torrent/work notes do not override countries', [...home,...mixed], [
  title('🇨🇳 China | Torrent'), title('🇨🇳 China (для работы)'),
], [], []);
add('ordinary far countries hidden', [...home, ...mixed], [
  title('🇨🇳 China'), title('🇱🇮 Лихтенштейн'), title('🇦🇶 Antarctica'),
  title('🇩🇪 Germany'), title('🇳🇴 Norway'), title('🇭🇺 Hungary'), title('🇸🇰 Slovakia'), title('🇷🇴 Romania'),
], null, [3,4,5,6,7]);
for (const file of [...home, ...mixed]) {
  add('US/Turkey variant ' + file, [file], [title('🇺🇸 USA Washington'), title('🇹🇷 Turkey Istanbul')],
    null, file.includes('us-turkey') ? [0,1] : []);
}
for (const country of ['🇷🇺 Россия', '🇧🇾 Belarus', '🇯🇵 Japan', 'Russia', 'Беларусь', 'Япония']) {
  add('unconditional home exclusion ' + country, [...home, ...mixed], [
    title(country), title(country + ' ⚡'), {title:country, type:'Hysteria2'}, {title:country, obfs:'xhttp'},
    title(country + ' | FutureProtocol9'),
  ], [], []);
}
add('country flag wins over country spelling', all, [title('🇩🇪 Russia')], null, [0]);
add('mixed Street cue and metadata markers', mixed, [
  title('🇷🇺 Russia WHITELIST'), title('🇯🇵 whitelist Japan'), title('🇨🇳 China (Whitelist)'),
  title('🇩🇪 Germany ⚡ whitelist'), {title:'🇳🇱 Netherlands whitelist',type:'Hysteria2'},
  {title:'🇳🇱 Netherlands whitelist',type:'VLESS',obfs:'xhttp'},
  title('🇳🇱 Netherlands whitelist'), title('🇫🇷 France Paris'),
], ['🇷🇺 ✅ Улица Россия', '🇯🇵 ✅ Улица Япония', '🇨🇳 ✅ Улица Китай',
    '🇩🇪 ✅ Улица Германия ⚡', '🇳🇱 ✅ Улица Нидерланды ⚡',
    '🇳🇱 ✅ Улица Нидерланды', '🇳🇱 ✅ Улица Нидерланды 2', '🇫🇷 ✅ Дом Франция Paris'], [0,1,2,3,4,5,6,7]);
add('negative whitelist is not Street', mixed, [
  title('🇷🇺 Russia no-whitelist'), title('🇧🇾 Belarus NONWHITELIST'), title('🇯🇵 Japan without whitelist'),
  title('🇷🇺 Russia no Street'), title('🇷🇺 Russia без улицы'),
], [], []);
add('emoji presentation does not create invisible distinctions', home, [
  title('🇩🇪 ⚡️ Germany'), title('🇩🇪 ⚡ Germany'),
], ['🇩🇪 ⚡⚡ Дом Германия', '🇩🇪 ⚡⚡ Дом Германия 2'], [0,1]);
add('emoji presentation does not create invisible distinctions', [...mixed,'street-reserve.js'], [
  title('🇩🇪 ⚡️ Germany'), title('🇩🇪 ⚡ Germany'),
], null, [0,1]);
add('country code SS is not a protocol marker', home, [title('🇸🇸 SS')], [], []);
const commonCountries = [
  ['NL','Netherlands','Нидерланды'],['DE','Germany','Германия'],['FR','France','Франция'],['AT','Austria','Австрия'],
  ['FI','Finland','Финляндия'],['SE','Sweden','Швеция'],['CH','Switzerland','Швейцария'],['NO','Norway','Норвегия'],
  ['HU','Hungary','Венгрия'],['SK','Slovakia','Словакия'],['SI','Slovenia','Словения'],['RO','Romania','Румыния'],
  ['PL','Poland','Польша'],['CZ','Czech Republic','Чехия'],['DK','Denmark','Дания'],['EE','Estonia','Эстония'],
  ['ES','Spain','Испания'],['IT','Italy','Италия'],['IE','Ireland','Ирландия'],['LT','Lithuania','Литва'],
  ['LV','Latvia','Латвия'],['LU','Luxembourg','Люксембург'],['MD','Moldova','Молдова'],['RS','Serbia','Сербия'],
  ['TR','Turkey','Турция'],['US','United States','США'],['RU','Russia','Россия'],['BY','Belarus','Беларусь'],
  ['JP','Japan','Япония'],['BE','Belgium','Бельгия'],['BG','Bulgaria','Болгария'],['HR','Croatia','Хорватия'],
  ['KZ','Kazakhstan','Казахстан'],['CN','China','Китай'],['HK','Hong Kong','Гонконг'],['TW','Taiwan','Тайвань'],
];
const flagOf = code => Array.from(code).map(c=>String.fromCodePoint(0x1F1E6+c.charCodeAt(0)-65)).join('');
add('common country names normalize across engines', ['street-reserve.js'],
  commonCountries.map(([code,full])=>title(flagOf(code)+' '+full)),
  commonCountries.map(([code,_,short])=>flagOf(code)+' 🔑 Улица '+short),
  commonCountries.map((_,id)=>id));
add('key aliases and protocol metadata', ['street-reserve.js'], [
  title('🇩🇪 ⚡ Обход [Gold] - Германия'),
  {title:'🇩🇪 Обход [Cooper] — Germany',type:'Hysteria2'},
  {title:'🇩🇪 Обход [Lead] - Германия',obfs:'xhttp'},
  title('🇩🇪 Обход [Cobalt] - Германия'), title('🇷🇺 Обход [Silver] - Россия'),
  title('🇨🇳 Обход [Silver] - China'), title('🇯🇵 Japan'),
], ['🇩🇪 🔑 Улица Германия ⚡', '🇩🇪 🔑 Улица Германия ⚡ 2',
    '🇩🇪 🔑 Улица Германия', '🇩🇪 🔑 Улица Германия 2',
    '🇷🇺 🔑 Улица Россия', '🇨🇳 🔑 Улица Китай', '🇯🇵 🔑 Улица Япония'], [0,1,2,3,4,5,6]);
for (const label of ['Hysteria','Hysteria2','Hysteria 3','HYSTERIA-v12','Hysteria version 4',
  'Hysteria 2.1','Hysteria (v3)','Hysteria [v7]','HY2','hy-3','HYS4','Хайстерия 2','Хистерия3','Гистерия 2']) {
  add('Hysteria spelling ' + label, home, [title('🇨🇳 ' + label + ' | Китай')], ['🇨🇳 ⚡⚡⚡ Дом Китай'], [0]);
  add('single trailing Hysteria marker ' + label, [...mixed, 'street-reserve.js'],
    [title('🇩🇪 ⚡ ' + label + ' | Германия')], null, [0]);
}
const newProtocolInputs = [
  title('🇨🇳 China (experimental)'), title('🇨🇳 China | FutureTransport9'), title('🇨🇳 China | FutureProtocol8'),
  {title:'🇨🇳 China',type:'FutureProtocol7'}, title('🇨🇳 China скорость'), title('🇨🇳 ⚡ China'),
];
add('unknown annotations and protocols retained', home, newProtocolInputs, null, [5,0,1,2,3,4]);
add('unknown annotations and protocols retained', mixed, newProtocolInputs, null, [0,1,2,3,4,5]);
add('metadata permits hidden protocol label', mixed, [{title:'🇨🇳 China (XHTTP)',obfs:'xhttp'}], ['🇨🇳 ✅ Дом Китай'], [0]);
add('metadata protocol punctuation is escaped literally', mixed,
  [{title:'🇨🇳 China (Future.Protocol+)',type:'Future.Protocol+'}], ['🇨🇳 ✅ Дом Китай'], [0]);
add('metadata protocol punctuation is escaped literally', ['street-reserve.js'],
  [{title:'🇨🇳 China (Future.Protocol+)',type:'Future.Protocol+'}], ['🇨🇳 🔑 Улица Китай'], [0]);
add('ordinary displayed protocol omitted', mixed, [title('🇩🇪 Germany (XHTTP)')], ['🇩🇪 ✅ Дом Германия'], [0]);
add('title-only protocol fallback stays visible', mixed, [title('🇨🇳 China (XHTTP)')], null, [0]);
add('formatted prefix is not provider lightning', home,
  [title('🇨🇳 ⚡ Дом Китай'), title('🇨🇳 ⚡Дом Китай'), title('🇨🇳 ⚡⚡ Дом Китай')],
  ['🇨🇳 ⚡⚡ Дом Китай'], [2]);
for (const status of ['не работает','НЕ РАБОТАЕТ','не работают','техработы','тех-работы','тех. работы','технические работы',
  'maintenance','OFFLINE','not working','out of service','недоступен']) {
  add('outage ' + status, all, [title('🇩🇪 ⚡ Германия Hysteria (' + status + ')'), title('🇩🇪 Germany')], null, [1]);
}
for (const note of ['для работы','работает','техработы завершены','технические работы окончены',
  'техработы: завершены','maintenance: completed','maintenance completed','no maintenance']) {
  add('positive work status ' + note, all, [title('🇩🇪 Germany ' + note)], null, [0]);
}
add('no country guessed from an alias', all, [title('NewNode (experimental)'), title(''), {}], null, [0,1,2]);
add('NO in a status is not Norway', all, [title('No maintenance')], null, [0]);
add('Norway keeps a negated status intact', ['street-reserve.js'], [title('🇳🇴 No maintenance')],
  ['🇳🇴 🔑 Улица Норвегия No maintenance'], [0]);
add('unflagged protocol is not a country code', home, [{title:'SS NewNode',type:'SS'}],
  ['⚡ Дом ? NewNode SS'], [0]);
add('partial fields do not become protocol names', all, [
  {title:'🇩🇪 Germany',type:2,obfs:3}, {title:'🇩🇪 Germany',type:'VLESS / UDP'},
], null, [0,1]);
add('current snapshot singleton', all, [title('🇳🇱 Netherlands')], null, [0]);
add('literal ordinal does not collide with generated ordinal', all, [
  title('🇩🇪 Germany Washington'), title('🇩🇪 Germany Washington'), title('🇩🇪 Germany Washington 2'),
], null, [0,1,2]);
add('new country remains visible', all, [title('🇻🇳 Vietnam'), title('🇷🇼 Rwanda')], null, [0,1]);
add('useful unknown alias remains visible', all, [title('🇩🇪 Обход [FutureTransport9] - Германия')], null, [0]);
add('city Gold Coast is not a metal alias', all, [title('🇩🇪 Germany Gold Coast')], null, [0]);
add('legacy reserve index is replaced', ['street-reserve.js'], [title('🇩🇪 🔑 Улица [резерв] 7')],
  ['🇩🇪 🔑 Улица Германия'], [0]);
add('provider ordinal decoration is removed', all, [title('🇩🇪 Обход [Gold] - Германия ^~8~^')], null, [0]);

add('mixed Extra is removed as a whole word', mixed, [
  title('🇩🇪 Germany Extra'), title('🇩🇪 EXTRA Germany whitelist ⚡'), title('🇩🇪 Germany Extraordinary'),
], ['🇩🇪 ✅ Дом Германия', '🇩🇪 ✅ Улица Германия ⚡', '🇩🇪 ✅ Дом Германия Extraordinary'], [0,1,2]);
add('mixed Extra alone is not a country exception', mixed, [title('🇨🇳 China (Extra)')], [], []);
add('collision ordinals follow trailing lightning', mixed, [
  title('🇩🇪 ⚡ Germany'), title('🇩🇪 ⚡ Germany'), title('🇩🇪 ⚡ Germany'),
], ['🇩🇪 ✅ Дом Германия ⚡', '🇩🇪 ✅ Дом Германия ⚡ 2', '🇩🇪 ✅ Дом Германия ⚡ 3'], [0,1,2]);
add('collision ordinals follow trailing lightning', ['street-reserve.js'], [
  title('🇩🇪 ⚡ Germany'), title('🇩🇪 ⚡ Germany'),
], ['🇩🇪 🔑 Улица Германия ⚡', '🇩🇪 🔑 Улица Германия ⚡ 2'], [0,1]);
add('legacy abbreviation migrates to full plain country', home, [
  title('🇩🇪 ⚡⚡⚡ Дом [Герм]'), title('🇳🇱 ⚡⚡ Дом [Нидер]'),
], ['🇩🇪 ⚡⚡⚡ Дом Германия', '🇳🇱 ⚡⚡ Дом Нидерланды'], [0,1]);
add('brackets are removed from useful notes', all, [
  title('🇩🇪 Germany (experimental) [speed] {fast}'),
], null, [0]);
add('long country aliases are consumed fully', ['street-reserve.js'], [
  title('🇺🇸 United States of America'), title('🇦🇪 UAE'), title('🇿🇦 South Africa'),
], ['🇺🇸 🔑 Улица США', '🇦🇪 🔑 Улица Объединённые Арабские Эмираты',
    '🇿🇦 🔑 Улица Южно-Африканская Республика'], [0,1,2]);

add('German Home Torrent movie marker is not repeated', home, [title('🇩🇪 ⚡ Дом [Герм] Торрент 🎬')], ['🇩🇪 ⚡ Дом Германия Торрент 🎬'], [0]);
add('metadata version brackets do not duplicate a label', home,
  [{title:'🇨🇳 China',type:'Future(2)'}], ['🇨🇳 ⚡ Дом Китай FUTURE 2'], [0]);

add('Netherlands priority applies only to Hysteria in Home', home, [
  title('🇩🇪 Germany'), title('🇳🇱 Netherlands'), title('🇩🇪 ⚡ Germany'),
  title('🇳🇱 ⚡ Netherlands'), title('🇳🇱 Hysteria Netherlands'), title('🇩🇪 Hysteria Germany'),
], ['🇳🇱 ⚡⚡⚡ Дом Нидерланды', '🇩🇪 ⚡⚡⚡ Дом Германия',
    '🇩🇪 ⚡⚡ Дом Германия', '🇳🇱 ⚡⚡ Дом Нидерланды',
    '🇩🇪 ⚡ Дом Германия', '🇳🇱 ⚡ Дом Нидерланды'], [4,5,2,3,0,1]);
add('previous full US label is normalized', ['home-us-turkey.js'],
  [title('🇺🇸 ⚡ Дом Соединённые Штаты Америки Лос-Анджелес')],
  ['🇺🇸 ⚡ Дом США Лос-Анджелес'], [0]);

// Recreate the native wrapping boundary, including its later function declaration.
function wrap(source) {
  return 'function $js_filter_server($server,$index,$context){\n' + source +
    '\n; return true; }\nfunction $js_filter_servers($servers){var result=[],context={};' +
    'for(var i=0;i<$servers.length;i++){var $server=$servers[i];' +
    'if($js_filter_server($server,i,context))result.push($server);}return result;} true;';
}
const suites = [];
for (const [file, [mode, extra]] of Object.entries(views)) {
  assert.equal(fs.readFileSync(path.join(__dirname,file),'utf8'), output(mode,extra), 'stale output ' + file);
  const context = vm.createContext({});
  assert.equal(vm.runInContext(wrap(output(mode,extra)),context), true);
  const cases = fixtures.filter(x => x.files.includes(file));
  const run = input => JSON.parse(vm.runInContext('JSON.stringify($js_filter_servers(' + JSON.stringify(input) + '))',context));
  for (const c of cases) validate(file,c,run(c.input),run);
  suites.push({file, source:output(mode,extra), cases});
  console.log('PASS: ' + file + ' (' + cases.length + ' scenarios)');
}
function validate(file, c, result, run) {
  const label = file + ': ' + c.name;
  assert.deepEqual(result.map(x=>x.id),c.ids,label+' retention/order');
  if (c.titles) assert.deepEqual(result.map(x=>x.title),c.titles,label+' display');
  assert.equal(new Set(result.map(x=>x.title)).size,result.length,label+' unique names');
  for (const server of result) {
    const {title:_,...actual}=server, {title:__,...original}=c.input.find(x=>x.id===server.id);
    assert.deepEqual(actual,original,label+' only title changes');
    assert(!/[\[\](){}]/.test(server.title),label+' bracket-free display');
    assert(!/\bhysteria\b|хайстерия|\bhy[0-9]/i.test(server.title),label+' Hysteria word removed');
    if (!file.startsWith('home')) {
      assert(!/⚡⚡/.test(server.title),label+' one trailing lightning');
      if (/⚡/.test(server.title)) assert(/ ⚡(?: \d+)*$/.test(server.title),label+' ordinal follows marker');
    }
  }
  if (c.repeat) assert.deepEqual(run(result),result,label+' repeat processing');
}
if (process.argv.includes('--native')) {
  const app=process.env.SHADOWROCKET_EXECUTABLE || '/Applications/Shadowrocket.app/Contents/MacOS/Shadowrocket';
  const lines=cp.execFileSync('/usr/bin/strings',[app],{encoding:'utf8',maxBuffer:32*1024*1024}).split('\n');
  const i=lines.findIndex(x=>x.startsWith('function $js_filter_server($server, $index, $context)'));
  assert(i>=0,'installed wrapper not found; recheck the integration boundary');
  const template=lines.slice(i,i+2).join('\n');
  assert(template.includes('function $js_filter_servers($servers)') && template.split('%@').length===2,'installed wrapper changed');
  const inputs=suites.map(s=>({file:s.file,source:template.replace('%@',()=>s.source),cases:s.cases}));
  const script="ObjC.import('JavaScriptCore');\nvar suites="+JSON.stringify(inputs)+";\nvar outputs=suites.map(function(s){var c=$.JSContext.alloc.init;c.evaluateScript(s.source);return {file:s.file,results:s.cases.map(function(t){var expr='JSON.stringify($js_filter_servers('+JSON.stringify(t.input)+'))';var first=JSON.parse(ObjC.unwrap(c.evaluateScript(expr).toObject));var second=JSON.parse(ObjC.unwrap(c.evaluateScript('JSON.stringify($js_filter_servers('+JSON.stringify(first)+'))').toObject));return {first:first,second:second};})};});\nJSON.stringify(outputs);\n";
  const folder=fs.mkdtempSync(path.join(os.tmpdir(),'shadowrocket-native-test-'));
  try {
    const target=path.join(folder,'probe.js');fs.writeFileSync(target,script);
    const results=JSON.parse(cp.execFileSync('/usr/bin/osascript',['-l','JavaScript',target],{encoding:'utf8',maxBuffer:16*1024*1024}));
    for (const suite of results) {
      const cases=suites.find(s=>s.file===suite.file).cases;
      suite.results.forEach((r,i)=>{validate(suite.file,cases[i],r.first,()=>r.second);});
    }
    console.log('PASS: all five filters in JavaScriptCore using the installed native wrapper');
  } finally { fs.rmSync(folder,{recursive:true,force:true}); }
}
console.log('PASS: '+suites.reduce((sum,s)=>sum+s.cases.length,0)+' behavioral scenarios; no private data');
