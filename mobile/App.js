import { useState } from "react";

import LoginScreen from "./src/screens/LoginScreen";
import DashboardScreen from "./src/screens/DashboardScreen";

export default function App() {
  const [token, setToken] = useState(null);

  function handleLogin(authToken) {
    setToken(authToken);
  }

  if (token) {
    return <DashboardScreen token={token} />;
  }

  return <LoginScreen onLogin={handleLogin} />;
}
