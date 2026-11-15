// Sales screen and phone-first sale sheet. The existing shared API is unchanged.
let names=['Soofi','Choice','Aju','Nikku','Muhanti','Nabaa','Chehche','Tara','Chubby','Aril','Ufu','Noddy','Xee','Rushdan','Kiah','Amna','Faya'];
const drinks=[['Limeade',60,'lime','🍈'],['Lemonade',60,'lemon','🍋'],['Strawberry',70,'berry','🍓']];
const $=id=>document.getElementById(id),money=n=>'MVR '+Number(n).toLocaleString();
let sales=[],cart=[0,0,0],off=0,busy=false,pending=null,range='today',historyRange='today',currentView='sell',syncing=false;
const pendingKey='lemonade-pending-order-v1';
try{const d=JSON.parse(localStorage.getItem(pendingKey)||'null');if(d&&typeof d.id==='string'&&Array.isArray(d.items)&&d.items.length===3&&d.items.every(n=>Number.isInteger(n)&&n>=0&&n<=100)&&[0,10].includes(d.discount)&&['Cash','Transfer'].includes(d.payment)){pending=d;cart=[...d.items];off=d.discount}}catch{}
function art(d){return '<span class="art '+d[2]+'"><span class="cup"><span class="straw"></span><span class="liquid"></span><span class="ice"></span><span class="slice"></span><span class="cup-face">:)</span></span><span class="fruit">'+d[3]+'</span><span class="artplus">+</span></span>'}
$('products').innerHTML=drinks.map((d,i)=>'<button class="drink-card" onclick="openSale('+i+')" aria-label="Sell '+d[0]+'">'+art(d)+'<span class="drink-details"><b>'+d[0]+'</b><span><small>MVR</small> '+d[1]+'</span></span></button>').join('');
$('flavours').innerHTML=drinks.map((d,i)=>'<div class="flavour-row"><button class="flavour-choice" id="flavour'+i+'" onclick="add('+i+',1)" aria-label="Add '+d[0]+'"><span class="flavour-icon '+d[2]+'">'+d[3]+'</span><span><b>'+d[0]+'</b><small id="unit'+i+'">'+money(d[1])+'</small></span></button><div class="sheet-qty"><button aria-label="Remove '+d[0]+'" onclick="add('+i+',-1)">−</button><output id="qty'+i+'">0</output><button aria-label="Add one '+d[0]+'" onclick="add('+i+',1)">+</button></div></div>').join('');
function setSellerOptions(){const select=$('seller'),previous=pending?.seller||select.value||localStorage.getItem('lemon-seller')||names[0];const choices=[...names];if(pending&&!choices.includes(previous))choices.push(previous);select.innerHTML=choices.map(n=>'<option>'+safe(n)+'</option>').join('');select.value=choices.includes(previous)?previous:choices[0]}
function sellerChanged(){localStorage.setItem('lemon-seller',$('seller').value)}
function renderCart(){
 const cups=cart.reduce((a,n)=>a+n,0),total=cart.reduce((a,n,i)=>a+n*(drinks[i][1]-off),0),locked=busy||!!pending;
 cart.forEach((n,i)=>{$('qty'+i).textContent=n;$('unit'+i).textContent=money(drinks[i][1]-off);$('flavour'+i).classList.toggle('selected',n>0)});
 $('cupcount').textContent=cups+' cup'+(cups===1?'':'s');$('total').textContent=money(total);
 $('discount0').classList.toggle('selected',off===0);$('discount10').classList.toggle('selected',off===10);
 $('sale-fields').querySelectorAll('button,select').forEach(b=>b.disabled=locked);
 $('cash').disabled=!cups||busy||(pending&&pending.payment!=='Cash');$('transfer').disabled=!cups||busy||(pending&&pending.payment!=='Transfer');
 $('cash').textContent=busy&&pending?.payment==='Cash'?'Saving…':pending?.payment==='Cash'?'Retry cash':'Cash';
 $('transfer').textContent=busy&&pending?.payment==='Transfer'?'Saving…':pending?.payment==='Transfer'?'Retry transfer':'Transfer';
 $('close-sale').disabled=busy;$('resume-sale').classList.toggle('hidden',!pending);
}
function openSale(i=0){if(busy)return;if(!pending){cart=[0,0,0];cart[i]=1;off=0;$('sale-error').textContent=''}else{$('sale-error').textContent='This sale is unconfirmed. Retry the same payment.'}setSellerOptions();renderCart();if(!$('sale-dialog').open)$('sale-dialog').showModal();document.body.classList.add('sale-open')}
function closeSale(){if(busy)return;$('sale-dialog').close();document.body.classList.remove('sale-open');if(!pending){cart=[0,0,0];off=0}renderCart()}
$('sale-dialog').addEventListener('cancel',e=>{e.preventDefault();closeSale()});
function add(i,n){if(busy||pending)return;cart[i]=Math.max(0,Math.min(100,cart[i]+n));renderCart()}
function setDiscount(n){if(busy||pending)return;off=n;renderCart()}
function view(v){currentView=v;['sell','history','board','admin'].forEach(id=>{$(id).classList.toggle('hidden',id!==v);$(id+'nav').classList.toggle('active',id===v)});if(v==='board'){renderBoard();if(window.replayMotionIn)requestAnimationFrame(()=>window.replayMotionIn($('board')))}if(v==='history')renderHistory();window.scrollTo({top:0,behavior:'instant'})}
function day(value){return new Date(value).toLocaleDateString('en-CA',{timeZone:'Indian/Maldives'})}
function byPeriod(period){return period==='all'?sales:sales.filter(s=>day(s.created_at)===day(new Date()))}
function tally(list){return [...new Set([...names,...list.map(s=>s.seller)])].map(name=>({name,cups:list.filter(s=>s.seller===name).reduce((a,s)=>a+s.cups,0),total:list.filter(s=>s.seller===name).reduce((a,s)=>a+s.total,0)})).sort((a,b)=>b.cups-a.cups||a.name.localeCompare(b.name))}
function period(p){range=p;$('today').classList.toggle('chosen',p==='today');$('all').classList.toggle('chosen',p==='all');renderBoard()}
function historyPeriod(p){historyRange=p;$('history-today').classList.toggle('chosen',p==='today');$('history-all').classList.toggle('chosen',p==='all');renderHistory()}
function flavorSummary(s){try{return JSON.parse(s.items).map((n,i)=>n?n+' '+drinks[i][0]:'').filter(Boolean).join(' · ')}catch{return s.cups+' cups'}}
function renderHistory(){const rows=byPeriod(historyRange);$('history-total').textContent=money(rows.reduce((a,s)=>a+s.total,0));$('history-count').textContent=rows.length+' sale'+(rows.length===1?'':'s');$('recent').innerHTML=rows.length?rows.map(s=>'<div class="history-row"><span class="payment-icon">'+(s.payment==='Cash'?'💵':'🏦')+'</span><div class="history-detail"><b>'+safe(s.seller)+'</b><small>'+safe(flavorSummary(s))+'</small><small>'+new Date(s.created_at).toLocaleString([],{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})+' · '+s.payment+'</small></div><strong>'+money(s.total)+'</strong></div>').join(''):'<div class="empty">No sales '+(historyRange==='today'?'today':'yet')+' 🍋</div>'}
function renderBoard(){
 const rows=tally(byPeriod(range)),cups=rows.reduce((a,r)=>a+r.cups,0),total=rows.reduce((a,r)=>a+r.total,0);
 const podiumMarkup=cups?[1,0,2].filter(i=>rows[i]).map(i=>{const r=rows[i];return '<div class="podium-person p'+i+'"><div class="podium-avatar">'+(i===0?'👑':safe(r.name[0]))+'</div><b>'+safe(r.name)+'</b><span>'+r.cups+' 🥤</span><div class="podium-step">'+(rows.findIndex(x=>x.cups===r.cups)+1)+'</div></div>'}).join(''):'<div class="no-race"><span data-motion="top-squeezer" aria-hidden="true">🏆</span><b>The crown is waiting.</b></div>';
 if($('podium').dataset.markup!==podiumMarkup){$('podium').innerHTML=podiumMarkup;$('podium').dataset.markup=podiumMarkup}
 $('stats').innerHTML=[['Cups',cups],['Sales',money(total)],['Selling',rows.filter(r=>r.cups).length]].map(x=>'<div class="panel stat"><small>'+x[0]+'</small><b>'+x[1]+'</b></div>').join('');
 let last=-1,rank=0;$('ranks').innerHTML=rows.map((r,i)=>{if(r.cups!==last)rank=i+1;last=r.cups;return '<div class="rankrow"><b>'+(r.cups?(rank===1?'♕':rank):'—')+'</b><div class="name">'+safe(r.name)+'<div class="ranktrack"><i style="width:'+(rows[0]?.cups?r.cups/rows[0].cups*100:0)+'%"></i></div></div><strong>'+r.cups+' cups</strong><span>'+money(r.total)+'</span></div>'}).join('');
 if(window.refreshMotions)window.refreshMotions();
}
let toastTimer;function toast(text){$('toast').textContent=text;$('toast').classList.remove('hidden');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.add('hidden'),4000)}
async function sync(){if(syncing)return;syncing=true;try{
 const tr=await fetch('/api/team');if(tr.ok){const team=await tr.json();if(Array.isArray(team)&&team.length&&team.every(n=>typeof n==='string')&&JSON.stringify(team)!==JSON.stringify(names)){names=team;setSellerOptions()}}
 const response=await fetch('/api/sales');if(!response.ok)throw Error();const result=await response.json();if(!Array.isArray(result))throw Error();sales=result;$('sync').textContent='Live sync';$('sync').classList.remove('offline');
 renderHistory();if(currentView==='board')renderBoard();if(adminOpen&&['overview','sales'].includes(adminPage))renderAdmin();
}catch{$('sync').textContent='Offline';$('sync').classList.add('offline')}finally{syncing=false}}
async function checkout(payment){
 if(busy||!cart.some(Boolean)||(pending&&pending.payment!==payment))return;
 pending=pending||{id:crypto.randomUUID(),seller:$('seller').value,items:[...cart],discount:off,payment};
 try{localStorage.setItem(pendingKey,JSON.stringify(pending))}catch{}busy=true;$('sale-error').textContent='';renderCart();
 try{const response=await fetch('/api/sales',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(pending)});if(!response.ok)throw Error();
 pending=null;try{localStorage.removeItem(pendingKey)}catch{}cart=[0,0,0];off=0;$('sale-dialog').close();document.body.classList.remove('sale-open');toast('Sale recorded ✓');if(window.celebrateSale)window.celebrateSale();await sync();
 }catch{$('sale-error').textContent='Sale not confirmed. Retry the same payment. Your order is kept.'}finally{busy=false;renderCart()}
}
async function undo(id){if(!confirm('Undo this sale? It will be removed from totals and rankings.'))return;try{const r=await fetch('/api/void',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});if(!r.ok)throw Error();await sync();toast('Sale undone.')}catch{toast('Could not undo. Please retry.')}}
