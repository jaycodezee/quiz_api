import styles from '../styles/Quiz.module.css';

interface QuestionSectionProps {
  question: string;
}

const QuestionSection = ({ question }: QuestionSectionProps) => {
  return (
    <section className={styles.questionSection}>
      <h2>{question}</h2>
    </section>
  );
};

export default QuestionSection;
