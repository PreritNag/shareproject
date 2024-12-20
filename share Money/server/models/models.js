const { createHmac, randomBytes } = require("crypto");
const { Schema, model } = require("mongoose");
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

// Middleware to hash the password before saving
userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = randomBytes(16).toString('hex');
  this.password = createHmac('sha256', salt).update(this.password).digest('hex');
  this.salt = salt;
  next();
});

// Static method to verify password and generate token
userSchema.statics.matchPasswordandGenerateToken = async function (name, password) {
  const user = await this.findOne({ name });
  if (!user) {
    throw new Error('User not found');
  }

  const salt = user.salt;
  const hashedPassword = user.password;
  const userProvidedHash = createHmac('sha256', salt).update(password).digest('hex');

  if (userProvidedHash !== hashedPassword) {
    throw new Error('Password does not match');
  }

  // Generate a token for the user
  const token = createTokenuser(user);
  return token;
};

// Create the User model
const User = model("user", userSchema);

module.exports = User;
