import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function Navbar() {
  const { admin, handleAdminLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    handleAdminLogout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link to="/" className="flex items-center group">
            <h1 className="text-xl md:text-2xl font-bold text-white group-hover:text-blue-100 transition-colors">
              🎉 BNI Events
            </h1>
          </Link>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white hover:bg-blue-700 p-2 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <li>
              <Link to="/" className="text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors font-medium">
                Events
              </Link>
            </li>
            
            {admin ? (
              <>
                <li>
                  <Link to="/admin/dashboard" className="text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors font-medium">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/admin/event/create" className="bg-blue-500 hover:bg-blue-400 text-white px-3 py-2 rounded-lg transition-colors font-medium">
                    + New Event
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={handleLogout} 
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors font-medium"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/mark-attendance" className="text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors font-medium">
                    Mark Attendance
                  </Link>
                </li>
                <li>
                  <Link to="/admin/login" className="bg-blue-500 hover:bg-blue-400 text-white px-3 py-2 rounded-lg transition-colors font-medium">
                    Admin Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-blue-700 border-t border-blue-600">
            <ul className="flex flex-col space-y-2 p-4">
              <li>
                <Link to="/" className="block text-white hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors" onClick={() => setMenuOpen(false)}>
                  Events
                </Link>
              </li>
              
              {admin ? (
                <>
                  <li>
                    <Link to="/admin/dashboard" className="block text-white hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors" onClick={() => setMenuOpen(false)}>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/event/create" className="block bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors font-medium" onClick={() => setMenuOpen(false)}>
                      + New Event
                    </Link>
                  </li>
                  <li>
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/mark-attendance" className="block text-white hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors" onClick={() => setMenuOpen(false)}>
                      Mark Attendance
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/login" className="block bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors font-medium" onClick={() => setMenuOpen(false)}>
                      Admin Login
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
