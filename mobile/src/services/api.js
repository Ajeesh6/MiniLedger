const API_BASE_URL = "http://192.168.1.7:5000";

export async function requestOtp(phone) {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/request-otp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to request OTP.");
  }

  return data;
}

export async function verifyOtp(phone, otp) {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/verify-otp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, otp }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "OTP verification failed.");
  }

  return data;
}


export async function getLoanSummary(token) {
  const response = await fetch(
    `${API_BASE_URL}/api/loans/summary`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to load loan summary.");
  }

  return data;
}

export async function getLoans(token) {
  const response = await fetch(
    `${API_BASE_URL}/api/loans`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to load loans.");
  }

  return data;
}


export async function createLoan(token, loan) {
  const response = await fetch(`${API_BASE_URL}/api/loans`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(loan),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to add loan.");
  }

  return data;
}


export async function markLoanRepaid(token, loanId) {
  const response = await fetch(
    `${API_BASE_URL}/api/loans/${loanId}/repay`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to mark loan as repaid.");
  }

  return data;
}
