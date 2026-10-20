import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const port=Number(process.env.PORT||4173),dir=path.resolve('dist');
const MIME={'.html':'text/html; charset=utf-8','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.txt':'text/plain; charset=utf-8'};
http.createServer(async(req,res)=>{
 let url=new URL(req.url,'http://localhost');
 let filename=path.resolve(dir,'.'+decodeURIComponent(url.pathname));
 if(!filename.startsWith(dir+path.sep)&&filename!==dir){res.writeHead(403).end();return;}
 try{const stat=await fs.stat(filename);if(stat.isDirectory())filename=path.join(filename,'index.html');}
 catch{if(url.pathname!=='/') {res.writeHead(404).end('Not found');return;}}
 if(url.pathname==='/')filename=path.join(dir,'index.html');
 try{let data=await fs.readFile(filename);res.writeHead(200,{'Content-Type':MIME[path.extname(filename)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data)}catch{res.writeHead(404).end('Not found')}
}).listen(port,'0.0.0.0',()=>console.log(`Gallery preview: http://localhost:${port}`));
