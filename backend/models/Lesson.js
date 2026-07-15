const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  words: {
    type: [String],
    required: true,
    default: []
  }
}, { timestamps: true });

// We use virtual 'id' instead of _id for frontend compatibility
lessonSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
lessonSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Lesson', lessonSchema);
