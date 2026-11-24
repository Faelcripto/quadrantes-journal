import Journal from '../journal';
import {defaultContent} from '@/lib/site-content';
import Scene from './scene';

export const metadata={robots:{index:false,follow:false}};
export default function CosmicPreview(){
 return <div data-cosmic-preview=""><style>{'[data-cosmic-preview] .orbit-universe i,[data-cosmic-preview] .orbit-universe::before,[data-cosmic-preview] .orbit-universe::after{display:none!important}'}</style><Journal user={null} content={defaultContent} isAdmin={false}/><Scene/></div>;
}
