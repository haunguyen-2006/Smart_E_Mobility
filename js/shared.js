/* Shared SVG and text helpers. Keep renderer-independent utilities here. */
window.DiagramCore = (() => {
const esc = s => String(s ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");
function wrapWords(text, maxChars=36, maxLines=4){
  const words=String(text??"").split(/\s+/).filter(Boolean), lines=[];
  let line="";
  for(const word of words){
    if(word.length>maxChars){
      if(line){lines.push(line);line="";}
      for(let i=0;i<word.length;i+=maxChars) lines.push(word.slice(i,i+maxChars));
      continue;
    }
    const candidate=line?line+" "+word:word;
    if(candidate.length>maxChars && line){lines.push(line);line=word;} else line=candidate;
  }
  if(line) lines.push(line);
  if(lines.length>maxLines){lines.length=maxLines;lines[maxLines-1]=lines[maxLines-1].replace(/[.,;:]?$/,"")+"…";}
  return lines;
}
function wrapAllWords(text,maxChars=48){
  const words=String(text??"").trim().split(/\s+/).filter(Boolean), lines=[]; let line="";
  for(const word of words){
    if(word.length>maxChars){
      if(line){lines.push(line);line="";}
      for(let i=0;i<word.length;i+=maxChars) lines.push(word.slice(i,i+maxChars));
      continue;
    }
    const candidate=line?line+" "+word:word;
    if(candidate.length>maxChars && line){lines.push(line);line=word;} else line=candidate;
  }
  if(line) lines.push(line);
  return lines.length?lines:[""];
}
function svgText(x,y,text,opts={}){
  const {anchor="start",size=13,fill="#263750",weight=500,max=40,lineH=16,maxLines=3}=opts;
  const lines=wrapWords(text,max,maxLines);
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" font-weight="${weight}" fill="${fill}">${lines.map((ln,i)=>`<tspan x="${x}" dy="${i===0?0:lineH}">${esc(ln)}</tspan>`).join("")}</text>`;
}
function svgTextCentered(x,cy,text,opts={}){
  const {anchor="middle",size=13,fill="#263750",weight=500,max=40,lineH=16}=opts;
  const lines=wrapAllWords(text,max);
  const firstY=cy-((lines.length-1)*lineH)/2+size*0.34;
  return `<text x="${x}" y="${firstY}" text-anchor="${anchor}" font-size="${size}" font-weight="${weight}" fill="${fill}">${lines.map((ln,i)=>`<tspan x="${x}" dy="${i===0?0:lineH}">${esc(ln)}</tspan>`).join("")}</text>`;
}
function svgTextLines(x,yTop,lines,opts={}){
  const {anchor="start",size=12,fill="#263750",weight=500,lineH=15}=opts;
  const y=yTop+size;
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" font-weight="${weight}" fill="${fill}">${lines.map((ln,i)=>`<tspan x="${x}" dy="${i===0?0:lineH}">${esc(ln)}</tspan>`).join("")}</text>`;
}
let diagramSvgCounter=0;
function arrowDefs(prefix){
 return `<defs>
  <marker id="${prefix}-arrCall" markerWidth="9" markerHeight="9" refX="9" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#365b91"/></marker>
  <marker id="${prefix}-arrReturn" markerWidth="9" markerHeight="9" refX="9" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#6e7d91"/></marker>
  <marker id="${prefix}-arrBranch" markerWidth="9" markerHeight="9" refX="9" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#b77724"/></marker>
  <marker id="${prefix}-arrState" markerWidth="9" markerHeight="9" refX="9" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#227a76"/></marker>
 </defs>`;
}
function makeSvg(viewBox, contents, label){
 const dims=String(viewBox).trim().split(/\s+/); const svgW=Number(dims[2])||1200, svgH=Number(dims[3])||800;
 const prefix=`diagram-${++diagramSvgCounter}`;
 contents=contents.replace(/url\(#arrCall\)/g,`url(#${prefix}-arrCall)`).replace(/url\(#arrReturn\)/g,`url(#${prefix}-arrReturn)`).replace(/url\(#arrBranch\)/g,`url(#${prefix}-arrBranch)`).replace(/url\(#arrState\)/g,`url(#${prefix}-arrState)`);
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}" role="img" aria-label="${esc(label)}" viewBox="${viewBox}" class="diagram-svg">${arrowDefs(prefix)}${contents}</svg>`;
}

function shortRole(u){
  if(u.id==="UC-001"||u.id==="UC-023") return "User";
  return u.actor;
}
  return { esc, wrapWords, wrapAllWords, svgText, svgTextCentered, svgTextLines, arrowDefs, makeSvg, shortRole };
})();
