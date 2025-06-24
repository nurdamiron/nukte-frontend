import { Container, Paper, Title, Text, TextInput, Button, Stack, Alert, Center, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconMail, IconAlertCircle, IconCheck, IconRefresh } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authService } from '../../services/auth.service';
import { useAuth } from '../../contexts/AuthContext';

export function EmailVerificationPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (user?.verified) {
      navigate('/');
      return;
    }

    // Start countdown timer for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [user, navigate, countdown]);

  const form = useForm({
    initialValues: {
      code: '',
    },
    validate: {
      code: (value: string) => (value.length === 6 ? null : 'Код должен содержать 6 цифр'),
    },
  });

  const handleSubmit = async (values: { code: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.verifyEmail(values.code);
      
      // Update user in context
      updateUser(response.user);
      
      setSuccess(true);
      
      notifications.show({
        title: 'Email подтвержден',
        message: response.message,
        color: 'green',
        icon: <IconCheck size={16} />,
      });

      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка при подтверждении email';
      setError(errorMessage);
      
      notifications.show({
        title: 'Ошибка',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setSendingCode(true);
    setError(null);
    
    try {
      const response = await authService.sendVerificationCode();
      
      notifications.show({
        title: 'Код отправлен',
        message: response.message,
        color: 'green',
      });

      // Start 60 second countdown
      setCountdown(60);
      form.setFieldValue('code', '');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка при отправке кода';
      setError(errorMessage);
      
      notifications.show({
        title: 'Ошибка',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setSendingCode(false);
    }
  };

  if (success) {
    return (
      <Container size={420} my={80}>
        <Center>
          <Paper withBorder shadow="md" p={30} radius="md" w="100%">
            <Stack gap="md" align="center">
              <div style={{ 
                backgroundColor: '#e7f5e7', 
                borderRadius: '50%', 
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <IconCheck size={40} color="#28a745" />
              </div>
              
              <Title order={3} ta="center">
                Email подтвержден!
              </Title>
              
              <Text c="dimmed" size="sm" ta="center">
                Ваш email адрес успешно подтвержден. Теперь вы можете в полной мере пользоваться всеми возможностями Nukte.
              </Text>
              
              <Button
                onClick={() => navigate('/')}
                mt="md"
              >
                Перейти к главной
              </Button>
            </Stack>
          </Paper>
        </Center>
      </Container>
    );
  }

  return (
    <Container size={420} my={80}>
      <Title ta="center" order={2} mb="md">
        Подтвердите email
      </Title>
      <Text c="dimmed" size="sm" ta="center" mb={30}>
        Мы отправили 6-значный код подтверждения на <strong>{user?.email}</strong>
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md">
        <Stack gap="md">
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
              {error}
            </Alert>
          )}

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Код подтверждения"
                placeholder="123456"
                leftSection={<IconMail size={16} />}
                required
                disabled={loading}
                maxLength={6}
                style={{ textAlign: 'center' }}
                styles={{
                  input: { 
                    textAlign: 'center', 
                    fontSize: '24px', 
                    letterSpacing: '8px',
                    fontWeight: 'bold'
                  }
                }}
                {...form.getInputProps('code')}
              />

              <Button 
                fullWidth 
                mt="md" 
                type="submit"
                loading={loading}
                disabled={loading || form.values.code.length !== 6}
              >
                Подтвердить email
              </Button>
            </Stack>
          </form>

          <Group justify="center" mt="md">
            <Text size="sm" c="dimmed">
              Не получили код?
            </Text>
            <Button
              variant="subtle"
              size="sm"
              leftSection={<IconRefresh size={14} />}
              onClick={handleResendCode}
              loading={sendingCode}
              disabled={sendingCode || countdown > 0}
            >
              {countdown > 0 ? `Отправить повторно (${countdown}с)` : 'Отправить повторно'}
            </Button>
          </Group>

          <Text size="xs" c="dimmed" ta="center" mt="md">
            Проверьте папку "Спам", если не видите письмо во входящих
          </Text>

          <Center mt="md">
            <Button
              variant="subtle"
              size="sm"
              onClick={() => navigate('/')}
            >
              Пропустить пока
            </Button>
          </Center>
        </Stack>
      </Paper>
    </Container>
  );
}