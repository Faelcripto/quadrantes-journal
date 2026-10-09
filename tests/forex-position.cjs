const assert=require('node:assert/strict');
const ts=require('typescript');
const fs=require('node:fs');
const moduleResult={exports:{}};
new Function('exports','require','module',ts.transpileModule(fs.readFileSync('lib/forex-position.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(moduleResult.exports,require,moduleResult);
const {forexPosition}=moduleResult.exports;
const base={capital:10000,riskPercent:1,stopPips:20,quoteToUsd:1,pipSize:.0001,contract:100000,step:.01,minimum:.01};
assert.equal(forexPosition(base).lots,.5);
assert.equal(forexPosition(base).risk,100);
assert.equal(forexPosition({...base,pipSize:.01,quoteToUsd:1/150}).lots,.75);
assert.equal(forexPosition({...base,quoteToUsd:1.25}).lots,.4);
assert.equal(forexPosition({...base,stopPips:30}).lots,.33);
assert.equal(forexPosition({...base,capital:10}).belowMinimum,true);
for(const key of Object.keys(base))assert.equal(forexPosition({...base,[key]:0}),null);
assert.equal(forexPosition({...base,stopPips:NaN}),null);
assert.equal(forexPosition({...base,riskPercent:101}),null);
for(const stop of [1,3,17,29,100,700]){const r=forexPosition({...base,stopPips:stop});assert.ok(r.risk<=r.budget);}
console.log('PASS: USD, JPY, cross conversion, downward rounding, minimum and invalid inputs');
