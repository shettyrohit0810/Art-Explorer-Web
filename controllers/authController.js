const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const crypto = require('crypto');

const generateGravatarUrl = (email) => {
  const hash = crypto.createHash('sha256').update(email.trim().toLowerCase()).digest('hex');
  return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
};

exports.register = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists.' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const profileImageUrl = generateGravatarUrl(email);
    const newUser = new User({ fullname, email, password: hashedPassword, profileImageUrl, favorites: [] });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000, sameSite: 'strict' });
    res.status(201).json({ message: 'User registered successfully', user: { fullname, email, profileImageUrl } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'All fields are required.' });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found.' });
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(400).json({ message: 'Incorrect password.' });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000, sameSite: 'strict' });
    res.status(200).json({ message: 'Login successful', user: { fullname: user.fullname, email: user.email, profileImageUrl: user.profileImageUrl, favorites: user.favorites } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out' });
};

exports.deleteAccount = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Not authenticated' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await User.findByIdAndDelete(decoded.userId);
    res.clearCookie('token');
    res.status(200).json({ message: 'Account deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.me = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(200).json({ authenticated: false });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(200).json({ authenticated: false });
    res.status(200).json({ authenticated: true, user: { fullname: user.fullname, email: user.email, profileImageUrl: user.profileImageUrl, favorites: user.favorites } });
  } catch (error) {
    console.error(error);
    res.status(200).json({ authenticated: false });
  }
};
