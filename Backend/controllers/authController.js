const { OAuth2Client } = require('google-auth-library');
const User = require('../models/userModel');
const captainModel = require('../models/captainModel');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Verify Google ID token and sign in / create user
exports.googleAuthController = async (req, res) => {
  try {
    const { idToken, role = 'user' } = req.body;
    if (!idToken) return res.status(400).json({ message: 'idToken is required' });

    const ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const { email, name } = payload;

    if (!email) return res.status(400).json({ message: 'Google account has no email' });

    // For user role: create if not exists
    if (role === 'user') {
      let user = await User.findOne({ email });
      if (!user) {
        const names = (name || '').split(' ');
        const firstname = names.shift() || 'User';
        const lastname = names.join(' ') || '';

        user = await User.create({
          fullname: { firstname, lastname },
          email,
          // set a random password because model requires password; user will login via Google
          password: Math.random().toString(36).slice(-12)
        });
      }

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.cookie('token', token, { httpOnly: true, sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', secure: process.env.NODE_ENV === 'production' });
      const safeUser = user.toObject(); delete safeUser.password;
      return res.status(200).json({ message: 'Login successful', user: safeUser, token });
    }

    // For captain role: only allow if captain already exists (require manual signup initially)
    if (role === 'captain') {
      const captain = await captainModel.findOne({ email }).select('-password');
      if (!captain) return res.status(404).json({ message: 'Captain account not found. Please sign up via captain signup first.' });

      const token = jwt.sign({ _id: captain._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
      res.cookie('token', token, { httpOnly: true, sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', secure: process.env.NODE_ENV === 'production' });
      return res.status(200).json({ message: 'Login successful', captain, token });
    }

    return res.status(400).json({ message: 'Invalid role' });
  } catch (error) {
    console.error('Google auth error:', error);
    return res.status(500).json({ message: 'Failed to authenticate with Google', error: error.message });
  }
};
