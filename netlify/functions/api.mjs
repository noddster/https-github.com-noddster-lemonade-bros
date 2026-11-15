import {getStore} from '@netlify/blobs';
import app from '../../lib/app.mjs';
import {createDb} from '../../lib/storage.mjs';
export default async function handler(request){
 const url=new URL(request.url);
 url.pathname=url.pathname.replace(/^\/\.netlify\/functions\/api/,'/api');
 const normalized=new Request(url,request);
 const store=getStore({name:'lemonade-bros',consistency:'strong'});
 return app.fetch(normalized,{
  DB:createDb(store),
  ADMIN_PIN:process.env.ADMIN_PIN,
  SESSION_SECRET:process.env.SESSION_SECRET
 });
}
