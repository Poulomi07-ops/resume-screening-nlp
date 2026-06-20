import { useState } from "react";
import { useNavigate, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Result from "./Result";

function UploadPage() {
  const [name, setName] = useState("");
  const [resume, setResume] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (name.trim() === "") {
      setError("Name is required");
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(name)) {
      setError("Name should contain only letters");
      return;
    }

    if (resume === null) {
      setError("Please upload your resume");
      return;
    }

    if (!resume.name.toLowerCase().endsWith(".pdf")) {
      setError("Only PDF files are allowed");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("resume", resume);

    fetch("http://127.0.0.1:8000/upload/", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setSuccess("Resume submitted successfully!");

        setTimeout(() => {
          navigate("/result", { state: { score: data.score, status: data.status } });
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
        setError(error.message);
      });
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Resume Screening System</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Upload Resume (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResume(e.target.files[0])}
            />
          </div>

          {error && (
            <p style={{ color: "red", marginBottom: "10px" }}>
              {error}
            </p>
          )}

          {success && (
            <p style={{ color: "lightgreen", marginBottom: "10px" }}>
              {success}
            </p>
          )}

          <button type="submit">
            Submit Resume
          </button>
        </form>

        <Link to="/result">
          <button type="button" style={{ marginTop: "10px" }}>
            View Rankings
          </button>
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<UploadPage />} />
      <Route path="/result" element={<Result />} />
    </Routes>
  );
}

export default App;