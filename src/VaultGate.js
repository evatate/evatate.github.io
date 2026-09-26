import React, { useEffect, useRef } from 'react';

export default function VaultGate() {
  const soundToggleRef = useRef(() => {});

  useEffect(() => {
    let stopped = false;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const svgNS = 'http://www.w3.org/2000/svg';
    function el(tag, attrs) {
      const e = document.createElementNS(svgNS, tag);
      for (const k in attrs) e.setAttribute(k, attrs[k]);
      return e;
    }

    const svg = document.getElementById('vaultSvg');
    svg.replaceChildren();

    const defs = el('defs', {});
    svg.appendChild(defs);

    const faceGrad = el('radialGradient', { id: 'faceGrad', cx: '35%', cy: '28%', r: '80%' });
    faceGrad.appendChild(el('stop', { offset: '0%', 'stop-color': '#8b9196' }));
    faceGrad.appendChild(el('stop', { offset: '55%', 'stop-color': '#54585e' }));
    faceGrad.appendChild(el('stop', { offset: '100%', 'stop-color': '#26282b' }));
    defs.appendChild(faceGrad);

    const bezelGrad = el('linearGradient', { id: 'bezelGrad', x1: '0%', y1: '0%', x2: '100%', y2: '100%' });
    [['0%', '#5b5f65'], ['22%', '#232629'], ['50%', '#0e1012'], ['78%', '#2c2f33'], ['100%', '#4a4e54']].forEach((s) => {
      bezelGrad.appendChild(el('stop', { offset: s[0], 'stop-color': s[1] }));
    });
    defs.appendChild(bezelGrad);

    const boltGrad = el('radialGradient', { id: 'boltGrad', cx: '35%', cy: '30%', r: '75%' });
    boltGrad.appendChild(el('stop', { offset: '0%', 'stop-color': '#cfd2d6' }));
    boltGrad.appendChild(el('stop', { offset: '60%', 'stop-color': '#6d7176' }));
    boltGrad.appendChild(el('stop', { offset: '100%', 'stop-color': '#1c1e20' }));
    defs.appendChild(boltGrad);

    const knobGrad = el('radialGradient', { id: 'knobGrad', cx: '35%', cy: '28%', r: '80%' });
    knobGrad.appendChild(el('stop', { offset: '0%', 'stop-color': '#d7dade' }));
    knobGrad.appendChild(el('stop', { offset: '45%', 'stop-color': '#7c8085' }));
    knobGrad.appendChild(el('stop', { offset: '100%', 'stop-color': '#202224' }));
    defs.appendChild(knobGrad);

    const blurSmall = el('filter', { id: 'blurSmall', x: '-50%', y: '-50%', width: '200%', height: '200%' });
    blurSmall.appendChild(el('feGaussianBlur', { stdDeviation: '2.2' }));
    defs.appendChild(blurSmall);

    const cx = 170, cy = 170;
    const GOLD = '#caa14e';

    svg.appendChild(el('circle', { cx, cy, r: 142, fill: 'none', stroke: 'url(#bezelGrad)', 'stroke-width': 26 }));

    for (let b = 0; b < 6; b++) {
      const ba = (b * 60 - 90) * Math.PI / 180;
      const bx = cx + 142 * Math.cos(ba), by = cy + 142 * Math.sin(ba);
      svg.appendChild(el('circle', { cx: bx, cy: by, r: 6.5, fill: 'url(#boltGrad)', stroke: 'rgba(0,0,0,0.5)', 'stroke-width': 0.75 }));
      const slotA = ba + Math.PI / 5;
      svg.appendChild(el('line', {
        x1: bx - 3.6 * Math.cos(slotA), y1: by - 3.6 * Math.sin(slotA),
        x2: bx + 3.6 * Math.cos(slotA), y2: by + 3.6 * Math.sin(slotA),
        stroke: 'rgba(0,0,0,0.55)', 'stroke-width': 1
      }));
    }

    svg.appendChild(el('circle', { cx, cy, r: 130, fill: 'none', stroke: 'rgba(0,0,0,0.55)', 'stroke-width': 4, filter: 'url(#blurSmall)' }));
    svg.appendChild(el('circle', { cx, cy, r: 128, fill: 'url(#faceGrad)' }));

    const faceGroup = el('g', {});
    svg.appendChild(faceGroup);

    [22, 40, 58, 76, 94].forEach((r, idx) => {
      faceGroup.appendChild(el('circle', { cx, cy, r, fill: 'none', stroke: `rgba(255,255,255,${idx % 2 ? 0.05 : 0.08})`, 'stroke-width': 1 }));
    });

    for (let k = 0; k < 72; k++) {
      const ka = (k * 5) * Math.PI / 180;
      const kx1 = cx + 120 * Math.cos(ka), ky1 = cy + 120 * Math.sin(ka);
      const kx2 = cx + 127 * Math.cos(ka), ky2 = cy + 127 * Math.sin(ka);
      faceGroup.appendChild(el('line', { x1: kx1, y1: ky1, x2: kx2, y2: ky2, stroke: 'rgba(255,255,255,0.14)', 'stroke-width': 1 }));
    }

    for (let t = 0; t < 60; t++) {
      const isMajor = (t % 10 === 0);
      const ta = (t * 6 - 90) * Math.PI / 180;
      const rInner = isMajor ? 84 : 96;
      const rOuter = 112;
      faceGroup.appendChild(el('line', {
        x1: cx + rInner * Math.cos(ta), y1: cy + rInner * Math.sin(ta),
        x2: cx + rOuter * Math.cos(ta), y2: cy + rOuter * Math.sin(ta),
        stroke: isMajor ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.32)',
        'stroke-width': isMajor ? 1.6 : 1
      }));
      if (isMajor) {
        const num = (t / 10) * 10;
        const nx = cx + 70 * Math.cos(ta), ny = cy + 70 * Math.sin(ta);
        const text = el('text', { x: nx, y: ny, 'text-anchor': 'middle', 'dominant-baseline': 'middle', fill: 'rgba(255,255,255,0.82)', 'font-size': '10', 'font-family': 'ui-monospace, monospace' });
        text.textContent = num;
        faceGroup.appendChild(text);
      }
    }

    const facts = ['Hi!', "I'm Eva", 'Computer Science', "Dartmouth '27", 'Machine Learning', 'Cybersecurity'];
    const hubR = 34;

    faceGroup.appendChild(el('circle', { cx, cy, r: hubR, fill: 'none', stroke: 'rgba(255,255,255,0.22)', 'stroke-width': 2 }));

    // Spokes sit at +30deg from each numbered tick, i.e. exactly midway
    // between two adjacent ticks, rather than directly on top of one.
    const SPOKE_PHASE = 30;
    facts.forEach((_, i) => {
      const a = (i * 60 - 90 + SPOKE_PHASE) * Math.PI / 180;
      const hx = cx + hubR * Math.cos(a), hy = cy + hubR * Math.sin(a);
      const gx = cx + 118 * Math.cos(a), gy = cy + 118 * Math.sin(a);
      const perpX = -Math.sin(a), perpY = Math.cos(a), off = 2.5;

      faceGroup.appendChild(el('line', { x1: hx, y1: hy, x2: gx, y2: gy, stroke: GOLD, 'stroke-width': 6, 'stroke-linecap': 'round' }));
      faceGroup.appendChild(el('line', {
        x1: hx + perpX * off, y1: hy + perpY * off, x2: gx + perpX * off, y2: gy + perpY * off,
        stroke: 'rgba(255,255,255,0.35)', 'stroke-width': 1.5, 'stroke-linecap': 'round'
      }));
      faceGroup.appendChild(el('circle', { cx: gx, cy: gy, r: 8.5, fill: 'url(#knobGrad)', stroke: 'rgba(0,0,0,0.5)', 'stroke-width': 1 }));
      faceGroup.appendChild(el('circle', { cx: gx, cy: gy, r: 3.2, fill: GOLD }));
    });

    svg.appendChild(el('polygon', {
      points: `${cx - 6},${cy - 160} ${cx + 6},${cy - 160} ${cx},${cy - 144}`,
      fill: GOLD
    }));
    svg.appendChild(el('line', { x1: cx, y1: cy - 144, x2: cx, y2: cy - 118, stroke: GOLD, 'stroke-width': 1.5, opacity: '0.9' }));

    svg.appendChild(el('circle', { cx, cy, r: 20, fill: 'url(#knobGrad)', stroke: 'rgba(0,0,0,0.5)', 'stroke-width': 1 }));
    svg.appendChild(el('circle', { cx: cx - 6, cy: cy - 7, r: 5, fill: 'rgba(255,255,255,0.35)' }));

    // ---- interaction state ----
    const factEl = document.getElementById('vaultFact');
    const plaqueEl = document.getElementById('plaque');
    const statusEl = document.getElementById('vaultStatus');
    const glowRing = document.getElementById('glowRing');
    const gateStage = document.getElementById('gateStage');
    const gateDotsHost = document.getElementById('gateDots');
    gateDotsHost.innerHTML = facts.map(() => '<span class="gateDot w-1.5 h-1.5 rounded-full bg-white/15"></span>').join('');
    const gateDots = gateDotsHost.querySelectorAll('.gateDot');

    let muted = false;
    let actx = null;
    function ensureAudio() {
      if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { actx = null; } }
      if (actx && actx.state === 'suspended') actx.resume();
    }
    function tone(freq, dur, gain, type) {
      if (muted || !actx) return;
      const t = actx.currentTime;
      const osc = actx.createOscillator(), g = actx.createGain();
      osc.type = type || 'square';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(gain, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(g); g.connect(actx.destination);
      osc.start(t); osc.stop(t + dur);
    }
    function noiseBurst(dur, gain, filterFreq) {
      if (muted || !actx) return;
      const n = Math.max(1, Math.floor(actx.sampleRate * dur));
      const buffer = actx.createBuffer(1, n, actx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < n; i++) { data[i] = (Math.random() * 2 - 1) * (1 - i / n); }
      const src = actx.createBufferSource();
      src.buffer = buffer;
      const filter = actx.createBiquadFilter();
      filter.type = 'bandpass'; filter.frequency.value = filterFreq; filter.Q.value = 1.1;
      const g = actx.createGain();
      const t = actx.currentTime;
      g.gain.setValueAtTime(gain, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(filter); filter.connect(g); g.connect(actx.destination);
      src.start(t);
    }

    const soundBtn = document.getElementById('soundBtn');
    const soundIcon = document.getElementById('soundIcon');
    function onSoundToggle() {
      muted = !muted;
      soundBtn.setAttribute('aria-pressed', String(!muted));
      soundIcon.innerHTML = muted
        ? '<path d="M11 5 6 9H2v6h4l5 4V5z"/><line x1="16" y1="9" x2="22" y2="15"/><line x1="22" y1="9" x2="16" y2="15"/>'
        : '<path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/>';
    }
    soundToggleRef.current = onSoundToggle;

    let rotation = 0, velocity = 0, smoothed = 0, dragging = false, lastAngle = 0;
    let lastMinor = -1, lastGate = -1;
    let visited = new Set();
    let unlocked = false;
    const wrap = document.getElementById('dialWrap');

    function angleAt(clientX, clientY) {
      const rect = svg.getBoundingClientRect();
      const mx = clientX - (rect.left + rect.width / 2);
      const my = clientY - (rect.top + rect.height / 2);
      return Math.atan2(my, mx) * 180 / Math.PI;
    }

    let bumpTimeout = null;
    function bump() {
      if (reduceMotion) return;
      wrap.style.transform = 'scale(1.006)';
      if (bumpTimeout) clearTimeout(bumpTimeout);
      bumpTimeout = setTimeout(() => { wrap.style.transform = 'scale(1)'; bumpTimeout = null; }, 60);
    }

    function playDoorSound() {
      tone(80, 0.4, 0.2, 'sine');
      setTimeout(() => { tone(720, 0.15, 0.12, 'triangle'); }, 150);
      setTimeout(() => { tone(960, 0.2, 0.13, 'triangle'); }, 280);
    }

    function openVaultDoor() {
      gateStage.classList.add('opening');
      playDoorSound();
      const about = document.getElementById('about');
      const delay = reduceMotion ? 60 : 1150;
      setTimeout(() => {
        if (about) about.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        // The visitor is now looking at the About section, so the gate is
        // safely off-screen -- reset it here (rather than waiting on an
        // IntersectionObserver) so it's ready to unlock again if they scroll
        // back up, with no manual replay step.
        setTimeout(resetGate, reduceMotion ? 60 : 900);
      }, delay);
    }

    function freeSpinBurst(durationMs, totalDegrees, onDone) {
      let start = null;
      const startRotation = rotation;
      function step(ts) {
        if (stopped) return;
        if (!start) start = ts;
        const p = Math.min(1, (ts - start) / durationMs);
        const eased = 1 - Math.pow(1 - p, 3);
        rotation = startRotation + totalDegrees * eased;
        updateFace();
        if (p < 1) requestAnimationFrame(step); else if (onDone) onDone();
      }
      requestAnimationFrame(step);
    }

    function bigUnlockNoise() {
      tone(65, 0.5, 0.3, 'sawtooth');
      noiseBurst(0.2, 0.26, 1500);
      setTimeout(() => { tone(660, 0.16, 0.15, 'triangle'); }, 130);
      setTimeout(() => { tone(880, 0.22, 0.16, 'triangle'); }, 250);
    }

    function unlockSequence() {
      unlocked = true;
      dragging = false;
      velocity = 0;
      smoothed = 0;
      plaqueEl.classList.add('unlocked');
      glowRing.classList.add('unlocked');
      statusEl.classList.remove('text-gray-500');
      statusEl.classList.add('text-white');
      tone(110, 0.3, 0.18, 'square');

      if (reduceMotion) {
        bigUnlockNoise();
        setTimeout(openVaultDoor, 420);
        return;
      }
      setTimeout(() => {
        freeSpinBurst(820, 760, () => {
          bigUnlockNoise();
          setTimeout(openVaultDoor, 420);
        });
      }, 160);
    }

    function resetGate() {
      gateStage.classList.remove('opening');
      unlocked = false; visited = new Set(); lastGate = -1; lastMinor = -1;
      rotation = 0; velocity = 0; smoothed = 0;
      faceGroup.setAttribute('transform', `rotate(0 ${cx} ${cy})`);
      factEl.textContent = 'Hi!';
      plaqueEl.classList.remove('unlocked');
      glowRing.classList.remove('unlocked');
      statusEl.textContent = '0 / 6';
      statusEl.classList.add('text-gray-500');
      statusEl.classList.remove('text-white');
      gateDots.forEach((d) => { d.classList.remove('bg-[#caa14e]'); d.classList.add('bg-white/15'); });
    }

    function updateFace() {
      faceGroup.setAttribute('transform', `rotate(${rotation} ${cx} ${cy})`);

      const minorIdx = (((Math.round(-rotation / 6)) % 60) + 60) % 60;
      if (minorIdx !== lastMinor) {
        lastMinor = minorIdx;
        tone(minorIdx % 10 === 0 ? 900 : 1300, 0.02, 0.035, 'square');
        bump();
      }

      const gateIdx = (((Math.floor(-rotation / 60)) % 6) + 6) % 6;
      if (gateIdx !== lastGate) {
        lastGate = gateIdx;
        factEl.textContent = facts[gateIdx];
        if (!visited.has(gateIdx)) {
          visited.add(gateIdx);
          gateDots[gateIdx].classList.remove('bg-white/15');
          gateDots[gateIdx].classList.add('bg-[#caa14e]');
          tone(500, 0.08, 0.09, 'triangle');
          statusEl.textContent = `${visited.size} / 6`;
        }
        if (!unlocked && visited.size >= 6) unlockSequence();
      }
    }
    factEl.textContent = 'Hi!';

    function onPointerDown(e) {
      if (unlocked) return;
      ensureAudio();
      wrap.setPointerCapture(e.pointerId);
      dragging = true;
      lastAngle = angleAt(e.clientX, e.clientY);
    }
    function onPointerMove(e) {
      if (!dragging || unlocked) return;
      const a = angleAt(e.clientX, e.clientY);
      let delta = a - lastAngle;
      if (delta > 180) delta -= 360; if (delta < -180) delta += 360;
      rotation += delta;
      smoothed = smoothed * 0.72 + delta * 0.28;
      velocity = smoothed;
      lastAngle = a;
      updateFace();
    }
    function onPointerRelease() {
      if (!dragging) return;
      dragging = false;
      velocity = Math.max(-42, Math.min(42, smoothed * 1.25));
    }
    wrap.addEventListener('pointerdown', onPointerDown);
    wrap.addEventListener('pointermove', onPointerMove);
    wrap.addEventListener('pointerup', onPointerRelease);
    wrap.addEventListener('pointercancel', onPointerRelease);

    function spin() {
      if (stopped) return;
      if (!dragging && Math.abs(velocity) > 0.02 && !reduceMotion && !unlocked) {
        rotation += velocity; velocity *= 0.968; smoothed = velocity; updateFace();
      }
      requestAnimationFrame(spin);
    }
    spin();

    return () => {
      stopped = true;
      wrap.removeEventListener('pointerdown', onPointerDown);
      wrap.removeEventListener('pointermove', onPointerMove);
      wrap.removeEventListener('pointerup', onPointerRelease);
      wrap.removeEventListener('pointercancel', onPointerRelease);
      if (bumpTimeout) clearTimeout(bumpTimeout);
      svg.replaceChildren();
      if (actx) { try { actx.close(); } catch (e) { /* noop */ } }
    };
  }, []);

  return (
    <section id="gateStage" className="min-h-screen flex items-center justify-center px-6 relative pt-20">
      <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
              animationDelay: Math.random() * 5 + 's'
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
        <div className="heroSide animate-fade-in text-center md:text-left order-2 md:order-1">
          <p className="text-sm font-light text-gray-300 tracking-widest">A COLLECTION OF</p>
          <p className="text-3xl font-bold text-white mt-2">Projects</p>
        </div>

        <div className="flex flex-col items-center order-1 md:order-2">
          <div className="heroSide animate-fade-in flex items-center gap-3 mb-6">
            <p className="text-gray-400 text-xs tracking-widest uppercase">Turn the wheel</p>
            <button id="soundBtn" onClick={() => soundToggleRef.current()} className="soundBtn w-6 h-6 rounded-full border border-white/20 text-gray-400 flex items-center justify-center" aria-pressed="true" aria-label="Toggle sound">
              <svg id="soundIcon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5 6 9H2v6h4l5 4V5z" />
                <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                <path d="M18.5 5.5a9 9 0 0 1 0 13" />
              </svg>
            </button>
          </div>

          <div id="dialAssembly" className="relative">
            <div className="flash"></div>
            <div className="relative glowRing rounded-full" id="glowRing">
              <div className="dialWrap relative touch-none select-none" id="dialWrap">
                <svg id="vaultSvg" viewBox="0 0 340 340" className="absolute inset-0 w-full h-full"></svg>
                <div className="gloss"></div>
              </div>
            </div>

            <div className="plaque mt-7 rounded-md px-6 py-3 text-center min-w-[220px] mx-auto" id="plaque">
              <p id="vaultFact" className="text-xl font-light text-white tracking-wide">Hi!</p>
            </div>

            <div className="flex items-center justify-center gap-2 mt-4" id="gateDots"></div>
            <p id="vaultStatus" className="mt-3 text-[11px] tracking-widest uppercase text-gray-500 h-4 text-center">0 / 6</p>
          </div>
        </div>

        <div className="heroSide animate-fade-in-delay text-center md:text-right order-3">
          <p className="text-sm font-light text-white tracking-widest">Eva Tate<br />Dartmouth College '27</p>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <p className="text-xs font-light text-gray-400 tracking-widest uppercase">Scroll to explore</p>
        <div className="animate-bounce">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60 hover:text-white/90 transition-colors">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      <style>{`
        #gateStage{ perspective: 1400px; }
        .dialWrap{ width:min(340px, 78vw); aspect-ratio:1/1; filter:drop-shadow(0 22px 34px rgba(0,0,0,0.65)); }
        .gloss{
          position:absolute; inset:0; border-radius:50%; pointer-events:none;
          background:linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.02) 30%, rgba(255,255,255,0) 55%, rgba(255,255,255,0.05) 100%);
          mix-blend-mode:overlay;
        }
        .plaque{
          font-family: ui-monospace, "IBM Plex Mono", monospace;
          letter-spacing:.06em;
          background:linear-gradient(180deg,#2a2f35,#16191c);
          border:1px solid rgba(255,255,255,0.08);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.6), inset 0 -1px 0 rgba(255,255,255,0.04);
        }
        .plaque.unlocked{ border-color:rgba(202,161,78,0.55); box-shadow: inset 0 2px 4px rgba(0,0,0,0.6), 0 0 18px rgba(202,161,78,0.25); }
        .gateDot{ transition: background-color .3s ease, box-shadow .3s ease; }
        .soundBtn{ transition: color .15s ease, border-color .15s ease; }
        .glowRing{ transition: box-shadow .6s ease; }
        .glowRing.unlocked{ box-shadow: 0 0 0 1px rgba(202,161,78,0.4), 0 0 40px 6px rgba(202,161,78,0.18); }

        #dialAssembly{
          transform-origin: 18% center;
          transition: transform 1s cubic-bezier(.32,.72,.28,1), opacity .9s ease;
        }
        .flash{
          position:absolute; inset:-20%; border-radius:50%; pointer-events:none; opacity:0;
          background:radial-gradient(circle, rgba(255,241,209,0.9) 0%, rgba(202,161,78,0.35) 35%, rgba(202,161,78,0) 70%);
        }
        .opening .flash{ animation: doorFlash 1s ease-out forwards; }
        @keyframes doorFlash{ 0%{opacity:0;} 12%{opacity:1;} 100%{opacity:0;} }
        .opening #dialAssembly{ transform: rotateY(-115deg) translateX(-14px); opacity:0; }

        .heroSide{ transition: opacity .5s ease, transform .5s ease; }
        .opening .heroSide{ opacity:0; transform:translateY(-8px); }

        @media (prefers-reduced-motion: reduce){
          #dialAssembly{ transition:none; }
          .opening #dialAssembly{ transform:none; opacity:0; }
          .opening .flash{ animation:none; }
          .heroSide{ transition:none; }
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(10px, -10px); }
          50% { transform: translate(-10px, 10px); }
          75% { transform: translate(10px, 10px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.3s forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
}
