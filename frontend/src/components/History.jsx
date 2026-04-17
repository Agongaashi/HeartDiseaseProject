import { useEffect, useState } from "react";
import { getPatients } from "../api/api";

function History() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getPatients();

      console.log("API response:", data);

      if (Array.isArray(data)) {
        setPatients(data);
      } else {
        setPatients([]);
      }

    } catch (error) {
      console.error("Error loading patients:", error);
      setError("Nuk mund të ngarkohen të dhënat");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const getGender = (sex) => {
    return sex === 1 ? "Male" : "Female";
  };

  const getPredictionStyle = (prediction) => {
    return {
      color: prediction === 1 ? "#dc3545" : "#28a745",
      fontWeight: "bold"
    };
  };

  return (
    <div style={{ 
      maxWidth: "1200px", 
      margin: "20px auto", 
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "10px",
      backgroundColor: "#f9f9f9"
    }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>📋 Patients History</h2>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : error ? (
        <p style={{ textAlign: "center", color: "red" }}>{error}</p>
      ) : patients.length === 0 ? (
        <p style={{ textAlign: "center" }}>No patients found</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ 
            width: "100%", 
            borderCollapse: "collapse",
            backgroundColor: "white"
          }}>
            <thead>
              <tr style={{ 
                backgroundColor: "#007bff", 
                color: "white",
                textAlign: "left"
              }}>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>ID</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>Age</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>Sex</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>BP</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>Cholesterol</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>Heart Rate</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>Prediction</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>Probability</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>Date</th>
              </tr>
            </thead>

            <tbody>
              {patients.map((p, index) => (
                <tr key={p.id || index} style={{ 
                  backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white"
                }}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{p.id}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{p.age}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{getGender(p.sex)}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{p.blood_pressure}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{p.cholesterol}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{p.heart_rate}</td>
                  <td style={{ 
                    padding: "10px", 
                    border: "1px solid #ddd",
                    ...getPredictionStyle(p.prediction)
                  }}>
                    {p.prediction === 1 ? "⚠️ Risk" : "✅ No Risk"}
                  </td>
                  {/* 🔴 KOLONA E RE - PROBABILITY */}
                  <td style={{ 
                    padding: "10px", 
                    border: "1px solid #ddd",
                    fontWeight: "bold"
                  }}>
                    {p.prediction_probability 
                      ? `${(p.prediction_probability * 100).toFixed(1)}%` 
                      : "-"}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd", fontSize: "12px" }}>
                    {p.created_at ? new Date(p.created_at).toLocaleDateString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {!loading && patients.length > 0 && (
        <div style={{ 
          marginTop: "20px", 
          padding: "10px", 
          backgroundColor: "#e9ecef", 
          borderRadius: "5px",
          textAlign: "center"
        }}>
          <strong>Total patients:</strong> {patients.length} | 
          <strong style={{ color: "#dc3545" }}> With risk:</strong> {patients.filter(p => p.prediction === 1).length} | 
          <strong style={{ color: "#28a745" }}> Without risk:</strong> {patients.filter(p => p.prediction !== 1).length}
        </div>
      )}
    </div>
  );
}

export default History;