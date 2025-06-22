import { Container, Paper, Title, Text, TextInput, PasswordInput, Button, Group, Anchor, Stack, Divider, Center } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconMail, IconLock, IconBrandGoogle, IconPhone } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const navigate = useNavigate();
  
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Неверный формат email'),
      password: (value) => (value.length >= 6 ? null : 'Пароль должен быть минимум 6 символов'),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log(values);
    // TODO: Implement login
    navigate('/');
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
          <Button
            fullWidth
            variant="default"
            leftSection={<IconBrandGoogle size={18} />}
          >
            Войти через Google
          </Button>

          <Button
            fullWidth
            variant="default"
            leftSection={<IconPhone size={18} />}
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
                {...form.getInputProps('email')}
              />

              <PasswordInput
                label="Пароль"
                placeholder="Ваш пароль"
                leftSection={<IconLock size={16} />}
                {...form.getInputProps('password')}
              />

              <Group justify="space-between" mt="xs">
                <Anchor
                  onClick={() => console.log('Forgot password')}
                  size="sm"
                >
                  Забыли пароль?
                </Anchor>
              </Group>

              <Button fullWidth mt="xl" type="submit">
                Войти
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
}