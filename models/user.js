const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  recipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ingredient"
  }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;