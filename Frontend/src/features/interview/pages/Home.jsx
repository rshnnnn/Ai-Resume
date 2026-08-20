import React, { useState, useRef } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { loading, generateReport, reports} = useInterview();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");

  const resumeInputRef = useRef(null);

  const navigate = useNavigate();

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0];

    const data = await generateReport({
      selfDescription,
      resumeFile,
      jobDescription,
    });

    if (data?._id) {
      navigate(`/interview/${data._id}`);
    }
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <h1>Generating your interview report...</h1>
      </main>
    );
  }

  return (
    <main className="Home">
      <div className="header">
        <h1>AI Interview Assistant</h1>
        <p>Upload your resume, and describe yourself.</p>
      </div>

      <div className="left">
        <textarea
          onChange={(e) => setJobDescription(e.target.value)}
          name="jobDescription"
          id="jobDescription"
          placeholder="Enter your job description here..."
        />
      </div>

      <div className="right">
        <div className="input-group">
          <label htmlFor="resume">Upload Resume</label>
          <input
            ref={resumeInputRef}
            type="file"
            name="resume"
            id="resume"
            accept=".pdf"
          />
        </div>

        <div className="input-group">
          <label htmlFor="selfDescription">Self Description</label>
          <textarea
            onChange={(e) => setSelfDescription(e.target.value)}
            name="selfDescription"
            id="selfDescription"
            placeholder="Describe yourself in a few sentences..."
          />
        </div>

        <button
          onClick={handleGenerateReport}
          className="generate-btn"
        >
          Generate Interview Report
        </button>
      </div>
      {reports.length > 0 && (
        <div className="previous-reports">
          <h2>Previous Reports</h2>
          <ul>
            {reports.map((report) => (
              <li key={report._id}>
                <a href={`/interview/${report._id}`}>{report.title}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
       <footer className="footer">
      <div className="footer-container">
        <h2>AI Interview Assistant</h2>

        <p>
          Helping candidates prepare smarter with AI-powered interview reports.
        </p>

        <div className="footer-links">
          <a
            href="https://www.linkedin.com/in/rshnnnn/"
            target="_blank"
            rel="noopener noreferrer"
          >
            🔗 LinkedIn
          </a>

          <a href="mailto:roshanworkspace.off@gmail.com">
            📧 Email
          </a>

          <a
            href="https://github.com/rshnnnn"
            target="_blank"
            rel="noopener noreferrer"
          >
            💻 GitHub
          </a>
        </div>

        <p className="footer-copy">
          © {new Date().getFullYear()} Roshan Kumar. All Rights Reserved.
        </p>
      </div>
    </footer>
    </main>
  );
};

export default Home;