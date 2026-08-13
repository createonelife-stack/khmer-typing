require('dotenv').config();
const mongoose = require('mongoose');
const Quiz = require('./models/Quiz');
const quiz5Data = require('./seed_quiz_5_data');

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const newQuiz = new Quiz({
      title: "កាលវិភាគនៃការបោះឆ្នោត (២០២៦-២០២៧)",
      description: "កម្រងសំណួរអំពីកាលបរិច្ឆេទសំខាន់ៗ ទាក់ទងនឹងការចុះឈ្មោះ និងការបោះឆ្នោត ២០២៦-២០២៧។",
      questions: quiz5Data,
      isLocked: false
    });

    await newQuiz.save();
    console.log('Successfully seeded Quiz 5: កាលវិភាគនៃការបោះឆ្នោត (២០២៦-២០២៧)');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seed();
