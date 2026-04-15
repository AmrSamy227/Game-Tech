(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[244],{5531:function(e,s,l){"use strict";l.d(s,{Z:function(){return n}});var a=l(2265);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let t=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),i=(...e)=>e.filter((e,s,l)=>!!e&&l.indexOf(e)===s).join(" ");/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var r={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let c=(0,a.forwardRef)(({color:e="currentColor",size:s=24,strokeWidth:l=2,absoluteStrokeWidth:t,className:c="",children:n,iconNode:d,...o},x)=>(0,a.createElement)("svg",{ref:x,...r,width:s,height:s,stroke:e,strokeWidth:t?24*Number(l)/Number(s):l,className:i("lucide",c),...o},[...d.map(([e,s])=>(0,a.createElement)(e,s)),...Array.isArray(n)?n:[n]])),n=(e,s)=>{let l=(0,a.forwardRef)(({className:l,...r},n)=>(0,a.createElement)(c,{ref:n,iconNode:s,className:i(`lucide-${t(e)}`,l),...r}));return l.displayName=`${e}`,l}},5340:function(e,s,l){"use strict";l.d(s,{Z:function(){return t}});var a=l(5531);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let t=(0,a.Z)("Star",[["polygon",{points:"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2",key:"8f66p6"}]])},4873:function(e,s,l){Promise.resolve().then(l.bind(l,2395))},2395:function(e,s,l){"use strict";l.r(s),l.d(s,{default:function(){return h}});var a=l(7437),t=l(2265),i=l(5531);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,i.Z)("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]),c=(0,i.Z)("CircleCheckBig",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);var n=l(5340);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let d=(0,i.Z)("Target",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"6",key:"1vlfrh"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]]);var o=l(3031),x=l(7101);function h(){let[e,s]=(0,t.useState)("playing"),[l]=(0,t.useState)(x.uX.slice(0,12)),i=[{id:"playing",label:"Currently Playing",icon:(0,a.jsx)(r,{size:20})},{id:"completed",label:"Completed",icon:(0,a.jsx)(c,{size:20})},{id:"wishlist",label:"Wishlist",icon:(0,a.jsx)(n.Z,{size:20})},{id:"backlog",label:"Backlog",icon:(0,a.jsx)(d,{size:20})}];return(0,a.jsx)("div",{className:"min-h-screen bg-[#1c1c1c] py-12 px-4",children:(0,a.jsxs)("div",{className:"max-w-[1400px] mx-auto",children:[(0,a.jsxs)("h1",{className:"text-5xl font-bold mb-4 text-white slide-in",children:["Game Tracker",(0,a.jsx)("span",{className:"block w-20 h-1 bg-red-600 mt-4 rounded"})]}),(0,a.jsx)("p",{className:"text-gray-400 mb-8 text-lg",children:"Track your gaming journey and organize your collection"}),(0,a.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-4 gap-6 mb-12",children:[(0,a.jsxs)("div",{className:"bg-[#2a2a2a] p-6 rounded-xl shadow-lg hover:shadow-red-600/20 transition-all",children:[(0,a.jsxs)("div",{className:"flex items-center gap-3 mb-2",children:[(0,a.jsx)(r,{className:"text-red-600",size:24}),(0,a.jsx)("h3",{className:"text-white font-bold",children:"Playing"})]}),(0,a.jsx)("p",{className:"text-4xl font-bold text-white",children:"12"})]}),(0,a.jsxs)("div",{className:"bg-[#2a2a2a] p-6 rounded-xl shadow-lg hover:shadow-red-600/20 transition-all",children:[(0,a.jsxs)("div",{className:"flex items-center gap-3 mb-2",children:[(0,a.jsx)(c,{className:"text-green-600",size:24}),(0,a.jsx)("h3",{className:"text-white font-bold",children:"Completed"})]}),(0,a.jsx)("p",{className:"text-4xl font-bold text-white",children:"48"})]}),(0,a.jsxs)("div",{className:"bg-[#2a2a2a] p-6 rounded-xl shadow-lg hover:shadow-red-600/20 transition-all",children:[(0,a.jsxs)("div",{className:"flex items-center gap-3 mb-2",children:[(0,a.jsx)(n.Z,{className:"text-yellow-600",size:24}),(0,a.jsx)("h3",{className:"text-white font-bold",children:"Wishlist"})]}),(0,a.jsx)("p",{className:"text-4xl font-bold text-white",children:"23"})]}),(0,a.jsxs)("div",{className:"bg-[#2a2a2a] p-6 rounded-xl shadow-lg hover:shadow-red-600/20 transition-all",children:[(0,a.jsxs)("div",{className:"flex items-center gap-3 mb-2",children:[(0,a.jsx)(d,{className:"text-blue-600",size:24}),(0,a.jsx)("h3",{className:"text-white font-bold",children:"Backlog"})]}),(0,a.jsx)("p",{className:"text-4xl font-bold text-white",children:"35"})]})]}),(0,a.jsx)("div",{className:"mb-8",children:(0,a.jsx)("div",{className:"flex flex-wrap gap-4",children:i.map(l=>(0,a.jsxs)("button",{onClick:()=>s(l.id),className:"flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ".concat(e===l.id?"bg-red-600 text-white shadow-lg":"bg-[#2a2a2a] text-gray-400 hover:bg-[#333] hover:text-white"),children:[l.icon,l.label]},l.id))})}),(0,a.jsx)("div",{className:"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6",children:l.map(e=>(0,a.jsx)("div",{className:"fade-in",children:(0,a.jsx)(o.Z,{game:e})},e.id))})]})})}}},function(e){e.O(0,[724,964,384,971,864,744],function(){return e(e.s=4873)}),_N_E=e.O()}]);