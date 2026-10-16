import type {SiteContent} from './site-content';
export function normalizeCourse(course:SiteContent['course']):SiteContent['course']{
 return {...course,modules:course.modules.map((m,i)=>({...m,lessons:m.lessons.map((l,j)=>({...l,id:l.id||`original-module-${i}-lesson-${j}`}))}))};
}
export function courseProgress(course:SiteContent['course'],completed:readonly string[]){
 const normalized=normalizeCourse(course);
 const lessons=normalized.modules.flatMap((m,moduleIndex)=>m.lessons.map((l,lessonIndex)=>({...l,id:l.id!,moduleTitle:m.title,moduleIndex,lessonIndex}))).filter(l=>!!l.videoUrl);
 const done=new Set(completed);const count=lessons.filter(l=>done.has(l.id)).length;
 return {lessons,count,total:lessons.length,percent:lessons.length?Math.floor(count/lessons.length*100):0,next:lessons.find(l=>!done.has(l.id))||null};
}
