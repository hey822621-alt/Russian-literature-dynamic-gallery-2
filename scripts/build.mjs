import fs from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();
const read=(name)=>fs.readFile(path.join(root,name),'utf8');
const template=await read('src/index.template.html');
const styles=await read('src/styles.css');
const script=await read('src/main.js');
const data=await read('src/data.json');
const parsed=JSON.parse(data);
const scenes=parsed.authors.flatMap(a=>a.works.flatMap(w=>w.scenes));
const allNames=new Set();
for(const scene of scenes){
 if(allNames.has(scene.id))throw new Error(`Duplicate scene ID: ${scene.id}`);
 allNames.add(scene.id);
 const location=path.join(root,'public',scene.image.replace(/^\//,''));
 try{await fs.access(location)}catch{throw new Error(`Missing artwork: ${location}`)}
}
if(scenes.length!==47)throw new Error(`Artwork mismatch: expected 47, got ${scenes.length}`);
let html=template.replace('/*STYLE_PLACEHOLDER*/',()=>styles).replace('/*SCRIPT_PLACEHOLDER*/',()=>script.replace('/*DATA_PLACEHOLDER*/',()=>JSON.stringify(parsed).replaceAll('</','<\\/').replaceAll('"/images/art/','"images/art/')));
html=html.replace('src="/images/art/p01.webp"','src="images/art/p01.webp"');
if(html.includes('PLACEHOLDER'))throw new Error('Unfilled HTML placeholder');
await fs.rm(path.join(root,'dist'),{recursive:true,force:true});
await fs.mkdir(path.join(root,'dist'),{recursive:true});
await fs.writeFile(path.join(root,'dist/index.html'),html,'utf8');
await fs.cp(path.join(root,'public/images'),path.join(root,'dist/images'),{recursive:true});
await fs.writeFile(path.join(root,'dist/robots.txt'),'User-agent: *\nAllow: /\n','utf8');
console.log(`✓ Built dist/ with ${parsed.authors.length} authors, ${parsed.authors.reduce((n,a)=>n+a.works.length,0)} works and ${scenes.length} individually mapped paintings`);
