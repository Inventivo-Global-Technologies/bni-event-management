import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';

function RegistrationSuccess() {
  const { slug, attendeeId } = useParams();
  const location = useLocation();
  const registrationHash = location.state?.registrationHash || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-800 py-8 md:py-12 flex items-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white rounded-lg shadow-2xl p-8 md:p-12 border-t-4 border-green-500">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-block bg-green-100 rounded-full p-4 mb-6">
              <svg className="w-16 h-16 md:w-20 md:h-20 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">✨ Registration Successful!</h2>
          </div>
          
          {/* Success Message */}
          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg mb-8 text-center">
            <p className="text-lg text-green-800 font-semibold mb-2">🎉 Thank you for registering for the event!</p>
            <p className="text-green-700">Your registration has been confirmed and you're all set.</p>
          </div>

          {/* Hash Code Section */}
          {registrationHash && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 md:p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">📋 Your Hash Code</h3>
              <p className="text-gray-600 text-center mb-4">(For Marking Attendance)</p>
              <div className="bg-white border-2 border-gray-300 rounded-lg p-6 mb-4">
                <code className="text-center text-blue-600 font-mono text-lg md:text-xl break-all block">{registrationHash}</code>
              </div>
              <p className="text-sm text-blue-700 text-center font-semibold">💾 Save this code. You'll need it to mark your attendance on event day.</p>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 md:p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📝 Next Steps</h3>
            <ol className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white font-bold mr-3 flex-shrink-0">1</span>
                <span>On the day of the event, go to "Mark Attendance"</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white font-bold mr-3 flex-shrink-0">2</span>
                <span>Enter your hash code above</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white font-bold mr-3 flex-shrink-0">3</span>
                <span>Your attendance will be recorded</span>
              </li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">>
            <Link 
              to="/mark-attendance" 
              className="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 md:py-4 rounded-lg transition-colors duration-300 text-base md:text-lg"
            >
              📍 Mark Attendance
            </Link>
            <Link 
              to="/" 
              className="flex-1 text-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 md:py-4 rounded-lg transition-colors duration-300 text-base md:text-lg"
            >
              ← Back to Events
            </Link>
          </div>

          {/* Footer Note */}
          <p className="text-center text-gray-600 text-sm mt-8 pt-8 border-t border-gray-200">
            Questions? Contact the event organizer for more information.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegistrationSuccess;
