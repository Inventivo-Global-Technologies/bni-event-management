// Utility functions

export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export const formatDateInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16);
};

export const isEventOngoing = (event) => {
  const now = new Date();
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  return now >= startDate && now <= endDate;
};

export const isEventUpcoming = (event) => {
  const now = new Date();
  const startDate = new Date(event.start_date);
  return now < startDate;
};

export const isEventCompleted = (event) => {
  const now = new Date();
  const endDate = new Date(event.end_date);
  return now > endDate;
};

export const getEventStatus = (event) => {
  if (isEventOngoing(event)) return 'ongoing';
  if (isEventUpcoming(event)) return 'upcoming';
  return 'completed';
};
