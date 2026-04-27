import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthContext from './context/AuthContext';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import EventCreate from './pages/admin/EventCreate';
import EventEdit from './pages/admin/EventEdit';
import AdminEventDetail from './pages/admin/AdminEventDetail';

// User Pages
import PublicEvents from './pages/user/PublicEvents';
import PublicEventDetail from './pages/user/PublicEventDetail';
import Registration from './pages/user/Registration';
import RegistrationSuccess from './pages/user/RegistrationSuccess';
import MarkAttendance from './pages/user/MarkAttendance';

function App() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already logged in
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin));
      } catch (error) {
        localStorage.removeItem('admin');
      }
    }
    setLoading(false);
  }, []);

  const handleAdminLogin = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem('admin', JSON.stringify(adminData));
  };

  const handleAdminLogout = () => {
    setAdmin(null);
    localStorage.removeItem('admin');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <AuthContext.Provider value={{ admin, handleAdminLogin, handleAdminLogout }}>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Admin Routes */}
              {admin ? (
                <>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/event/create" element={<EventCreate />} />
                  <Route path="/admin/event/:slug/edit" element={<EventEdit />} />
                  <Route path="/admin/event/:slug" element={<AdminEventDetail />} />
                  <Route path="/admin/login" element={<Navigate to="/admin/dashboard" replace />} />
                </>
              ) : (
                <>
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/*" element={<Navigate to="/admin/login" replace />} />
                </>
              )}

              {/* Public Routes */}
              <Route path="/" element={<PublicEvents />} />
              <Route path="/events" element={<PublicEvents />} />
              <Route path="/event/:slug" element={<PublicEventDetail />} />
              <Route path="/event/:slug/register" element={<Registration />} />
              <Route path="/registration/success/:slug/:attendeeId" element={<RegistrationSuccess />} />
              <Route path="/mark-attendance" element={<MarkAttendance />} />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </AuthContext.Provider>
    </Router>
  );
}

export default App;
