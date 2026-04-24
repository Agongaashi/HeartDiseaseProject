import { useEffect, useState } from "react";
import {
  deletePatientRecord,
  getMyResults,
  getPatientHistory,
  getPatientUsers
} from "../api/api";
import { useAuth } from "../auth/authStore";
import Sidebar from "../components/Sidebar";

export default function History() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        if (!user?.role) return;

        if (user.role === "doctor") {
          const patientUsers = await getPatientUsers();
          setPatients(Array.isArray(patientUsers) ? patientUsers : []);
          setData([]);
          return;
        }

        setLoading(true);
        const res = await getMyResults();
        setData(Array.isArray(res) ? res : []);
      } catch (err) {
        console.log(err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  useEffect(() => {
    if (user?.role !== "doctor") return;

    const loadPatientHistory = async () => {
      if (!selectedPatientId) {
        setData([]);
        return;
      }

      try {
        setLoading(true);
        const res = await getPatientHistory(selectedPatientId);
        setData(Array.isArray(res) ? res : []);
      } catch (err) {
        console.log(err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    loadPatientHistory();
  }, [selectedPatientId, user]);

  const handleDelete = async (recordId) => {
    const confirmed = window.confirm("Delete this history record?");

    if (!confirmed) return;

    try {
      await deletePatientRecord(recordId);
      setData((prev) => prev.filter((p) => p.id !== recordId));
    } catch (err) {
      console.log(err);
      alert(err.detail || "Delete failed");
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="page">
        <header className="page-header">
          <div>
            <p className="eyebrow">History</p>
            <h1 className="page-title">Prediction records</h1>
            <p className="page-subtitle">
              Review saved evaluations, patient details, and prediction probabilities.
            </p>
          </div>
        </header>

        <section className="panel form-panel">
          {user?.role === "doctor" && (
            <div className="history-toolbar">
              <div className="field history-select">
                <label htmlFor="patient-history">Patient email</label>
                <select
                  id="patient-history"
                  className="select"
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                >
                  <option value="">Select patient</option>

                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {!user ? (
            <div className="empty-state">Loading...</div>
          ) : loading ? (
            <div className="empty-state">Loading...</div>
          ) : user.role === "doctor" && !selectedPatientId ? (
            <div className="empty-state">Select a patient to view history.</div>
          ) : data.length === 0 ? (
            <div className="empty-state">No data found.</div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Patient Name</th>
                    <th>Age</th>
                    <th>Sex</th>
                    <th>BP</th>
                    <th>Cholesterol</th>
                    <th>Heart Rate</th>
                    <th>Prediction</th>
                    <th>Probability</th>
                    {user.role === "doctor" && <th>Action</th>}
                  </tr>
                </thead>

                <tbody>
                  {data.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.patient_name || "-"}</td>
                      <td>{p.age}</td>
                      <td>{p.sex}</td>
                      <td>{p.blood_pressure}</td>
                      <td>{p.cholesterol}</td>
                      <td>{p.heart_rate}</td>
                      <td>{p.prediction}</td>
                      <td>{p.prediction_probability}</td>
                      {user.role === "doctor" && (
                        <td>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="button button-danger"
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
