import React, { useState } from "react";
import axios from "axios";

function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please upload an image first!");

    const formData = new FormData();
    formData.append("image", image);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data.prediction
        ? `${res.data.prediction} (${res.data.confidence}%)`
        : "No result from server");

    } catch (error) {
      console.error(error);
      setResult("Error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f8f5",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <h1 style={{ color: "#2f855a" }}>🌿 Plant Disease Detector (JAYPEE UNIVERSITY)</h1>
      <div style={{
        marginTop: "20px",
        padding: "15px",
        background: "#edfdf7",
        borderLeft: "5px solid #38a169",
        borderRadius: "8px",
        width: "260px",
        textAlign: "left",
        fontFamily: "Poppins"
      }}>
        <h3 style={{ margin: "0 0 8px 0", color: "#2f855a" }}>Project Team</h3>
        <ul style={{ margin: 0, paddingLeft: "20px", color: "#22543d", fontWeight: 500 }}>
          <li>ADITYA THAKUR</li>
          <li>SOUMYA SANGAL</li>
          <li>SURYANSH</li>
          <li>SHUBHAM</li>
        </ul>
      </div>



      <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <br />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "#38a169",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {loading ? "Analyzing..." : "Upload & Analyze"}
        </button>
      </form>

      {result && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "white",
            borderRadius: "10px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Result:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

export default App;
