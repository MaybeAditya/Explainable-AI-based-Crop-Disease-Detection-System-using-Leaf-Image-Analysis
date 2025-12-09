// src/App.js
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./App.css";

export default function App() {
  const [logs, setLogs] = useState([
    "[INFO] Booting Vision-LeafNet v4.2",
    "[INFO] Loading GPU optimized kernels",
    "[INFO] Calibrating chlorophyll channels...",
  ]);

  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [textureScore, setTextureScore] = useState(0);
  const [jargon, setJargon] = useState("");
  const [overlayOpen, setOverlayOpen] = useState(false);

  // Interactive radar states
  const radarRef = useRef(null);
  const [radarOffset, setRadarOffset] = useState({ x: 0, y: 0 });
  const [sweepRotate, setSweepRotate] = useState(0);
  const [waves, setWaves] = useState([]); // click pulses

  // Jargon bank
  const jargonList = [
    "Analyzing chlorophyll variance...",
    "Scanning vein topology maps...",
    "Detecting necrotic tissue divergence...",
    "Isolating fungal spore clusters...",
    "Computing NDVI stress metrics...",
    "Measuring leaf vascular decay...",
    "Cross-referencing disease signatures...",
    "Evaluating stomatal conductance drop...",
    "Assessing surface reflectance histogram...",
    "Mapping pigment density distortions..."
  ];

  // small auto-log generator to keep UI alive
  useEffect(() => {
    const tail = [
      "[DEBUG] Flushing detection cache",
      "[INFO] Model telemetry heartbeat",
      "[DEBUG] Re-calibrating color balance",
      "[INFO] Snapshot saved to /tmp/scans/latest",
    ];
    const t = setInterval(() => {
      appendLog(tail[Math.floor(Math.random() * tail.length)]);
    }, 4200);
    return () => clearInterval(t);
  }, []);

  // auto-scroll logs whenever updated
  const logInnerRef = useRef(null);
  useEffect(() => {
    if (logInnerRef.current) {
      logInnerRef.current.scrollTop = logInnerRef.current.scrollHeight;
    }
  }, [logs]);

  // radar mouse tracking (only when mouse inside radar)
  useEffect(() => {
    const el = radarRef.current;
    if (!el) return;

    function onMove(e) {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      // small gentle offset for parallax effect
      setRadarOffset({ x: dx * 0.02, y: dy * 0.02 });
      // sweep rotation influenced by x movement
      setSweepRotate(dx * 0.05);
    }

    function onLeave() {
      setRadarOffset({ x: 0, y: 0 });
      setSweepRotate(0);
    }

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [radarRef]);

  // cleanup old waves
  useEffect(() => {
    const t = setInterval(() => {
      setWaves((w) => w.filter((s) => Date.now() - s.ts < 1000)); // keep 1s pulses
    }, 200);
    return () => clearInterval(t);
  }, []);

  function appendLog(line) {
    setLogs((s) => [...s, line].slice(-400));
  }

  function handleFile(e) {
    if (!e.target.files?.[0]) return;
    setFile(e.target.files[0]);
    appendLog(`[USER] Selected file: ${e.target.files[0].name}`);
  }

  async function startScan() {
    if (!file) {
      appendLog("[ERROR] No image selected — please upload an image.");
      return;
    }

    appendLog("[USER] Initiated scan");
    setScanning(true);
    setProgress(0);
    setResult(null);
    setOverlayOpen(false);

    // staged jargon/logs & progress (visual)
    const stage1 = jargonList[Math.floor(Math.random() * jargonList.length)];
    appendLog(`[SCIENCE] ${stage1}`);
    setJargon(stage1);
    setTimeout(() => setProgress(40), 450);

    const stage2 = jargonList[Math.floor(Math.random() * jargonList.length)];
    setTimeout(() => {
      appendLog(`[SCIENCE] ${stage2}`);
      setJargon(stage2);
      setProgress(72);
    }, 1000);

    const stage3 = jargonList[Math.floor(Math.random() * jargonList.length)];
    setTimeout(() => {
      appendLog(`[SCIENCE] ${stage3}`);
      setJargon(stage3);
      setProgress(94);
    }, 1700);

    // call backend after animation
    setTimeout(async () => {
      appendLog("[INFO] Sending image to backend...");
      try {
        const formData = new FormData();
        formData.append("image", file);

        const res = await axios.post("http://localhost:5000/predict", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 15000,
        });

        if (res?.data?.prediction) {
          // parse backend reply
          const pick = {
            name: res.data.prediction,
            conf: typeof res.data.confidence === "number" ? res.data.confidence : Math.round((res.data.confidence || 0) * 100),
            summary: res.data.summary || "No summary provided.",
            rec: res.data.recommendations || ["No recommendations."],
            texture: typeof res.data.texture_score === "number" ? res.data.texture_score : null,
          };

          if (pick.texture !== null) setTextureScore(pick.texture);
          else setTextureScore(0);

          appendLog(`[RESULT] ${pick.name} @${pick.conf}%`);
          finishWithResult(pick);
        } else {
          appendLog("[ERROR] Backend responded but did not include 'prediction'. No result shown.");
          setScanning(false);
          setProgress(0);
        }
      } catch (err) {
        console.error(err);
        appendLog("[ERROR] Could not reach backend — check server or CORS.");
        setScanning(false);
        setProgress(0);
      }
    }, 2400);
  }

  function finishWithResult(pick) {
    setProgress(pick.conf ?? 0);
    if (typeof pick.texture === "number") setTextureScore(pick.texture);
    setResult(pick);
    setOverlayOpen(true);
    setScanning(false);
    appendLog("[INFO] Scan complete — report generated");
  }

  // radar click -> pulse
  function onRadarClick(e) {
    const rect = radarRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0..1
    const y = (e.clientY - rect.top) / rect.height;
    setWaves((w) => [...w, { ts: Date.now(), x, y }]);
    appendLog("[USER] Pinged scan area");
  }

  return (
    <div className="cc-root">
      <div className="cc-container" role="application" aria-label="Plant AI Command Center">
        {/* HEADER */}
        <header className="cc-header">
          <div className="cc-brand">
            <div className="cc-logo" aria-hidden>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C12 2 18 5 20 11C20 11 13 11 11 15C9 19 11 22 11 22C11 22 3 19 3 11C3 3 12 2 12 2Z" fill="#00F7B2" />
              </svg>
            </div>
            <div>
              <h1>Plant Disease AI — Command Center</h1>
              <div className="cc-sub">Futuristic prototype</div>
            </div>
          </div>

          <div className="cc-header-right">
            <div className="cc-badge">Model v4.2</div>
            <div className="cc-muted">Confidence baseline: <span className="cc-pill">98.2%</span></div>
          </div>
        </header>

        {/* LEFT - SCAN */}
        <section className="cc-scan-panel">
          <div>
            <div className="cc-muted">Scan Zone</div>

            <div
              className="cc-scan-area"
              ref={radarRef}
              onClick={onRadarClick}
              role="button"
              tabIndex={0}
            >
              <div className={`cc-flash ${scanning ? "active" : ""}`} />
              <div className="cc-glow" style={{ transform: `translate(${radarOffset.x}px, ${radarOffset.y}px)` }} />

              {/* Radar (SVG) */}
              <div
                className="cc-radar"
                style={{
                  transform: `translate(${radarOffset.x}px, ${radarOffset.y}px)`,
                }}
              >
                <svg viewBox="0 0 200 200" className="radar-base">
                  <defs>
                    <radialGradient id="g1" cx="50%" cy="30%">
                      <stop offset="0%" stopColor="#3cff9a" stopOpacity="0.18" />
                      <stop offset="60%" stopColor="#00ffd5" stopOpacity="0.03" />
                      <stop offset="100%" stopColor="#000" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <circle cx="100" cy="100" r="90" stroke="rgba(60,255,154,0.12)" strokeWidth="0.8" fill="url(#g1)" />
                  <circle cx="100" cy="100" r="60" stroke="rgba(60,255,154,0.06)" strokeWidth="0.6" fill="transparent" />
                  <circle cx="100" cy="100" r="30" stroke="rgba(60,255,154,0.04)" strokeWidth="0.5" fill="transparent" />
                </svg>

                {/* sweep */}
                <svg className="cc-sweep" viewBox="0 0 200 200"
                  style={{ transform: `rotate(${sweepRotate}deg)` }}>
                  <defs>
                    <linearGradient id="lg" x1="0" x2="1">
                      <stop offset="0%" stopColor="#00ffd5" stopOpacity="0.35" />
                      <stop offset="80%" stopColor="#3cff9a" stopOpacity="0.05" />
                      <stop offset="100%" stopColor="#3cff9a" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <g className="sector" transform="translate(100,100)">
                    <path d="M0 0 L180 0 A180 180 0 0 1 0 -180 Z" fill="url(#lg)" />
                  </g>
                </svg>

                {/* click waves */}
                {waves.map((w, idx) => {
                  const age = Date.now() - w.ts;
                  const alive = age < 1000;
                  const size = (age / 1000) * 320;
                  const left = `${w.x * 100}%`;
                  const top = `${w.y * 100}%`;
                  return (
                    <div
                      key={idx}
                      className="radar-wave"
                      style={{
                        left,
                        top,
                        width: size,
                        height: size,
                        marginLeft: -size / 2,
                        marginTop: -size / 2,
                        opacity: alive ? 1 - age / 1000 : 0,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            <div className="cc-floating-cards">
              <label className="cc-card upload-card">
                <div>
                  <strong>Upload Image</strong>
                  <p className="cc-muted-small">PNG / JPG</p>
                </div>
                <input type="file" accept="image/*" onChange={handleFile} />
              </label>

              <div className="cc-card"><strong>Live Scan</strong><p className="cc-muted-small">Camera (optional)</p></div>

              <div className="cc-card"><strong>Disease Library</strong><p className="cc-muted-small">200+ entries</p></div>
            </div>

            <div className="cc-jargon">{jargon || "Idle — hover the scanner and upload an image."}</div>
          </div>

          <div className="cc-bottom-row">
            <button className="cc-scan-button" onClick={startScan} disabled={scanning}>
              {scanning ? "Scanning..." : "Initiate AI Scan"}
            </button>
            <div className="cc-muted small">Last demo: <strong>2 minutes ago</strong></div>
          </div>
        </section>

        {/* MIDDLE */}
        <main className="cc-middle-panel">
          <div className="cc-result-header">
            <div>
              <div className="cc-muted">Latest Scan Result</div>
              <h2>{result ? result.name : "No scan yet"}</h2>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="cc-muted">Model</div>
              <strong>Vision-LeafNet</strong>
            </div>
          </div>

          <div className="cc-result-card">
            <div className="cc-result-left">
              <div className="cc-preview">
                <svg width="80" height="80" viewBox="0 0 24 24">
                  <path d="M12 2C12 2 18 5 20 11C20 11 13 11 11 15C9 19 11 22 11 22C11 22 3 19 3 11C3 3 12 2 12 2Z" fill="#00F7B2" />
                </svg>
              </div>

              <div className="cc-result-meta">
                <div className="cc-muted">Diagnosis</div>
                <h3>{result ? result.name : "—"}</h3>

                <div className="cc-muted">Probability</div>
                <div className="cc-progress"><i style={{ width: progress + "%" }} /></div>

                <div style={{ marginTop: 8 }}>
                  Suggested action: <strong>{result ? result.rec?.[0] : "—"}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="cc-row">
            <div className="cc-card cc-small">
              <div className="cc-muted">Texture Analysis</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
                <div style={{ flex: 1 }}>
                  <div className="cc-muted">Chlorosis Index</div>
                  <div className="cc-progress"><i style={{ width: (textureScore || 0) + "%" }} /></div>
                </div>
                <div style={{ width: 84, textAlign: "center", fontWeight: 700 }}>{textureScore || "—"}%</div>
              </div>
            </div>

            <div className="cc-card cc-small" style={{ width: 220 }}>
              <div className="cc-muted">Risk</div>
              <h3>{result ? (result.conf >= 90 ? "High" : "Moderate") : "—"}</h3>
              <div className="cc-muted">Recommended</div>
              <div style={{ marginTop: 6, fontWeight: 700 }}>{result ? result.rec?.join(", ") : "No recommendations."}</div>
            </div>
          </div>

          <div style={{ marginTop: "auto", fontSize: 13, color: "var(--muted)", textAlign: "right" }}>
            Demo UI • No guaranteed medical accuracy
          </div>
        </main>

        {/* RIGHT */}
        <aside className="cc-right-panel">
          <div className="cc-logs">
            <div style={{ fontWeight: 700, marginBottom: 8 }}>AI Model Logs</div>
            <div className="cc-log-inner" ref={logInnerRef}>
              {logs.map((l, i) => <div key={i} className="cc-log-line">{l}</div>)}
            </div>
          </div>

          <div className="cc-model-card">
            <div className="cc-muted">Model Summary</div>
            <div style={{ marginTop: 8, fontWeight: 700 }}>Vision-LeafNet v4.2</div>
            <div style={{ marginTop: 8, color: "var(--muted)" }}>Parameters: ~12.4M</div>
          </div>
        </aside>

        {/* Overlay */}
        <div className={`cc-overlay ${overlayOpen ? "show" : ""}`}>
          <div className="cc-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div className="cc-muted">Scan Report</div>
                <h2>{result ? result.name : "—"}</h2>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="cc-muted">Confidence</div>
                <div style={{ fontWeight: 800, fontSize: 28 }}>{result ? result.conf + "%" : "—"}</div>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div className="cc-muted">Summary</div>
              <p style={{ marginTop: 8, color: "var(--muted)" }}>{result ? result.summary : "—"}</p>
              <div className="cc-muted">Recommendations</div>
              <ul style={{ marginTop: 8, color: "var(--muted)" }}>
                {result ? result.rec.map((r, idx) => <li key={idx}>{r}</li>) : <li>—</li>}
              </ul>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
              <button className="cc-scan-button" onClick={() => setOverlayOpen(false)}>Close</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
