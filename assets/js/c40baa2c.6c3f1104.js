"use strict";(self.webpackChunkarktype_io=self.webpackChunkarktype_io||[]).push([[6291],{57522:(e,n,t)=>{t.d(n,{Zo:()=>c,kt:()=>m});var r=t(29901);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function p(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var l=r.createContext({}),u=function(e){var n=r.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},c=function(e){var n=u(e.components);return r.createElement(l.Provider,{value:n},e.children)},s="mdxType",d={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},f=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,c=p(e,["components","mdxType","originalType","parentName"]),s=u(t),f=a,m=s["".concat(l,".").concat(f)]||s[f]||d[f]||o;return t?r.createElement(m,i(i({ref:n},c),{},{components:t})):r.createElement(m,i({ref:n},c))}));function m(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var o=t.length,i=new Array(o);i[0]=f;var p={};for(var l in n)hasOwnProperty.call(n,l)&&(p[l]=n[l]);p.originalType=e,p[s]="string"==typeof e?e:a,i[1]=p;for(var u=2;u<o;u++)i[u]=t[u];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}f.displayName="MDXCreateElement"},96451:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>l,default:()=>m,frontMatter:()=>p,metadata:()=>u,toc:()=>s});var r=t(73268),a=t(68039),o=(t(29901),t(57522)),i=["components"],p={hide_table_of_contents:!0},l="PrecompiledDefaults",u={unversionedId:"api/precompileddefaults",id:"version-1.0.28-alpha/api/precompileddefaults",title:"PrecompiledDefaults",description:"text",source:"@site/versioned_docs/version-1.0.28-alpha/api/precompileddefaults.md",sourceDirName:"api",slug:"/api/precompileddefaults",permalink:"/docs/1.0.28-alpha/api/precompileddefaults",draft:!1,tags:[],version:"1.0.28-alpha",frontMatter:{hide_table_of_contents:!0}},c={},s=[{value:"text",id:"text",level:2}],d={toc:s},f="wrapper";function m(e){var n=e.components,t=(0,a.Z)(e,i);return(0,o.kt)(f,(0,r.Z)({},d,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"precompileddefaults"},"PrecompiledDefaults"),(0,o.kt)("h2",{id:"text"},"text"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"export type PrecompiledDefaults = {\n    any: any\n    bigint: bigint\n    boolean: boolean\n    false: false\n    never: never\n    null: null\n    number: number\n    object: object\n    string: string\n    symbol: symbol\n    true: true\n    unknown: unknown\n    void: void\n    undefined: undefined\n    integer: number\n    alpha: string\n    alphanumeric: string\n    lowercase: string\n    uppercase: string\n    creditCard: string\n    email: string\n    uuid: string\n    semver: string\n    json: (In: string) => Out<unknown>\n    parsedNumber: (In: string) => Out<number>\n    parsedInteger: (In: string) => Out<number>\n    parsedDate: (In: string) => Out<Date>\n    Function: (...args: any[]) => unknown\n    Date: Date\n    Error: Error\n    Map: Map<unknown, unknown>\n    RegExp: RegExp\n    Set: Set<unknown>\n    WeakMap: WeakMap<object, unknown>\n    WeakSet: WeakSet<object>\n    Promise: Promise<unknown>\n}\n")))}m.isMDXComponent=!0}}]);