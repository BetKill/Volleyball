import '../styles/globals.css'; // Подключение глобальных стилей
import { AppProps } from 'next/app';
import { useEffect, useRef, useState } from 'react';
import { createAssistant, AssistantAppState } from '@salutejs/client'; // Ассистент

function MyApp({ Component, pageProps }: AppProps) {
  const [leftScore, setLeftScore] = useState(0);  // Счет левой команды
  const [rightScore, setRightScore] = useState(0); // Счет правой команды

  const assistantRef = useRef<ReturnType<typeof createAssistant>>(null);
  const assistantStateRef = useRef<AssistantAppState>({});

  useEffect(() => {
    // Инициализация ассистента
    assistantRef.current = createAssistant({
      getState: () => assistantStateRef.current,
    });

    assistantRef.current.on('data', (command) => {
      if (command.type === 'smart_app_data') {
        console.log('Команда от ассистента:', command.smart_app_data);

        // Логика для увеличения очков
        if (command.smart_app_data.action === 'increase') {
          if (command.smart_app_data.team === 'left') {
            setLeftScore((prevScore) => prevScore + 1);  // Увеличиваем счет левой команды
          } else if (command.smart_app_data.team === 'right') {
            setRightScore((prevScore) => prevScore + 1);  // Увеличиваем счет правой команды
          }
        }
        // Логика для уменьшения очков
        else if (command.smart_app_data.action === 'decrease') {
          if (command.smart_app_data.team === 'left') {
            setLeftScore((prevScore) => prevScore - 1);  // Уменьшаем счет левой команды
          } else if (command.smart_app_data.team === 'right') {
            setRightScore((prevScore) => prevScore - 1);  // Уменьшаем счет правой команды
          }
        }
      }
    });

    // Нет необходимости вручную уничтожать ассистента, если он не вызывает проблем

  }, []); // Пустой массив зависимостей, инициализация будет один раз при монтировании компонента

  return (
      <div>
        <Component {...pageProps} />
        <div>
          <h1>Счет игры</h1>
          <div>
            <p>Левая команда: {leftScore}</p>
            <p>Правая команда: {rightScore}</p>
          </div>
        </div>
      </div>
  );
}

export default MyApp;
