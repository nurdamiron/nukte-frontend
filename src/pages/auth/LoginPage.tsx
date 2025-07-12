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
      email: (value) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Неверный формат email'),
      password: (value) => (value.length >= 1 ? null : 'Введите пароль'),
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
      <Stack align="center" mb="xl">
        <Title ta="center" order={1} mb="md" style={{ 
          background: 'linear-gradient(45deg, var(--mantine-color-violet-6), var(--mantine-color-purple-6))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: '2.5rem',
          fontWeight: 800,
        }}>
          С возвращением!
        </Title>
        <Text c="dimmed" size="lg" ta="center" mb={30} style={{ maxWidth: 300 }}>
          Еще нет аккаунта?{' '}
          <Anchor size="lg" onClick={() => navigate('/register')} style={{ fontWeight: 600 }}>
            Зарегистрироваться
          </Anchor>
        </Text>
      </Stack>

      <Paper 
        withBorder 
        shadow="xl" 
        p={40} 
        radius="xl"
        style={{
          backdropFilter: 'blur(20px)',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Stack gap="md">
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            variant="light"
            leftSection={<IconBrandGoogle size={18} />}
            disabled={loading}
            size="md"
            radius="xl"
            style={{
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            Войти через Google
          </Button>

          <Button
            fullWidth
            variant="light"
            leftSection={<IconPhone size={18} />}
            disabled={loading}
            size="md"
            radius="xl"
            style={{
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            Войти по номеру телефона
          </Button>

          <Divider label="или" labelPosition="center" my="sm" />

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="lg">
              <TextInput
                label="Email"
                placeholder="your@email.com"
                leftSection={<IconMail size={16} />}
                disabled={loading}
                size="md"
                radius="xl"
                {...form.getInputProps('email')}
              />

              <PasswordInput
                label="Пароль"
                placeholder="Ваш пароль"
                leftSection={<IconLock size={16} />}
                disabled={loading}
                size="md"
                radius="xl"
                {...form.getInputProps('password')}
              />

              <Group justify="flex-end" mt="xs">
                <Anchor
                  onClick={() => navigate('/forgot-password')}
                  size="sm"
                  style={{ fontWeight: 600 }}
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
                size="lg"
                radius="xl"
                variant="gradient"
                gradient={{ from: 'violet', to: 'purple', deg: 45 }}
                style={{
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(139, 69, 199, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '';
                }}
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