import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getAll();
      const events = response.data.results || response.data;
      setEvents(Array.isArray(events) ? events : []);
    } catch (err) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (slug) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventsAPI.delete(slug);
        setEvents(events.filter(e => e.slug !== slug));
      } catch (err) {
        setError('Failed to delete event');
      }
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Loading events...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">📊 Admin Dashboard</h2>
            <p className="text-gray-600 mt-2">Manage all your events in one place</p>
          </div>
          <Link 
            to="/admin/event/create" 
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 text-center"
          >
            + Create New Event
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-4 mb-8 rounded">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {events.length === 0 ? (
            <div className="col-span-full bg-white rounded-lg shadow-md p-8 md:p-12 text-center border border-gray-200">
              <p className="text-lg text-gray-600 mb-4">No events created yet.</p>
              <Link to="/admin/event/create" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                Create Your First Event
              </Link>
            </div>
          ) : (
            events.map(event => (
              <div 
                key={event.id} 
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200 flex flex-col"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 md:p-6">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="text-lg md:text-xl font-bold line-clamp-2 flex-1">{event.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 md:p-6 flex-grow">
                  <div className="space-y-3 mb-6 text-sm md:text-base">
                    <p className="text-gray-700"><strong>📍 Location:</strong> {event.location}</p>
                    <p className="text-gray-700"><strong>👥 Capacity:</strong> {event.registered_count}/{event.capacity}</p>
                    <p className="text-gray-700"><strong>🕐 Starts:</strong> {formatDate(event.start_date)}</p>
                    <p className="text-gray-700"><strong>🕐 Ends:</strong> {formatDate(event.end_date)}</p>
                  </div>

                  {/* Capacity Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full" 
                      style={{width: `${Math.min((event.registered_count / event.capacity) * 100, 100)}%`}}
                    ></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 md:p-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-2">
                  <Link 
                    to={`/admin/event/${event.slug}`} 
                    className="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded transition-colors duration-300 text-sm md:text-base"
                  >
                    View
                  </Link>
                  <Link 
                    to={`/admin/event/${event.slug}/edit`} 
                    className="flex-1 text-center bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-3 rounded transition-colors duration-300 text-sm md:text-base"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDeleteEvent(event.slug)} 
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded transition-colors duration-300 text-sm md:text-base"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
