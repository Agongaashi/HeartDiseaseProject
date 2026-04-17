import { useState } from "react";
import { predictPatient } from "../api/api";

function Form() {

  const [formData, setFormData] = useState({
    age: "",
    sex: "",
    blood_pressure: "",
    cholesterol: "",
    heart_rate: ""
  });

  const [result, setResult] = useState(null);  // Ruan gjithë përgjigjen
  const [loading, setLoading] = useState(false);  // Për loading
  const [error, setError] = useState(null);  // Për gabime

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await predictPatient({
        age: Number(formData.age),
        sex: Number(formData.sex),
        blood_pressure: Number(formData.blood_pressure),
        cholesterol: Number(formData.cholesterol),
        heart_rate: Number(formData.heart_rate)
      });

      setResult(response);  // ← Ruan gjithë përgjigjen, jo vetëm prediction
      
      // Pastro formularin (opsionale)
      setFormData({
        age: "",
        sex: "",
        blood_pressure: "",
        cholesterol: "",
        heart_rate: ""
      });
      
    } catch (err) {
      setError("Gabim gjatë predikimit. Kontrollo serverin.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Heart Disease Prediction</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />

        <select
          name="sex"
          value={formData.sex}
          onChange={handleChange}
          required
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        >
          <option value="">Select Gender</option>
          <option value="1">Male</option>
          <option value="0">Female</option>
        </select>

        <input
          type="number"
          name="blood_pressure"
          placeholder="Blood Pressure"
          value={formData.blood_pressure}
          onChange={handleChange}
          required
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />

        <input
          type="number"
          name="cholesterol"
          placeholder="Cholesterol"
          value={formData.cholesterol}
          onChange={handleChange}
          required
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />

        <input
          type="number"
          name="heart_rate"
          placeholder="Heart Rate"
          value={formData.heart_rate}
          onChange={handleChange}
          required
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: "10px", 
            backgroundColor: "#007bff", 
            color: "white", 
            border: "none", 
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          {loading ? "Processing..." : "Predict"}
        </button>
      </form>

      {/* Loading */}
      {loading && (
        <p style={{ textAlign: "center", marginTop: "20px" }}>Duke analizuar...</p>
      )}

      {/* Error */}
      {error && (
        <div style={{ 
          marginTop: "20px", 
          padding: "15px", 
          backgroundColor: "#f8d7da", 
          color: "#721c24", 
          borderRadius: "5px",
          textAlign: "center"
        }}>
          {error}
        </div>
      )}

      {/* Rezultati i plotë */}
      {result && (
        <div style={{ 
          marginTop: "20px", 
          padding: "20px", 
          backgroundColor: result.prediction === 1 ? "#f8d7da" : "#d4edda",
          color: result.prediction === 1 ? "#721c24" : "#155724",
          borderRadius: "10px",
          textAlign: "center",
          border: `2px solid ${result.prediction === 1 ? "#dc3545" : "#28a745"}`
        }}>
          <h3>Prediction Result:</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            {result.prediction === 1 ? "⚠️ Heart Disease Risk" : "✅ No Heart Disease"}
          </p>
          <p><strong>Risk Level:</strong> {result.risk_level}</p>
          <p><strong>Probability:</strong> {(result.probability * 100).toFixed(1)}%</p>
          <p><strong>Patient ID:</strong> {result.patient_id}</p>
          <p><strong>Message:</strong> {result.message}</p>
        </div>
      )}
    </div>
  );
}

export default Form;