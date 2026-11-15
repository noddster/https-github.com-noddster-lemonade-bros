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
 let saleInstance,timer;
 window.celebrateSale=()=>{
  if(reduce.matches)return;
  const el=document.getElementById('sale-motion');if(!el)return;
  clearTimeout(timer);if(saleInstance)saleInstance.destroy();el.classList.remove('hidden');saleInstance=create(el,'sweet-sale');timer=setTimeout(()=>{el.classList.add('hidden');saleInstance?.destroy();saleInstance=null},2100);
 };
 const observer=new MutationObserver(()=>refreshMotions());
 // Only observe app re-renders, never the SVG subtrees animated every frame.
 ['ticket','podium'].forEach(id=>{const el=document.getElementById(id);if(el)observer.observe(el,{childList:true})});
 refreshMotions();
 reduce.addEventListener('change',()=>{for(const a of instances.values()){if(reduce.matches)a.goToAndStop(Math.max(0,a.totalFrames-1),true)}});
})();
