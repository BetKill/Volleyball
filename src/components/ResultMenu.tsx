// ResultMenu.tsx
import React from 'react';
import styles from '../styles/ResultMenu.module.css';

// Define the prop types
interface ResultMenuProps {
    handleReset: () => void;  // Type for the reset function
    winner: string;            // Type for the winner (string)
}

const ResultMenu: React.FC<ResultMenuProps> = ({ handleReset, winner }) => {
    return (
        <div>
            <div className={styles['modal-container']}>
                <div className={styles['modal-content']}>
                    <p>{winner}</p>
                    <button className={styles.button} onClick={handleReset}>Заново</button>
                </div>
            </div>
        </div>
    );
}

export default ResultMenu;
