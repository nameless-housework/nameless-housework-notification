if(!self.define){let e,s={};const o=(o,i)=>(o=new URL(o+".js",i).href,s[o]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=o,e.onload=s,document.head.appendChild(e)}else e=o,importScripts(o),s()})).then((()=>{let e=s[o];if(!e)throw new Error(`Module ${o} didn’t register its module`);return e})));self.define=(i,n)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let r={};const c=e=>o(e,t),a={module:{uri:t},exports:r,require:c};s[t]=Promise.all(i.map((e=>a[e]||c(e)))).then((e=>(n(...e),r)))}}define(["./workbox-db5fc017"],(function(e){"use strict";e.setCacheNameDetails({prefix:"nameless-housework-notification"}),self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"/nameless-housework-notification/index.html",revision:"aab2ee80a2c2aa8e1d4fa8280ccfc276"},{url:"/nameless-housework-notification/manifest.json",revision:"e739e62b2eec99bc0f50fea7c4cf3808"},{url:"/nameless-housework-notification/robots.txt",revision:"b6216d61c03e6ce0c9aea6ca7808f7ca"},{url:"/nameless-housework-notification/static/css/app.baa57ebf.css",revision:null},{url:"/nameless-housework-notification/static/css/chunk-vendors.652ef09d.css",revision:null},{url:"/nameless-housework-notification/static/js/app.42f45de9.js",revision:null},{url:"/nameless-housework-notification/static/js/chunk-vendors.9dbaf46e.js",revision:null}],{})}));
//# sourceMappingURL=service-worker.js.map
