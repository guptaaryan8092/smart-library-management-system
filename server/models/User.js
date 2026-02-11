const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    membershipNumber: {
      type: String,
      unique: true,
      sparse: true, // Allow null for admin users
    },
    membershipType: {
      type: String,
      enum: ['6months', '1year', '2years'],
      required: function() {
        return this.role === 'user';
      },
    },
    membershipExpiry: {
      type: Date,
      required: function() {
        return this.role === 'user';
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Generate membership number before saving (for new users only)
userSchema.pre('save', function (next) {
  if (this.isNew && this.role === 'user' && !this.membershipNumber) {
    // Generate membership number: MEM + timestamp + random 3 digits
    this.membershipNumber = `MEM${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

// Calculate membership expiry before saving
userSchema.pre('save', function (next) {
  if (this.isNew && this.role === 'user' && this.membershipType) {
    const now = new Date();
    switch (this.membershipType) {
      case '6months':
        this.membershipExpiry = new Date(now.setMonth(now.getMonth() + 6));
        break;
      case '1year':
        this.membershipExpiry = new Date(now.setFullYear(now.getFullYear() + 1));
        break;
      case '2years':
        this.membershipExpiry = new Date(now.setFullYear(now.getFullYear() + 2));
        break;
    }
  }
  next();
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to check if membership is active
userSchema.methods.isMembershipActive = function () {
  if (this.role === 'admin') return true;
  return this.isActive && this.membershipExpiry && new Date() <= this.membershipExpiry;
};

module.exports = mongoose.model('User', userSchema);
