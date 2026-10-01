const fs = require('fs'), assert = require('assert/strict');
let checks=0;
function run(fn, input, expected, output) {
 const node={host:'preserved',...input};
 const result=fn(node);assert.equal(result,expected,input.title);checks++;
 assert.equal(node.host,'preserved');
 for(const key of Object.keys(input).filter(k=>k!=='title'))assert.deepEqual(node[key],input[key]);
 if(expected) {
  if(output)assert.equal(node.title,output,input.title);
  const title=node.title;assert.equal(fn(node),true,title);assert.equal(node.title,title);checks++;
 } else assert.equal(node.title,input.title);
 return node;
}
for(const [file,key] of [['home.js','base'],['home-us-turkey.js','plus']]) {
 const fn=new Function('$server',fs.readFileSync(__dirname+'/'+file,'utf8'));
 for(const title of ['🇳🇴 Норвегия','🇭🇺 Венгрия','🇸🇰 Словакия','🇷🇴 Румыния','🇩🇪 Германия','🇳🇱 Нидерланды'])run(fn,{title,type:'VLESS'},true);
 for(const title of ['🇦🇶 Антарктида','🇹🇯 Таджикистан','🇪🇬 Египет','🇲🇳 Монголия','🇧🇳 Бруней','🇱🇰 Шри-Ланка','🇸🇸 Южный Судан'])run(fn,{title,type:'VLESS'},false);
 for(const label of ['Hysteria','Hysteria2','Hysteria 3','HYSTERIA-v12','Hysteria version 4','Hysteria 2.1','Hysteria (v3)','Hysteria [v7]','Hysteria [3.5]','HY2','hy-3','HYS4','Хайстерия 2','Хистерия3','Гистерия 2']) {
  for(const title of [`🇨🇳 ${label} | Китай`,`🇨🇳 Китай | ${label}`,`🇨🇳 Китай (${label})`])run(fn,{title},true,'🇨🇳 ⚡⚡⚡Дом [Китай]');
 }
 for(const title of ['🇱🇮 Лихтенштейн','🇨🇳 Китай','🇨🇳 ⚡Дом [Китай]'])run(fn,{title,type:'VLESS'},false);
 run(fn,{title:'🇱🇮 ⚡ Лихтенштейн',type:'VLESS'},true,'🇱🇮 ⚡⚡Дом [Лихтенштейн]');
 run(fn,{title:'🇨🇳 Китай',type:'Hysteria2'},true,'🇨🇳 ⚡⚡⚡Дом [Китай]');
 run(fn,{title:'🇨🇳 Китай',type:'FutureProtocol7'},true,'🇨🇳 ⚡Дом [Китай]');
 run(fn,{title:'🇨🇳 Китай',type:'VLESS / UDP'},false);
 run(fn,{title:'🇨🇳 Китай',type:1},false);
 run(fn,{title:'🇨🇳 Китай (xhttp)',type:'VLESS'},true,'🇨🇳 ⚡Дом [Китай (xhttp)]');
 run(fn,{title:'🇨🇳 Китай | FutureProtocol7'},true,'🇨🇳 ⚡Дом [Китай | FutureProtocol7]');
 run(fn,{title:'🇨🇳 Китай (test)'},true,'🇨🇳 ⚡Дом [Китай (test)]');
 run(fn,{title:'🇨🇳 Китай [FutureProtocol7]'},true,'🇨🇳 ⚡Дом [Китай [FutureProtocol7]]');
 run(fn,{title:'🇨🇳 Китай ()'},false);
 run(fn,{title:'🇱🇮 Лихтенштейн (новый протокол)'},true);
 run(fn,{title:'🇨🇳 ⚡ Китай'},true,'🇨🇳 ⚡⚡Дом [Китай]');
 run(fn,{title:'🇨🇳 ⚡⚡⚡Дом [Китай]'},true,'🇨🇳 ⚡⚡⚡Дом [Китай]');
 run(fn,{title:'🇨🇳 ⚡ Китай Torrent'},false);
 run(fn,{title:'🇨🇳 Hysteria для работы'},false);
 run(fn,{title:'🇩🇪 ⚡Дом [Hysteria | Германия]'},true,'🇩🇪 ⚡⚡⚡Дом [Германия]');
 run(fn,{title:'🇩🇪 Германия (xhttp)'},true,'🇩🇪 ⚡Дом [Германия (xhttp)]');
 run(fn,{title:'🇳🇱 Нидерланды ADS'},true,'🇳🇱 ⚡Дом [Нидерланды]');
 run(fn,{title:'🇻🇳 Новая страна'},true,'🇻🇳 ⚡Дом [Новая страна]');
 run(fn,{title:'Новый сервер без флага'},true,'⚡Дом [Новый сервер без флага]');
 for(const title of ['🇺🇸 США','🇹🇷 Турция'])run(fn,{title,type:'VLESS'},key==='plus');
 for(const type of ['VLESS','Hysteria2','FutureProtocol7']) {
  for(const title of ['🇷🇺 Россия','🇷🇺 ⚡ Россия','🇷🇺 Новосибирск (xhttp)','🇷🇺 Hysteria 3 | Россия','🇷🇺 ⚡⚡⚡Дом [Россия]','Россия | NewProtocol','Russia (xhttp)'])run(fn,{title,type},false);
 }
 console.log('PASS: '+file);
}
const reserve = new Function('$server', fs.readFileSync(__dirname+'/street-reserve.js','utf8'));
const reserveCases = [
 [{title:'🇩🇪 ⚡ Обход [Alpha] - Германия',type:'VLESS',obfs:'none'},'🇩🇪 ⚡ Alpha 🔑 Улица [резерв]'],
 [{title:'🇳🇱 Обход [Beta] - Нидерланды',type:'Hysteria2'},'🇳🇱 Beta · HY2 🔑 Улица [резерв]'],
 [{title:'🇷🇺 Обход [Beta] - Россия',type:'Hysteria2'},'🇷🇺 Beta · HY2 🔑 Улица [резерв]'],
 [{title:'🇳🇱 Обход [Gamma] - Нидерланды',type:'VLESS',obfs:'xhttp'},'🇳🇱 Gamma · XHTTP 🔑 Улица [резерв]'],
 [{title:'🇳🇱 ⚡Обход [Delta] - Нидерланды ^~9~^'},'🇳🇱 ⚡ Delta · #9 🔑 Улица [резерв]'],
 [{title:'🇩🇪 🔑 Улица [резерв] 7',type:'VLESS'},'🇩🇪 7 🔑 Улица [резерв]'],
 [{title:'🇳🇱 Обход [New-Name v10] – Netherlands (FutureTransport9)',type:'FutureProtocol8',obfs:'FutureTransport9'},'🇳🇱 New-Name v10 · (FutureTransport9) · FutureProtocol8 🔑 Улица [резерв]'],
 [{title:'🇩🇪 Germany Hysteria-v2',type:'hy2'},'🇩🇪 Germany HY2 🔑 Улица [резерв]'],
 [{title:'🇩🇪 Germany (XHTTP)',type:'VLESS',obfs:'xhttp'},'🇩🇪 Germany (XHTTP) 🔑 Улица [резерв]'],
 [{title:'🇩🇪 Обходчик',type:2,obfs:3},'🇩🇪 Обходчик 🔑 Улица [резерв]'],
 [{title:'New country, new server (new protocol)'},'New country, new server (new protocol) 🔑 Улица [резерв]'],
 [{title:'🇩🇪 Обход[Node-2]—Germany'},'🇩🇪 Node-2 🔑 Улица [резерв]'],
 [{title:'🇩🇪 Обход [Alpha]'},'🇩🇪 [Alpha] 🔑 Улица [резерв]'],
 [{title:'🇩🇪 Обход [Обход тест] - Германия'},'🇩🇪 Обход тест 🔑 Улица [резерв]'],
 [{title:'🇩🇪 Обход [NewNode] - Германия | HY2'},'🇩🇪 NewNode · HY2 🔑 Улица [резерв]'],
 [{title:'🇻🇳 Обход [NewNode] - Vietnam | QUIC-v8'},'🇻🇳 NewNode · Vietnam · QUIC-v8 🔑 Улица [резерв]'],
 [{title:'🇩🇪 Обход [Node] - Германия-2'},'🇩🇪 Node · Германия-2 🔑 Улица [резерв]'],
 [{title:'🇩🇪 Обход [Node] - Россия'},'🇩🇪 Node · Россия 🔑 Улица [резерв]'],
 [{title:'🇳🇱 Hysteria version 9.1 | NewNode',type:'Hysteria9.1'},'🇳🇱 HY9.1 · NewNode 🔑 Улица [резерв]'],
 [{title:'Torrent для работы'},'Torrent для работы 🔑 Улица [резерв]'],
 [{title:''},'Без названия 🔑 Улица [резерв]'],
 [{},'Без названия 🔑 Улица [резерв]'],
];
for (const [input,expected] of reserveCases) {
 const node=run(reserve,input,true,expected);
 assert(node.title.includes('Улица [резерв]'));
}
for(const title of ['🇷🇺 Russia XHTTP','🇨🇳 China','🇦🇶 Antarctica','Unknown (test)','🇷🇺 ⚡ Россия'])run(reserve,{title},true);
console.log('PASS: street-reserve.js; every input retained, repeat-safe naming');
console.log('PASS: '+checks+' behavior checks');
