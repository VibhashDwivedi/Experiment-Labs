import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { auth } from '../../firebase';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal, Button, Form } from 'react-bootstrap';

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({ title: '', date: '', description: '' });

  useEffect(() => {
    const fetchEvents = async () => {
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        const response = await axios.get('http://localhost:3001/events', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(response.data);
      }
      setLoading(false);
    };

    fetchEvents();

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchEvents();
      }
    });

    return () => unsubscribe();
  }, [currentEvent]);

  const handleSelectSlot = ({ start }) => {
    setCurrentEvent({  title: '', date: start, description: '' });
    setShowModal(true);
  };

  const handleSelectEvent = (event) => {
    setCurrentEvent(event);
    setShowModal(true);
  };

  const handleSaveEvent = async () => {
    const token = await auth.currentUser.getIdToken();
    const formattedEvent = {
      ...currentEvent,
      date: moment(currentEvent.date).toISOString()
    };
    if (currentEvent.id) {
      // Update event
      await axios.put(`http://localhost:3001/events/${currentEvent.id}`, formattedEvent, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } else {
      // Create event
      const response = await axios.post('http://localhost:3001/events', formattedEvent, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents([...events, response.data]);
    }
    setShowModal(false);
    setCurrentEvent({  title: '', date: '', description: '' });
  };

  const handleDeleteEvent = async () => {
    const token = await auth.currentUser.getIdToken();
    await axios.delete(`http://localhost:3001/events/${currentEvent.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setEvents(events.filter(event => event.id !== currentEvent.id));
    setShowModal(false);
    setCurrentEvent({  title: '', date: '', description: '' });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="date"
        endAccessor="date"
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
      />
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentEvent.id ? 'Edit Event' : 'Create Event'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={currentEvent.title}
                onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="datetime-local"
                value={currentEvent.date ? moment(currentEvent.date).format('YYYY-MM-DDTHH:mm') : ''}
                onChange={(e) => setCurrentEvent({ ...currentEvent, date: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={currentEvent.description}
                onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {currentEvent.id && (
            <Button variant="danger" onClick={handleDeleteEvent}>
              Delete
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEvent}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CalendarComponent;