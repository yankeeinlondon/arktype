"use strict";(self.webpackChunkarktype_io=self.webpackChunkarktype_io||[]).push([[384],{7522:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>d});var r=n(9901);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},l=Object.keys(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var u=r.createContext({}),p=function(e){var t=r.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},c=function(e){var t=p(e.components);return r.createElement(u.Provider,{value:t},e.children)},s="mdxType",f={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,l=e.originalType,u=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),s=p(n),m=o,d=s["".concat(u,".").concat(m)]||s[m]||f[m]||l;return n?r.createElement(d,a(a({ref:t},c),{},{components:n})):r.createElement(d,a({ref:t},c))}));function d(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var l=n.length,a=new Array(l);a[0]=m;var i={};for(var u in t)hasOwnProperty.call(t,u)&&(i[u]=t[u]);i.originalType=e,i[s]="string"==typeof e?e:o,a[1]=i;for(var p=2;p<l;p++)a[p]=n[p];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},9442:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>u,default:()=>d,frontMatter:()=>i,metadata:()=>p,toc:()=>s});var r=n(3050),o=n(3146),l=(n(9901),n(7522)),a=["components"],i={hide_table_of_contents:!0},u="union",p={unversionedId:"api/union",id:"version-1.0.18-alpha/api/union",title:"union",description:"operator",source:"@site/versioned_docs/version-1.0.18-alpha/api/union.md",sourceDirName:"api",slug:"/api/union",permalink:"/docs/api/union",draft:!1,tags:[],version:"1.0.18-alpha",frontMatter:{hide_table_of_contents:!0}},c={},s=[{value:"operator",id:"operator",level:2},{value:"string",id:"string",level:2},{value:"tuple",id:"tuple",level:2},{value:"helper",id:"helper",level:2}],f={toc:s},m="wrapper";function d(e){var t=e.components,n=(0,o.Z)(e,a);return(0,l.kt)(m,(0,r.Z)({},f,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"union"},"union"),(0,l.kt)("h2",{id:"operator"},"operator"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"/docs/api/union"},"|"))),(0,l.kt)("h2",{id:"string"},"string"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},'"L',"|",'R" ',(0,l.kt)("br",null)),(0,l.kt)("li",{parentName:"ul"},'const union = type("string',"|",'number")',(0,l.kt)("br",null))),(0,l.kt)("h2",{id:"tuple"},"tuple"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},'[L, "',"|",'" , R]'," ",(0,l.kt)("br",null)),(0,l.kt)("li",{parentName:"ul"},"const tupleUnion = type(",'["string", "',"|",'", "number"]',")",(0,l.kt)("br",null))),(0,l.kt)("h2",{id:"helper"},"helper"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"union(L,R) ",(0,l.kt)("br",null)),(0,l.kt)("li",{parentName:"ul"},'const helperUnion = union("string", "number")',(0,l.kt)("br",null))))}d.isMDXComponent=!0}}]);