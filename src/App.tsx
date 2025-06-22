import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { BrowserRouter } from 'react-router-dom';
import Router from './Router';
import { theme } from './styles/theme';
import { AuthProvider } from './contexts/AuthContext';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/carousel/styles.css';

function App() {
  return (
    <MantineProvider theme={theme}>
      <Notifications position="top-right" />
      <ModalsProvider>
        <AuthProvider>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </AuthProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;