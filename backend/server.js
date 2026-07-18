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
const Quiz = require('./models/Quiz');
const quizzesToSeed = require('./quizDataSeed');

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
      status: 'active',
      createdBy: req.user.username
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

app.get('/api/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'admin') {
      query = { createdBy: req.user.username };
    }
    const users = await User.find(query, 'username role status loginCount createdBy _id');
    res.json(users.map(u => ({ 
      id: u._id, 
      username: u.username, 
      role: u.role, 
      status: u.status, 
      loginCount: u.loginCount || 0,
      createdBy: u.createdBy 
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stats', authenticateToken, isAdmin, async (req, res) => {
  try {
    let totalUsers = 0;
    let totalUsersByOwner = 0;
    let totalUsersByAdmin = 0;

    if (req.user.role === 'owner') {
      totalUsersByOwner = await User.countDocuments({ role: 'user', createdBy: 'owner' });
      totalUsersByAdmin = await User.countDocuments({ role: 'user', createdBy: { $ne: 'owner' } });
      totalUsers = totalUsersByOwner + totalUsersByAdmin;
    } else {
      totalUsers = await User.countDocuments({ role: 'user', createdBy: req.user.username });
    }

    const totalAdmins = await User.countDocuments({ role: { $in: ['admin', 'owner'] } });
    const totalSuspended = await User.countDocuments({ status: 'suspended' });
    const totalLessons = await Lesson.countDocuments();
    const totalQuizzes = await Quiz.countDocuments();
    res.json({ totalUsers, totalUsersByOwner, totalUsersByAdmin, totalAdmins, totalSuspended, totalLessons, totalQuizzes });
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

app.put('/api/users/:username/status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const targetUser = await User.findOne({ username: req.params.username });
    if (!targetUser) return res.status(404).json({ error: 'User not found' });

    if (req.user.role === 'admin' && targetUser.role !== 'user') {
      return res.status(403).json({ error: 'Admins can only change status of regular users' });
    }

    if (req.params.username === 'owner' && status === 'suspended') {
       return res.status(403).json({ error: 'Cannot suspend the main owner' });
    }

    targetUser.status = status;
    await targetUser.save();
    
    res.json({ success: true, user: { username: targetUser.username, status } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/users/:username', authenticateToken, isAdmin, async (req, res) => {
  try {
    const usernameToRemove = req.params.username;
    
    const targetUser = await User.findOne({ username: usernameToRemove });
    if (!targetUser) return res.status(404).json({ error: 'User not found' });

    if (req.user.role === 'admin' && targetUser.role !== 'user') {
      return res.status(403).json({ error: 'Admins can only delete regular users' });
    }

    if (usernameToRemove === 'owner' || usernameToRemove === req.user.username) {
      return res.status(403).json({ error: 'Cannot delete the main owner or yourself' });
    }

    await User.deleteOne({ username: usernameToRemove });
    
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

// ---------- quiz routes ----------

app.get('/api/quizzes', async (req, res) => {
  try {
    const quizzes = await Quiz.find({}, 'title description questions _id');
    res.json(quizzes.map(q => ({ id: q._id, title: q.title, description: q.description, questions: q.questions })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/quizzes/seed', authenticateToken, isAdmin, async (req, res) => {
  try {
    await Quiz.deleteMany({});
    await Quiz.insertMany(quizzesToSeed);
    res.json({ success: true, message: "បានបង្កើតកម្រងសំនួរដោយស្វ័យប្រវត្តិរួចរាល់!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/quizzes/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json({ id: quiz._id, title: quiz.title, description: quiz.description, questions: quiz.questions });
  } catch (error) {
    res.status(404).json({ error: 'Quiz not found' });
  }
});

app.post('/api/quizzes', authenticateToken, isAdmin, async (req, res) => {
  try {
    const newQuiz = new Quiz({
      title: "កម្រងសំនួរថ្មី",
      description: "ការពិពណ៌នាសំនួរ",
      questions: []
    });
    await newQuiz.save();
    res.json({ id: newQuiz._id, title: newQuiz.title, description: newQuiz.description, questions: newQuiz.questions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/quizzes/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, { title, description, questions }, { new: true });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json({ id: quiz._id, title: quiz.title, description: quiz.description, questions: quiz.questions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/quizzes/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


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
