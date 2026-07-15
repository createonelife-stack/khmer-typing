const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  score: Number,
  wpm: Number,
  accuracy: Number,
  correctWords: Number,
  totalWords: Number,
  timeUsed: Number,
  bonus: Number
}, { timestamps: true });

// We use virtual 'id' instead of _id for frontend compatibility
resultSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
resultSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Result', resultSchema);
