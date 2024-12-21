const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs"); // Using bcrypt for better security
const { createTokenuser } = require('../service/authentication1');

// Define the User Schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'], // Email format validation
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    default: 1000,
    required: true,
  },
  termsAccepted: {
    type: Boolean,
    required: true,
    default: false,
  },
  privacyPolicy: {
    type: Boolean,
    required: true,
    default: false,
  },
  salt: {
    type: String,
  },
});

// Middleware to hash the password before saving (Using bcrypt)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash password
    next();
  } catch (error) {
    next(error); // Pass errors to the next middleware
  }
});

// Static method to verify password and generate token
userSchema.statics.matchPasswordandGenerateToken = async function (name, password) {
  const user = await this.findOne({ name });
  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password); // Compare hashed password
  if (!isMatch) {
    throw new Error('Password does not match');
  }

  // Generate a token for the user
  const token = createTokenuser(user);
  return token;
};

// Create the User model
const User = model("user", userSchema);

module.exports = User;
