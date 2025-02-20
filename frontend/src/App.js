import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Login from "./components/Auth/Login";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const [userInfo, setUserInfo] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const userName = localStorage.getItem('username');

    if (userName && userName.length > 0) {
      setUserInfo(userName);
      setIsAuthenticated(true);
    }
  }, []);

  const onLogin = (username, password) => {
    localStorage.setItem('username', username);
    setUserInfo(username);
    setIsAuthenticated(true);
  };

  const onLogout = () => {
    localStorage.removeItem('username');
    setUserInfo('');
    setIsAuthenticated(false);
  };

  console.log(`userInfo: ${userInfo}`);

  return (
    <div className="App">
      <BrowserRouter>
        {isAuthenticated ? (
          <AuthenticatedRoutes name={userInfo} onLogout={onLogout} />
        ) :
          <UnauthenticatedRoutes onLogin={(username, password) => onLogin(username, password)} />}
      </BrowserRouter>
    </div>
  );
}

const AuthenticatedRoutes = ({ name, onLogout }) => {
  return (
    <Routes>
      <Route element={<MainLayout userName={name} onLogout={onLogout} />}>
        <Route index element={<AdminDashboard userName={name} />} />
      </Route>
    </ Routes>
  );
};

const UnauthenticatedRoutes = ({ onLogin }) => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={(username, password) => onLogin(username, password)} />} />
      <Route path="*" element={<Login onLogin={(username, password) => onLogin(username, password)} originalUrl={location.pathname} />} />
    </Routes>
  )
};

export default App;
