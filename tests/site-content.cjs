const fs=require('fs'),ts=require(process.cwd()+'/node_modules/typescript'),vm=require('vm'),assert=require('assert');
function load(p){const code=ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText;const module={exports:{}};const req=n=>n==='zod'?require(process.cwd()+'/node_modules/zod'):n==='./strategies'?load('lib/strategies.ts'):n==='@/data/macro-weekly.json'?JSON.parse(fs.readFileSync('data/macro-weekly.json','utf8')):require(n);vm.runInNewContext(code,{module,exports:module.exports,require:req,Date,Set,console});return module.exports;}
const {contentSchemas:s,defaultContent:d}=load('lib/site-content.ts');
for(const k of Object.keys(s))assert(s[k].safeParse(d[k]).success,k+' defaults');
let c=structuredClone(d.course);c.modules[0].lessons[0].videoUrl='javascript:alert(1)';assert(!s.course.safeParse(c).success);
assert(!s.appearance.safeParse({...d.appearance,accent:'url(evil)'}).success);
assert(!s.strategies.safeParse({items:[d.strategies.items[0],d.strategies.items[0],d.strategies.items[0]]}).success);
assert(!s.macro.safeParse({...d.macro,weekEnd:'2020-01-01'}).success);
console.log('PASS: defaults, unsafe links, appearance presets, strategy uniqueness, date range');
