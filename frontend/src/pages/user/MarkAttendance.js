import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { attendeesAPI } from '../../services/api';

function MarkAttendance() {
  const [searchParams] = useSearchParams();
  const hashFromUrl = searchParams.get('hash');
  
  const [hashCode, setHashCode] = useState(hashFromUrl || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [attendeeInfo, setAttendeeInfo] = useState(null);

  // Auto-submit if hash is provided in URL
  useEffect(() => {
    if (hashFromUrl && !attendeeInfo) {
      submitAttendance(hashFromUrl);
    }
  }, [hashFromUrl, attendeeInfo]);

  const submitAttendance = async (hash) => {
    setError('');
    setSuccess('');
    setAttendeeInfo(null);
    setLoading(true);

    try {
      const response = await attendeesAPI.markAttendance({ registration_hash: hash });
      setAttendeeInfo(response.data);
      setSuccess('✓ Attendance marked successfully!');
      setHashCode('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 
                      'Hash code not found. Please verify and try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    submitAttendance(hashCode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-800 py-8 md:py-12 flex items-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white rounded-lg shadow-2xl p-8 md:p-12 border border-gray-200">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">📍 Mark Your Attendance</h2>
            <p className="text-gray-600 text-lg">Enter your hash code received during registration</p>
          </div>

          {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-4 mb-6 rounded"><p className="font-semibold">{error}</p></div>}
          {success && <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-4 mb-6 rounded"><p className="font-semibold">{success}</p></div>}

          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            <div>
              <label htmlFor="hashCode" className="block text-gray-700 font-semibold mb-3">Hash Code *</label>
              <input
                type="text"
                id="hashCode"
                value={hashCode}
                onChange={(e) => setHashCode(e.target.value.toUpperCase())}
                placeholder="Enter your 16-character hash code"
                maxLength="16"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition-colors text-center font-mono text-lg tracking-widest"
                required
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 md:py-4 rounded-lg transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg md:text-xl"
              disabled={loading || hashCode.length !== 16}
            >
              {loading ? '⏳ Verifying...' : '✅ Mark Attendance'}
            </button>
          </form>

          {attendeeInfo && (
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 md:p-8 mb-8">
              <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">🎉 Attendance Confirmed</h3>
              <div className="space-y-4 bg-white p-6 rounded-lg">
                <p className="text-gray-700 text-lg"><strong className="text-green-700">👤 Name:</strong> {attendeeInfo.full_name}</p>
                <p className="text-gray-700 text-lg"><strong className="text-green-700">🎪 Event:</strong> {attendeeInfo.event_title}</p>
                <p className="text-gray-700 text-lg"><strong className="text-green-700">🏷️ Type:</strong> {attendeeInfo.registration_type}</p>
                <p className="text-gray-700 text-lg"><strong className="text-green-700">✓ Status:</strong> <span className="text-green-600 font-bold">Verified</span></p>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 md:p-8">
            <h3 className="text-xl font-bold text-blue-900 mb-4">📋 How to find your hash code:</h3>
            <ol className="space-y-3 text-blue-800">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-blue-500 text-white font-bold mr-3 flex-shrink-0 text-sm">1</span>
                <span>Check your confirmation email after registration</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-blue-500 text-white font-bold mr-3 flex-shrink-0 text-sm">2</span>
                <span>Or ask the event organizer for your hash code</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-blue-500 text-white font-bold mr-3 flex-shrink-0 text-sm">3</span>
                <span>Enter it above to mark your attendance</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarkAttendance;
