
/* Activity Diagram renderer
 * Layout revision: wider vertical rhythm, a compact decision-branch callout,
 * and no connector tail beyond the callout. All A/E branch details remain below.
 */
window.SmartMobilityRenderers = window.SmartMobilityRenderers || {};
window.SmartMobilityRenderers.renderActivity = (() => {
  const { wrapAllWords, svgTextCentered, svgTextLines, makeSvg } = window.DiagramCore;
  const { activityFlow } = window.SmartMobilityActivityFlow;

  function actorAction(step) {
    const t = String(step || "").trim();
    return /^(The (student|user|administrator|admin|operator|strategic simulation operator|real-time operations operator)|Before submitting|If the student|If the operator)/i.test(t);
  }

  return function renderActivity(u) {
    const flow = activityFlow(u);
    const flowSteps = flow.steps || [];

    if (!flowSteps.length) {
      return makeSvg(
        "0 0 900 260",
        '<rect width="900" height="260" fill="#fff"/><text x="450" y="130" text-anchor="middle" font-size="16" fill="#a13e50">No activity steps are available for this use case.</text>',
        `${u.id} ${u.name} activity diagram`
      );
    }

    // Overall canvas and central main-flow column.
    const W = 1400;
    const panelX = 18;
    const panelW = 1364;

    const nodeX = 150;
    const nodeW = 820;
    const center = nodeX + nodeW / 2;

    // Initial node has a separate entry lane.
    const top = 128;

    // Vertical spacing.
    const nodeGap = 58;
    const decisionLeadGap = 44;
    const decisionExitGap = 56;

    const branchCardGap = 18;
    const branchPanelGap = 42;
    const columnGap = 30;

    const decisionIndex = Number.isInteger(flow.decisionIndex)
      ? flow.decisionIndex
      : -1;

    const retryFlows = {
      "UC-020": { retryIndex: 2, errorText: "The system shows the operator which inputs need correction." },
      "UC-021": { retryIndex: 2, errorText: "The system identifies missing or unavailable scenarios for reselection." },
      "UC-022": { retryIndex: 2, errorText: "The system reports that the recommendation is no longer feasible." }
    };
    const retryFlow = retryFlows[u.id];

    const heights = flowSteps.map(st => {
      const lines = wrapAllWords(st.text, 88);
      return Math.max(70, 30 + lines.length * 19);
    });

    // Calculate main-flow positions.
    const positions = [];
    let cursor = top;
    let decision = null;

    for (let i = 0; i < flowSteps.length; i++) {
      positions.push({
        y: cursor,
        h: heights[i],
        actor: actorAction(flowSteps[i].text)
      });

      cursor += heights[i];

      if (i === decisionIndex) {
        decision = {
          cy: cursor + decisionLeadGap + 39,
          halfW: 145,
          halfH: 39
        };

        cursor = decision.cy + decision.halfH + decisionExitGap;
      } else if (i < flowSteps.length - 1) {
        cursor += nodeGap;
      }
    }

    const errorLines = retryFlow ? wrapAllWords(retryFlow.errorText, 38) : [];
    const errorH = retryFlow ? Math.max(78, 26 + errorLines.length * 17) : 0;
    const errorX = nodeX + nodeW + 42;
    const errorW = W - errorX - 36;
    const retryTarget = retryFlow ? positions[retryFlow.retryIndex] : null;
    const errorY = retryFlow && decision
      ? decision.cy - errorH / 2
      : 0;

    const last = positions[positions.length - 1];

    const endY = last.y + last.h + 42;
    const mainBottom = Math.max(endY + 34, retryFlow ? errorY + errorH + 28 : 0);

    // Alternative and exception cards.
    const inner = 24;
    const colW = (panelW - inner * 2 - columnGap) / 2;

    const altX = panelX + inner;
    const excX = altX + colW + columnGap;

    function cardMetrics(item) {
      const titleLines = wrapAllWords(
        `${item.code} — ${item.title}`,
        48
      );

      const descLines = wrapAllWords(
        item.description,
        76
      );

      const titleH = titleLines.length * 15;
      const descH = descLines.length * 14.5;

      return {
        titleLines,
        descLines,
        height: Math.max(
          92,
          18 + titleH + 9 + descH + 18
        )
      };
    }

    const cards = [];
    let altY = 0;
    let excY = 0;

    (u.alternatives || []).forEach(item => {
      const m = cardMetrics(item);

      cards.push({
        item,
        type: "alt",
        x: altX,
        y: 0,
        w: colW,
        ...m,
        stack: altY
      });

      altY += m.height + branchCardGap;
    });

    (u.exceptions || []).forEach(item => {
      const m = cardMetrics(item);

      cards.push({
        item,
        type: "exc",
        x: excX,
        y: 0,
        w: colW,
        ...m,
        stack: excY
      });

      excY += m.height + branchCardGap;
    });

    const branchTop = mainBottom + branchPanelGap;
    const branchHeaderH = 88;
    const cardTop = branchTop + branchHeaderH;

    cards.forEach(c => {
      c.y = cardTop + c.stack;
    });

    const maxStack = Math.max(altY, excY);

    const branchBottom = cards.length
      ? cardTop + maxStack - branchCardGap
      : cardTop + 12;

    const H = Math.max(
      branchBottom + 34,
      mainBottom + 30,
      480
    );

    let out = `
      <rect
        x="0"
        y="0"
        width="${W}"
        height="${H}"
        rx="16"
        fill="#fff"
      />

      <rect
        x="${panelX}"
        y="20"
        width="${panelW}"
        height="${mainBottom - 4}"
        rx="15"
        fill="#f7f9ff"
        stroke="#dce6f5"
        stroke-width="1.3"
      />

      <text
        x="42"
        y="51"
        font-size="11.5"
        font-weight="850"
        letter-spacing="1.2"
        fill="#6e83a2"
      >MAIN SUCCESS FLOW</text>
    `;

    // Initial node and entry transition.
    // The line starts below the filled circle, preventing overlap.
    out += `
      <circle
        cx="${center}"
        cy="70"
        r="8"
        fill="#253b59"
      />

      <path
        d="M${center} 79 V${top}"
        stroke="#637b9c"
        stroke-width="1.8"
        fill="none"
        marker-end="url(#arrCall)"
      />
    `;

    // Draw main-flow activity boxes.
    for (let i = 0; i < flowSteps.length; i++) {
      const p = positions[i];
      const st = flowSteps[i];

      const fill = p.actor ? "#f0edff" : "#eaf2ff";
      const stroke = p.actor ? "#8674cf" : "#7c9ed3";

      // Activity box.
      out += `
        <rect
          x="${nodeX}"
          y="${p.y}"
          width="${nodeW}"
          height="${p.h}"
          rx="12"
          fill="${fill}"
          stroke="${stroke}"
          stroke-width="1.55"
        />
      `;

      // Step number badge.
      const badgeY = p.y + (p.h - 25) / 2;

      out += `
        <rect
          x="${nodeX + 16}"
          y="${badgeY}"
          width="40"
          height="25"
          rx="7"
          fill="${p.actor ? "#d9d1ff" : "#d5e6ff"}"
        />
      `;

      out += svgTextCentered(
        nodeX + 36,
        badgeY + 12.5,
        String(i + 1).padStart(2, "0"),
        {
          size: 10.8,
          weight: 850,
          fill: "#344d70",
          max: 3,
          lineH: 12
        }
      );

      // Vertically centered activity text.
      out += svgTextCentered(
        nodeX + 78,
        p.y + p.h / 2,
        st.text,
        {
          anchor: "start",
          size: 14,
          weight: 620,
          fill: "#263b56",
          max: 88,
          lineH: 19
        }
      );

      const bottom = p.y + p.h;

      if (i === decisionIndex && decision) {
        const dTop = decision.cy - decision.halfH;

        // Connector from activity box to decision.
        out += `
          <path
            d="M${center} ${bottom} V${dTop}"
            stroke="#637b9c"
            stroke-width="1.8"
            fill="none"
            marker-end="url(#arrCall)"
          />
        `;

        // Decision diamond.
        out += `
          <polygon
            points="
              ${center},${dTop}
              ${center + decision.halfW},${decision.cy}
              ${center},${decision.cy + decision.halfH}
              ${center - decision.halfW},${decision.cy}
            "
            fill="#fff8e8"
            stroke="#b98738"
            stroke-width="1.8"
          />
        `;

        out += svgTextCentered(
          center - decision.halfW - 22,
          decision.cy,
          flow.decisionText || "Does the condition pass?",
          {
            anchor: "end",
            size: 11.5,
            weight: 850,
            fill: "#78531d",
            max: 30,
            lineH: 14.5
          }
        );

        const next = positions[i + 1];

        if (next) {
          // YES branch continues vertically.
          out += `
            <path
              d="M${center} ${decision.cy + decision.halfH} V${next.y}"
              stroke="#477f62"
              stroke-width="1.9"
              fill="none"
              marker-end="url(#arrCall)"
            />
          `;

          out += `
            <text
              x="${center + 18}"
              y="${decision.cy + decision.halfH + 30}"
              font-size="10.8"
              font-weight="850"
              fill="#39734f"
            >YES / valid</text>
          `;
        }

        if (!retryFlow) {
          const calloutX = 755;
          const calloutW = 285;
          const calloutH = 36;
          const calloutY = decision.cy - calloutH / 2;
          const rightVertex = center + decision.halfW;
          out += `
            <path d="M${rightVertex} ${decision.cy} H${calloutX}"
              stroke="#b77724" stroke-width="1.7" fill="none" marker-end="url(#arrBranch)"/>
            <rect x="${calloutX}" y="${calloutY}" width="${calloutW}" height="${calloutH}"
              rx="8" fill="#fffaf3" stroke="#e8c995" stroke-width="1.2"/>
          `;
          out += svgTextCentered(calloutX + calloutW / 2, decision.cy, "NO — see A/E branches below", {
            size: 11, weight: 850, fill: "#98641a", max: 34, lineH: 13
          });
        }

      } else if (i < flowSteps.length - 1) {
        const next = positions[i + 1];

        // Normal connector between activities.
        out += `
          <path
            d="M${center} ${bottom} V${next.y}"
            stroke="#637b9c"
            stroke-width="1.75"
            fill="none"
            marker-end="url(#arrCall)"
          />
        `;
      }
    }

    if (retryFlow && decision && retryTarget) {
      const rightVertex = center + decision.halfW;
      const errorCenterY = errorY + errorH / 2;
      const turnX = errorX - 18;
      const returnX = errorX + errorW / 2;
      const targetCenterY = retryTarget.y + retryTarget.h / 2;

      // Invalid/NO is a solid path to the correction node. The dashed path
      // returns from that node to the operator's input activity.
      out += `
        <path d="M${rightVertex} ${decision.cy} H${turnX} V${errorCenterY} H${errorX}"
          stroke="#637b9c" stroke-width="1.8" fill="none" marker-end="url(#arrCall)"/>
        <text x="${rightVertex + 18}" y="${decision.cy - 12}" font-size="10.8" font-weight="850" fill="#9a5838">NO / invalid</text>
        <rect x="${errorX}" y="${errorY}" width="${errorW}" height="${errorH}"
          rx="12" fill="#fff0f2" stroke="#d99aa5" stroke-width="1.5"/>
      `;
      out += svgTextCentered(errorX + errorW / 2, errorCenterY, retryFlow.errorText, {
        size: 12, weight: 700, fill: "#87414d", max: 37, lineH: 15
      });

      out += `
        <path d="M${returnX} ${errorY} V${targetCenterY} H${nodeX + nodeW}"
          stroke="#b77724" stroke-width="1.8" stroke-dasharray="7 5" fill="none" marker-end="url(#arrBranch)"/>
      `;
    }

    // Final node.
    // Arrow stops before the outer circle of the final-state marker.
    out += `
      <path
        d="M${center} ${last.y + last.h} V${endY - 9.5}"
        stroke="#637b9c"
        stroke-width="1.75"
        fill="none"
        marker-end="url(#arrCall)"
      />

      <circle
        cx="${center}"
        cy="${endY}"
        r="9.5"
        fill="#fff"
        stroke="#263c59"
        stroke-width="1.8"
      />

      <circle
        cx="${center}"
        cy="${endY}"
        r="4.8"
        fill="#263c59"
      />

      <text
        x="${center + 20}"
        y="${endY + 4}"
        font-size="11"
        fill="#71829b"
      >Use case complete</text>
    `;

    // Alternative and exception detail panel.
    out += `
      <rect
        x="${panelX}"
        y="${branchTop}"
        width="${panelW}"
        height="${H - branchTop - 14}"
        rx="15"
        fill="#fffaf3"
        stroke="#f0dfc0"
        stroke-width="1.3"
      />

      <text
        x="42"
        y="${branchTop + 29}"
        font-size="11.5"
        font-weight="900"
        letter-spacing="1.1"
        fill="#956a2c"
      >ALTERNATIVE &amp; EXCEPTION FLOWS</text>

      <text
        x="42"
        y="${branchTop + 49}"
        font-size="10.8"
        fill="#8c7a60"
      >Each A/E path is listed separately below; the full source description is retained.</text>

      <text
        x="${altX}"
        y="${branchTop + 73}"
        font-size="10.8"
        font-weight="900"
        letter-spacing=".7"
        fill="#a36b1f"
      >ALTERNATIVE FLOWS (${(u.alternatives || []).length})</text>

      <text
        x="${excX}"
        y="${branchTop + 73}"
        font-size="10.8"
        font-weight="900"
        letter-spacing=".7"
        fill="#a13e50"
      >EXCEPTION FLOWS (${(u.exceptions || []).length})</text>
    `;

    // Draw all A/E detail cards.
    for (const c of cards) {
      const isAlt = c.type === "alt";

      const edge = isAlt ? "#d7b16d" : "#d99aa5";
      const fill = isAlt ? "#fff8e9" : "#fff0f2";
      const ink = isAlt ? "#98641a" : "#a13e50";

      out += `
        <rect
          x="${c.x}"
          y="${c.y}"
          width="${c.w}"
          height="${c.height}"
          rx="10"
          fill="${fill}"
          stroke="${edge}"
          stroke-width="1.25"
        />

        <rect
          x="${c.x + 12}"
          y="${c.y + 12}"
          width="38"
          height="22"
          rx="6"
          fill="${isAlt ? "#f7e6c7" : "#f7dbe0"}"
        />
      `;

      out += svgTextCentered(
        c.x + 31,
        c.y + 23,
        c.item.code,
        {
          size: 10.2,
          weight: 900,
          fill: ink,
          max: 4,
          lineH: 12
        }
      );

      out += svgTextLines(
        c.x + 60,
        c.y + 10,
        c.titleLines,
        {
          size: 11.5,
          weight: 850,
          fill: ink,
          lineH: 15
        }
      );

      const bodyY =
        c.y + 17 + c.titleLines.length * 15 + 7;

      out += svgTextLines(
        c.x + 14,
        bodyY,
        c.descLines,
        {
          size: 11,
          weight: 500,
          fill: "#4f6179",
          lineH: 14.5
        }
      );
    }

    // Footer legend.
    out += `
      <text
        x="42"
        y="${H - 16}"
        font-size="10.5"
        fill="#7b8ba2"
      >Purple = actor action · Blue = system action · Diamond = validation/decision · A/E cards = branch details</text>
    `;

    return makeSvg(
      `0 0 ${W} ${H}`,
      out,
      `${u.id} ${u.name} activity diagram`
    );
  };
})();
