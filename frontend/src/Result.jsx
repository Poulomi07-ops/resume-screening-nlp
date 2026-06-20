// import "./Result.css";
// import { useState, useEffect } from "react";

// function Result({ score, status }) {

//   const [applicants, setApplicants] = useState([]);

//   useEffect(() => {
//     fetch("http://127.0.0.1:8000/applicants/")
//       .then((res) => res.json())
//       .then((data) => setApplicants(data.applicants));
//   }, []);

//   return (
//     <div className="result-page">

//       <div className="score-section">
//         <h1>Resume Match Score</h1>

//         <div className="score-circle">
//           <span>{score}%</span>
//         </div>

//         <p className="status">
//           {status}
//         </p>
//       </div>

//       <div className="ranking-section">
//         <h2>Applicant Rankings</h2>

//         <table>
//           <thead>
//             <tr>
//               <th>Rank</th>
//               <th>Applicant Name</th>
//               <th>Score</th>
//             </tr>
//           </thead>

//           <tbody>
//             {applicants.map((applicant) => (
//               <tr key={applicant.rank}>
//                 <td>{applicant.rank}</td>
//                 <td>{applicant.name}</td>
//                 <td>{applicant.score}%</td>
//               </tr>
//             ))}
//           </tbody>

//         </table>
//       </div>

//     </div>
//   );
// }

// export default Result;


import "./Result.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function Result() {
  const location = useLocation();
  const { score, status } = location.state || {};

  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/applicants/")
      .then((res) => res.json())
      .then((data) => setApplicants(data.applicants));
  }, []);

  return (
    <div className="result-page">

      {score !== undefined && (
        <div className="score-section">
          <h1>Resume Match Score</h1>

          <div className="score-circle">
            <span>{score}%</span>
          </div>

          <p className="status">
            {status}
          </p>
        </div>
      )}

      <div className="ranking-section">
        <h2>Applicant Rankings</h2>

        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Applicant Name</th>
              <th>Score</th>
            </tr>
          </thead>

          <tbody>
            {applicants.map((applicant) => (
              <tr key={applicant.rank}>
                <td>{applicant.rank}</td>
                <td>{applicant.name}</td>
                <td>{applicant.score}%</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}

export default Result;
