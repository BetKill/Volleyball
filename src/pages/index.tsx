import { useState, useEffect, useRef } from 'react';
import styles from '../styles/Home.module.css';
import { createAssistant, AssistantAppState } from '@salutejs/client';  // Импортируем ассистента

export default function Home() {
    const [leftScore, setLeftScore] = useState(0);
    const [rightScore, setRightScore] = useState(0);
    const [winner, setWinner] = useState<string | null>(null);  // Храним победителя

    const assistantRef = useRef<ReturnType<typeof createAssistant>>(null);  // Ссылка на ассистента
    const assistantStateRef = useRef<AssistantAppState>({});  // Ссылка на состояние ассистента

    useEffect(() => {
        // Инициализация ассистента
        assistantRef.current = createAssistant({
            getState: () => assistantStateRef.current,
        });

        // Обработчик событий от ассистента
        assistantRef.current.on('data', (command) => {
            if (command.type === 'smart_app_data') {
                console.log('Команда от ассистента:', command.smart_app_data);
                const action = command.smart_app_data.action;
                const team = command.smart_app_data.team;

                // Обработка команд для добавления или вычитания очков
                if (action === 'add' || action === 'subtract') {
                    handleScoreChange(team, action);  // Обновляем счет
                }
            }
        });

        // Очистка при размонтировании компонента
        return () => {
            assistantRef.current = null;
            assistantStateRef.current = {};
        };
    }, []);

    // Логика изменения счета
    const handleScoreChange = (team: string, action: 'add' | 'subtract') => {
        if (winner) return;  // Останавливаем изменения, если есть победитель

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

        // Проверка на победу (если команда набрала 25 и разница >= 2)
        if (
            (newLeftScore >= 25 && newLeftScore - newRightScore >= 2) ||
            (newRightScore >= 25 && newRightScore - newLeftScore >= 2)
        ) {
            setWinner(team === 'left' ? 'Левая команда' : 'Правая команда');
        }
    };

    // Функция для сброса игры
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

            <div className={styles['teams-container']}>
                <div
                    className={`${styles['team-area']} ${styles.left}`}
                    onClick={(e) => {
                        const {clientX, target} = e;
                        const middleX = (target as HTMLElement).offsetLeft + (target as HTMLElement).offsetWidth / 2;
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
                        const {clientX, target} = e;
                        const middleX = (target as HTMLElement).offsetLeft + (target as HTMLElement).offsetWidth / 2;
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
