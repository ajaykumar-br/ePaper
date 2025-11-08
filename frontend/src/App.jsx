import { useState } from "react";
import axios from "axios";

function App() {
  const [epaperFile, setEpaperFile] = useState(null);

  const uploadFile = async () => {
    if (!epaperFile) {
      alert("Please select a file first.");
      return;
    }
    try {
      const res = await axios.post('http://localhost:3000/api/v1/news/upload', {
          file: epaperFile
      });
    } catch (err) {
      console.error("Upload failed:", err);
    }
  }

  return (
    <>
    <div className="text-center mt-10">
      <input type="file" onChange={(e) => {
        const file = e.target.files[0];
        setEpaperFile(file);
      }} />
      <button className="btn bg-amber-200 px-3 py-2 rounded-sm" onClick={uploadFile}>Upload PDF</button>
    </div>
    </>
  )
}

export default App
