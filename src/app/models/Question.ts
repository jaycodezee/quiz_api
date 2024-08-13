import mongoose, { Schema, Document } from 'mongoose';


const quizQuestionSchema = new Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  answer: { type: String, required: true },
});

const QuizQuestion = mongoose.models.QuizQuestion || mongoose.model('QuizQuestion', quizQuestionSchema);

export default QuizQuestion;
