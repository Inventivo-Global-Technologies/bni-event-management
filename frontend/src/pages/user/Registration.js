import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsAPI, attendeesAPI } from '../../services/api';

function Registration() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company_name: '',
    business_category: '',
    registration_type: 'visitor',
  });

  useEffect(() => {
    fetchEvent();
  }, [slug]);

  const fetchEvent = async () => {
    try {
      const response = await eventsAPI.getBySlug(slug);
      setEvent(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load event');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await attendeesAPI.register(slug, formData);
      navigate(`/registration/success/${slug}/${response.data.id}`, {
        state: { registrationHash: response.data.registration_hash }
      });
    } catch (err) {
      console.error('Registration error:', err.response?.data);
      
      // Build detailed error message
      let errorMessage = 'Failed to register. Please check your information.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.email) {
        errorMessage = 'Email error: ' + (Array.isArray(err.response.data.email) ? err.response.data.email[0] : err.response.data.email);
      } else if (err.response?.data?.full_name) {
        errorMessage = 'Name error: ' + (Array.isArray(err.response.data.full_name) ? err.response.data.full_name[0] : err.response.data.full_name);
      } else if (err.response?.data?.registration_type) {
        errorMessage = 'Registration type error: ' + (Array.isArray(err.response.data.registration_type) ? err.response.data.registration_type[0] : err.response.data.registration_type);
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    </div>
  );
  
  if (!event) return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 flex items-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-4 rounded">
          <p className="font-semibold text-lg">{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 border border-gray-200">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">📝 Register for {event.title}</h2>
          {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-4 mb-6 rounded"><p className="font-semibold">{error}</p></div>}

          <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="full_name" className="block text-gray-700 font-semibold mb-2">Full Name *</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-gray-700 font-semibold mb-2">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="company_name" className="block text-gray-700 font-semibold mb-2">Company Name</label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
              placeholder="Enter your company name"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="business_category" className="block text-gray-700 font-semibold mb-2">Business Category</label>
            <input
              type="text"
              id="business_category"
              name="business_category"
              value={formData.business_category}
              onChange={handleInputChange}
              placeholder="Enter your business category"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="registration_type" className="block text-gray-700 font-semibold mb-2">Attendee Type *</label>
            <select
              id="registration_type"
              name="registration_type"
              value={formData.registration_type}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              required
            >
              <option value="visitor">Visitor</option>
              <option value="primary_member">Primary Member</option>
              <option value="cross_region">Cross Region</option>
              <option value="launch_member">Launch Member</option>
              <option value="family_member">Family Member</option>
              <option value="vip">VIP</option>
              <option value="support_staff">Support Staff</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
            <button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={submitting}>
              {submitting ? 'Registering...' : '✅ Complete Registration'}
            </button>
            <button type="button" className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors duration-300" onClick={() => navigate(-1)}>
              ← Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}

export default Registration;
