// Analytic ray tracing in world space. The same light illuminates bodies and rings.
export const fragment = `
precision highp float;
uniform vec2 res,mouse;
uniform float t,quality;
float hash(vec3 p){p=fract(p*.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}
float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1)),f.x),f.y),f.z);}
float fb(vec3 p){return noise(p)*.54+noise(p*2.03+7.)*.27+noise(p*4.1)*.13+noise(p*8.3+3.)*.06;}
mat2 rot(float a){return mat2(cos(a),sin(a),-sin(a),cos(a));}
float sphere(vec3 o,vec3 d,vec3 c,float r){vec3 v=o-c;float b=dot(v,d),h=b*b-dot(v,v)+r*r;return h>0.?-b-sqrt(h):1e4;}
vec3 stars(vec2 p,float scale,float seed){p=p*scale;vec2 id=floor(p);float h=hash(vec3(id,seed));vec2 f=fract(p)-.16-.68*vec2(hash(vec3(id,seed+2.)),hash(vec3(id,seed+1.)));float a=length(f);return mix(vec3(.52,.73,1),vec3(1,.81,.57),h)*smoothstep(.80,1.,h)*exp(-a*a*mix(350.,130.,h))*.72;}
float ringBand(float r){float v=.4+.3*sin(r*77.)+.15*sin(r*203.)+.08*sin(r*419.);return (.52+.48*v)*(1.-.90*exp(-pow((r-1.96)*48.,2.)))*smoothstep(1.28,1.46,r)*(1.-smoothstep(2.12,2.22,r));}
void main(){
 float aspect=res.x/res.y;vec2 uv=(2.*gl_FragCoord.xy-res)/res.y;
 vec3 eye=vec3(mouse*.048+vec2(sin(t*.018)*.035,cos(t*.014)*.017),5.);
 vec3 d=normalize(vec3(uv,-2.25));vec2 sky=d.xy/-d.z;
 vec3 col=vec3(.012,.016,.028);
 // Sample different depths through a tilted, turbulent interstellar dust sheet.
 for(int j=0;j<5;j++){if(quality<.6&&j>2)break;float z=9.+float(j)*2.4;vec3 p=eye+d*z;
 float cloud=fb(p*.43+vec3(3.,8.,t*.0015));float ribbon=exp(-abs(p.y-.27*p.x-.9*sin(p.x*.55)-.35*z+3.)*1.15);
 col+=mix(vec3(.016,.066,.098),vec3(.15,.058,.205),cloud)*ribbon*smoothstep(.25,.75,cloud)*.63;}
 col+=stars(sky+eye.xy*.002,88.,7.)+stars(sky+eye.xy*.006,39.,31.);
 vec2 g=(sky-vec2(-aspect*.31,.235))*rot(.34);g.y*=3.4;float gr=length(g);
 col+=vec3(.23,.18,.32)*exp(-gr*40.)*(.55+.45*cos(atan(g.y,g.x)*2.+gr*122.));
 vec3 sun=vec3(-aspect*.9,.60,-2.6);vec3 sd=normalize(sun-eye);
 float dist=length(d-sd);float rays=.8+.2*sin(atan(d.y-sd.y,d.x-sd.x)*10.+t*.012);
 col+=vec3(1.,.59,.21)*(exp(-dist*15.)*.35*rays+exp(-dist*56.)*.95)+vec3(1.,.92,.70)*(1.-smoothstep(.010,.012,dist));
 // Fine motes, with near and far planes responding differently to camera drift.
 col+=stars(sky+eye.xy*.055+vec2(t*.00028,-t*.00011),23.,13.)*vec3(.23,.51,.42);
 for(int j=0;j<2;j++){float k=float(j),period=21.+k*10.;float cycle=floor((t+5.+k*7.)/period);float phase=mod(t+5.+k*7.,period);
 float seed=hash(vec3(cycle,k,7.));vec2 dir=normalize(vec2(1.,-.26-.35*seed));vec2 q=sky+eye.xy*(.015+.018*k)-vec2(-aspect*.53,.10+.28*seed)+dir*(.12-phase*(.23+.04*k));float a=dot(q,dir),b=abs(q.x*dir.y-q.y*dir.x);
 col+=vec3(.63,.80,1.)*exp(-b*1100.)*exp(-abs(a)*42.)*(1.-smoothstep(.001,.006,a))*smoothstep(0.,.5,phase)*(1.-smoothstep(3.,4.,phase));}
 vec3 sat=vec3(aspect*1.17+.035*sin(t*.024),.53+.025*cos(t*.032),-.3);
 float rad=min(.70,aspect*.66);vec3 rn=normalize(vec3(-.23,.89,.38));float nearest=1e4;
 for(int j=0;j<4;j++){float k=float(j);vec3 c=sat;float r=rad;
 if(j==1){c=vec3(-aspect*.96,-.98,-1.5);r=.31;}
 if(j==2){c=vec3(aspect*.19+sin(t*.023)*.08,1.36,-2.9);r=.14;}
 if(j==3){c=sat+vec3(cos(.5+t*.035)*rad*2.35,sin(.5+t*.035)*rad*.55,sin(.5+t*.035)*rad*1.4);r=rad*.084;}
 float h=sphere(eye,d,c,r);if(h>0.&&h<nearest){nearest=h;vec3 pos=eye+h*d,n=normalize(pos-c),l=normalize(sun-pos);vec3 tex=n;tex.xy=rot(-.19)*tex.xy;tex.xz=rot(t*(.022+k*.009))*tex.xz;
 float f=fb(tex*7.+k),lat=tex.y+.03*(f-.5);vec3 albedo=mix(vec3(.47,.31,.18),vec3(.93,.79,.57),clamp(.5+.23*sin(lat*38.)+.17*sin(lat*83.+f*4.)+.11*sin(lat*183.)+f*.17,0.,1.));
 if(j==1)albedo=mix(vec3(.035,.105,.18),vec3(.12,.54,.50),smoothstep(.32,.65,f));if(j==2)albedo=mix(vec3(.19,.09,.25),vec3(.66,.44,.47),f);if(j==3)albedo=vec3(.50,.45,.40)*f;
 float shadow=1.;if(j==0){float a=dot(c-pos,rn)/dot(l,rn);if(a>.001)shadow-=.81*ringBand(length(pos+a*l-c)/r);}
 float nl=dot(n,l);col=albedo*(vec3(.065,.081,.12)+vec3(1.,.86,.66)*max(nl,0.)*shadow)+vec3(.40,.53,.66)*pow(1.-max(dot(n,-d),0.),4.)*(.09+.6*max(nl,0.));}}
 float den=dot(d,rn);if(abs(den)>.001){float h=dot(sat-eye,rn)/den;vec3 pos=eye+d*h;float r=length(pos-sat)/rad;
 if(h>0.&&h<nearest&&r>1.28&&r<2.22){float band=ringBand(r);vec3 l=normalize(sun-pos);vec3 v=pos-sat;float sh=dot(v,l)<0.?smoothstep(rad*.94,rad*1.07,length(cross(v,l))):1.;
 vec3 ice=mix(vec3(.54,.39,.27),vec3(.95,.85,.67),.5+.5*sin(r*63.));col=mix(col,ice*(.19+.75*sh),clamp(band*1.33,0.,1.));}
 if(h>0.&&h<nearest&&r>2.5)col+=vec3(.10,.15,.19)*exp(-abs(r-2.68)*120.);}
 gl_FragColor=vec4(col/(1.+.25*col),1.);
}`;
