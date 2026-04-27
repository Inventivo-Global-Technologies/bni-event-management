import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventsAPI } from '../../services/api';
import { formatDate, getEventStatus } from '../../utils/helpers';

function PublicEventDetail() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvent();
  }, [slug]);

  const fetchEvent = async () => {
    try {
      const response = await eventsAPI.getBySlug(slug);
      setEvent(response.data);
    } catch (err) {
      setError('Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 border border-blue-300';
      case 'ongoing': return 'bg-green-100 text-green-800 border border-green-300';
      case 'completed': return 'bg-gray-100 text-gray-800 border border-gray-300';
      default: return 'bg-red-100 text-red-800 border border-red-300';
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Loading event...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-4 rounded">
          <p className="font-semibold text-lg">{error}</p>
        </div>
      </div>
    </div>
  );
  
  if (!event) return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 px-4 py-4 rounded">
          <p className="font-semibold text-lg">Event not found</p>
        </div>
      </div>
    </div>
  );

  const remainingCapacity = event.capacity - event.registered_count;
  const eventStatus = getEventStatus(event);
  const canRegister = remainingCapacity > 0 && eventStatus !== 'completed';

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-semibold">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Events
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Poster Section */}
          {event.poster_url && (
            <div className="md:col-span-1">
              <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg bg-gray-200">
                <img 
                  src={event.poster_url} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Details Section */}
          <div className={`md:col-span-${event.poster_url ? 2 : 3}`}>
            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{event.title}</h1>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(eventStatus)}`}>
                  {eventStatus.charAt(0).toUpperCase() + eventStatus.slice(1)}
                </span>
              </div>
            </div>

            {/* Info Groups */}
            <div className="space-y-6 mb-8">
              {/* Location */}
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">📍 Location</h3>
                <p className="text-gray-700 text-base md:text-lg">{event.location}</p>
              </div>

              {/* Date & Time */}
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">📅 Date & Time</h3>
                <div className="space-y-2">
                  <p className="text-gray-700 text-base md:text-lg"><strong>Start:</strong> {formatDate(event.start_date)}</p>
                  <p className="text-gray-700 text-base md:text-lg"><strong>End:</strong> {formatDate(event.end_date)}</p>
                </div>
              </div>

              {/* Capacity */}
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">👥 Capacity</h3>
                <p className="text-gray-700 text-base md:text-lg mb-3">{event.registered_count}/{event.capacity} registered</p>
                <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-500" 
                    style={{width: `${Math.min((event.registered_count / event.capacity) * 100, 100)}%`}}
                  ></div>
                </div>
                {!canRegister && (
                  <p className="text-red-600 font-semibold text-base mt-3">
                    {eventStatus === 'completed' ? '❌ This event has been completed' : '⚠️ This event is full'}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">📝 Description</h3>
                <p className="text-gray-700 text-base md:text-lg leading-relaxed whitespace-pre-wrap">{event.description}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              {canRegister ? (
                <Link 
                  to={`/event/${slug}/register`} 
                  className="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 md:py-4 rounded-lg transition-colors duration-300 text-base md:text-lg"
                >
                  ✅ Register Now
                </Link>
              ) : (
                <button 
                  disabled 
                  className="flex-1 bg-gray-400 text-gray-600 font-bold py-3 md:py-4 rounded-lg cursor-not-allowed text-base md:text-lg"
                >
                  {eventStatus === 'completed' ? 'Event Completed' : 'Event is Full'}
                </button>
              )}
              <Link 
                to="/" 
                className="flex-1 text-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 md:py-4 rounded-lg transition-colors duration-300 text-base md:text-lg"
              >
                ← Back
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicEventDetail;
