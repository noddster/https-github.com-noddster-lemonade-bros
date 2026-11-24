import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';

test('actual admin rendering ranks revenue and labels proportional profit or loss',async()=>{
 const content={innerHTML:'',classList:{remove(){}},querySelector(){return {open:false}}};
 const context=vm.createContext({sales:[{seller:'Noddy',total:1300,cups:0,items:'{"kind":"reconciliation"}'},{seller:'Soofi',total:700,cups:12,items:'[0,12,0]'}],adminMerch:{revenue:0,cash:0,orders:0,unpaid:0,bySeller:{}},names:['Noddy','Soofi'],drinks:[['Limeade',60,'lime',''],['Lemonade',60,'lemon',''],['Strawberry',70,'berry','']],money:n=>'MVR '+Number(n).toLocaleString('en-US'),$:()=>content,tally:list=>['Noddy','Soofi'].map(name=>({name,total:list.filter(x=>x.seller===name).reduce((a,x)=>a+x.total,0),cups:list.filter(x=>x.seller===name).reduce((a,x)=>a+x.cups,0)}))});
 vm.runInContext(await readFile(new URL('../ui/admin.js',import.meta.url),'utf8'),context);
 vm.runInContext("adminData={expenses:[{name:'Costs',amount:1000,gst:0}],team:[]};renderAdmin()",context);
 assert.ok(content.innerHTML.includes('65.0% of revenue'));
 assert.ok(content.innerHTML.includes('Estimated profit share: MVR 650'));
 assert.ok(content.innerHTML.indexOf('♕ Noddy')<content.innerHTML.indexOf('>Soofi<'));
 vm.runInContext("adminData.expenses[0].amount=3000;renderAdmin()",context);
 assert.ok(content.innerHTML.includes('Estimated loss share: MVR 650'));
 assert.ok(!content.innerHTML.includes('Estimated profit share:'));
 vm.runInContext("sales=[];adminMerch={revenue:0,cash:0,orders:0,unpaid:0,bySeller:{}};renderAdmin()",context);
 assert.ok(!content.innerHTML.includes('NaN'));assert.ok(!content.innerHTML.includes('Infinity'));
});
