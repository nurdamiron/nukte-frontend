import { Container, Paper, Title, Text, TextInput, PasswordInput, Button, Group, Anchor, Stack, Divider, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconMail, IconLock, IconBrandGoogle, IconPhone, IconAlertCircle } from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LoginRequest } from '../../types/api.types';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = location.state?.from?.pathname || '/';
  
  const form = useForm<LoginRequest>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Неверный формат email'),
      password: (value) => (value.length >= 6 ? null : 'Пароль должен быть минимум 6 символов'),
    },
  });

  const handleSubmit = async (values: LoginRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      await login(values);
      
      notifications.show({
        title: 'Успешный вход',
        message: 'Добро пожаловать!',
        color: 'green',
      });
      
      navigate(from, { replace: true });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка при входе в систему';
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

  return (
    <Container size={420} my={80}>
      <Title ta="center" order={2} mb="md">
        С возвращением!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mb={30}>
        Еще нет аккаунта?{' '}
        <Anchor size="sm" onClick={() => navigate('/register')}>
          Зарегистрироваться
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md">
        <Stack gap="md">
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            variant="default"
            leftSection={<IconBrandGoogle size={18} />}
            disabled={loading}
          >
            Войти через Google
          </Button>

          <Button
            fullWidth
            variant="default"
            leftSection={<IconPhone size={18} />}
            disabled={loading}
          >
            Войти по номеру телефона
          </Button>

          <Divider label="или" labelPosition="center" my="sm" />

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Email"
                placeholder="your@email.com"
                leftSection={<IconMail size={16} />}
                disabled={loading}
                {...form.getInputProps('email')}
              />

              <PasswordInput
                label="Пароль"
                placeholder="Ваш пароль"
                leftSection={<IconLock size={16} />}
                disabled={loading}
                {...form.getInputProps('password')}
              />

              <Group justify="flex-end" mt="xs">
                <Anchor
                  onClick={() => navigate('/forgot-password')}
                  size="sm"
                >
                  Забыли пароль?
                </Anchor>
              </Group>

              <Button 
                fullWidth 
                mt="xl" 
                type="submit"
                loading={loading}
                disabled={loading}
              >
                Войти
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
}