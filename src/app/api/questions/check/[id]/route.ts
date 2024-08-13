import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import QuizQuestion from '@/app/models/Question';

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGODB_URI!);
};

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const { id } = params;

    const body = await request.json();

    if (!body.answer) {
      return NextResponse.json({ error: 'Answer is required' }, { status: 400 });
    }


    const question = await QuizQuestion.findById(id);
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }


    const isCorrect = question.answer === body.answer;

    return NextResponse.json({ isCorrect }, { status: 200 });
  } catch (error) {
    console.error('Error checking the answer:', error); 
    return NextResponse.json({ error: 'Failed to check the answer' }, { status: 500 });
  }
}
