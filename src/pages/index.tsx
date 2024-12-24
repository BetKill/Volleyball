// src/pages/index.tsx
import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
    const [leftScore, setLeftScore] = useState(0);
    const [rightScore, setRightScore] = useState(0);
    const [winner, setWinner] = useState<string | null>(null);

    const handleScoreChange = (team: string, action: 'add' | 'subtract') => {
        if (winner) return; // Останавливаем изменение счета, если есть победитель

        let newLeftScore = leftScore;
        let newRightScore = rightScore;

        if (team === 'left') {
            if (action === 'add') {
                newLeftScore = leftScore + 1;
            } else if (action === 'subtract' && leftScore > 0) {
                newLeftScore = leftScore - 1;
            }
        } else if (team === 'right') {
            if (action === 'add') {
                newRightScore = rightScore + 1;
            } else if (action === 'subtract' && rightScore > 0) {
                newRightScore = rightScore - 1;
            }
        }

        // Обновляем счет
        setLeftScore(newLeftScore);
        setRightScore(newRightScore);

        // Проверка на победу
        if (
            (newLeftScore >= 25 && newLeftScore - newRightScore >= 2) ||
            (newRightScore >= 25 && newRightScore - newLeftScore >= 2)
        ) {
            setWinner(team === 'left' ? 'Левая команда' : 'Правая команда');
        }
    };

    const resetGame = () => {
        setLeftScore(0);
        setRightScore(0);
        setWinner(null);
    };

    return (
        <div className={styles.App}>
            <div className={styles.header}>
                <div className={styles['total-score']}>
                    {leftScore} - {rightScore}
                </div>
                <button className={styles['reset-btn']} onClick={resetGame}>
                    Перезапустить
                </button>
            </div>

            <div className={styles.court}>
                <div
                    className={`${styles['team-area']} ${styles.left}`}
                    onClick={(e) => {
                        const { clientX, target } = e;
                        // @ts-ignore
                        const middleX = target.offsetLeft + target.offsetWidth / 2;
                        if (clientX < middleX) {
                            handleScoreChange('left', 'subtract');
                        } else {
                            handleScoreChange('left', 'add');
                        }
                    }}
                >
                    <span className={styles.score}>{leftScore}</span>
                </div>

                <div
                    className={`${styles['team-area']} ${styles.right}`}
                    onClick={(e) => {
                        const { clientX, target } = e;
                        // @ts-ignore
                        const middleX = target.offsetLeft + target.offsetWidth / 2;
                        if (clientX < middleX) {
                            handleScoreChange('right', 'subtract');
                        } else {
                            handleScoreChange('right', 'add');
                        }
                    }}
                >
                    <span className={styles.score}>{rightScore}</span>
                </div>
            </div>

            {winner && (
                <div className={styles['winner-banner']}>
                    <h2>{winner} выиграла!</h2>
                </div>
            )}
        </div>
    );
}
