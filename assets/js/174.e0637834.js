"use strict";(self.webpackChunkarktype_io=self.webpackChunkarktype_io||[]).push([[174],{9613:(e,r,t)=>{t.d(r,{Zo:()=>u,kt:()=>p});var n=t(9496);function o(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function a(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function i(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?a(Object(t),!0).forEach((function(r){o(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function l(e,r){if(null==e)return{};var t,n,o=function(e,r){if(null==e)return{};var t,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)t=a[n],r.indexOf(t)>=0||(o[t]=e[t]);return o}(e,r);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)t=a[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var s=n.createContext({}),c=function(e){var r=n.useContext(s),t=r;return e&&(t="function"==typeof e?e(r):i(i({},r),e)),t},u=function(e){var r=c(e.components);return n.createElement(s.Provider,{value:r},e.children)},f={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},d=n.forwardRef((function(e,r){var t=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),d=c(t),p=o,b=d["".concat(s,".").concat(p)]||d[p]||f[p]||a;return t?n.createElement(b,i(i({ref:r},u),{},{components:t})):n.createElement(b,i({ref:r},u))}));function p(e,r){var t=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var a=t.length,i=new Array(a);i[0]=d;var l={};for(var s in r)hasOwnProperty.call(r,s)&&(l[s]=r[s]);l.originalType=e,l.mdxType="string"==typeof e?e:o,i[1]=l;for(var c=2;c<a;c++)i[c]=t[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,t)}d.displayName="MDXCreateElement"},9826:(e,r,t)=>{t.d(r,{Z:()=>R});var n=t(574),o=t(1163),a=t(9496),i=t(5924),l=t(4454),s=t(6994),c=t(446),u=t(4660),f=t(1941),d=t(3345),p=t(8658),b=t(1481),m=t(9989);function v(e){return(0,m.Z)("MuiLinearProgress",e)}(0,b.Z)("MuiLinearProgress",["root","colorPrimary","colorSecondary","determinate","indeterminate","buffer","query","dashed","dashedColorPrimary","dashedColorSecondary","bar","barColorPrimary","barColorSecondary","bar1Indeterminate","bar1Determinate","bar1Buffer","bar2Indeterminate","bar2Buffer"]);var y=t(4637);const g=["className","color","value","valueBuffer","variant"];let h,w,Z,k,P,O,j=e=>e;const C=(0,s.F4)(h||(h=j`
  0% {
    left: -35%;
    right: 100%;
  }

  60% {
    left: 100%;
    right: -90%;
  }

  100% {
    left: 100%;
    right: -90%;
  }
`)),x=(0,s.F4)(w||(w=j`
  0% {
    left: -200%;
    right: 100%;
  }

  60% {
    left: 107%;
    right: -8%;
  }

  100% {
    left: 107%;
    right: -8%;
  }
`)),S=(0,s.F4)(Z||(Z=j`
  0% {
    opacity: 1;
    background-position: 0 -23px;
  }

  60% {
    opacity: 0;
    background-position: 0 -23px;
  }

  100% {
    opacity: 1;
    background-position: -200px -23px;
  }
`)),$=(e,r)=>"inherit"===r?"currentColor":e.vars?e.vars.palette.LinearProgress[`${r}Bg`]:"light"===e.palette.mode?(0,c.$n)(e.palette[r].main,.62):(0,c._j)(e.palette[r].main,.5),B=(0,d.ZP)("span",{name:"MuiLinearProgress",slot:"Root",overridesResolver:(e,r)=>{const{ownerState:t}=e;return[r.root,r[`color${(0,u.Z)(t.color)}`],r[t.variant]]}})((({ownerState:e,theme:r})=>(0,o.Z)({position:"relative",overflow:"hidden",display:"block",height:4,zIndex:0,"@media print":{colorAdjust:"exact"},backgroundColor:$(r,e.color)},"inherit"===e.color&&"buffer"!==e.variant&&{backgroundColor:"none","&::before":{content:'""',position:"absolute",left:0,top:0,right:0,bottom:0,backgroundColor:"currentColor",opacity:.3}},"buffer"===e.variant&&{backgroundColor:"transparent"},"query"===e.variant&&{transform:"rotate(180deg)"}))),E=(0,d.ZP)("span",{name:"MuiLinearProgress",slot:"Dashed",overridesResolver:(e,r)=>{const{ownerState:t}=e;return[r.dashed,r[`dashedColor${(0,u.Z)(t.color)}`]]}})((({ownerState:e,theme:r})=>{const t=$(r,e.color);return(0,o.Z)({position:"absolute",marginTop:0,height:"100%",width:"100%"},"inherit"===e.color&&{opacity:.3},{backgroundImage:`radial-gradient(${t} 0%, ${t} 16%, transparent 42%)`,backgroundSize:"10px 10px",backgroundPosition:"0 -23px"})}),(0,s.iv)(k||(k=j`
    animation: ${0} 3s infinite linear;
  `),S)),D=(0,d.ZP)("span",{name:"MuiLinearProgress",slot:"Bar1",overridesResolver:(e,r)=>{const{ownerState:t}=e;return[r.bar,r[`barColor${(0,u.Z)(t.color)}`],("indeterminate"===t.variant||"query"===t.variant)&&r.bar1Indeterminate,"determinate"===t.variant&&r.bar1Determinate,"buffer"===t.variant&&r.bar1Buffer]}})((({ownerState:e,theme:r})=>(0,o.Z)({width:"100%",position:"absolute",left:0,bottom:0,top:0,transition:"transform 0.2s linear",transformOrigin:"left",backgroundColor:"inherit"===e.color?"currentColor":(r.vars||r).palette[e.color].main},"determinate"===e.variant&&{transition:"transform .4s linear"},"buffer"===e.variant&&{zIndex:1,transition:"transform .4s linear"})),(({ownerState:e})=>("indeterminate"===e.variant||"query"===e.variant)&&(0,s.iv)(P||(P=j`
      width: auto;
      animation: ${0} 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
    `),C))),M=(0,d.ZP)("span",{name:"MuiLinearProgress",slot:"Bar2",overridesResolver:(e,r)=>{const{ownerState:t}=e;return[r.bar,r[`barColor${(0,u.Z)(t.color)}`],("indeterminate"===t.variant||"query"===t.variant)&&r.bar2Indeterminate,"buffer"===t.variant&&r.bar2Buffer]}})((({ownerState:e,theme:r})=>(0,o.Z)({width:"100%",position:"absolute",left:0,bottom:0,top:0,transition:"transform 0.2s linear",transformOrigin:"left"},"buffer"!==e.variant&&{backgroundColor:"inherit"===e.color?"currentColor":(r.vars||r).palette[e.color].main},"inherit"===e.color&&{opacity:.3},"buffer"===e.variant&&{backgroundColor:$(r,e.color),transition:"transform .4s linear"})),(({ownerState:e})=>("indeterminate"===e.variant||"query"===e.variant)&&(0,s.iv)(O||(O=j`
      width: auto;
      animation: ${0} 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) 1.15s infinite;
    `),x))),R=a.forwardRef((function(e,r){const t=(0,p.Z)({props:e,name:"MuiLinearProgress"}),{className:a,color:s="primary",value:c,valueBuffer:d,variant:b="indeterminate"}=t,m=(0,n.Z)(t,g),h=(0,o.Z)({},t,{color:s,variant:b}),w=(e=>{const{classes:r,variant:t,color:n}=e,o={root:["root",`color${(0,u.Z)(n)}`,t],dashed:["dashed",`dashedColor${(0,u.Z)(n)}`],bar1:["bar",`barColor${(0,u.Z)(n)}`,("indeterminate"===t||"query"===t)&&"bar1Indeterminate","determinate"===t&&"bar1Determinate","buffer"===t&&"bar1Buffer"],bar2:["bar","buffer"!==t&&`barColor${(0,u.Z)(n)}`,"buffer"===t&&`color${(0,u.Z)(n)}`,("indeterminate"===t||"query"===t)&&"bar2Indeterminate","buffer"===t&&"bar2Buffer"]};return(0,l.Z)(o,v,r)})(h),Z=(0,f.Z)(),k={},P={bar1:{},bar2:{}};if("determinate"===b||"buffer"===b)if(void 0!==c){k["aria-valuenow"]=Math.round(c),k["aria-valuemin"]=0,k["aria-valuemax"]=100;let e=c-100;"rtl"===Z.direction&&(e=-e),P.bar1.transform=`translateX(${e}%)`}else 0;if("buffer"===b)if(void 0!==d){let e=(d||0)-100;"rtl"===Z.direction&&(e=-e),P.bar2.transform=`translateX(${e}%)`}else 0;return(0,y.jsxs)(B,(0,o.Z)({className:(0,i.Z)(w.root,a),ownerState:h,role:"progressbar"},k,{ref:r},m,{children:["buffer"===b?(0,y.jsx)(E,{className:w.dashed,ownerState:h}):null,(0,y.jsx)(D,{className:w.bar1,ownerState:h,style:P.bar1}),"determinate"===b?null:(0,y.jsx)(M,{className:w.bar2,ownerState:h,style:P.bar2})]}))}))},4744:(e,r,t)=>{t.d(r,{Z:()=>v});var n=t(574),o=t(1163),a=t(9496),i=t(1003),l=t(3746),s=t(5809),c=t(6482),u=t(3345),f=t(8658),d=t(4637);const p=["component","direction","spacing","divider","children"];function b(e,r){const t=a.Children.toArray(e).filter(Boolean);return t.reduce(((e,n,o)=>(e.push(n),o<t.length-1&&e.push(a.cloneElement(r,{key:`separator-${o}`})),e)),[])}const m=(0,u.ZP)("div",{name:"MuiStack",slot:"Root",overridesResolver:(e,r)=>[r.root]})((({ownerState:e,theme:r})=>{let t=(0,o.Z)({display:"flex",flexDirection:"column"},(0,i.k9)({theme:r},(0,i.P$)({values:e.direction,breakpoints:r.breakpoints.values}),(e=>({flexDirection:e}))));if(e.spacing){const n=(0,l.hB)(r),o=Object.keys(r.breakpoints.values).reduce(((r,t)=>(("object"==typeof e.spacing&&null!=e.spacing[t]||"object"==typeof e.direction&&null!=e.direction[t])&&(r[t]=!0),r)),{}),a=(0,i.P$)({values:e.direction,base:o}),s=(0,i.P$)({values:e.spacing,base:o});"object"==typeof a&&Object.keys(a).forEach(((e,r,t)=>{if(!a[e]){const n=r>0?a[t[r-1]]:"column";a[e]=n}}));const u=(r,t)=>{return{"& > :not(style) + :not(style)":{margin:0,[`margin${o=t?a[t]:e.direction,{row:"Left","row-reverse":"Right",column:"Top","column-reverse":"Bottom"}[o]}`]:(0,l.NA)(n,r)}};var o};t=(0,c.Z)(t,(0,i.k9)({theme:r},s,u))}return t=(0,i.dt)(r.breakpoints,t),t})),v=a.forwardRef((function(e,r){const t=(0,f.Z)({props:e,name:"MuiStack"}),a=(0,s.Z)(t),{component:i="div",direction:l="column",spacing:c=0,divider:u,children:v}=a,y=(0,n.Z)(a,p),g={direction:l,spacing:c};return(0,d.jsx)(m,(0,o.Z)({as:i,ownerState:g,ref:r},y,{children:u?b(v,u):v}))}))},1941:(e,r,t)=>{t.d(r,{Z:()=>a});t(9496);var n=t(4218),o=t(3247);function a(){return(0,n.Z)(o.Z)}}}]);