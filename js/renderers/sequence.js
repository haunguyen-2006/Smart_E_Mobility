/* Sequence Diagram renderer.
 * Layout tuned for wider participant spacing and clear message labels.
 * All 23 Use Cases use the same renderer; edit participantGap/cardWidth below
 * to adjust global spacing without changing each UC's sequence data.
 */
window.SmartMobilityRenderers = window.SmartMobilityRenderers || {};
window.SmartMobilityRenderers.renderSequence = (() => {
  const { esc, wrapWords, makeSvg } = window.DiagramCore;

  function centeredText(x, centerY, lines, opts = {}) {
    const { size = 11.5, fill = "#354964", weight = 600, lineH = 13 } = opts;
    const firstY = centerY - ((lines.length - 1) * lineH) / 2 + size * 0.34;
    return `<text x="${x}" y="${firstY}" text-anchor="middle" font-size="${size}" font-weight="${weight}" fill="${fill}">${lines.map((line, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : lineH}">${esc(line)}</tspan>`).join("")}</text>`;
  }

  function labelLines(text, maxChars, maxLines = 3) {
    return wrapWords(text, maxChars, maxLines);
  }

  return function renderSequence(u) {
    const { parts, messages } = u.sequence;

    // Geometry: keep generous whitespace between participant cards.
    const cardWidth = 230;
    const participantGap = 405;
    const firstCenter = 155;
    const xs = parts.map((_, i) => firstCenter + i * participantGap);
    const W = Math.max(760, firstCenter * 2 + participantGap * (parts.length - 1));
    const cardY = 32;
    const cardH = 72;
    const top = 130;
    const expandedLabels = u.id === "UC-021" || u.id === "UC-022";
    const rowH = expandedLabels ? 100 : 78;
    const H = top + messages.length * rowH + 48;
    const lineOffset = expandedLabels ? 86 : 58;
    const maxMessageLines = expandedLabels ? 5 : 3;
    const cardHalf = cardWidth / 2;
    const showActivations = true;

    // Track receiver lifetimes from calls through their matching returns.
    const activations = [];
    const branchActivations = [];
    const branchOpen = [];
    const branchLastTouch = new Map();
    if (showActivations) {
      const open = [];
      const lastTouch = new Map();
      messages.forEach((message, i) => {
        const [fromIndex, toIndex, label, rawKind] = message;
        const kind = rawKind || "call";
        const y = top + i * rowH + lineOffset;
        // Draw short, independent activations for exception/recovery messages
        // without changing the activation stack for the success path.
        if (/^\[Failure:|^\[Alternative E1 recovery\]/.test(String(label))) {
          const isRecovery = String(label).startsWith("[Alternative E1 recovery]");
          if (isRecovery) {
            branchLastTouch.set(fromIndex, y);
            branchLastTouch.set(toIndex, y);
            if (kind === "self" || fromIndex === toIndex) {
              branchActivations.push({ participant: fromIndex, start: y - 8, end: y + 20, self: true, at: y });
            } else if (kind === "return") {
              let matched = false;
              for (let j = branchOpen.length - 1; j >= 0; j--) {
                if (branchOpen[j].participant === fromIndex && branchOpen[j].caller === toIndex) {
                  const active = branchOpen.splice(j, 1)[0];
                  branchActivations.push({ ...active, end: y, at: y });
                  matched = true;
                  break;
                }
              }
              if (!matched) {
                if (fromIndex !== 0) branchActivations.push({ participant: fromIndex, start: y - 8, end: y + 14, at: y });
                if (toIndex !== 0) branchActivations.push({ participant: toIndex, start: y - 8, end: y + 14, at: y });
              }
            } else if (toIndex !== 0) {
              branchOpen.push({ participant: toIndex, caller: fromIndex, start: y });
            }
            return;
          }

          if (kind === "self" || fromIndex === toIndex) {
            branchActivations.push({ participant: fromIndex, start: y - 8, end: y + 20, self: true, at: y });
          } else if (kind === "return") {
            if (fromIndex !== 0) branchActivations.push({ participant: fromIndex, start: y - 8, end: y + 14, at: y });
            if (toIndex !== 0) branchActivations.push({ participant: toIndex, start: y - 8, end: y + 14, at: y });
          } else {
            if (fromIndex !== 0) branchActivations.push({ participant: fromIndex, start: y - 8, end: y + 14, at: y });
            if (toIndex !== 0) branchActivations.push({ participant: toIndex, start: y - 8, end: y + 14, at: y });
          }
          return;
        }
        const previousFromTouch = lastTouch.get(fromIndex);
        lastTouch.set(fromIndex, y);
        lastTouch.set(toIndex, y);
        if (kind === "self" || fromIndex === toIndex) {
          activations.push({ participant: fromIndex, start: y - 8, end: y + 20, self: true });
        } else if (kind === "return") {
          let closed = false;
          for (let j = open.length - 1; j >= 0; j--) {
            if (open[j].participant === fromIndex && open[j].caller === toIndex) {
              const active = open.splice(j, 1)[0];
              activations.push({ ...active, end: y });
              closed = true;
              break;
            }
          }
          if (!closed) {
            // Some source sequences contain a response without an explicit
            // matching call. Still show the responding participant's work.
            activations.push({
              participant: fromIndex,
              start: Math.min(previousFromTouch ?? y - 18, y - 18),
              end: y
            });
          }
        } else if (toIndex !== 0) {
          // A new invocation begins a distinct activation. If the same
          // participant still has an unmatched bar, close it at this boundary
          // before opening the next one so bars do not merge or disappear.
          for (let j = open.length - 1; j >= 0; j--) {
            if (open[j].participant === toIndex) {
              const active = open.splice(j, 1)[0];
              activations.push({ ...active, end: Math.max(active.start + 15, y - 8) });
            }
          }
          open.push({ participant: toIndex, caller: fromIndex, start: y });
        }
      });
      // Close any incomplete activation after that participant's last message,
      // never at the bottom of the diagram or in its footer.
      open.forEach(active => {
        const lastY = (lastTouch.get(active.participant) ?? active.start) + 16;
        activations.push({ ...active, end: Math.min(lastY, H - 36) });
      });

      // Keep each failure response connected to the activation opened by its
      // corresponding main-path request (for example, verify -> unavailable).
      messages.forEach((message, i) => {
        const [fromIndex, toIndex, label, rawKind] = message;
        if (!String(label).startsWith("[Failure:") || (rawKind || "call") !== "return") return;
        for (let j = i - 1; j >= 0; j--) {
          const [callFrom, callTo, callLabel, callKind] = messages[j];
          if (String(callLabel).startsWith("[Failure:") || String(callLabel).startsWith("[Alternative ")) continue;
          if (callFrom !== toIndex || callTo !== fromIndex || (callKind || "call") === "return" || (callKind || "call") === "self") continue;
          const callY = top + j * rowH + lineOffset;
          const responseY = top + i * rowH + lineOffset;
          const active = activations.find(a => !a.self && a.participant === fromIndex && a.caller === toIndex && a.start <= callY && a.end >= callY);
          if (active) active.end = Math.max(active.end, responseY);
          break;
        }
      });

      branchOpen.forEach(active => {
        const lastY = Math.min((branchLastTouch.get(active.participant) ?? active.start) + 16, H - 36);
        branchActivations.push({ ...active, end: lastY, at: lastY });
      });

      // Keep the comparison-generation failure interaction continuous across
      // its self-error, UI report, and retry prompt messages.
      const failSelfIndex = messages.findIndex(m => String(m[2]).startsWith("[Failure: comparison generation fails] Return comparison error"));
      const failReportIndex = messages.findIndex(m => String(m[2]).startsWith("[Failure: comparison generation fails] Report error"));
      const failOfferIndex = messages.findIndex(m => String(m[2]).startsWith("[Failure: comparison generation fails] Offer retry"));
      if (failSelfIndex >= 0 && failReportIndex >= 0 && failOfferIndex >= 0) {
        const selfY = top + failSelfIndex * rowH + lineOffset;
        const reportY = top + failReportIndex * rowH + lineOffset;
        const offerY = top + failOfferIndex * rowH + lineOffset;
        const computeIndex = messages.findIndex(m => String(m[2]).startsWith("[If selected results are comparable] Compute side-by-side impact"));
        const showIndex = messages.findIndex(m => String(m[2]).startsWith("[If comparison succeeds] Show comparison for review"));
        const computeY = computeIndex >= 0 ? top + computeIndex * rowH + lineOffset : selfY;
        const showY = showIndex >= 0 ? top + showIndex * rowH + lineOffset : reportY;

        // Keep the Comparison Service and Simulation UI activations continuous
        // across the success path and the comparison-generation failure path.
        const serviceActivation = activations.find(a => !a.self && a.participant === 2 && a.start <= computeY && a.end >= computeY);
        if (serviceActivation) serviceActivation.end = Math.max(serviceActivation.end, reportY + 14);
        const computeSelfActivation = activations.find(a => a.self && a.participant === 2 && a.start <= computeY && a.end >= computeY);
        if (computeSelfActivation) computeSelfActivation.end = Math.max(computeSelfActivation.end, selfY + 20);
        const uiActivation = activations.find(a => !a.self && a.participant === 1 && a.start <= showY && a.end >= showY);
        if (uiActivation) uiActivation.end = Math.max(uiActivation.end, offerY + 14);

        for (let i = branchActivations.length - 1; i >= 0; i--) {
          const active = branchActivations[i];
          if ((active.participant === 1 || active.participant === 2) && active.at >= selfY && active.at <= offerY) {
            branchActivations.splice(i, 1);
          }
        }
        branchActivations.push({ participant: 2, start: selfY - 8, end: reportY + 14, at: selfY });
        branchActivations.push({ participant: 2, start: selfY - 8, end: selfY + 20, self: true, at: selfY });
        branchActivations.push({ participant: 1, start: reportY - 8, end: offerY + 14, at: reportY });
      }

      // Apply each branch activation only where the main path has no bar.
      branchActivations.forEach(active => {
        const alreadyActive = activations.some(existing =>
          existing.participant === active.participant &&
          !!existing.self === !!active.self &&
          existing.start <= active.at && existing.end >= active.at
        );
        if (!alreadyActive) activations.push(active);
      });
    }

    // Keep the actor/operator active for the full interaction span in every
    // use case, from their first message through their final message.
    const actorMessageRows = messages
      .map((message, i) => ({ message, i }))
      .filter(({ message }) => message[0] === 0 || message[1] === 0)
      .map(({ i }) => i);
    if (actorMessageRows.length) {
      const actorStart = top + Math.min(...actorMessageRows) * rowH + lineOffset - 8;
      const actorEnd = Math.min(top + Math.max(...actorMessageRows) * rowH + lineOffset + 14, H - 36);
      activations.push({ participant: 0, start: actorStart, end: actorEnd, actor: true });
    }

    let out = `<rect x="0" y="0" width="${W}" height="${H}" rx="13" fill="#fff"/>
      <text x="25" y="20" font-size="10" letter-spacing="1.5" font-weight="800" fill="#8292a9">MESSAGE ORDER ↓</text>`;

    // Participant headers and lifelines.
    parts.forEach((part, i) => {
      const x = xs[i];
      const left = x - cardHalf;
      const fill = i === 0 ? "#f1edff" : i === 1 ? "#f7f9fc" : i === 2 ? "#eaf2ff" : "#e2f7f4";
      const stroke = i === 0 ? "#7766c7" : i === 1 ? "#bdc9da" : i === 2 ? "#6f93cb" : "#65aaa4";
      out += `<rect x="${left}" y="${cardY}" width="${cardWidth}" height="${cardH}" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`;
      out += centeredText(x, cardY + cardH / 2, labelLines(part, 27, 3), { size: 12, fill: "#263750", weight: 750, lineH: 15 });
      out += `<line x1="${x}" y1="${cardY + cardH}" x2="${x}" y2="${H - 27}" stroke="#aebbd0" stroke-width="1.25" stroke-dasharray="6 6"/>`;
    });

    // Main activation bars stay centered on their lifeline. Self-call bars are
    // nudged right so they remain visible beside a longer parent activation.
    activations.forEach(active => {
      const x = xs[active.participant] + (active.self ? 10 : 0);
      const width = active.self ? 13 : 16;
      out += `<rect x="${x - width / 2}" y="${active.start}" width="${width}" height="${Math.max(15, active.end - active.start)}" rx="3" fill="#dce8f8" stroke="#5276a8" stroke-width="1.2"/>`;
    });

    // Messages. Labels are placed in their own band above the arrow line,
    // so text never sits directly on top of a connector.
    messages.forEach((message, i) => {
      const [fromIndex, toIndex, rawLabel, rawKind] = message;
      const from = xs[fromIndex];
      const to = xs[toIndex];
      const label = rawLabel;
      const kind = rawKind || "call";
      const rowY = top + i * rowH;
      const lineY = rowY + lineOffset;

      if (fromIndex === toIndex || kind === "self") {
        // Route self-calls out from the parent activation and back to the
        // right-shifted nested activation, keeping the loop visible.
        const loopStart = from + 15;
        const loopEnd = from + 60;
        const loopReturnX = from + 15;
        const labelWidth = 205;
        const placeRight = fromIndex < parts.length - 1;
        const labelX = placeRight ? from + 61 : from - 61 - labelWidth;
        const lines = labelLines(label, 25, maxMessageLines);
        const boxH = Math.max(25, lines.length * 13 + 10);
        const boxY = rowY + 5;
        out += `<path d="M${loopStart} ${lineY} H${loopEnd} V${lineY + 13} H${loopReturnX}" fill="none" stroke="#365b91" stroke-width="1.7" marker-end="url(#arrCall)"/>`;
        out += `<rect x="${labelX}" y="${boxY}" width="${labelWidth}" height="${boxH}" rx="6" fill="#fff" stroke="#e2e9f3" stroke-width="1"/>`;
        out += centeredText(labelX + labelWidth / 2, boxY + boxH / 2, lines, { size: 11.2, fill: "#354964", weight: 600, lineH: 13 });
      } else {
        const sx = from;
        const ex = to;
        const marker = kind === "return" ? "arrReturn" : "arrCall";
        const dash = kind === "return" ? 'stroke-dasharray="6 5"' : "";
        const stroke = kind === "return" ? "#718198" : "#365b91";
        out += `<line x1="${sx}" y1="${lineY}" x2="${ex}" y2="${lineY}" stroke="${stroke}" stroke-width="1.7" ${dash} marker-end="url(#${marker})"/>`;

        const mid = (sx + ex) / 2;
        const available = Math.max(112, Math.abs(ex - sx) - 12);
        const labelWidth = Math.min(330, available);
        const maxChars = Math.max(17, Math.min(29, Math.floor((labelWidth - 18) / 6.1)));
        const lines = labelLines(label, maxChars, maxMessageLines);
        const boxH = Math.max(25, lines.length * 13 + 10);
        const boxY = rowY + 5;
        out += `<rect x="${mid - labelWidth / 2}" y="${boxY}" width="${labelWidth}" height="${boxH}" rx="6" fill="#fff" stroke="#e2e9f3" stroke-width="1"/>`;
        out += centeredText(mid, boxY + boxH / 2, lines, { size: 11.2, fill: "#354964", weight: 600, lineH: 13 });
      }

      out += `<text x="19" y="${lineY + 4}" font-size="10" font-weight="700" fill="#96a4b8">${String(i + 1).padStart(2, "0")}</text>`;
    });

    out += `<rect x="18" y="${H - 29}" width="${W - 36}" height="18" rx="5" fill="#f6f8fc"/>`;
    out += `<text x="${W / 2}" y="${H - 16}" text-anchor="middle" font-size="10.5" fill="#77869c">Solid arrows = request/action · Dashed arrows = response · Blue bars = active processing</text>`;

    return makeSvg(`0 0 ${W} ${H}`, out, `${u.id} ${u.name} sequence diagram`).replace('<svg ', '<svg data-diagram-type="sequence" ');
  };
})();
