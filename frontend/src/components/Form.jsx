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

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await predictPatient({
      age: Number(formData.age),
      sex: Number(formData.sex),
      blood_pressure: Number(formData.blood_pressure),
      cholesterol: Number(formData.cholesterol),
      heart_rate: Number(formData.heart_rate)
    });

    setResult(response.prediction);
  };

  return (
    <div>
      <h2>Heart Disease Prediction</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="sex"
          placeholder="Sex (0 = Female, 1 = Male)"
          value={formData.sex}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="blood_pressure"
          placeholder="Blood Pressure"
          value={formData.blood_pressure}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="cholesterol"
          placeholder="Cholesterol"
          value={formData.cholesterol}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="heart_rate"
          placeholder="Heart Rate"
          value={formData.heart_rate}
          onChange={handleChange}
          required
        />

        <button type="submit">Predict</button>

      </form>

      {result !== null && (
        <h3>
          Prediction: {result === 1 ? "Heart Disease Risk" : "No Heart Disease"}
        </h3>
      )}

    </div>
  );
}

export default Form;