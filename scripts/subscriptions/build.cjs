const fs = require('node:fs');
const path = require('node:path');
const {minify_sync} = require('terser');
const views = {
  'home.js': ['home', false],
  'home-us-turkey.js': ['home', true],
  'mixed.js': ['mixed', false],
  'mixed-us-turkey.js': ['mixed', true],
  'street-reserve.js': ['street', false],
};
// Only local identifiers and formatting change; retain all logic and field names.
const compact = minify_sync(fs.readFileSync(path.join(__dirname, 'naming.js'), 'utf8'), {
  compress: false,
  mangle: true,
  format: {comments: false, ascii_only: false},
}).code;

// LZW over UTF-16 units. Store variable-width codes as 14-bit CJK characters:
// every payload character is printable, one UTF-16 unit, and stable under NFC.
function pack(source) {
  const alphabet = [...new Set(source.split(''))].join('');
  const dictionary = new Map(alphabet.split('').map((ch, index) => [ch, index]));
  const codes = [];
  let word = '';
  for (const ch of source.split('')) {
    const next = word + ch;
    if (dictionary.has(next)) word = next;
    else {
      codes.push(dictionary.get(word));
      dictionary.set(next, dictionary.size);
      word = ch;
    }
  }
  if (word) codes.push(dictionary.get(word));
  if (dictionary.size > 65536) throw Error('Packed source exceeds decoder bit capacity');
  let payload = '', buffer = 0, bits = 0;
  codes.forEach((code, index) => {
    const width = Math.ceil(Math.log2(alphabet.length + index));
    buffer = (buffer << width) | code;
    bits += width;
    while (bits >= 14) {
      bits -= 14;
      payload += String.fromCharCode(0x4e00 + ((buffer >>> bits) & 16383));
    }
  });
  if (bits) payload += String.fromCharCode(0x4e00 + ((buffer << (14 - bits)) & 16383));
  return {alphabet, payload, count: codes.length};
}

// Embedded verbatim (then identifier-mangled) into every filter; no runtime library.
function unpack(alphabet, payload, count) {
  var dictionary = alphabet.split(''), word = '', source = '';
  var buffer = 0, bits = 0, index = 0, next = dictionary.length, width = 0;
  while ((1 << width) < next) width++;
  for (var k = 0; k < count; k++) {
    // Encoder adds a dictionary entry after its first code; decoder adds it
    // after its second. This counter keeps their code-width transitions aligned.
    if (next++ > (1 << width)) width++;
    while (bits < width) {
      buffer = (buffer << 14) | (payload.charCodeAt(index++) - 0x4e00);
      bits += 14;
    }
    var code = (buffer >>> (bits -= width)) & ((1 << width) - 1);
    var entry = dictionary[code] || word + word[0];
    source += entry;
    if (word) dictionary.push(word + entry[0]);
    word = entry;
  }
  return source;
}
const packed = pack(compact);
if (unpack(packed.alphabet, packed.payload, packed.count) !== compact) throw Error('Packing changed source');

function output(mode, extra) {
  const script = '$js_filter_servers=(function(){var filter=eval("("+(' + unpack.toString() + ')(' +
    JSON.stringify(packed.alphabet) + ',' + JSON.stringify(packed.payload) + ',' + packed.count +
    ')+")");return function(servers){return filter(servers,' + JSON.stringify(mode) + ',' + extra + ')}})();';
  const result = 'return true;}' + minify_sync(script, {
    compress: false, mangle: true, format: {comments: false, ascii_only: false},
  }).code + 'function $subscription_tail(){';
  // UTF-16 length is conservative: even supplementary characters count twice.
  if (result.length > 3900) throw Error('Filter exceeds 3900 UTF-16 units: ' + mode);
  return result;
}
if (require.main === module) {
  for (const [file, [mode, extra]] of Object.entries(views)) {
    const target = path.join(__dirname, file), expected = output(mode, extra);
    if (process.argv.includes('--check')) {
      if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== expected) throw Error('Stale generated filter: ' + file);
    } else fs.writeFileSync(target, expected);
  }
  console.log('PASS: five generated filters ' + (process.argv.includes('--check') ? 'current' : 'written'));
}
module.exports = {views, output};
