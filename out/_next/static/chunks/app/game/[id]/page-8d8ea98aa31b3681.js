(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[184],{5531:function(e,t,r){"use strict";r.d(t,{Z:function(){return a}});var n=r(2265);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let o=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),l=(...e)=>e.filter((e,t,r)=>!!e&&r.indexOf(e)===t).join(" ");/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var i={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,n.forwardRef)(({color:e="currentColor",size:t=24,strokeWidth:r=2,absoluteStrokeWidth:o,className:s="",children:a,iconNode:c,...u},f)=>(0,n.createElement)("svg",{ref:f,...i,width:t,height:t,stroke:e,strokeWidth:o?24*Number(r)/Number(t):r,className:l("lucide",s),...u},[...c.map(([e,t])=>(0,n.createElement)(e,t)),...Array.isArray(a)?a:[a]])),a=(e,t)=>{let r=(0,n.forwardRef)(({className:r,...i},a)=>(0,n.createElement)(s,{ref:a,iconNode:t,className:l(`lucide-${o(e)}`,r),...i}));return r.displayName=`${e}`,r}},1291:function(e,t,r){"use strict";r.d(t,{Z:function(){return o}});var n=r(5531);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let o=(0,n.Z)("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]])},7158:function(e,t,r){"use strict";r.d(t,{Z:function(){return o}});var n=r(5531);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let o=(0,n.Z)("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]])},1573:function(e,t,r){Promise.resolve().then(r.bind(r,2124)),Promise.resolve().then(r.t.bind(r,6964,23)),Promise.resolve().then(r.t.bind(r,4724,23)),Promise.resolve().then(r.t.bind(r,3388,23))},2124:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return f}});var n=r(7437),o=r(2265),l=r(6691),i=r.n(l),s=r(1291),a=r(7158),c=r(5531);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let u=(0,c.Z)("Play",[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]]);function f(e){let{game:t}=e,[r,l]=(0,o.useState)(0),c=[{type:"video",src:t.trailer||""},...t.screenshots.map(e=>({type:"image",src:e}))].filter(e=>e.src),f=e=>{let t=r+e;t>=0&&t<c.length&&l(t)};return 0===c.length?null:(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("div",{className:"relative w-full pb-[56.25%] mb-4 bg-black rounded overflow-hidden",children:"video"===c[r].type&&c[r].src?(0,n.jsx)("iframe",{src:c[r].src,className:"absolute top-0 left-0 w-full h-full",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",allowFullScreen:!0}):(0,n.jsx)(i(),{src:c[r].src||t.image,alt:"".concat(t.title," media ").concat(r),fill:!0,className:"object-cover"})}),(0,n.jsxs)("div",{className:"relative",children:[r>0&&(0,n.jsx)("button",{onClick:()=>f(-1),className:"absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/80 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors",children:(0,n.jsx)(s.Z,{size:20})}),r<c.length-1&&(0,n.jsx)("button",{onClick:()=>f(1),className:"absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/80 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors",children:(0,n.jsx)(a.Z,{size:20})}),(0,n.jsx)("div",{className:"flex gap-3 overflow-x-auto pb-2",children:c.map((e,o)=>(0,n.jsxs)("button",{onClick:()=>l(o),className:"relative flex-shrink-0 w-32 h-20 rounded overflow-hidden transition-all ".concat(r===o?"ring-2 ring-red-600":""),children:["video"===e.type&&e.src?(0,n.jsx)("div",{className:"absolute inset-0 bg-black/50 flex items-center justify-center z-10",children:(0,n.jsx)(u,{size:24,className:"text-white"})}):null,(0,n.jsx)(i(),{src:e.src||t.image,alt:"Thumbnail ".concat(o),fill:!0,className:"object-cover"})]},o))})]})]})}},2597:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{default:function(){return c},unstable_getImgProps:function(){return a}});let n=r(1024),o=r(3655),l=r(7707),i=r(6964),s=n._(r(5324)),a=e=>{(0,l.warnOnce)("Warning: unstable_getImgProps() is experimental and may change or be removed at any time. Use at your own risk.");let{props:t}=(0,o.getImgProps)(e,{defaultLoader:s.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[16,32,48,64,96,128,256,384],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!0}});for(let[e,r]of Object.entries(t))void 0===r&&delete t[e];return{props:t}},c=i.Image},3388:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{suspense:function(){return o},NoSSR:function(){return l}}),r(1024),r(2265);let n=r(4922);function o(){let e=Error(n.NEXT_DYNAMIC_NO_SSR_CODE);throw e.digest=n.NEXT_DYNAMIC_NO_SSR_CODE,e}function l(e){let{children:t}=e;return t}},622:function(e,t,r){"use strict";/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var n=r(2265),o=Symbol.for("react.element"),l=Symbol.for("react.fragment"),i=Object.prototype.hasOwnProperty,s=n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,a={key:!0,ref:!0,__self:!0,__source:!0};function c(e,t,r){var n,l={},c=null,u=null;for(n in void 0!==r&&(c=""+r),void 0!==t.key&&(c=""+t.key),void 0!==t.ref&&(u=t.ref),t)i.call(t,n)&&!a.hasOwnProperty(n)&&(l[n]=t[n]);if(e&&e.defaultProps)for(n in t=e.defaultProps)void 0===l[n]&&(l[n]=t[n]);return{$$typeof:o,type:e,key:c,ref:u,props:l,_owner:s.current}}t.Fragment=l,t.jsx=c,t.jsxs=c},7437:function(e,t,r){"use strict";e.exports=r(622)},6691:function(e,t,r){e.exports=r(2597)}},function(e){e.O(0,[724,964,971,864,744],function(){return e(e.s=1573)}),_N_E=e.O()}]);