import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const [userInfo, setUserInfo] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const onLogin = (username, password) => {
    console.log(`USERNAME: ${username}`);
    setUserInfo(username);
    setIsAuthenticated(true);
  };

  console.log(`userInfo: ${userInfo}`);

  return (
    <div className="App">
      <BrowserRouter>
        {isAuthenticated ? (
          <AuthenticatedRoutes name={userInfo} />
        ) :
          <UnauthenticatedRoutes onLogin={(username, password) => onLogin(username, password)} />}
      </BrowserRouter>
    </div>
  );
}

const AuthenticatedRoutes = ({ name }) => {
  return (
    <Routes>
      <Route element={<MainLayout userName={name} />}>
        <Route index element={<AdminDashboard />} />
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
