import { Container, Grid, Paper, Avatar, Text, Group, Button, Stack, Tabs, TextInput, Textarea, Select, FileButton, Badge, Progress, Card, ThemeIcon, Switch, Divider, ActionIcon, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconUser, IconShieldCheck, IconBuilding, IconCalendar, IconStar, IconCamera, IconEdit, IconMail, IconPhone, IconMapPin, IconBrandGoogle, IconBell, IconLock, IconCreditCard, IconFileDescription } from '@tabler/icons-react';
import { useState } from 'react';

const mockUser = {
  id: 1,
  name: 'Данияр Касымов',
  email: 'daniyar@example.com',
  phone: '+7 (777) 123-45-67',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
  role: 'both', // guest, host, both
  verified: false,
  joinedDate: '2023-01-15',
  location: 'Алматы, Казахстан',
  bio: 'Фотограф и видеограф с 5-летним опытом. Владелец нескольких студий в Алматы.',
  stats: {
    asHost: {
      listings: 3,
      bookings: 45,
      revenue: 5240000,
      rating: 4.9,
      reviews: 28,
    },
    asGuest: {
      bookings: 12,
      spent: 840000,
      reviews: 8,
    },
  },
  verificationStatus: 'pending', // none, pending, verified
  verificationDocuments: ['ID uploaded', 'Selfie uploaded'],
};

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState<string | null>('profile');
  const [avatar, setAvatar] = useState<File | null>(null);
  
  const form = useForm({
    initialValues: {
      name: mockUser.name,
      email: mockUser.email,
      phone: mockUser.phone,
      location: mockUser.location,
      bio: mockUser.bio,
    },
  });

  const notificationForm = useForm({
    initialValues: {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: false,
      bookingReminders: true,
      reviewReminders: true,
    },
  });

  return (
    <Container size="xl" my="xl">
      <Grid gutter="xl">
        {/* Sidebar */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper shadow="sm" p="xl" radius="md" withBorder>
            <Stack align="center" mb="xl">
              <div style={{ position: 'relative' }}>
                <Avatar
                  src={avatar ? URL.createObjectURL(avatar) : mockUser.avatar}
                  size={120}
                  radius={120}
                />
                <FileButton onChange={setAvatar} accept="image/*">
                  {(props) => (
                    <ActionIcon
                      {...props}
                      pos="absolute"
                      bottom={0}
                      right={0}
                      size="lg"
                      radius="xl"
                      variant="filled"
                    >
                      <IconCamera size={20} />
                    </ActionIcon>
                  )}
                </FileButton>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <Group gap={4} justify="center">
                  <Text size="xl" fw={600}>{mockUser.name}</Text>
                  {mockUser.verified && (
                    <ThemeIcon size="sm" radius="xl" color="blue" variant="light">
                      <IconShieldCheck size={14} />
                    </ThemeIcon>
                  )}
                </Group>
                <Text size="sm" c="dimmed">
                  Участник с {new Date(mockUser.joinedDate).toLocaleDateString('ru-RU', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </Text>
              </div>

              {mockUser.verificationStatus === 'pending' && (
                <Badge color="yellow" variant="light" fullWidth>
                  Верификация на рассмотрении
                </Badge>
              )}
              {mockUser.verificationStatus === 'none' && (
                <Button variant="light" fullWidth leftSection={<IconShieldCheck size={18} />}>
                  Пройти верификацию
                </Button>
              )}
            </Stack>

            {/* Stats */}
            {mockUser.role !== 'guest' && (
              <div>
                <Text size="sm" fw={600} mb="xs">Статистика хоста</Text>
                <Stack gap="xs" mb="md">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Локаций</Text>
                    <Text size="sm" fw={500}>{mockUser.stats.asHost.listings}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Бронирований</Text>
                    <Text size="sm" fw={500}>{mockUser.stats.asHost.bookings}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Заработано</Text>
                    <Text size="sm" fw={500}>
                      {(mockUser.stats.asHost.revenue / 1000000).toFixed(1)}M ₸
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Рейтинг</Text>
                    <Group gap={4}>
                      <IconStar size={14} fill="currentColor" />
                      <Text size="sm" fw={500}>{mockUser.stats.asHost.rating}</Text>
                    </Group>
                  </Group>
                </Stack>
              </div>
            )}

            {mockUser.role !== 'host' && (
              <div>
                <Text size="sm" fw={600} mb="xs">Статистика гостя</Text>
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Бронирований</Text>
                    <Text size="sm" fw={500}>{mockUser.stats.asGuest.bookings}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Потрачено</Text>
                    <Text size="sm" fw={500}>
                      {mockUser.stats.asGuest.spent.toLocaleString()} ₸
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Отзывов оставлено</Text>
                    <Text size="sm" fw={500}>{mockUser.stats.asGuest.reviews}</Text>
                  </Group>
                </Stack>
              </div>
            )}
          </Paper>
        </Grid.Col>

        {/* Main Content */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper shadow="sm" radius="md" withBorder>
            <Tabs value={activeTab} onChange={setActiveTab}>
              <Tabs.List>
                <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>
                  Профиль
                </Tabs.Tab>
                <Tabs.Tab value="security" leftSection={<IconLock size={16} />}>
                  Безопасность
                </Tabs.Tab>
                <Tabs.Tab value="notifications" leftSection={<IconBell size={16} />}>
                  Уведомления
                </Tabs.Tab>
                <Tabs.Tab value="payments" leftSection={<IconCreditCard size={16} />}>
                  Платежи
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="profile" p="xl">
                <form onSubmit={form.onSubmit((values) => console.log(values))}>
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

                    <TextInput
                      label="Местоположение"
                      placeholder="Город, Страна"
                      leftSection={<IconMapPin size={16} />}
                      {...form.getInputProps('location')}
                    />

                    <Textarea
                      label="О себе"
                      placeholder="Расскажите немного о себе..."
                      minRows={3}
                      {...form.getInputProps('bio')}
                    />

                    <Select
                      label="Тип аккаунта"
                      data={[
                        { value: 'guest', label: 'Только гость' },
                        { value: 'host', label: 'Только хост' },
                        { value: 'both', label: 'Гость и хост' },
                      ]}
                      defaultValue={mockUser.role}
                    />

                    <Group justify="flex-end" mt="md">
                      <Button type="submit">
                        Сохранить изменения
                      </Button>
                    </Group>
                  </Stack>
                </form>
              </Tabs.Panel>

              <Tabs.Panel value="security" p="xl">
                <Stack gap="lg">
                  <div>
                    <Text fw={600} mb="md">Изменить пароль</Text>
                    <Stack gap="md">
                      <PasswordInput
                        label="Текущий пароль"
                        placeholder="Введите текущий пароль"
                      />
                      <PasswordInput
                        label="Новый пароль"
                        placeholder="Введите новый пароль"
                      />
                      <PasswordInput
                        label="Подтвердите новый пароль"
                        placeholder="Повторите новый пароль"
                      />
                      <Button w="fit-content">
                        Изменить пароль
                      </Button>
                    </Stack>
                  </div>

                  <Divider />

                  <div>
                    <Text fw={600} mb="md">Двухфакторная аутентификация</Text>
                    <Paper p="md" withBorder radius="md">
                      <Group justify="space-between">
                        <div>
                          <Text size="sm" fw={500}>SMS-подтверждение</Text>
                          <Text size="xs" c="dimmed">
                            Получайте код подтверждения при входе
                          </Text>
                        </div>
                        <Switch size="md" />
                      </Group>
                    </Paper>
                  </div>

                  <Divider />

                  <div>
                    <Text fw={600} mb="md">Подключенные аккаунты</Text>
                    <Stack gap="sm">
                      <Paper p="md" withBorder radius="md">
                        <Group justify="space-between">
                          <Group>
                            <IconBrandGoogle size={24} />
                            <div>
                              <Text size="sm" fw={500}>Google</Text>
                              <Text size="xs" c="dimmed">daniyar@gmail.com</Text>
                            </div>
                          </Group>
                          <Button size="sm" variant="light" color="red">
                            Отключить
                          </Button>
                        </Group>
                      </Paper>
                    </Stack>
                  </div>
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="notifications" p="xl">
                <form onSubmit={notificationForm.onSubmit((values) => console.log(values))}>
                  <Stack gap="lg">
                    <div>
                      <Text fw={600} mb="md">Email уведомления</Text>
                      <Stack gap="sm">
                        <Switch
                          label="Уведомления о бронированиях"
                          description="Получать email при новых запросах и изменениях"
                          {...notificationForm.getInputProps('emailNotifications', { type: 'checkbox' })}
                        />
                        <Switch
                          label="Напоминания о бронированиях"
                          description="Напоминания за день до бронирования"
                          {...notificationForm.getInputProps('bookingReminders', { type: 'checkbox' })}
                        />
                        <Switch
                          label="Напоминания об отзывах"
                          description="Напоминания оставить отзыв после бронирования"
                          {...notificationForm.getInputProps('reviewReminders', { type: 'checkbox' })}
                        />
                        <Switch
                          label="Маркетинговые письма"
                          description="Новости, акции и специальные предложения"
                          {...notificationForm.getInputProps('marketingEmails', { type: 'checkbox' })}
                        />
                      </Stack>
                    </div>

                    <Divider />

                    <div>
                      <Text fw={600} mb="md">SMS уведомления</Text>
                      <Switch
                        label="SMS уведомления"
                        description="Получать SMS о важных событиях"
                        {...notificationForm.getInputProps('smsNotifications', { type: 'checkbox' })}
                      />
                    </div>

                    <Group justify="flex-end" mt="md">
                      <Button type="submit">
                        Сохранить настройки
                      </Button>
                    </Group>
                  </Stack>
                </form>
              </Tabs.Panel>

              <Tabs.Panel value="payments" p="xl">
                <Stack gap="lg">
                  <div>
                    <Group justify="space-between" mb="md">
                      <Text fw={600}>Способы оплаты</Text>
                      <Button size="sm" leftSection={<IconCreditCard size={16} />}>
                        Добавить карту
                      </Button>
                    </Group>
                    <Stack gap="sm">
                      <Paper p="md" withBorder radius="md">
                        <Group justify="space-between">
                          <Group>
                            <ThemeIcon size="lg" radius="md" variant="light">
                              <IconCreditCard size={20} />
                            </ThemeIcon>
                            <div>
                              <Text size="sm" fw={500}>•••• •••• •••• 4242</Text>
                              <Text size="xs" c="dimmed">Истекает 12/25</Text>
                            </div>
                          </Group>
                          <Badge color="green" variant="light">Основная</Badge>
                        </Group>
                      </Paper>
                    </Stack>
                  </div>

                  <Divider />

                  <div>
                    <Text fw={600} mb="md">Способы вывода средств</Text>
                    <Text size="sm" c="dimmed" mb="md">
                      Настройте способ получения выплат за ваши локации
                    </Text>
                    <Button variant="light" leftSection={<IconCreditCard size={16} />}>
                      Настроить выплаты
                    </Button>
                  </div>

                  <Divider />

                  <div>
                    <Text fw={600} mb="md">История транзакций</Text>
                    <Button variant="light" leftSection={<IconFileDescription size={16} />}>
                      Посмотреть историю
                    </Button>
                  </div>
                </Stack>
              </Tabs.Panel>
            </Tabs>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}