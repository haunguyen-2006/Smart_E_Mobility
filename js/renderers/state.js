/* State-chart Diagram renderer */
window.SmartMobilityRenderers = window.SmartMobilityRenderers || {};
window.SmartMobilityRenderers.renderState = (() => {
  const { esc, wrapAllWords, svgTextCentered, svgTextLines, makeSvg } = window.DiagramCore;
  return function renderState(u){
  // State path and alternate states share the available width. A branch rail is confined
  // to the row of its source state; return destinations are labelled instead of long crossing arrows.
  const s=u.state,W=1010;
  const leftX=12,leftW=420,rightX=445,rightW=553;
  const stateX=35,stateW=345,stateH=64,cx=stateX+stateW/2;
  const railX=428,branchX=458,branchW=515,top=145,transitionGap=82,branchGap=9;
  const groups=s.states.map((_,i)=>(s.branches||[]).map((b,j)=>({...b,_index:j})).filter(b=>b.from===i));
  function branchMetrics(b){
    const labelLines=wrapAllWords(b.label||'Alternative condition',57);
    const nameLines=wrapAllWords(b.name||'Alternate state',57);
    const route=b.terminal?'Ends this path':(Number.isInteger(b.returnTo)&&s.states[b.returnTo]?`Returns to: ${s.states[b.returnTo]}`:'Branch outcome');
    const routeLines=wrapAllWords(route,65);
    const h=Math.max(78,10+labelLines.length*12.5+4+nameLines.length*14+5+routeLines.length*11.5+12);
    return {...b,labelLines,nameLines,routeLines,height:h};
  }
  const branchGroups=groups.map(g=>g.map(branchMetrics));
  const rowHeights=branchGroups.map(g=>Math.max(stateH+16,g.reduce((n,b)=>n+b.height,0)+Math.max(0,g.length-1)*branchGap));
  const rows=[];let cursor=top;
  for(let i=0;i<s.states.length;i++){
    const rowH=rowHeights[i],stateY=cursor+(rowH-stateH)/2;
    const total=branchGroups[i].reduce((n,b)=>n+b.height,0)+Math.max(0,branchGroups[i].length-1)*branchGap;
    let by=cursor+(rowH-total)/2;
    const cards=branchGroups[i].map(b=>{const z={...b,x:branchX,y:by,w:branchW};by+=b.height+branchGap;return z;});
    rows.push({y:cursor,h:rowH,stateY,cards});cursor+=rowH;
    if(i<s.states.length-1)cursor+=transitionGap;
  }
  const lastRow=rows[rows.length-1],endY=lastRow.stateY+stateH+25;
  const H=Math.max(cursor+36,endY+44,420);
  let out=`<rect x="0" y="0" width="${W}" height="${H}" rx="13" fill="#fff"/>
    <rect x="12" y="18" width="420" height="${H-36}" rx="12" fill="#f5fbfa" stroke="#d7eeea" stroke-width="1.2"/>
    <rect x="445" y="18" width="553" height="${H-36}" rx="12" fill="#fbfcfe" stroke="#e0e7f0" stroke-width="1.2"/>
    <text x="28" y="43" font-size="10.5" font-weight="850" letter-spacing=".7" fill="#528a85">MAIN STATE LIFECYCLE</text>
    <text x="461" y="43" font-size="10.5" font-weight="850" letter-spacing=".5" fill="#7486a0">BRANCH STATES</text>
    <text x="461" y="59" font-size="9.7" fill="#7486a0">Grouped by source state; return target is labelled.</text>
    <text x="${stateX}" y="67" font-size="10" fill="#6d8298">${esc(s.subject)}</text>`;
  // Initial pseudostate: reserve a dedicated vertical entry lane. The arrow must
  // have enough shaft length so its marker cannot visually merge with the dot.
  const initialCy = 77;
  const initialRadius = 6;
  const initialStartY = initialCy + initialRadius;
  const firstStateArrowEnd = rows[0].stateY - 8;
  out+=`<circle cx="${cx}" cy="${initialCy}" r="${initialRadius}" fill="#254f57"/>`;
  out+=`<path d="M${cx} ${initialStartY} V${firstStateArrowEnd}" stroke="#31817b" stroke-width="1.6" fill="none" marker-end="url(#arrState)"/>`;

  // Main-state nodes and event labels. The event label sits in a reserved gap, never over the arrow.
  for(let i=0;i<s.states.length;i++){
    const row=rows[i],isLast=i===s.states.length-1;
    out+=`<rect x="${stateX}" y="${row.stateY}" width="${stateW}" height="${stateH}" rx="10" fill="${isLast?'#e1f6ef':'#fff'}" stroke="${isLast?'#328773':'#6fa9a3'}" stroke-width="${isLast?2:1.4}"/>`;
    if(isLast)out+=`<rect x="${stateX+4}" y="${row.stateY+4}" width="${stateW-8}" height="${stateH-8}" rx="7" fill="none" stroke="#8cc7b8" stroke-width="1"/>`;
    out+=svgTextCentered(cx,row.stateY+stateH/2,s.states[i],{size:12.3,weight:800,fill:'#274f55',max:34,lineH:15});
    if(!isLast){
      const next=rows[i+1],event=s.events[i]||'Continue',pillH=42;
      const pillY=row.y+row.h+(transitionGap-pillH)/2;
      if(row.stateY+stateH<pillY-4)out+=`<path d="M${cx} ${row.stateY+stateH} V${pillY-4}" stroke="#31817b" stroke-width="1.5" fill="none"/>`;
      out+=`<rect x="${stateX+10}" y="${pillY}" width="${stateW-20}" height="${pillH}" rx="7" fill="#eaf7f5" stroke="#c5e4df"/>`;
      out+=svgTextCentered(cx,pillY+pillH/2,event,{size:10.1,weight:650,fill:'#477772',max:46,lineH:12});
      out+=`<path d="M${cx} ${pillY+pillH} V${next.stateY-7}" stroke="#31817b" stroke-width="1.5" fill="none" marker-end="url(#arrState)"/>`;
    }else{
      // Stop the final transition just before the outer final-state ring.
      out+=`<path d="M${cx} ${row.stateY+stateH} V${endY-10}" stroke="#31817b" stroke-width="1.5" fill="none" marker-end="url(#arrState)"/>`;
      out+=`<circle cx="${cx}" cy="${endY}" r="8" fill="#fff" stroke="#286d68" stroke-width="1.7"/><circle cx="${cx}" cy="${endY}" r="4.5" fill="#286d68"/>`;
    }
  }
  // Branch connectors are drawn first so their arrowheads stop cleanly at card borders.
  for(const row of rows){
    const cards=row.cards;if(!cards.length)continue;
    const stateCenter=row.stateY+stateH/2,centers=cards.map(b=>b.y+b.height/2),minY=Math.min(...centers),maxY=Math.max(...centers);
    out+=`<path d="M${stateX+stateW} ${stateCenter} H${railX}" stroke="#b77724" stroke-width="1.35" stroke-dasharray="4 3" fill="none"/>`;
    if(cards.length>1)out+=`<path d="M${railX} ${minY} V${maxY}" stroke="#b77724" stroke-width="1.35" stroke-dasharray="4 3" fill="none"/>`;
    cards.forEach(b=>out+=`<path d="M${railX} ${b.y+b.height/2} H${branchX-7}" stroke="#b77724" stroke-width="1.35" stroke-dasharray="4 3" fill="none" marker-end="url(#arrBranch)"/>`);
  }
  // Branch-state cards contain all transition meaning without looping arrows across other states.
  for(const row of rows)row.cards.forEach(b=>{
    const terminal=!!b.terminal,edge=terminal?'#d48a96':'#c9a15e',fill=terminal?'#fff1f3':'#fff9ed',ink=terminal?'#9e4251':'#90611c';
    out+=`<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.height}" rx="8" fill="${fill}" stroke="${edge}" stroke-width="1.2"/>`;
    out+=`<rect x="${b.x+9}" y="${b.y+9}" width="5" height="${b.height-18}" rx="2.5" fill="${terminal?'#d88391':'#d3ad68'}"/>`;
    out+=svgTextLines(b.x+24,b.y+6,b.labelLines,{size:9.8,weight:850,fill:ink,lineH:12});
    const nameY=b.y+8+b.labelLines.length*12+2;
    out+=svgTextLines(b.x+24,nameY,b.nameLines,{size:11.2,weight:800,fill:terminal?'#963f50':'#70521f',lineH:13.5});
    const routeY=b.y+b.height-10-b.routeLines.length*11.5;
    out+=svgTextLines(b.x+24,routeY,b.routeLines,{size:9.5,weight:650,fill:'#61748b',lineH:11.5});
  });
  out+=`<text x="28" y="${H-13}" font-size="9.6" fill="#7b8ba2">Teal = main state transitions · Amber = alternate/error state · Return targets are written in branch cards to avoid line crossings.</text>`;
  return makeSvg(`0 0 ${W} ${H}`,out,`${u.id} ${u.name} state-chart diagram`);
};
})();
