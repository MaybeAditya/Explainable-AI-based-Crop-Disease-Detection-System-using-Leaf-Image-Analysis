// Import React hooks and axios for HTTP requests
import React, {useState, useEffect} from "react";
import axios from "axios";
import "./App.css";

export default function App(){

  // State variables
  const [file,setFile]=useState(null);        // Stores uploaded file
  const [preview,setPreview]=useState(null);  // Stores preview URL of uploaded image
  const [result,setResult]=useState(null);    // Stores API response (prediction, confidence, etc.)
  const [logs,setLogs]=useState([]);          // Stores live analysis feed messages
  const [showLoc,setShowLoc]=useState(true);  // Controls location popup visibility

  // Array of jargon messages for live feed simulation
  const jargon=[
    "Analyzing chlorophyll spectrum...",
    "Mapping vein topology...",
    "Running NDVI stress model...",
    "Scanning fungal signature clusters...",
    "Evaluating tissue degradation index...",
    "Cross-referencing plant pathology database..."
  ];

  // useEffect to simulate live feed messages every 2 seconds
  useEffect(()=>{
    const interval=setInterval(()=>{
      setLogs(l=>[
        ...l.slice(-6), // Keep only last 6 messages
        jargon[Math.floor(Math.random()*jargon.length)] // Add random jargon
      ]);
    },2000);

    // Cleanup interval when component unmounts
    return ()=>clearInterval(interval);

  },[]);

  // Handle file upload
  function handleFile(e){
    const f=e.target.files[0]; // Get first selected file
    if(!f) return;
    setFile(f);                // Save file in state
    setPreview(URL.createObjectURL(f)); // Create preview URL
  }

  // Send image to backend for prediction
  async function scan(){
    if(!file){
      alert("Upload leaf image"); // Alert if no file uploaded
      return;
    }

    const form=new FormData();
    form.append("image",file); // Append file to form data

    // POST request to backend API
    const res=await axios.post(
      "http://localhost:5000/predict",
      form
    );

    setResult(res.data); // Save response in state
  }

  // Determine severity based on confidence
  function severity(conf){
    if(conf>85) return "High";
    if(conf>60) return "Moderate";
    return "Low";
  }

  // Calculate health score (inverse of confidence)
  function health(conf){
    return 100-conf;
  }

  return(

    <div className="app">

      {/* Location popup shown initially */}
      {showLoc && (
        <div className="popup">
          <div className="popup-card">
            <h2>📍 Location Detected</h2>
            <p>Shimla, Himachal Pradesh</p>
            <p>Suggested language: Hindi</p>
            <button onClick={()=>setShowLoc(false)}>
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Header section */}
      <header className="header">
        <h1>LeafAI Command Dashboard</h1>
        <select>
          <option>English</option>
          <option>हिन्दी</option>
          <option>ਪੰਜਾਬੀ</option>
        </select>
      </header>

      {/* Main grid layout */}
      <div className="grid">

        {/* LEFT PANEL: Upload and preview */}
        <div className="panel">
          <h3>Leaf Scan</h3>
          <label className="upload">
            Upload Leaf
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
            />
          </label>

          {/* Show preview if file uploaded */}
          {preview && <img src={preview} className="preview" alt="leaf"/>}

          <button onClick={scan}>Analyze</button>
        </div>

        {/* MIDDLE PANEL: Live feed */}
        <div className="panel feed">
          <h3>Live Analysis Feed</h3>
          {logs.map((l,i)=>(
            <p key={i}>{l}</p>
          ))}
        </div>

        {/* RIGHT PANEL: Diagnosis results */}
        <div className="panel">
          <h3>Diagnosis</h3>

          {result ? (
            <>
              <p><strong>Disease:</strong> {result.prediction}</p>

              <p>
                <strong>Confidence:</strong>
                {result.confidence}%
              </p>

              {/* Confidence bar */}
              <div className="bar">
                <div
                  className="bar-fill"
                  style={{width:result.confidence+"%"}}
                />
              </div>

              <p>
                <strong>Health Score:</strong>
                {health(result.confidence)}
              </p>

              <p>
                <strong>Severity:</strong>
                {severity(result.confidence)}
              </p>

              {/* Summary text */}
              <p className="summary">
                {result.summary}
              </p>

              {/* Recommendations list */}
              <ul>
                {result.recommendations.map((r,i)=>(
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </>
          ):(
            <p>No scan yet</p>
          )}

        </div>

      </div>

    </div>

  );
}
