import { useEffect, useState } from "react";
import { getPatientUsers, predictPatient } from "../api/api";

function Form() {
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);

  const [formData, setFormData] = useState({
    user_id: "",
    age: "",
    sex: "",
    blood_pressure: "",
    cholesterol: "",
    heart_rate: ""
  });

  const [result, setResult] = useState(null);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await getPatientUsers();
        setPatients(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingPatients(false);
      }
    };

    loadPatients();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.user_id ||
      formData.age === "" ||
      formData.sex === "" ||
      formData.blood_pressure === "" ||
      formData.cholesterol === "" ||
      formData.heart_rate === ""
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await predictPatient({
        user_id: Number(formData.user_id),
        age: Number(formData.age),
        sex: Number(formData.sex),
        blood_pressure: Number(formData.blood_pressure),
        cholesterol: Number(formData.cholesterol),
        heart_rate: Number(formData.heart_rate)
      });

      setResult(res);
    } catch (err) {
      console.error(err);
      alert(err.detail || "Prediction failed");
    }
  };

  return (
    <section className="panel form-panel">
      <form className="form-stack" onSubmit={handleSubmit}>
        <div>
          <h2 className="panel-title">New prediction</h2>
          <p className="panel-copy">Complete the form and submit a prediction for the selected patient.</p>
        </div>

        <div className="field">
          <label htmlFor="user_id">Patient email</label>
          <select
            id="user_id"
            name="user_id"
            className="select"
            onChange={handleChange}
            value={formData.user_id}
          >
            <option value="">
              {loadingPatients ? "Loading patients..." : "Select patient"}
            </option>

            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.email}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="age">Age</label>
            <input
              id="age"
              className="input"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label htmlFor="sex">Sex</label>
            <select
              id="sex"
              className="select"
              name="sex"
              value={formData.sex}
              onChange={handleChange}
            >
              <option value="">Select sex</option>
              <option value="0">Male</option>
              <option value="1">Female</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="blood_pressure">Blood pressure</label>
          <input
            id="blood_pressure"
            className="input"
            name="blood_pressure"
            placeholder="BP"
            value={formData.blood_pressure}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="cholesterol">Cholesterol</label>
          <input
            id="cholesterol"
            className="input"
            name="cholesterol"
            placeholder="Cholesterol"
            value={formData.cholesterol}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="heart_rate">Heart rate</label>
          <input
            id="heart_rate"
            className="input"
            name="heart_rate"
            placeholder="Heart rate"
            value={formData.heart_rate}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="button button-primary">
          Predict
        </button>
      </form>

      {result && (
        <div className="result-box">
          <p className="eyebrow">Prediction result</p>
          <h3 className="result-value">{result.risk_level}</h3>
          <p className="panel-copy">{(result.probability * 100).toFixed(1)}% probability</p>
        </div>
      )}
    </section>
  );
}

export default Form;
