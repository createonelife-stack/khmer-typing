require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const path = require('path');

const User = require('./models/User');
const Lesson = require('./models/Lesson');
const Result = require('./models/Result');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_typing_key_2026';
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("CRITICAL ERROR: MONGODB_URI is not defined in .env file.");
} else {
  mongoose.connect(MONGODB_URI)
    .then(async () => {
      console.log('Connected to MongoDB Atlas');
      // Seed default owner if no users exist
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        const owner = new User({
          username: 'owner',
          passwordHash: bcrypt.hashSync('adminpassword', 10),
          role: 'owner',
          status: 'active'
        });
        await owner.save();
        console.log('Seeded default owner account');
      }
    })
    .catch(err => console.error('MongoDB connection error:', err));
}

// Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access token missing' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

function isAdmin(req, res, next) {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'owner')) {
    return res.status(403).json({ error: 'Access denied. Requires admin or owner role.' });
  }
  next();
}

function isOwner(req, res, next) {
  if (!req.user || req.user.role !== 'owner') {
    return res.status(403).json({ error: 'Access denied. Requires owner role.' });
  }
  next();
}

// Routes
app.post('/api/auth/register', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: 'Username already exists' });

    const newUser = new User({
      username,
      passwordHash: bcrypt.hashSync(password, 10),
      role: 'user',
      status: 'active'
    });
    
    await newUser.save();

    res.json({ success: true, message: 'User created successfully', user: { username: newUser.username, role: newUser.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'Account is temporarily suspended' });
    }
    
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();
    
    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users', authenticateToken, isOwner, async (req, res) => {
  try {
    const users = await User.find({}, 'username role status loginCount _id');
    res.json(users.map(u => ({ id: u._id, username: u.username, role: u.role, status: u.status, loginCount: u.loginCount || 0 })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stats', authenticateToken, isOwner, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalAdmins = await User.countDocuments({ role: { $in: ['admin', 'owner'] } });
    const totalSuspended = await User.countDocuments({ status: 'suspended' });
    const totalLessons = await Lesson.countDocuments();
    
    res.json({ totalUsers, totalAdmins, totalSuspended, totalLessons });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/:username/role', authenticateToken, isOwner, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin', 'owner'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    if (req.params.username === 'owner' && role !== 'owner') {
       return res.status(403).json({ error: 'Cannot change role of the main owner' });
    }

    const user = await User.findOneAndUpdate({ username: req.params.username }, { role }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json({ success: true, user: { username: user.username, role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/:username/status', authenticateToken, isOwner, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    if (req.params.username === 'owner' && status === 'suspended') {
       return res.status(403).json({ error: 'Cannot suspend the main owner' });
    }

    const user = await User.findOneAndUpdate({ username: req.params.username }, { status }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json({ success: true, user: { username: user.username, status } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/users/:username', authenticateToken, isOwner, async (req, res) => {
  try {
    const usernameToRemove = req.params.username;
    if (usernameToRemove === 'owner' || usernameToRemove === req.user.username) {
      return res.status(403).json({ error: 'Cannot delete the main owner or yourself' });
    }

    const result = await User.deleteOne({ username: usernameToRemove });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'User not found' });
    
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------- lesson routes ----------

app.get('/api/lessons', async (req, res) => {
  try {
    const lessons = await Lesson.find({}, 'title words _id');
    res.json(lessons.map(l => ({ id: l._id, title: l.title, words: l.words })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/lessons/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    res.json({ id: lesson._id, title: lesson.title, words: lesson.words });
  } catch (error) {
    res.status(404).json({ error: 'Lesson not found' });
  }
});

app.post('/api/lessons', authenticateToken, isAdmin, async (req, res) => {
  try {
    const newLesson = new Lesson({
      title: "ចំណងជើងមេរៀនថ្មី",
      words: ["ពាក្យ១", "ពាក្យ២"]
    });
    await newLesson.save();
    res.json({ id: newLesson._id, title: newLesson.title, words: newLesson.words });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/lessons/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { title, words } = req.body;
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, { title, words }, { new: true });
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    res.json({ id: lesson._id, title: lesson.title, words: lesson.words });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/lessons/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await Lesson.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------- result routes ----------

app.post('/api/results', authenticateToken, async (req, res) => {
  try {
    const result = new Result({
      ...req.body,
      userId: req.user.id
    });
    await result.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/results', authenticateToken, isAdmin, async (req, res) => {
  try {
    const query = {};
    if (req.query.lessonId) query.lessonId = req.query.lessonId;
    
    const results = await Result.find(query).populate('userId', 'username');
    
    const mapped = results.map(r => ({
      id: r._id,
      lessonId: r.lessonId,
      username: r.userId ? r.userId.username : 'Unknown',
      score: r.score,
      wpm: r.wpm,
      accuracy: r.accuracy,
      correctWords: r.correctWords,
      totalWords: r.totalWords,
      timeUsed: r.timeUsed,
      bonus: r.bonus,
      timestamp: r.createdAt
    }));
    
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Single-Server setup: Serve React Frontend statically
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Fallback for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
