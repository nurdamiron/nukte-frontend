import { Container, Paper, Title, Text, PasswordInput, Button, Stack, Alert, Center } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconLock, IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authService } from '../../services/auth.service';
import { PasswordStrengthMeter } from '../../components/auth/PasswordStrengthMeter';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setError('Отсутствует токен для сброса пароля');
      return;
    }
    setToken(tokenParam);
  }, [searchParams]);

  const form = useForm({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validate: {
      password: (value: string) => {
        if (value.length < 8) return 'Пароль должен быть минимум 8 символов';
        if (!/(?=.*[a-z])/.test(value)) return 'Пароль должен содержать строчные буквы';
        if (!/(?=.*[A-Z])/.test(value)) return 'Пароль должен содержать заглавные буквы';
        if (!/(?=.*\d)/.test(value)) return 'Пароль должен содержать цифры';
        if (!/(?=.*[@$!%*?&])/.test(value)) return 'Пароль должен содержать специальные символы (@$!%*?&)';
        return null;
      },
      confirmPassword: (value: string, values: { password: string; confirmPassword: string }) => 
        value === values.password ? null : 'Пароли не совпадают',
    },
  });

  const handleSubmit = async (values: { password: string; confirmPassword: string }) => {
    if (!token) {
      setError('Отсутствует токен для сброса пароля');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.resetPassword(token, values.password);
      
      setSuccess(true);
      
      notifications.show({
        title: 'Пароль изменен',
        message: response.message,
        color: 'green',
        icon: <IconCheck size={16} />,
      });

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка при сбросе пароля';
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
                Пароль успешно изменен!
              </Title>
              
              <Text c="dimmed" size="sm" ta="center">
                Ваш пароль был успешно изменен. Вы будете перенаправлены на страницу входа через несколько секунд.
              </Text>
              
              <Button
                onClick={() => navigate('/login')}
                mt="md"
              >
                Перейти к входу
              </Button>
            </Stack>
          </Paper>
        </Center>
      </Container>
    );
  }

  if (!token) {
    return (
      <Container size={420} my={80}>
        <Center>
          <Paper withBorder shadow="md" p={30} radius="md" w="100%">
            <Stack gap="md" align="center">
              <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
                Ссылка для сброса пароля недействительна или истекла
              </Alert>
              
              <Button
                onClick={() => navigate('/forgot-password')}
                mt="md"
              >
                Запросить новую ссылку
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
        Создать новый пароль
      </Title>
      <Text c="dimmed" size="sm" ta="center" mb={30}>
        Введите новый пароль для вашего аккаунта
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
              <PasswordInput
                label="Новый пароль"
                placeholder="Введите новый пароль"
                leftSection={<IconLock size={16} />}
                required
                disabled={loading}
                {...form.getInputProps('password')}
              />
              
              {form.values.password && (
                <PasswordStrengthMeter password={form.values.password} />
              )}

              <PasswordInput
                label="Подтвердите новый пароль"
                placeholder="Повторите новый пароль"
                leftSection={<IconLock size={16} />}
                required
                disabled={loading}
                {...form.getInputProps('confirmPassword')}
              />

              <Button 
                fullWidth 
                mt="md" 
                type="submit"
                loading={loading}
                disabled={loading}
              >
                Изменить пароль
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
}