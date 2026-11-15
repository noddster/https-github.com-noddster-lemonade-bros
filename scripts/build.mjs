import {mkdir,writeFile} from 'node:fs/promises';
import app from '../lib/app.mjs';
await mkdir('public',{recursive:true});
const response=await app.fetch(new Request('https://lemonade.invalid/'),{});
if(!response.ok)throw Error('Could not build page');
await writeFile('public/index.html',await response.text());
console.log('Netlify frontend built.');
