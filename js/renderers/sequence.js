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
    const rowH = 78;
    const H = top + messages.length * rowH + 48;
    const lineOffset = 58;
    const cardHalf = cardWidth / 2;

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
        const loopStart = from + 10;
        const loopEnd = from + 48;
        const labelWidth = 205;
        const placeRight = fromIndex < parts.length - 1;
        const labelX = placeRight ? from + 61 : from - 61 - labelWidth;
        const lines = labelLines(label, 25, 3);
        const boxH = Math.max(25, lines.length * 13 + 10);
        const boxY = rowY + 5;
        out += `<path d="M${loopStart} ${lineY} H${loopEnd} V${lineY + 13} H${loopStart + 2}" fill="none" stroke="#365b91" stroke-width="1.7" marker-end="url(#arrCall)"/>`;
        out += `<rect x="${labelX}" y="${boxY}" width="${labelWidth}" height="${boxH}" rx="6" fill="#fff" stroke="#e2e9f3" stroke-width="1"/>`;
        out += centeredText(labelX + labelWidth / 2, boxY + boxH / 2, lines, { size: 11.2, fill: "#354964", weight: 600, lineH: 13 });
      } else {
        const forward = from < to;
        const sx = from + (forward ? cardHalf + 8 : -(cardHalf + 8));
        const ex = to + (forward ? -(cardHalf + 8) : cardHalf + 8);
        const marker = kind === "return" ? "arrReturn" : "arrCall";
        const dash = kind === "return" ? 'stroke-dasharray="6 5"' : "";
        const stroke = kind === "return" ? "#718198" : "#365b91";
        out += `<line x1="${sx}" y1="${lineY}" x2="${ex}" y2="${lineY}" stroke="${stroke}" stroke-width="1.7" ${dash} marker-end="url(#${marker})"/>`;

        const mid = (sx + ex) / 2;
        const available = Math.max(112, Math.abs(ex - sx) - 12);
        const labelWidth = Math.min(330, available);
        const maxChars = Math.max(17, Math.min(29, Math.floor((labelWidth - 18) / 6.1)));
        const lines = labelLines(label, maxChars, 3);
        const boxH = Math.max(25, lines.length * 13 + 10);
        const boxY = rowY + 5;
        out += `<rect x="${mid - labelWidth / 2}" y="${boxY}" width="${labelWidth}" height="${boxH}" rx="6" fill="#fff" stroke="#e2e9f3" stroke-width="1"/>`;
        out += centeredText(mid, boxY + boxH / 2, lines, { size: 11.2, fill: "#354964", weight: 600, lineH: 13 });
      }

      out += `<text x="19" y="${lineY + 4}" font-size="10" font-weight="700" fill="#96a4b8">${String(i + 1).padStart(2, "0")}</text>`;
    });

    out += `<rect x="18" y="${H - 29}" width="${W - 36}" height="18" rx="5" fill="#f6f8fc"/>`;
    out += `<text x="${W / 2}" y="${H - 16}" text-anchor="middle" font-size="10.5" fill="#77869c">Main success path · Solid arrows = request/action · Dashed arrows = response</text>`;

    return makeSvg(`0 0 ${W} ${H}`, out, `${u.id} ${u.name} sequence diagram`).replace('<svg ', '<svg data-diagram-type="sequence" ');
  };
})();
