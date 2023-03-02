"use strict";(self.webpackChunkarktype_io=self.webpackChunkarktype_io||[]).push([[9514,4726],{6037:(e,t,n)=>{n.r(t),n.d(t,{default:()=>Te});var a=n(9496),r=n(5924),l=n(8262),i=n(8780),o=n(4398),c=n(9319),d=n(8121),s=n(5769),m=n(3491),u=n(8205),b=n(7453),p=n(5434);const h="backToTopButton_O2Bg",v="backToTopButtonShow_DpjX";function E(){var e=function(e){var t=e.threshold,n=(0,a.useState)(!1),r=n[0],l=n[1],i=(0,a.useRef)(!1),o=(0,b.Ct)(),c=o.startScroll,d=o.cancelScroll;return(0,b.RF)((function(e,n){var a=e.scrollY,r=null==n?void 0:n.scrollY;r&&(i.current?i.current=!1:a>=r?(d(),l(!1)):a<t?l(!1):a+window.innerHeight<document.documentElement.scrollHeight&&l(!0))})),(0,p.S)((function(e){e.location.hash&&(i.current=!0,l(!1))})),{shown:r,scrollToTop:function(){return c(0)}}}({threshold:300}),t=e.shown,n=e.scrollToTop;return a.createElement("button",{"aria-label":(0,u.I)({id:"theme.BackToTopButton.buttonAriaLabel",message:"Scroll back to top",description:"The ARIA label for the back to top button"}),className:(0,r.Z)("clean-btn",i.k.common.backToTopButton,h,t&&v),type:"button",onClick:n})}var f=n(3442),g=n(1547),k=n(2723),_=n(7725),C=n(4250);function I(e){return a.createElement("svg",(0,C.Z)({width:"20",height:"20","aria-hidden":"true"},e),a.createElement("g",{fill:"#7a7a7a"},a.createElement("path",{d:"M9.992 10.023c0 .2-.062.399-.172.547l-4.996 7.492a.982.982 0 01-.828.454H1c-.55 0-1-.453-1-1 0-.2.059-.403.168-.551l4.629-6.942L.168 3.078A.939.939 0 010 2.528c0-.548.45-.997 1-.997h2.996c.352 0 .649.18.828.45L9.82 9.472c.11.148.172.347.172.55zm0 0"}),a.createElement("path",{d:"M19.98 10.023c0 .2-.058.399-.168.547l-4.996 7.492a.987.987 0 01-.828.454h-3c-.547 0-.996-.453-.996-1 0-.2.059-.403.168-.551l4.625-6.942-4.625-6.945a.939.939 0 01-.168-.55 1 1 0 01.996-.997h3c.348 0 .649.18.828.45l4.996 7.492c.11.148.168.347.168.55zm0 0"})))}const S="collapseSidebarButton_Rmuo",N="collapseSidebarButtonIcon_h3D6";function Z(e){var t=e.onClick;return a.createElement("button",{type:"button",title:(0,u.I)({id:"theme.docs.sidebar.collapseButtonTitle",message:"Collapse sidebar",description:"The title attribute for collapse button of doc sidebar"}),"aria-label":(0,u.I)({id:"theme.docs.sidebar.collapseButtonAriaLabel",message:"Collapse sidebar",description:"The title attribute for collapse button of doc sidebar"}),className:(0,r.Z)("button button--secondary button--outline",S),onClick:t},a.createElement(I,{className:N}))}var T=n(5653),x=n(7075),y=n(6596),w=Symbol("EmptyContext"),L=a.createContext(w);function A(e){var t=e.children,n=(0,a.useState)(null),r=n[0],l=n[1],i=(0,a.useMemo)((function(){return{expandedItem:r,setExpandedItem:l}}),[r]);return a.createElement(L.Provider,{value:i},t)}var M=n(5762),P=n(3290),B=n(4676),F=n(2671),H=["item","onItemClick","activePath","level","index"];function R(e){var t=e.categoryLabel,n=e.onClick;return a.createElement("button",{"aria-label":(0,u.I)({id:"theme.DocSidebarItem.toggleCollapsedCategoryAriaLabel",message:"Toggle the collapsible sidebar category '{label}'",description:"The ARIA label to toggle the collapsible sidebar category"},{label:t}),type:"button",className:"clean-btn menu__caret",onClick:n})}function V(e){var t=e.item,n=e.onItemClick,l=e.activePath,o=e.level,d=e.index,s=(0,x.Z)(e,H),m=t.items,u=t.label,b=t.collapsible,p=t.className,h=t.href,v=(0,k.L)().docs.sidebar.autoCollapseCategories,E=function(e){var t=(0,F.Z)();return(0,a.useMemo)((function(){return e.href?e.href:!t&&e.collapsible?(0,c.Wl)(e):void 0}),[e,t])}(t),f=(0,c._F)(t,l),g=(0,P.Mg)(h,l),_=(0,M.u)({initialState:function(){return!!b&&(!f&&t.collapsed)}}),I=_.collapsed,S=_.setCollapsed,N=function(){var e=(0,a.useContext)(L);if(e===w)throw new y.i6("DocSidebarItemsExpandedStateProvider");return e}(),Z=N.expandedItem,T=N.setExpandedItem,A=function(e){void 0===e&&(e=!I),T(e?null:d),S(e)};return function(e){var t=e.isActive,n=e.collapsed,r=e.updateCollapsed,l=(0,y.D9)(t);(0,a.useEffect)((function(){t&&!l&&n&&r(!1)}),[t,l,n,r])}({isActive:f,collapsed:I,updateCollapsed:A}),(0,a.useEffect)((function(){b&&null!=Z&&Z!==d&&v&&S(!0)}),[b,Z,d,S,v]),a.createElement("li",{className:(0,r.Z)(i.k.docs.docSidebarItemCategory,i.k.docs.docSidebarItemCategoryLevel(o),"menu__list-item",{"menu__list-item--collapsed":I},p)},a.createElement("div",{className:(0,r.Z)("menu__list-item-collapsible",{"menu__list-item-collapsible--active":g})},a.createElement(B.Z,(0,C.Z)({className:(0,r.Z)("menu__link",{"menu__link--sublist":b,"menu__link--sublist-caret":!h&&b,"menu__link--active":f}),onClick:b?function(e){null==n||n(t),h?A(!1):(e.preventDefault(),A())}:function(){null==n||n(t)},"aria-current":g?"page":void 0,"aria-expanded":b?!I:void 0,href:b?null!=E?E:"#":E},s),u),h&&b&&a.createElement(R,{categoryLabel:u,onClick:function(e){e.preventDefault(),A()}})),a.createElement(M.z,{lazy:!0,as:"ul",className:"menu__list",collapsed:I},a.createElement(J,{items:m,tabIndex:I?-1:0,onItemClick:n,activePath:l,level:o+1})))}var D=n(8344),W=n(9631);const z="menuExternalLink_OKtT";var Y=["item","onItemClick","activePath","level","index"];function U(e){var t=e.item,n=e.onItemClick,l=e.activePath,o=e.level,d=(e.index,(0,x.Z)(e,Y)),s=t.href,m=t.label,u=t.className,b=t.autoAddBaseUrl,p=(0,c._F)(t,l),h=(0,D.Z)(s);return a.createElement("li",{className:(0,r.Z)(i.k.docs.docSidebarItemLink,i.k.docs.docSidebarItemLinkLevel(o),"menu__list-item",u),key:m},a.createElement(B.Z,(0,C.Z)({className:(0,r.Z)("menu__link",!h&&z,{"menu__link--active":p}),autoAddBaseUrl:b,"aria-current":p?"page":void 0,to:s},h&&{onClick:n?function(){return n(t)}:void 0},d),m,!h&&a.createElement(W.Z,null)))}const q="menuHtmlItem_zVAe";function G(e){var t=e.item,n=e.level,l=e.index,o=t.value,c=t.defaultStyle,d=t.className;return a.createElement("li",{className:(0,r.Z)(i.k.docs.docSidebarItemLink,i.k.docs.docSidebarItemLinkLevel(n),c&&[q,"menu__list-item"],d),key:l,dangerouslySetInnerHTML:{__html:o}})}var K=["item"];function O(e){var t=e.item,n=(0,x.Z)(e,K);switch(t.type){case"category":return a.createElement(V,(0,C.Z)({item:t},n));case"html":return a.createElement(G,(0,C.Z)({item:t},n));default:return a.createElement(U,(0,C.Z)({item:t},n))}}var Q=["items"];function j(e){var t=e.items,n=(0,x.Z)(e,Q);return a.createElement(A,null,t.map((function(e,t){return a.createElement(O,(0,C.Z)({key:t,item:e,index:t},n))})))}const J=(0,a.memo)(j),X="menu_UThG",$="menuWithAnnouncementBar_MJtx";function ee(e){var t=e.path,n=e.sidebar,l=e.className,o=function(){var e=(0,T.nT)().isActive,t=(0,a.useState)(e),n=t[0],r=t[1];return(0,b.RF)((function(t){var n=t.scrollY;e&&r(0===n)}),[e]),e&&n}();return a.createElement("nav",{"aria-label":(0,u.I)({id:"theme.docs.sidebar.navAriaLabel",message:"Docs sidebar",description:"The ARIA label for the sidebar navigation"}),className:(0,r.Z)("menu thin-scrollbar",X,o&&$,l)},a.createElement("ul",{className:(0,r.Z)(i.k.docs.docSidebarMenu,"menu__list")},a.createElement(J,{items:n,activePath:t,level:1})))}const te="sidebar_qbtQ",ne="sidebarWithHideableNavbar_Y4J7",ae="sidebarHidden_jRT5",re="sidebarLogo_NY9Z";function le(e){var t=e.path,n=e.sidebar,l=e.onCollapse,i=e.isHidden,o=(0,k.L)(),c=o.navbar.hideOnScroll,d=o.docs.sidebar.hideable;return a.createElement("div",{className:(0,r.Z)(te,c&&ne,i&&ae)},c&&a.createElement(_.Z,{tabIndex:-1,className:re}),a.createElement(ee,{path:t,sidebar:n}),d&&a.createElement(Z,{onClick:l}))}const ie=a.memo(le);var oe=n(499),ce=n(6490),de=function(e){var t=e.sidebar,n=e.path,l=(0,ce.e)();return a.createElement("ul",{className:(0,r.Z)(i.k.docs.docSidebarMenu,"menu__list")},a.createElement(J,{items:t,activePath:n,onItemClick:function(e){"category"===e.type&&e.href&&l.toggle(),"link"===e.type&&l.toggle()},level:1}))};function se(e){return a.createElement(oe.Zo,{component:de,props:e})}const me=a.memo(se);function ue(e){var t=(0,g.i)(),n="desktop"===t||"ssr"===t,r="mobile"===t;return a.createElement(a.Fragment,null,n&&a.createElement(ie,e),r&&a.createElement(me,e))}const be="expandButton_aIPS",pe="expandButtonIcon_LuQe";function he(e){var t=e.toggleSidebar;return a.createElement("div",{className:be,title:(0,u.I)({id:"theme.docs.sidebar.expandButtonTitle",message:"Expand sidebar",description:"The ARIA label and title attribute for expand button of doc sidebar"}),"aria-label":(0,u.I)({id:"theme.docs.sidebar.expandButtonAriaLabel",message:"Expand sidebar",description:"The ARIA label and title attribute for expand button of doc sidebar"}),tabIndex:0,role:"button",onKeyDown:t,onClick:t},a.createElement(I,{className:pe}))}const ve={docSidebarContainer:"docSidebarContainer_vg46",docSidebarContainerHidden:"docSidebarContainerHidden_rlrV",sidebarViewport:"sidebarViewport_bWKV"};function Ee(e){var t,n=e.children,r=(0,s.V)();return a.createElement(a.Fragment,{key:null!=(t=null==r?void 0:r.name)?t:"noSidebar"},n)}function fe(e){var t=e.sidebar,n=e.hiddenSidebarContainer,l=e.setHiddenSidebarContainer,o=(0,f.TH)().pathname,c=(0,a.useState)(!1),d=c[0],s=c[1],m=(0,a.useCallback)((function(){d&&s(!1),l((function(e){return!e}))}),[l,d]);return a.createElement("aside",{className:(0,r.Z)(i.k.docs.docSidebarContainer,ve.docSidebarContainer,n&&ve.docSidebarContainerHidden),onTransitionEnd:function(e){e.currentTarget.classList.contains(ve.docSidebarContainer)&&n&&s(!0)}},a.createElement(Ee,null,a.createElement("div",{className:(0,r.Z)(ve.sidebarViewport,d&&ve.sidebarViewportHidden)},a.createElement(ue,{sidebar:t,path:o,onCollapse:m,isHidden:d}),d&&a.createElement(he,{toggleSidebar:m}))))}const ge={docMainContainer:"docMainContainer_RMvG",docMainContainerEnhanced:"docMainContainerEnhanced_glLZ",docItemWrapperEnhanced:"docItemWrapperEnhanced_VlTW"};function ke(e){var t=e.hiddenSidebarContainer,n=e.children,l=(0,s.V)();return a.createElement("main",{className:(0,r.Z)(ge.docMainContainer,(t||!l)&&ge.docMainContainerEnhanced)},a.createElement("div",{className:(0,r.Z)("container padding-top--md padding-bottom--lg",ge.docItemWrapper,t&&ge.docItemWrapperEnhanced)},n))}const _e="docPage_eeXL",Ce="docsWrapper_pySQ";function Ie(e){var t=e.children,n=(0,s.V)(),r=(0,a.useState)(!1),l=r[0],i=r[1];return a.createElement(m.Z,{wrapperClassName:Ce},a.createElement(E,null),a.createElement("div",{className:_e},n&&a.createElement(fe,{sidebar:n.items,hiddenSidebarContainer:l,setHiddenSidebarContainer:i}),a.createElement(ke,{hiddenSidebarContainer:l},t)))}var Se=n(4726),Ne=n(7823);function Ze(e){var t=e.versionMetadata;return a.createElement(a.Fragment,null,a.createElement(Ne.Z,{version:t.version,tag:(0,o.os)(t.pluginId,t.version)}),a.createElement(l.d,null,t.noIndex&&a.createElement("meta",{name:"robots",content:"noindex, nofollow"})))}function Te(e){var t=e.versionMetadata,n=(0,c.hI)(e);if(!n)return a.createElement(Se.default,null);var o=n.docElement,m=n.sidebarName,u=n.sidebarItems;return a.createElement(a.Fragment,null,a.createElement(Ze,e),a.createElement(l.FG,{className:(0,r.Z)(i.k.wrapper.docsPages,i.k.page.docsDocPage,e.versionMetadata.className)},a.createElement(d.q,{version:t},a.createElement(s.b,{name:m,items:u},a.createElement(Ie,null,o)))))}},4726:(e,t,n)=>{n.r(t),n.d(t,{default:()=>o});var a=n(9496),r=n(8205),l=n(8262),i=n(3491);function o(){return a.createElement(a.Fragment,null,a.createElement(l.d,{title:(0,r.I)({id:"theme.NotFound.title",message:"Page Not Found"})}),a.createElement(i.Z,null,a.createElement("main",{className:"container margin-vert--xl"},a.createElement("div",{className:"row"},a.createElement("div",{className:"col col--6 col--offset-3"},a.createElement("h1",{className:"hero__title"},a.createElement(r.Z,{id:"theme.NotFound.title",description:"The title of the 404 page"},"Page Not Found")),a.createElement("p",null,a.createElement(r.Z,{id:"theme.NotFound.p1",description:"The first paragraph of the 404 page"},"We could not find what you were looking for.")),a.createElement("p",null,a.createElement(r.Z,{id:"theme.NotFound.p2",description:"The 2nd paragraph of the 404 page"},"Please contact the owner of the site that linked you to the original URL and let them know their link is broken.")))))))}},8121:(e,t,n)=>{n.d(t,{E:()=>o,q:()=>i});var a=n(9496),r=n(6596),l=a.createContext(null);function i(e){var t=e.children,n=e.version;return a.createElement(l.Provider,{value:n},t)}function o(){var e=(0,a.useContext)(l);if(null===e)throw new r.i6("DocsVersionProvider");return e}}}]);