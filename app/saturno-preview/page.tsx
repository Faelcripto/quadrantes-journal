import Journal from '../journal';
import {defaultContent} from '@/lib/site-content';

export const metadata={robots:{index:false,follow:false}};
export default function SaturnPreview(){
 return <div data-saturno-preview=""><style>{`
 [data-saturno-preview] .orbit-universe{background-image:linear-gradient(0deg,#03070e55,transparent 65%),url('/saturno-aneis-cobre.webp')!important;background-position:center,28% center!important}
 @media(max-width:767px){[data-saturno-preview] .orbit-universe{background-position:center,26% center!important}}
 `}</style><Journal user={null} content={defaultContent} isAdmin={false}/></div>;
}
