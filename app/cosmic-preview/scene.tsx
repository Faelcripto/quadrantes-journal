'use client';
import {useEffect} from 'react';
import {fragment} from './universe';

export default function Scene(){
 useEffect(()=>{
  const host=document.querySelector<HTMLElement>('[data-cosmic-preview] .orbit-universe');
  if(!host)return;
  const canvas=document.createElement('canvas');canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none';host.appendChild(canvas);
  const gl=canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,powerPreference:'low-power'});
  if(!gl){canvas.remove();return;}
  const prog=gl.createProgram();if(!prog){canvas.remove();return;}
  const shaders:WebGLShader[]=[];
  for(const [type,source] of [[gl.VERTEX_SHADER,'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'],[gl.FRAGMENT_SHADER,fragment]] as const){
   const sh=gl.createShader(type);if(!sh)break;gl.shaderSource(sh,source);gl.compileShader(sh);gl.attachShader(prog,sh);shaders.push(sh);
  }
  gl.linkProgram(prog);shaders.forEach(s=>gl.deleteShader(s));if(!gl.getProgramParameter(prog,gl.LINK_STATUS)){gl.deleteProgram(prog);canvas.remove();return;}
  gl.useProgram(prog);const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  const loc=gl.getAttribLocation(prog,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  const [res,mouse,t,quality]=['res','mouse','t','quality'].map(k=>gl.getUniformLocation(prog,k));
  const motion=matchMedia('(prefers-reduced-motion: reduce)');let scale=innerWidth<750?.8:1,raf=0,last=0,time=0,x=0,y=0,tx=0,ty=0,slow=0,lost=false;
  function draw(now:number){raf=0;if(document.hidden||lost)return;const dt=last?now-last:0;
   if(dt>0&&dt<32&&!motion.matches){raf=requestAnimationFrame(draw);return;}
   slow=dt>52?slow+1:Math.max(0,slow-1);if(slow>=12){scale=Math.max(.45,scale*.82);slow=0;}
   last=now;time+=motion.matches?0:Math.min(dt,70)*.001;x+=(tx-x)*.045;y+=(ty-y)*.045;
   const ratio=scale*Math.min(devicePixelRatio||1,1.4,1600/Math.max(innerWidth,innerHeight));
   const w=Math.max(1,Math.round(innerWidth*ratio)),h=Math.max(1,Math.round(innerHeight*ratio));
   if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl!.viewport(0,0,w,h);}
   gl!.uniform2f(res,w,h);gl!.uniform2f(mouse,motion.matches?0:x,motion.matches?0:y);gl!.uniform1f(t,time);gl!.uniform1f(quality,scale);gl!.drawArrays(gl!.TRIANGLES,0,3);if(!motion.matches)raf=requestAnimationFrame(draw);
  }
  function restart(){cancelAnimationFrame(raf);last=0;if(!document.hidden&&!lost)raf=requestAnimationFrame(draw);}
  function pointer(e:PointerEvent){if(e.pointerType!=='touch'){tx=e.clientX/innerWidth*2-1;ty=1-e.clientY/innerHeight*2;}}
  function loss(){lost=true;cancelAnimationFrame(raf);canvas.style.display='none';}
  document.addEventListener('visibilitychange',restart);window.addEventListener('resize',restart);window.addEventListener('pointermove',pointer,{passive:true});motion.addEventListener('change',restart);canvas.addEventListener('webglcontextlost',loss);restart();
  return ()=>{cancelAnimationFrame(raf);document.removeEventListener('visibilitychange',restart);window.removeEventListener('resize',restart);window.removeEventListener('pointermove',pointer);motion.removeEventListener('change',restart);canvas.removeEventListener('webglcontextlost',loss);gl.deleteBuffer(buf);gl.deleteProgram(prog);canvas.remove();};
 },[]);
 return null;
}
