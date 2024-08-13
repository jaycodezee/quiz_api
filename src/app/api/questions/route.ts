import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import QuizQuestion from '@/app/models/Question';
import Joi from 'joi';

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGODB_URI!);
};


const questionSchema = Joi.object({
  question: Joi.string().min(1).required(),
  options: Joi.array().items(Joi.string()).min(2).required(),
  answer: Joi.string().required().custom((value, helpers) => {
    
    const { options } = helpers.state.ancestors[0];
    if (!options.includes(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'Answer must be one of the options'),
});

export async function GET() {
  try {
    await connectToDatabase();
    const questions = await QuizQuestion.find({});
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quiz questions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { question, options, answer } = await request.json();
    
    
    const { error } = questionSchema.validate({ question, options, answer }, { abortEarly: false });
    if (error) {
      return NextResponse.json({ error: error.details.map(err => err.message) }, { status: 400 });
    }
    
    const existingQuestion = await QuizQuestion.findOne({ question });
    if (existingQuestion) {
      return NextResponse.json({ error: 'Question already exists' }, { status: 400 });
    }

    const newQuestion = new QuizQuestion({ question, options, answer });
    await newQuestion.save();
    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create quiz question' }, { status: 500 });
  }
}
