import Form from "../components/Form";
import Sidebar from "../components/Sidebar";

export default function DoctorDashboard() {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="page">
        <header className="page-header">
          <div>
            <p className="eyebrow">Doctor Dashboard</p>
            <h1 className="page-title">Heart risk prediction</h1>
            <p className="page-subtitle">
              Select a patient by email, enter the clinical values, and save the prediction to that patient's history.
            </p>
          </div>
        </header>

        <div className="content-grid">
          <Form />

          <section className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Workflow</h2>
              <p className="panel-copy">Keep each prediction connected to the right patient record.</p>
            </div>

            <div className="info-list">
              <div className="info-item">
                <span className="info-icon">1</span>
                <div>
                  <h3>Select patient</h3>
                  <p>Use the patient's email in the dropdown to avoid duplicate-name confusion.</p>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">2</span>
                <div>
                  <h3>Enter values</h3>
                  <p>Fill age, sex, blood pressure, cholesterol, and heart rate.</p>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">3</span>
                <div>
                  <h3>Review history</h3>
                  <p>Open History to see saved results and remove incorrect records when needed.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
