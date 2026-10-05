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
const source = fs.readFileSync(path.join(__dirname, 'naming.js'), 'utf8');
// Remove the view parameters so Terser can resolve their constants in closures.
const signature = 'function subscriptionNames(servers, mode, allowUsTurkey)';
if (!source.includes(signature)) throw Error('Shared source signature changed');
const specializedSource = source.replace(signature, 'function subscriptionNames(servers)');

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
function output(mode, extra) {
  // Each output contains only its own rules, not the other views' branches.
  const compact = minify_sync(specializedSource, {
    compress: {passes: 3, global_defs: {mode, allowUsTurkey: extra}},
    mangle: true,
    format: {comments: false, ascii_only: false},
  }).code;
  const packed = pack(compact);
  if (unpack(packed.alphabet, packed.payload, packed.count) !== compact) throw Error('Packing changed source');
  const script = '$js_filter_servers=eval("("+(' + unpack.toString() + ')(' +
    JSON.stringify(packed.alphabet) + ',' + JSON.stringify(packed.payload) + ',' + packed.count +
    ')+")");';
  const code = minify_sync(script, {
    compress: {passes: 3}, mangle: true, format: {comments: false, ascii_only: false},
  }).code;
  const literal = JSON.stringify(packed.payload);
  if (!code.includes(literal)) throw Error('Packed literal missing from output');
  // UIKit's word tokenizer can stall on a paragraph of random CJK characters.
  // Keep actual text paragraphs short; concatenation restores the same payload.
  const lines = packed.payload.match(/.{1,96}/g).map(part => JSON.stringify(part)).join('+\n');
  // The app selects JavaScript only when raw Filter text contains $server.
  // The unused tail both closes the native wrapper and carries that marker.
  const result = 'return true;}' + code.replace(literal, '(' + lines + ')') + 'function $server_tail(){';
  if (!result.includes('$server')) throw Error('Filter would not execute as JavaScript in the app');
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
