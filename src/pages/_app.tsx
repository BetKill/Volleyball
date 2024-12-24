import '../styles/globals.css'; // Подключение глобальных стилей
import { AppProps } from 'next/app';
import { useEffect, useRef } from 'react';
import { createAssistant, AssistantAppState } from '@salutejs/client'; // Ассистент

function MyApp({ Component, pageProps }: AppProps) {
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
        // Добавьте обработку команды, если нужно
      }
    });
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
