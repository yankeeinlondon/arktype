"use strict";(self.webpackChunkarktype_io=self.webpackChunkarktype_io||[]).push([[2087],{9613:(e,r,t)=>{t.d(r,{Zo:()=>u,kt:()=>m});var n=t(9496);function o(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function a(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function l(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?a(Object(t),!0).forEach((function(r){o(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function p(e,r){if(null==e)return{};var t,n,o=function(e,r){if(null==e)return{};var t,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)t=a[n],r.indexOf(t)>=0||(o[t]=e[t]);return o}(e,r);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)t=a[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var i=n.createContext({}),c=function(e){var r=n.useContext(i),t=r;return e&&(t="function"==typeof e?e(r):l(l({},r),e)),t},u=function(e){var r=c(e.components);return n.createElement(i.Provider,{value:r},e.children)},s={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},f=n.forwardRef((function(e,r){var t=e.components,o=e.mdxType,a=e.originalType,i=e.parentName,u=p(e,["components","mdxType","originalType","parentName"]),f=c(t),m=o,d=f["".concat(i,".").concat(m)]||f[m]||s[m]||a;return t?n.createElement(d,l(l({ref:r},u),{},{components:t})):n.createElement(d,l({ref:r},u))}));function m(e,r){var t=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var a=t.length,l=new Array(a);l[0]=f;var p={};for(var i in r)hasOwnProperty.call(r,i)&&(p[i]=r[i]);p.originalType=e,p.mdxType="string"==typeof e?e:o,l[1]=p;for(var c=2;c<a;c++)l[c]=t[c];return n.createElement.apply(null,l)}return n.createElement.apply(null,t)}f.displayName="MDXCreateElement"},5378:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>u,contentTitle:()=>i,default:()=>m,frontMatter:()=>p,metadata:()=>c,toc:()=>s});var n=t(4250),o=t(7075),a=(t(9496),t(9613)),l=["components"],p={hide_table_of_contents:!0},i="narrow",c={unversionedId:"api/narrow",id:"api/narrow",title:"narrow",description:"operator",source:"@site/docs/api/narrow.md",sourceDirName:"api",slug:"/api/narrow",permalink:"/docs/next/api/narrow",draft:!1,tags:[],version:"current",frontMatter:{hide_table_of_contents:!0}},u={},s=[{value:"operator",id:"operator",level:2},{value:"tuple",id:"tuple",level:2},{value:"example",id:"example",level:2}],f={toc:s};function m(e){var r=e.components,t=(0,o.Z)(e,l);return(0,a.kt)("wrapper",(0,n.Z)({},f,t,{components:r,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"narrow"},"narrow"),(0,a.kt)("h2",{id:"operator"},"operator"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/next/api/narrow"},"=>"))),(0,a.kt)("h2",{id:"tuple"},"tuple"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},'["type", "=>" , condition]'," ",(0,a.kt)("br",null)),(0,a.kt)("li",{parentName:"ul"},"const narrow = type( ",'["number", "=>" , (n) => n % 2 === 0]',")",(0,a.kt)("br",null))),(0,a.kt)("h2",{id:"example"},"example"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("pre",{parentName:"li"},(0,a.kt)("code",{parentName:"pre"},"     const isEven = (x: unknown): x is number => x % 2 === 0\n")))))}m.isMDXComponent=!0}}]);