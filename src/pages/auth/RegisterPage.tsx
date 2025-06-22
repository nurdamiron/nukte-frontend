import { Container, Paper, Title, Text, TextInput, PasswordInput, Button, Group, Anchor, Stack, Divider, Radio, Checkbox } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconMail, IconLock, IconUser, IconPhone, IconBrandGoogle } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

export function RegisterPage() {
  const navigate = useNavigate();
  
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'guest',
      agreeToTerms: false,
    },
    validate: {
      name: (value) => (value.length >= 2 ? null : 'Имя должно быть минимум 2 символа'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Неверный формат email'),
      phone: (value) => (value.length >= 10 ? null : 'Неверный формат телефона'),
      password: (value) => (value.length >= 6 ? null : 'Пароль должен быть минимум 6 символов'),
      confirmPassword: (value, values) => 
        value === values.password ? null : 'Пароли не совпадают',
      agreeToTerms: (value) => (value ? null : 'Необходимо принять условия'),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log(values);
    // TODO: Implement registration
    navigate('/');
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
          <Button
            fullWidth
            variant="default"
            leftSection={<IconBrandGoogle size={18} />}
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
                {...form.getInputProps('name')}
              />

              <TextInput
                label="Email"
                placeholder="your@email.com"
                leftSection={<IconMail size={16} />}
                {...form.getInputProps('email')}
              />

              <TextInput
                label="Телефон"
                placeholder="+7 (777) 123-45-67"
                leftSection={<IconPhone size={16} />}
                {...form.getInputProps('phone')}
              />

              <PasswordInput
                label="Пароль"
                placeholder="Придумайте пароль"
                leftSection={<IconLock size={16} />}
                {...form.getInputProps('password')}
              />

              <PasswordInput
                label="Подтвердите пароль"
                placeholder="Повторите пароль"
                leftSection={<IconLock size={16} />}
                {...form.getInputProps('confirmPassword')}
              />

              <Radio.Group
                label="Тип аккаунта"
                {...form.getInputProps('role')}
              >
                <Stack gap="xs" mt="xs">
                  <Radio value="guest" label="Я ищу локации для съёмок" />
                  <Radio value="host" label="Я хочу сдавать локации" />
                  <Radio value="both" label="И то, и другое" />
                </Stack>
              </Radio.Group>

              <Checkbox
                label={
                  <Text size="sm">
                    Я принимаю{' '}
                    <Anchor size="sm" onClick={() => console.log('Terms')}>
                      условия использования
                    </Anchor>
                    {' '}и{' '}
                    <Anchor size="sm" onClick={() => console.log('Privacy')}>
                      политику конфиденциальности
                    </Anchor>
                  </Text>
                }
                {...form.getInputProps('agreeToTerms', { type: 'checkbox' })}
              />

              <Button fullWidth mt="xl" type="submit">
                Зарегистрироваться
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
}