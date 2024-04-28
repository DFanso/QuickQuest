import { AuthProvider } from './contexts/AuthContext';
import type { AppProps } from 'next/app';
import './globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;