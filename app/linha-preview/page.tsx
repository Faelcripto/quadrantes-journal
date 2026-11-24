import Journal from '../journal';
import {defaultContent} from '@/lib/site-content';
export const metadata={robots:{index:false,follow:false}};
export default function LinhaPreview(){return <div data-linha=""><style>{`
[data-linha] .orbit-universe{background:radial-gradient(ellipse at 78% 18%,#211820 0%,transparent 36%),linear-gradient(120deg,#071221,#030811 65%,#030407)!important}
[data-linha] .orbit-shell .workspace .page-content .saturn-sky{display:grid;grid-template-columns:minmax(0,1fr) minmax(110px,32%);gap:12px 20px;align-items:center;min-height:104px;margin-block:0 16px;padding-block:14px}
[data-linha] .saturn-sky>div{grid-column:1;grid-row:1;min-width:0}
[data-linha] .saturn-sky h1{font-size:clamp(1.55rem,2.4vw,2.15rem);line-height:1.15;letter-spacing:-.035em;margin:0;text-wrap:balance}
[data-linha] .saturn-sky > div > h1 + p{display:none}
[data-linha] .saturn-sky::after{content:"";grid-row:1;grid-column:2;display:block;width:100%;height:clamp(64px,7vw,108px);background:url('/linha-cobre-preview.svg') center/100% auto no-repeat;pointer-events:none}
[data-linha] .saturn-sky:has(>button){grid-template-columns:minmax(0,1fr) minmax(110px,24%) auto}
[data-linha] .saturn-sky>button{grid-column:3;grid-row:1;justify-self:end}
body:has([data-linha]) [data-slot="sidebar-content"] nav{padding:10px 8px 14px!important}
body:has([data-linha]) [data-slot="sidebar-content"] [data-slot="sidebar-menu"]{padding-inline:8px}
body:has([data-linha]) [data-slot="sidebar-content"] :is(.community-tabs button,[data-slot="sidebar-menu-button"]){display:flex;justify-content:flex-start;align-items:center;gap:10px;padding:8px 12px;min-height:44px;box-sizing:border-box;width:100%;font-size:.9375rem;line-height:1.25;text-align:left}
body:has([data-linha]) .community-tabs button>b{margin-inline-start:auto}
body:has([data-linha]) [data-slot="sidebar-content"] button>svg{width:18px;height:18px;flex:none}

body:has([data-linha]) :is(.app-sidebar [data-slot="sidebar-inner"],[data-sidebar="sidebar"][data-mobile="true"]){
 background:radial-gradient(1px 1px at 11% 16%,#b3cae687 65%,transparent),radial-gradient(1px 1px at 76% 38%,#a8bada6e 65%,transparent),radial-gradient(1px 1px at 57% 73%,#c8dbea77 65%,transparent),linear-gradient(180deg,#000002 0%,#00040a 20%,#000b16 49%,#010a12 73%,#03050c 92%,#010207 100%)!important;
 background-size:199px 223px,271px 317px,173px 281px,100% 100%!important;
}
body:has([data-linha]) .community-tabs button:not(.selected):not(.is-live):not(:hover){background:#121212}
body:has([data-linha]) .community-tabs button.selected:not(.is-live){background:#2a1f18}

@media(max-width:700px){[data-linha] .orbit-shell .workspace .page-content .saturn-sky{grid-template-columns:minmax(0,1fr) minmax(66px,27%);min-height:80px;gap:8px;margin-bottom:10px;padding-block:10px}[data-linha] .saturn-sky>button{grid-row:2;grid-column:1/-1;justify-self:start}[data-linha] .saturn-sky::after{height:55px}}
`}</style><Journal user={null} content={defaultContent} isAdmin={false}/></div>}
