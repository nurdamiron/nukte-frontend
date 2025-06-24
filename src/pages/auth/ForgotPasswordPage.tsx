import { Container, Paper, Title, Text, TextInput, Button, Anchor, Stack, Alert, Center } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconMail, IconArrowLeft, IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { authService } from '../../services/auth.service';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Неверный формат email'),
    },
  });

  const handleSubmit = async (values: { email: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.forgotPassword(values.email);
      
      setSuccess(true);
      
      notifications.show({
        title: 'Письмо отправлено',
        message: response.message,
        color: 'green',
        icon: <IconCheck size={16} />,
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка при отправке письма';
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
                Письмо отправлено!
              </Title>
              
              <Text c="dimmed" size="sm" ta="center">
                Мы отправили инструкции для восстановления пароля на указанный email адрес.
                Проверьте входящие сообщения и папку "Спам".
              </Text>
              
              <Text size="xs" c="dimmed" ta="center">
                Не получили письмо? Проверьте правильность написания email адреса и попробуйте еще раз.
              </Text>
              
              <Button
                variant="light"
                leftSection={<IconArrowLeft size={16} />}
                onClick={() => navigate('/login')}
                mt="md"
              >
                Вернуться к входу
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
        Забыли пароль?
      </Title>
      <Text c="dimmed" size="sm" ta="center" mb={30}>
        Введите ваш email адрес и мы отправим инструкции для восстановления пароля
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
                label="Email"
                placeholder="your@email.com"
                leftSection={<IconMail size={16} />}
                required
                disabled={loading}
                {...form.getInputProps('email')}
              />

              <Button 
                fullWidth 
                mt="md" 
                type="submit"
                loading={loading}
                disabled={loading}
              >
                Отправить инструкции
              </Button>
              
              <Center mt="md">
                <Anchor 
                  size="sm"
                  onClick={() => navigate('/login')}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <IconArrowLeft size={14} />
                  Вернуться к входу
                </Anchor>
              </Center>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
}