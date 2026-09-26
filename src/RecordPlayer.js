import React, { useEffect, useRef, useState } from 'react';

const TRACK_ID = '0mnWNvwXRNu82bpfi2rsuz';

export default function RecordPlayer() {
  const embedHostRef = useRef(null);
  const controllerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`https://open.spotify.com/oembed?url=https://open.spotify.com/track/${TRACK_ID}`)
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setMeta(data); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;

    function boot(IFrameAPI) {
      if (cancelled || !embedHostRef.current || controllerRef.current) return;
      IFrameAPI.createController(embedHostRef.current, {
        uri: `spotify:track:${TRACK_ID}`,
        width: '100%',
        height: 152
      }, (EmbedController) => {
        if (cancelled) return;
        controllerRef.current = EmbedController;
        EmbedController.addListener('playback_update', (e) => {
          setIsPlaying(!e.data.isPaused && !e.data.isBuffering);
        });
      });
    }

    const previousReady = window.onSpotifyIframeApiReady;
    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      if (typeof previousReady === 'function') previousReady(IFrameAPI);
      boot(IFrameAPI);
    };

    if (!document.getElementById('spotify-iframe-api')) {
      const script = document.createElement('script');
      script.id = 'spotify-iframe-api';
      script.src = 'https://open.spotify.com/embed/iframe-api/v1';
      script.async = true;
      document.body.appendChild(script);
    }

    return () => { cancelled = true; };
  }, []);

  function toggle() {
    const c = controllerRef.current;
    if (!c) return;
    if (typeof c.togglePlay === 'function') { c.togglePlay(); return; }
    if (isPlaying) c.pause(); else c.play();
  }

  return (
    <div className="flex-none flex flex-col items-center gap-1">
      <p className="text-[9px] font-light text-gray-500 tracking-widest uppercase whitespace-nowrap">Click to play</p>

      <div
        className="rounded-lg p-1"
        style={{
          background: 'linear-gradient(155deg, #ddba8a 0%, #c69c66 45%, #a5764a 100%)',
          boxShadow: '0 6px 14px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.25)'
        }}
      >
        <div className="relative flex-none" style={{ width: 80, height: 80 }}>
      <button
        onClick={toggle}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        title={meta && meta.title ? meta.title : 'Click to play'}
        className="absolute cursor-pointer"
        style={{ left: 4, top: 4, width: 72, height: 72 }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{ animation: isPlaying ? 'spin-record 1.8s linear infinite' : 'none' }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="98" fill="#0a0a0a" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            {[92, 82, 72, 62, 52].map((r) => (
              <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
            ))}
          </svg>
          <div className="absolute rounded-full overflow-hidden bg-white" style={{ inset: '32%' }}>
            {meta && meta.thumbnail_url && (
              <img src={meta.thumbnail_url} alt="" className="w-full h-full object-cover" />
            )}
          </div>
          <div className="absolute rounded-full bg-black" style={{ inset: '48.5%' }} />
        </div>

        {/* Tonearm: pivots at the top-right, drops onto the record when playing */}
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
          <g style={{
            transformOrigin: '172px 10px',
            transform: isPlaying ? 'rotate(0deg)' : 'rotate(-36deg)',
            transition: 'transform 0.45s cubic-bezier(.34,1.4,.4,1)'
          }}>
            <line x1="172" y1="10" x2="118" y2="42" stroke="#d8dbdf" strokeWidth="5" strokeLinecap="round" />
            <circle cx="172" cy="10" r="8" fill="#d8dbdf" stroke="rgba(0,0,0,0.5)" strokeWidth="1" />
            <circle cx="118" cy="42" r="6" fill="#111" stroke="#d8dbdf" strokeWidth="2" />
          </g>
        </svg>
      </button>

      {/* Real Spotify player, kept mounted so playback still works, clipped to nothing visible
          regardless of what markup the embed SDK injects into it */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 overflow-hidden pointer-events-none"
        style={{ width: 1, height: 1, clip: 'rect(0,0,0,0)' }}
      >
        <div ref={embedHostRef} style={{ width: 256, height: 152 }} />
      </div>

      <style>{`
        @keyframes spin-record { to { transform: rotate(360deg); } }
      `}</style>
        </div>
      </div>
    </div>
  );
}
