/* Application controller: navigation, filtering, gallery, printing, and SVG export. */
(() => {
  const UCs = window.SMART_MOBILITY_UCS || [];
  if (UCs.length !== 23) {
    document.body.innerHTML = '<main style="font:16px system-ui;padding:32px;color:#922">Data loading error: expected 23 Use Cases, found ' + UCs.length + '. Check that all js/data/UC-xxx.js files are present and loaded before app.js.</main>';
    return;
  }
  const { esc } = window.DiagramCore;
  const { renderSequence, renderActivity, renderState } = window.SmartMobilityRenderers;
  const byId = new Map(UCs.map(u => [u.id, u]));
  const categories = [...new Set(UCs.map(u => u.category))];
  let currentId = UCs[0].id;
  let currentTab = 'sequence';
  let galleryMode = false;
  const $ = id => document.getElementById(id);

function flowNotesHtml(u){
  const renderGroup=(title,items,cls)=>{
    if(!items?.length) return "";
    return `<div class="note-group ${cls}"><h4>${title} (${items.length})</h4>${items.map(a=>`<div class="note-item"><div class="note-code">${esc(a.code)}</div><div class="note-title">${esc(a.title)}</div><div class="note-desc">${esc(a.description)}</div></div>`).join("")}</div>`;
  };
  return `<div class="branch-head">Source scenario branches</div><div class="notes-grid">${renderGroup("Alternative flows",u.alternatives,"alt")}${renderGroup("Exception flows",u.exceptions,"exc")}</div>`;
}
function sourceDetailsHtml(u){
 const fmtBullets=(s)=>String(s||"").split(/\s*•\s*/).map(x=>x.trim()).filter(Boolean).map(x=>`<li>${esc(x)}</li>`).join("");
 return `<h4>Trigger</h4><div class="source-line">${esc(u.trigger)}</div>
 <h4>Preconditions</h4><ul>${fmtBullets(u.preconditions)}</ul>
 <h4>Main Success Scenario</h4><ol>${u.steps.map(s=>`<li>${esc(s.text)}</li>`).join("")}</ol>
 <h4>Postconditions (success)</h4><div class="source-line">${esc(u.postconditions)}</div>
 <h4>Business Rules</h4><ul>${fmtBullets(u.businessRules)}</ul>
 <h4>Assumptions</h4><div class="source-line">${esc(u.assumptions)}</div>`;
}
function setTab(tab){
 currentTab=tab;
 document.querySelectorAll(".tab").forEach(b=>{
   const active=b.dataset.tab===tab;
   b.classList.toggle("active",active);
   b.setAttribute("aria-selected",active?"true":"false");
 });
 renderCurrentDiagram();
}
function renderCurrentDiagram(){
 if(galleryMode) return;
 const u=byId.get(currentId);
 let svg="", title="", hint="";
 if(currentTab==="sequence"){
   svg=renderSequence(u); title="Sequence Diagram";
   hint="Time flows from top to bottom. Solid arrows are requests/actions; dashed arrows are responses.";
   $("stateCaveat").hidden=true;
 }else if(currentTab==="activity"){
   svg=renderActivity(u); title="Activity Diagram";
   hint="The main success path is shown first; validation gates precede success-only actions. Every alternative and exception appears in a separate card below.";
   $("stateCaveat").hidden=true;
 }else{
   svg=renderState(u); title="State-chart Diagram";
   hint=`Workflow subject: ${u.state.subject}. Main states are above the branch outcomes; branch return targets are labelled to avoid crossing arrows.`;
   $("stateCaveat").hidden=false;
   $("stateCaveat").textContent="Modeling note: "+u.stateNote+" Review the inferred transitions with the group; do not treat them as additional database fields or confirmed business rules.";
 }
 $("diagramTitle").textContent=title;
 $("diagramHint").textContent=hint;
 $("diagramWrap").innerHTML=svg;
 $("branchNotes").innerHTML=currentTab==="activity"?"":flowNotesHtml(u);
 $("sourceBlock").innerHTML=sourceDetailsHtml(u);
}
function renderNav(){
 const q=$("search").value.trim().toLowerCase(), cat=$("categoryFilter").value;
 let shown=0, out="", last="";
 UCs.forEach(u=>{
   const hay=(u.id+" "+u.name+" "+u.actor+" "+u.category+" "+u.goal).toLowerCase();
   if(q&&!hay.includes(q)) return;
   if(cat&&u.category!==cat) return;
   shown++;
   if(u.category!==last){out+=`<div class="category-heading">${esc(u.category)}</div>`;last=u.category;}
   out+=`<button class="uc-link ${u.id===currentId?"selected":""}" data-id="${u.id}">
     <span class="uc-no">${u.id}</span><span class="uc-link-name">${esc(u.name)}</span></button>`;
 });
 $("navList").innerHTML=out||`<div class="empty">No matching use cases.</div>`;
 $("navCount").textContent=`(${shown})`;
 document.querySelectorAll(".uc-link").forEach(b=>b.addEventListener("click",()=>selectUC(b.dataset.id)));
}
function renderSelectedMeta(u){
 $("ucKicker").textContent=`${u.id} · ${u.category}`;
 $("ucTitle").textContent=u.name;
 $("ucGoal").textContent=u.goal;
 $("ucPills").innerHTML=`<span class="pill actor">${esc(u.actor)}</span><span class="pill">${u.steps.length} main steps</span><span class="pill">${u.alternatives.length} alternatives</span><span class="pill">${u.exceptions.length} exceptions</span>`;
 const meta=[
   ["Trigger",u.trigger],
   ["Preconditions",u.preconditions.replace(/\s*•\s*/g," · ")],
   ["Success outcome",u.postconditions]
 ];
 $("metaGrid").innerHTML=meta.map(([k,v])=>`<div class="meta"><label>${esc(k)}</label><div>${esc(v)}</div></div>`).join("");
}
function selectUC(id){
 if(!byId.has(id)) return;
 currentId=id;
 if(galleryMode){galleryMode=false;$("galleryView").hidden=true;$("singleView").hidden=false;$("galleryBtn").textContent="Browse all 23 / 69 diagrams";}
 renderSelectedMeta(byId.get(id));
 renderNav();
 renderCurrentDiagram();
 $("sourceDetails").open=false;
}
function fillFilters(){
 categories.forEach(c=>{const opt=document.createElement("option");opt.value=c;opt.textContent=c;$("categoryFilter").appendChild(opt);});
}
function exportCurrentSvg(){
 const svg=$("diagramWrap").querySelector("svg");
 if(!svg) return;
 const blob=new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n`+svg.outerHTML],{type:"image/svg+xml;charset=utf-8"});
 const url=URL.createObjectURL(blob), a=document.createElement("a");
 a.href=url;a.download=`${currentId.replace("-","_")}_${currentTab}_diagram.svg`;
 document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
}
function addGallery(){
 galleryMode=true;$("singleView").hidden=true;$("galleryView").hidden=false;
 $("galleryBtn").textContent="Back to current Use Case";
 let out=`<div class="card gallery-card"><h2 style="margin:0 0 6px">All 23 Use Cases · 69 Diagrams</h2><div class="gallery-desc">Open any diagram below to render it. Each figure is generated from the attached use-case specification and the explicit modeling notes in this file.</div><div class="small-note">For a clean review, expand one diagram at a time. The diagrams are intentionally grouped by Use Case rather than displayed as a single oversized image.</div></div>`;
 UCs.forEach(u=>{
   out+=`<section class="card gallery-card"><h3>${esc(u.id)}: ${esc(u.name)}</h3><div class="gallery-desc">${esc(u.category)} · Actor: ${esc(u.actor)}</div>`;
   const tabs=[["sequence","Sequence Diagram"],["activity","Activity Diagram"],["state","State-chart Diagram"]];
   tabs.forEach(([tab,label])=>{
     const gid=`g-${u.id}-${tab}`;
     out+=`<details class="gallery-subdetails" data-u="${u.id}" data-t="${tab}"><summary>${label}</summary><div class="diagram-wrap" id="${gid}"><div class="empty">Open this section to render the diagram.</div></div><div class="branch-notes" id="${gid}-notes"></div></details>`;
   });
   out+=`</section>`;
 });
 $("galleryView").innerHTML=out;
 $("galleryView").querySelectorAll("details.gallery-subdetails").forEach(d=>{
   d.addEventListener("toggle",()=>{
     if(!d.open||d.dataset.rendered==="yes") return;
     const u=byId.get(d.dataset.u), tab=d.dataset.t, target=d.querySelector(".diagram-wrap");
     target.innerHTML=tab==="sequence"?renderSequence(u):tab==="activity"?renderActivity(u):renderState(u);
     d.querySelector(".branch-notes").innerHTML=tab==="activity"?"":flowNotesHtml(u);
     d.dataset.rendered="yes";
   });
 });
 window.scrollTo({top:0,behavior:"smooth"});
}
function printCurrent(){
 if(galleryMode){
   // Keep gallery available as HTML; full print may be extremely long.
   window.print();
 }else window.print();
}
fillFilters();
renderNav();
renderSelectedMeta(byId.get(currentId));
renderCurrentDiagram();
$("search").addEventListener("input",renderNav);
$("categoryFilter").addEventListener("change",renderNav);
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>setTab(b.dataset.tab)));
$("exportBtn").addEventListener("click",exportCurrentSvg);
$("prevBtn").addEventListener("click",()=>{const i=UCs.findIndex(u=>u.id===currentId);selectUC(UCs[(i-1+UCs.length)%UCs.length].id);});
$("nextBtn").addEventListener("click",()=>{const i=UCs.findIndex(u=>u.id===currentId);selectUC(UCs[(i+1)%UCs.length].id);});
$("galleryBtn").addEventListener("click",()=>galleryMode?selectUC(currentId):addGallery());
$("printBtn").addEventListener("click",printCurrent);
})();
