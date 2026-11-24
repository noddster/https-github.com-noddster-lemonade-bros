import {mkdir,writeFile,readFile,copyFile} from 'node:fs/promises';
import app from '../lib/app.mjs';
await mkdir('public',{recursive:true});
await mkdir('public/staff',{recursive:true});
const response=await app.fetch(new Request('https://lemonade.invalid/'),{});
if(!response.ok)throw Error('Could not build page');
await writeFile('public/staff/index.html',await response.text());
await copyFile('public/shop.html','public/index.html');
await writeFile('public/staff/pos.js',(await Promise.all(['ui/sales.js','ui/admin.js','ui/reconciliation.js','public/staff/session.js'].map(p=>readFile(p,'utf8')))).join('\n'));
console.log('Shop and private staff frontend built.');

