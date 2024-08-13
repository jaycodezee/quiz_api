import styles from '../styles/Quiz.module.css';

interface OptionButtonProps {
  option: string;
  onClick: (option: string) => void;
}

const OptionButton = ({ option, onClick }: OptionButtonProps) => {
  return (
    <button className={styles.optionButton} onClick={() => onClick(option)}>
      {option}
    </button>
  );
};

export default OptionButton;
