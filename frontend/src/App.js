import React, {useState, useEffect} from "react";
import axios from "axios";
import "./App.css";

export default function App(){

const [file,setFile]=useState(null);
const [preview,setPreview]=useState(null);
const [result,setResult]=useState(null);
const [logs,setLogs]=useState([]);
const [showLoc,setShowLoc]=useState(true);

const jargon=[
"Analyzing chlorophyll spectrum...",
"Mapping vein topology...",
"Running NDVI stress model...",
"Scanning fungal signature clusters...",
"Evaluating tissue degradation index...",
"Cross-referencing plant pathology database..."
];

useEffect(()=>{

const interval=setInterval(()=>{
setLogs(l=>[
...l.slice(-6),
jargon[Math.floor(Math.random()*jargon.length)]
]);
},2000);

return ()=>clearInterval(interval);

},[]);
function handleFile(e){
const f=e.target.files[0];
if(!f) return;
setFile(f);
setPreview(URL.createObjectURL(f));
}

async function scan(){
if(!file){
alert("Upload leaf image");
return;
}

const form=new FormData();
form.append("image",file);

const res=await axios.post(
"http://localhost:5000/predict",
form
);
setResult(res.data);
}

function severity(conf){

if(conf>85) return "High";
if(conf>60) return "Moderate";
return "Low";
}
function health(conf){
return 100-conf;
}

return(

<div className="app">

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

<header className="header">

<h1>LeafAI Command Dashboard</h1>

<select>
<option>English</option>
<option>हिन्दी</option>
<option>ਪੰਜਾਬੀ</option>
</select>

</header>


<div className="grid">

{/* LEFT PANEL */}

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

{preview && <img src={preview} className="preview" alt="leaf"/>}

<button onClick={scan}>Analyze</button>

</div>


{/* MIDDLE PANEL */}

<div className="panel feed">
<h3>Live Analysis Feed</h3>
{logs.map((l,i)=>(
<p key={i}>{l}</p>
))}
</div>


{/* RIGHT PANEL */}

<div className="panel">

<h3>Diagnosis</h3>

{result ? (

<>
<p><strong>Disease:</strong> {result.prediction}</p>

<p>
<strong>Confidence:</strong>
{result.confidence}%
</p>

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

<p className="summary">
{result.summary}

</p>

<ul>
{result.recommendations.map((r,i)=>(
<li key={i}>{r}</li>
))}
</ul>
</>
):

<p>No scan yet</p>

}
</div>
</div>
</div>

);
}
