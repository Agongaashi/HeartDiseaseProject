import { useEffect, useState } from "react";
import { getPatients } from "../api/api";

function History() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);

      const data = await getPatients();

      console.log("API response:", data);

      // sigurohemi që është array
      if (Array.isArray(data)) {
        setPatients(data);
      } else {
        setPatients([]);
      }

    } catch (error) {
      console.error("Error loading patients:", error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Patients History</h2>

      {loading ? (
        <p>Loading...</p>
      ) : patients.length === 0 ? (
        <p>No patients found</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Age</th>
              <th>Sex</th>
              <th>BP</th>
              <th>Cholesterol</th>
              <th>Heart Rate</th>
              <th>Prediction</th>
            </tr>
          </thead>

          <tbody>
            {patients.map((p) => (
              <tr key={p.id || Math.random()}>
                <td>{p.id}</td>
                <td>{p.age}</td>
                <td>{p.sex}</td>
                <td>{p.blood_pressure}</td>
                <td>{p.cholesterol}</td>
                <td>{p.heart_rate}</td>
                <td>
                  {p.prediction === 1 ? "Risk" : "No Risk"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default History;