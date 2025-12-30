const VERSION='yw-cdn-v1'
const CORE=['/','/index.html']

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)))
  self.skipWaiting()
})

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==VERSION).map(k=>caches.delete(k)))))
  self.clients.claim()
})

self.addEventListener('fetch',e=>{
  const req=e.request
  if(req.method!=='GET')return
  e.respondWith((async()=>{
    const cache=await caches.open(VERSION)
    const cached=await cache.match(req)
    const network=fetch(req).then(res=>{
      if(res.ok&&(res.type==='basic'||res.type==='default'))cache.put(req,res.clone())
      return res
    }).catch(()=>cached||Promise.reject('offline'))
    return cached||network
  })())
})
