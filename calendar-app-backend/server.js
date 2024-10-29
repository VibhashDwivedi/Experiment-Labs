const express = require('express');
const { sequelize, User, Event } = require('./models'); 
const mysql = require('mysql2');
const admin = require('firebase-admin');
const cors = require('cors');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'experiment_labs_task'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
});

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = await admin.auth().verifyIdToken(token);
  const [user] = await User.findOrCreate({ where: { uid: decodedToken.uid }, defaults: { email: decodedToken.email }, raw: true });
  req.user = user;
  next();
};

// Route to handle user login
app.post('/api/login', async (req, res) => {
  const { uid, email, token } = req.body;
  try {
    const user = await User.findOne({ where: { uid } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Failed to log in user' });
  }
});

// Route to handle user signup data
app.post('/api/users', async (req, res) => {
  const { uid, email, password } = req.body;
  try {
    const user = await User.create({ uid, email, password });
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// CRUD routes for events
app.post('/events', authenticate, async (req, res) => {
  const event = await Event.create({ ...req.body, UserId: req.user.uid });
  res.json(event);
});

app.get('/events', authenticate, async (req, res) => {
  const events = await Event.findAll({ where: { UserId: req.user.uid } });
  res.json(events);
});

app.put('/events/:id', authenticate, async (req, res) => {
  try {
    const event = await Event.findOne({ where: { id: req.params.id, UserId: req.user.uid } });
    if (!event) {
      console.log(`Event not found: id=${req.params.id}, UserId=${req.user.uid}`);
      return res.status(403).send('Forbidden');
    }
    await event.update(req.body);
    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

app.delete('/events/:id', authenticate, async (req, res) => {
  const event = await Event.findOne({ where: { id: req.params.id, UserId: req.user.uid } });
  if (!event) return res.status(403).send('Forbidden');
  await event.destroy();
  res.sendStatus(204);
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});