(()=>{
 const instances=new Map(),reduce=matchMedia('(prefers-reduced-motion: reduce)');
 function create(el,name,loop=false){
  if(!window.lottie||!el)return null;
  el.textContent='';
  const instance=lottie.loadAnimation({container:el,renderer:'svg',loop:reduce.matches?false:loop,autoplay:!reduce.matches,path:'/animations/'+name+'.json',rendererSettings:{preserveAspectRatio:'xMidYMid meet'}});
  instance.addEventListener('DOMLoaded',()=>{if(reduce.matches)instance.goToAndStop(Math.max(0,instance.totalFrames-1),true)});
  return instance;
 }
 window.refreshMotions=()=>{
  for(const [el,a] of instances)if(!el.isConnected){a.destroy();instances.delete(el)}
  document.querySelectorAll('[data-motion]').forEach(el=>{if(instances.has(el)||el.closest('.hidden'))return;let loop=Number(el.dataset.motionLoop)||false;const a=create(el,el.dataset.motion,loop);if(a)instances.set(el,a)});
 };
 window.replayMotionIn=root=>{refreshMotions();for(const [el,a] of instances)if(root.contains(el)&&!reduce.matches)a.goToAndPlay(0,true)};
 let finishPreviousSale=null;
 window.celebrateSale=()=>new Promise(resolve=>{
  if(finishPreviousSale)finishPreviousSale();
  const el=document.getElementById('sale-motion');if(!el){resolve();return}
  el.textContent='✓';
  // Reduced motion or a missing player shows the recorded state without blocking checkout.
  if(reduce.matches||!window.lottie){setTimeout(resolve,reduce.matches?0:500);return}
  let instance=null,timer=null,finished=false;
  const finish=()=>{if(finished)return;finished=true;clearTimeout(timer);if(finishPreviousSale===finish)finishPreviousSale=null;if(instance){try{instance.destroy()}catch{}}el.textContent='✓';resolve()};
  finishPreviousSale=finish;
  try{
   instance=create(el,'sweet-sale');if(!instance){finish();return}
   instance.addEventListener('complete',finish);
   instance.addEventListener('data_failed',finish);
   instance.addEventListener('error',finish);
   instance.addEventListener('DOMLoaded',()=>{if(finished)return;clearTimeout(timer);const duration=instance.getDuration(false);timer=setTimeout(finish,Math.max(1000,Number.isFinite(duration)?duration*1000+1000:10000))});
   // A failed network request or player must not leave the saved sale locked forever.
   timer=setTimeout(finish,10000);
  }catch{finish()}
 });
 const observer=new MutationObserver(()=>refreshMotions());
 // Only observe app re-renders, never the SVG subtrees animated every frame.
 ['ticket','podium'].forEach(id=>{const el=document.getElementById(id);if(el)observer.observe(el,{childList:true})});
 refreshMotions();
 reduce.addEventListener('change',()=>{for(const a of instances.values()){if(reduce.matches)a.goToAndStop(Math.max(0,a.totalFrames-1),true)}});
})();

