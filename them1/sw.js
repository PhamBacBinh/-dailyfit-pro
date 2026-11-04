const C='them1-v11';
const ASSETS=['./','./index.html','./manifest.json','./icon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(ASSETS.map(u=>new Request(u,{cache:'no-cache'})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request,u=new URL(req.url);
  if(req.method!=='GET'||u.origin!==location.origin)return;
  const save=res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(req,cp));}return res;};
  if(req.mode==='navigate'||u.pathname.endsWith('.html')){
    e.respondWith(fetch(req,{cache:'no-cache'}).then(save).catch(()=>caches.match(req,{ignoreSearch:true}).then(r=>r||caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(hit=>{const net=fetch(req).then(save).catch(()=>hit);return hit||net;}));
});
