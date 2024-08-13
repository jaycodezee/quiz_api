"use client"
import { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import QuestionSection from './QuestionSection';
import OptionButton from './OptionButton';
import styles from '../styles/Quiz.module.css';

const QuizContainer = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(60000); 
  const [timerActive, setTimerActive] = useState<boolean>(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/questions');
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      }
    };
    fetchQuestions();
  }, []);

  const handleOptionClick = (option: string) => {
    if (!timerActive) return;

    const currentQuestion = questions[currentIndex];
    if (option === currentQuestion.answer) {
      setScore(score + 1);
      setFeedback('Correct! Good job.');
    } else {
      setFeedback('Incorrect. Try again.');
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setFeedback(null);
      } else {
        setQuizCompleted(true);
        setTimerActive(false);
      }
    }, 600);
  };

  useEffect(() => {
    if (timeRemaining <= 0) {
      setQuizCompleted(true);
      setTimerActive(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prevTime => prevTime - 1000);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, timerActive]);


const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000); 
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};


  const currentQuestion = questions[currentIndex];

  return (
    <div className={styles.quizContainer}>
      <Header />
      {quizCompleted ? (
        <div className={styles.thankYouSection}>
          <h2>Thank You for Taking the Quiz!</h2>
          <p>Your final score is: {score}/{questions.length}</p>
        </div>
      ) : (
        <>
          <div className={styles.scoreSection}>
            <p>Time Remaining: {formatTime(timeRemaining)}</p>
            <p>Score: {score}</p>
          </div>
          {currentQuestion ? (
            <>
              <QuestionSection question={currentQuestion.question} />
              <div className={styles.optionsContainer}>
                {currentQuestion.options.map((option: string, index: number) => (
                  <OptionButton key={index} option={option} onClick={handleOptionClick} />
                ))}
              </div>
              {feedback && (
                <div className={styles.feedbackSection}>
                  <p>{feedback}</p>
                </div>
              )}
            </>
          ) : (
            <p>Loading questions...</p>
          )}
        </>
      )}
    </div>
  );
};

export default QuizContainer;
