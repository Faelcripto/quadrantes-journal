import Journal from '../journal';
import {defaultContent} from '@/lib/site-content';
export const metadata={robots:{index:false,follow:false}};
export default function LinhaPreview(){return <div data-linha=""><style>{`
[data-linha] .orbit-universe{background:radial-gradient(ellipse at 13% 47%,#211820 0%,transparent 33%),linear-gradient(120deg,#071221,#030811 65%,#030407)!important}
[data-linha] .orbit-universe::after{content:"";position:absolute;left:0;top:43%;width:clamp(280px,32vw,560px);height:auto;aspect-ratio:384/240;transform:translateY(-50%);background:url('/linha-cobre-preview.svg') center/contain no-repeat;pointer-events:none}
@media(max-width:767px){[data-linha] .orbit-universe::after{width:78vw;opacity:.7}}
`}</style><Journal user={null} content={defaultContent} isAdmin={false}/></div>}
