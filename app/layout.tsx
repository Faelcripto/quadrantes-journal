import {createClient} from "@/lib/supabase/server";
import {readSiteContent} from "@/lib/site-content-server";
import {defaultContent} from "@/lib/site-content";
import type { Metadata } from "next";
import "./globals.css";

async function appearance(){
 try{return (await readSiteContent(await createClient(),true)).content.appearance;}
 catch{return defaultContent.appearance;}
}
export async function generateMetadata():Promise<Metadata>{const a=await appearance();return {title:a.name+' | Quadrantes',description:a.description,icons:{icon:'/favicon.svg'}};}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const a=await appearance();
  const colors=a.background==="black"?{base:"#030303",side:"#080808",panel:"#0d0d0d",field:"#111111"}:{base:"#101114",side:"#151619",panel:"#1b1c20",field:"#222329"};
  const accent={orange:"#f99545",gold:"#e5bd59",mint:"#72d9b2"}[a.accent];
  return (
    <html lang="pt-BR" style={{"--site-base":colors.base,"--site-side":colors.side,"--site-panel":colors.panel,"--site-field":colors.field,"--brand-accent":accent,"--primary":accent,"--ring":accent,"--background":colors.base,"--card":colors.panel,"--sidebar":colors.side} as React.CSSProperties}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
