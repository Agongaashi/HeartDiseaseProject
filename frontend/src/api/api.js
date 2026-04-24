const API_URL = "http://127.0.0.1:8000";

// ---------------- TOKENS ----------------
const getAccessToken = () => localStorage.getItem("access_token");
const getRefreshToken = () => localStorage.getItem("refresh_token");

const setAccessToken = (token) => {
  localStorage.setItem("access_token", token);
};

// ---------------- HANDLE RESPONSE ----------------
const handleResponse = async (res) => {
  let data;

  try {
    data = await res.json();
  } catch {
    data = { detail: "Invalid server response" };
  }

  if (!res.ok) {
    throw data;
  }

  return data;
};

// ---------------- REFRESH TOKEN ----------------
export const refreshToken = async () => {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      refresh_token: getRefreshToken()
    })
  });

  return handleResponse(res);
};

// ---------------- REQUEST WRAPPER ----------------
const request = async (url, options = {}) => {
  let res = await fetch(url, options);

  // 🔥 AUTO REFRESH
  if (res.status === 401) {
    const refreshed = await refreshToken();

    if (refreshed?.access_token) {
      setAccessToken(refreshed.access_token);

      res = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${refreshed.access_token}`
        }
      });
    }
  }

  return handleResponse(res);
};

// ---------------- AUTH ----------------
export const loginUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await handleResponse(res);

  localStorage.setItem("access_token", result.access_token);
  localStorage.setItem("refresh_token", result.refresh_token);
  localStorage.removeItem("role");
  localStorage.removeItem("email");

  return result;
};

export const registerUser = (data) =>
  fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(handleResponse);

// ---------------- AUTH HEADER ----------------
const authHeader = () => ({
  Authorization: `Bearer ${getAccessToken()}`
});

// ---------------- API CALLS ----------------
export const getPatients = () =>
  request(`${API_URL}/patients`, {
    headers: authHeader()
  });

export const getPatientHistory = (patientId) =>
  request(`${API_URL}/patients/${patientId}/history`, {
    headers: authHeader()
  });

export const deletePatientRecord = (recordId) =>
  request(`${API_URL}/patients/history/${recordId}`, {
    method: "DELETE",
    headers: authHeader()
  });

export const getMyResults = () =>
  request(`${API_URL}/my-results`, {
    headers: authHeader()
  });

export const getPatientUsers = () =>
  request(`${API_URL}/patients-users`, {
    headers: authHeader()
  });

export const predictPatient = (data) =>
  request(`${API_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader()
    },
    body: JSON.stringify(data)
  });
