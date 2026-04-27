import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventsAPI, attendeesAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';

function AdminEventDetail() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEventAndAttendees();
  }, [slug]);

  const fetchEventAndAttendees = async () => {
    try {
      setLoading(true);
      const [eventRes, attendeesRes] = await Promise.all([
        eventsAPI.getBySlug(slug),
        attendeesAPI.getByEvent(slug),
      ]);
      setEvent(eventRes.data);
      setAttendees(attendeesRes.data);
    } catch (err) {
      setError('Failed to load event details');
    } finally {
      setLoading(false);
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
  
  if (error) return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 flex items-center">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-4 rounded">
          <p className="font-semibold text-lg">{error}</p>
        </div>
      </div>
    </div>
  );
  
  if (!event) return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 flex items-center">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 px-4 py-4 rounded">
          <p className="font-semibold text-lg">Event not found</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{event.title}</h2>
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                event.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                'bg-red-100 text-red-800'
              }`}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Link to={`/admin/event/${slug}/edit`} className="flex-1 sm:flex-none text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
              ✏️ Edit
            </Link>
            <Link to="/admin/dashboard" className="flex-1 sm:flex-none text-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
              ← Back
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Event Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 md:p-8">
                <h3 className="text-2xl font-bold">📋 Event Information</h3>
              </div>
              <div className="p-6 md:p-8">
                {event.poster_url && (
                  <div className="mb-6 rounded-lg overflow-hidden h-64 md:h-80 bg-gray-200">
                    <img src={event.poster_url} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-500 text-sm font-semibold">DESCRIPTION</p>
                    <p className="text-gray-700 text-base md:text-lg whitespace-pre-wrap">{event.description}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-semibold">📍 LOCATION</p>
                    <p className="text-gray-700 text-base md:text-lg">{event.location}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-sm font-semibold">STARTS</p>
                      <p className="text-gray-700 text-base md:text-lg">{formatDate(event.start_date)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm font-semibold">ENDS</p>
                      <p className="text-gray-700 text-base md:text-lg">{formatDate(event.end_date)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-gray-500 text-sm font-semibold">👥 CAPACITY</p>
                      <p className="text-gray-700 text-base md:text-lg font-bold">{event.registered_count}/{event.capacity}</p>
                      <div className="w-full bg-gray-300 rounded-full h-2 mt-2 overflow-hidden">
                        <div className="bg-blue-500 h-full" style={{width: `${Math.min((event.registered_count / event.capacity) * 100, 100)}%`}}></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm font-semibold">📅 CREATED</p>
                      <p className="text-gray-700 text-base md:text-lg">{formatDate(event.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                  <span className="text-gray-700 font-semibold">Total Registered</span>
                  <span className="text-2xl font-bold text-blue-600">{event.registered_count}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                  <span className="text-gray-700 font-semibold">Available Slots</span>
                  <span className="text-2xl font-bold text-green-600">{event.capacity - event.registered_count}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                  <span className="text-gray-700 font-semibold">Capacity</span>
                  <span className="text-2xl font-bold text-purple-600">{event.capacity}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attendees Table */}
        <div className="mt-8 md:mt-12">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 md:p-8">
              <h3 className="text-2xl font-bold">👥 Attendees ({attendees.length})</h3>
            </div>
            <div className="p-6 md:p-8">
              {attendees.length === 0 ? (
                <p className="text-center text-gray-600 py-8">No attendees registered yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100 border-b-2 border-gray-300">
                        <th className="text-left px-4 py-3 font-bold text-gray-700">Name</th>
                        <th className="text-left px-4 py-3 font-bold text-gray-700">Email</th>
                        <th className="text-left px-4 py-3 font-bold text-gray-700">Company</th>
                        <th className="text-left px-4 py-3 font-bold text-gray-700">Type</th>
                        <th className="text-left px-4 py-3 font-bold text-gray-700">Status</th>
                        <th className="text-left px-4 py-3 font-bold text-gray-700">Registered</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendees.map((attendee, idx) => (
                        <tr key={attendee.id} className={`border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                          <td className="px-4 py-3 text-gray-700 font-medium">{attendee.full_name}</td>
                          <td className="px-4 py-3 text-gray-700 text-sm">{attendee.email}</td>
                          <td className="px-4 py-3 text-gray-700 text-sm">{attendee.company_name || '-'}</td>
                          <td className="px-4 py-3 text-gray-700 text-sm">{attendee.registration_type}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${attendee.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {attendee.is_verified ? '✓ Verified' : '○ Pending'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-700 text-sm">{formatDate(attendee.registered_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminEventDetail;
