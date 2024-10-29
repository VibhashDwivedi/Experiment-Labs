import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { auth } from '../firebase';

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const token = await auth.currentUser.getIdToken();
      const response = await axios.get('/events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(response.data);
    };

    fetchEvents();
  }, []);

  return (
    <div>
      {events.map(event => (
        <div key={event.id}>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p>{new Date(event.date).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default EventList;