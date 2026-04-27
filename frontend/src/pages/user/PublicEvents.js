import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../../services/api';
import { formatDate, getEventStatus } from '../../utils/helpers';

function PublicEvents() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');
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

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(e => getEventStatus(e) === filter);

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
        <div className="mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">🎯 BNI Events</h2>
          <p className="text-lg text-gray-600">Register for our upcoming events and connect with our community</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-4 mb-8 rounded">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 md:gap-3 mb-8 md:mb-12">
          {['all', 'upcoming', 'ongoing', 'completed'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all duration-300 ${
                filter === filterType
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-500'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)} Events
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full text-center py-12 md:py-20">
              <p className="text-xl text-gray-500">No events found</p>
            </div>
          ) : (
            filteredEvents.map(event => (
              <div 
                key={event.id} 
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full"
              >
                {/* Image */}
                {event.poster_url && (
                  <div className="relative h-48 md:h-56 overflow-hidden bg-gray-200">
                    <img 
                      src={event.poster_url} 
                      alt={event.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-4 md:p-6 flex flex-col flex-grow">
                  {/* Title and Status */}
                  <div className="mb-4 flex-grow">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 line-clamp-2">{event.title}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(getEventStatus(event))}`}>
                      {getEventStatus(event).charAt(0).toUpperCase() + getEventStatus(event).slice(1)}
                    </span>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-2 mb-6 text-sm md:text-base">
                    <p className="text-gray-700"><strong>📍 Location:</strong> {event.location}</p>
                    <p className="text-gray-700"><strong>📅 Date:</strong> {formatDate(event.start_date)}</p>
                    <p className="text-gray-700">
                      <strong>👥 Capacity:</strong> {event.registered_count}/{event.capacity}
                    </p>
                  </div>

                  {/* Capacity Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full transition-all duration-300" 
                      style={{width: `${Math.min((event.registered_count / event.capacity) * 100, 100)}%`}}
                    ></div>
                  </div>

                  {/* Button */}
                  <Link 
                    to={`/event/${event.slug}`} 
                    className="w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 md:py-3 rounded-lg transition-colors duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default PublicEvents;
