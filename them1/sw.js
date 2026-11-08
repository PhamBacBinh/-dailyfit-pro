const C='them1-v16';
const ASSETS=['./','./index.html','./manifest.json','./icon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(ASSETS.map(u=>fetch(u,{cache:'no-store'}).then(r=>{if(r.ok)return c.put(u,r);}).catch(()=>{})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request,u=new URL(req.url);
  if(req.method!=='GET'||u.origin!==location.origin)return;
  if(req.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('.html')){
    e.respondWith(fetch(u.origin+u.pathname,{cache:'no-store'}).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put('./index.html',cp));}return res;})
      .catch(()=>caches.match('./index.html').then(r=>r||caches.match('./'))));
    return;
  }
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(hit=>{const net=fetch(req).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(req,cp));}return res;}).catch(()=>hit);return hit||net;}));
});
