import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import QuizQuestion from '@/app/models/Question';

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGODB_URI!);
};
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await connectToDatabase();
    const questions = await QuizQuestion.findById(id);

    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quiz questions' }, { status: 500 });
  }
}


export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const { id } = params;


    const question = await QuizQuestion.findById(id);
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    await QuizQuestion.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Question deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete quiz question' }, { status: 500 });
  }
}
