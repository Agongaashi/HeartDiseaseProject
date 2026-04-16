const API_URL = "http://127.0.0.1:8000";

// prediction + save patient
export const predictPatient = async (data) => {
  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

// get patient history
export const getPatients = async () => {
  const response = await fetch(`${API_URL}/patients`);
  return response.json();
};