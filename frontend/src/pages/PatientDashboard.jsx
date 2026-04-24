import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function PatientDashboard() {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="page">
        <header className="page-header">
          <div>
            <p className="eyebrow">Patient Panel</p>
            <h1 className="page-title">Your health overview</h1>
            <p className="page-subtitle">
              Review the predictions saved by your doctor and follow your heart risk history over time.
            </p>
          </div>
        </header>

        <section className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Prediction history</h2>
            <p className="panel-copy">
              Your history page contains all saved evaluations connected to your account.
            </p>
          </div>

          <div className="info-list">
            <div className="info-item">
              <span className="info-icon">H</span>
              <div>
                <h3>Open history</h3>
                <p>See age, blood pressure, cholesterol, heart rate, prediction, and probability in one table.</p>
              </div>
            </div>

            <Link to="/history" className="button button-primary">
              View My History
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
