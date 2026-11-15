// A bounded event ledger, protected by conditional writes so simultaneous tills
// cannot overwrite each other's sales. A retried sale keeps the original ID.
async function update(store,key,fn){
 for(let attempt=0;attempt<12;attempt++){
  const current=await store.getWithMetadata(key,{type:'json'});
  const value=fn(current?.data??[]);
  if(value===null)return;
  const result=await store.setJSON(key,value,current?{onlyIfMatch:current.etag}:{onlyIfNew:true});
  if(result.modified)return;
  await new Promise(r=>setTimeout(r,20+Math.random()*80));
 }
 throw new Error('Stall is busy; retry the same sale.');
}
export function createDb(store){return {prepare(sql){let args=[];return {
 bind(...values){args=values;return this},
 async first(){if(sql.startsWith('SELECT value FROM app_settings')){const value=await store.get('admin',{type:'json'});return value?{value:JSON.stringify(value)}:null}throw Error('Unsupported query')},
 async all(){if(!sql.startsWith('SELECT * FROM sales'))throw Error('Unsupported query');const rows=await store.get('sales',{type:'json'})??[];return {results:rows.filter(s=>!s.voided).sort((a,b)=>b.created_at.localeCompare(a.created_at)).slice(0,10000)}},
 async run(){
  if(sql.startsWith('INSERT OR IGNORE INTO sales')){const [id,seller,items,cups,total,payment,created_at]=args;await update(store,'sales',rows=>{if(rows.some(s=>s.id===id))return null;if(rows.length>=10000)throw Error('Event ledger full');return [...rows,{id,seller,items,cups,total,payment,created_at,voided:0}]});return}
  if(sql.startsWith('UPDATE sales SET voided')){await update(store,'sales',rows=>rows.map(s=>s.id===args[0]?{...s,voided:1}:s));return}
  if(sql.startsWith('INSERT INTO app_settings')){await store.setJSON('admin',JSON.parse(args[1]));return}
  throw Error('Unsupported query');
 }
 }}}}
