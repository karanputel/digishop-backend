const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error", err));

// Login API
app.post('/api/login', async (req, res) => {
  const { name, email, picture } = req.body;
  let user = await User.findOne({ email });

  if (!user) {
    user = new User({ name, email, picture, unlocked: false });
    await user.save();
  }

  res.json({ success: true, unlocked: user.unlocked });
});

// Payment Unlock API
app.post('/api/unlock', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ success: false });

  user.unlocked = true;
  await user.save();

  res.json({ success: true });
});

// Status Check API
app.post('/api/status', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  res.json({ unlocked: user?.unlocked || false });
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
