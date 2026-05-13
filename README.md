Markdown
# 🌿 LeafAI — Cinematic Plant Disease Diagnostic Engine

LeafAI is an enterprise-grade, full-stack web application designed to detect plant diseases from leaf images with high precision. Built to demonstrate flagship-level UX/UI, the application bridges advanced generative AI (Google Gemini Vision) with fluid, cinematic frontend architecture.

![LeafAI Preview](https://via.placeholder.com/1000x500.png?text=LeafAI+Dashboard+Screenshot)

##  Key Features

###  Enterprise Frontend & Cinematic UX
*   **Glassmorphic Bento Grid:** Dynamic, responsive masonry layout using `react-tilt` for 3D card physics and fluid CSS grid architecture.
*   **Deep-Scan HUD Animation:** Custom CSS keyframe animations simulating a robotic vision/laser scan over the uploaded image.
*   **WebGL Particle Physics:** Context-aware background particles (`react-tsparticles`) that change color, speed, and density based on the AI's severity assessment.
*   **Fluid Motion & Transitions:** Smooth layout animations and skeleton loaders powered by `framer-motion`.
*   **Dark/Light Mode:** Full CSS variable-based theming with automatic contrast adjustments.

### Advanced AI Backend
*   **Multimodal Inference:** Utilizes `gemini-2.5-flash` to process image buffers and return structured JSON diagnostics (prediction, confidence score, summary, and treatments).
*   **Botanist AI Copilot:** A built-in, context-aware chat sidebar that allows users to ask follow-up questions about the diagnosed disease (e.g., "Can I use neem oil for this?").
*   **Streamlined Express API:** Handles `multipart/form-data` via Multer, processing images entirely in memory/temp storage before sending payloads to the AI model.

---

## 🛠️ Tech Stack

**Frontend:**
*   React.js
*   Framer Motion (Animations)
*   React-Tilt (3D Hover Effects)
*   React-tsParticles (Background Physics)
*   React-Hot-Toast (Notifications)
*   Axios

**Backend:**
*   Node.js & Express.js
*   Multer (File handling)
*   @google/generative-ai (Gemini SDK)
*   Cors & Dotenv

---

##  Installation & Setup

### Prerequisites
*   [Node.js](https://nodejs.org/) (v16 or higher)
*   A free API Key from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone the repository
```bash
git clone [https://github.com/yourusername/leaf-ai.git](https://github.com/yourusername/leaf-ai.git)
cd leaf-ai
2. Backend Setup
Open a terminal and navigate to the backend directory:
```
```Bash
cd backend
npm install
Create a .env file in the backend folder and add your Gemini API key:

Code snippet
PORT=5000
GEMINI_API_KEY=your_google_gemini_api_key_here
Start the backend server:
```
```Bash
npm run dev
# Server should output: 🚀 Server running on http://localhost:5000
3. Frontend Setup
Open a second terminal and navigate to the frontend directory:
```
```Bash
cd frontend
npm install
Start the React development server:
```
```Bash
npm start
# App will launch on http://localhost:3000
```

📂 API Endpoints
POST /predict
Description: Accepts a plant leaf image and returns a diagnostic JSON.

Payload: multipart/form-data (key: image)

Response:

JSON
{
  "prediction": "Tomato Early Blight",
  "confidence": "94.50",
  "summary": "Early blight is a fungal disease that causes...",
  "recommendations": ["Apply copper-based fungicide", "Ensure good airflow"]
}


### `POST /chat`
*   **Description:** Context-aware chatbot for follow-up questions.
*   **Payload:** JSON (`{ "message": "...", "context": {...} }`)
*   **Response:** `{ "reply": "Yes, neem oil is highly effective..." }`

---

##  Author
**Aditya Thakur**  
*Aspiring Software Development Engineer*  

*Built as a showcase of modern frontend architecture and full-stack AI integration.*
