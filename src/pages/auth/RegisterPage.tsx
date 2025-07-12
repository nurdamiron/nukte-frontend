import { Container, Paper, Title, Text, TextInput, PasswordInput, Button, Group, Anchor, Stack, Divider, Radio, Checkbox, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconMail, IconLock, IconUser, IconPhone, IconBrandGoogle, IconAlertCircle } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { RegisterRequest } from '../../types/api.types';
import { PasswordStrengthMeter } from '../../components/auth/PasswordStrengthMeter';

interface RegisterFormValues extends RegisterRequest {
  confirmPassword: string;
  agreeToTerms: boolean;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<RegisterFormValues>({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'filmmaker',
      agreeToTerms: false,
    },
    validate: {
      name: (value) => (value.length >= 2 ? null : 'Имя должно быть минимум 2 символа'),
      email: (value) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Неверный формат email'),
      phone: (value) => (!value || value.length >= 10 ? null : 'Неверный формат телефона'),
      password: (value) => {
        if (value.length < 8) return 'Пароль должен быть минимум 8 символов';
        if (!/(?=.*[a-z])/.test(value)) return 'Пароль должен содержать строчные буквы';
        if (!/(?=.*[A-Z])/.test(value)) return 'Пароль должен содержать заглавные буквы';
        if (!/(?=.*\d)/.test(value)) return 'Пароль должен содержать цифры';
        if (!/(?=.*[@$!%*?&])/.test(value)) return 'Пароль должен содержать специальные символы (@$!%*?&)';
        return null;
      },
      confirmPassword: (value, values) => 
        value === values.password ? null : 'Пароли не совпадают',
      agreeToTerms: (value) => (value ? null : 'Необходимо принять условия'),
    },
  });

  const handleSubmit = async (values: RegisterFormValues) => {
    setLoading(true);
    setError(null);
    
    try {
      const { confirmPassword, agreeToTerms, ...registerData } = values;
      
      // Only include phone if it's provided
      if (!registerData.phone) {
        delete registerData.phone;
      }
      
      await register(registerData as RegisterRequest);
      
      notifications.show({
        title: 'Регистрация успешна',
        message: 'Добро пожаловать в Nukte!',
        color: 'green',
      });
      
      navigate('/');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка при регистрации';
      setError(errorMessage);
      
      // Handle validation errors
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        Object.keys(errors).forEach((field) => {
          form.setFieldError(field, errors[field][0]);
        });
      }
      
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
    <Container size={460} my={40}>
      <Title ta="center" order={2} mb="md">
        Создать аккаунт
      </Title>
      <Text c="dimmed" size="sm" ta="center" mb={30}>
        Уже есть аккаунт?{' '}
        <Anchor size="sm" onClick={() => navigate('/login')}>
          Войти
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
            Регистрация через Google
          </Button>

          <Divider label="или" labelPosition="center" my="sm" />

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Имя"
                placeholder="Ваше имя"
                leftSection={<IconUser size={16} />}
                required
                disabled={loading}
                {...form.getInputProps('name')}
              />

              <TextInput
                label="Email"
                placeholder="your@email.com"
                leftSection={<IconMail size={16} />}
                required
                disabled={loading}
                {...form.getInputProps('email')}
              />

              <TextInput
                label="Телефон"
                placeholder="+7 (777) 123-45-67"
                leftSection={<IconPhone size={16} />}
                disabled={loading}
                {...form.getInputProps('phone')}
              />

              <PasswordInput
                label="Пароль"
                placeholder="Придумайте пароль"
                leftSection={<IconLock size={16} />}
                required
                disabled={loading}
                {...form.getInputProps('password')}
              />
              
              {form.values.password && (
                <PasswordStrengthMeter password={form.values.password} />
              )}

              <PasswordInput
                label="Подтвердите пароль"
                placeholder="Повторите пароль"
                leftSection={<IconLock size={16} />}
                required
                disabled={loading}
                {...form.getInputProps('confirmPassword')}
              />

              <Radio.Group
                label="Тип аккаунта"
                required
                {...form.getInputProps('role')}
              >
                <Stack gap="xs" mt="xs">
                  <Radio 
                    value="filmmaker" 
                    label="Я снимаю (фотограф, режиссёр, продюсер)" 
                    disabled={loading} 
                  />
                  <Radio 
                    value="location_owner" 
                    label="У меня есть локация для съёмок" 
                    disabled={loading} 
                  />
                  <Radio 
                    value="both" 
                    label="И то, и другое" 
                    disabled={loading} 
                  />
                </Stack>
              </Radio.Group>

              <Checkbox
                label={
                  <Text size="sm">
                    Я принимаю{' '}
                    <Anchor size="sm" onClick={() => navigate('/terms')}>
                      условия использования
                    </Anchor>
                    {' '}и{' '}
                    <Anchor size="sm" onClick={() => navigate('/privacy')}>
                      политику конфиденциальности
                    </Anchor>
                  </Text>
                }
                disabled={loading}
                {...form.getInputProps('agreeToTerms', { type: 'checkbox' })}
              />

              <Button 
                fullWidth 
                mt="xl" 
                type="submit"
                loading={loading}
                disabled={loading}
              >
                Зарегистрироваться
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
}