import { Container, Grid, Paper, Avatar, Text, Group, Button, Stack, Tabs, TextInput, Textarea, Select, FileButton, Badge, Progress, Card, ThemeIcon, Switch, Divider, ActionIcon, PasswordInput, Image } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconUser, IconShieldCheck, IconBuilding, IconCalendar, IconStar, IconCamera, IconEdit, IconMail, IconPhone, IconMapPin, IconBrandGoogle, IconBell, IconLock, IconCreditCard, IconFileDescription, IconVideo, IconSparkles } from '@tabler/icons-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const mockUser = {
  id: 1,
  name: 'Данияр Касымов',
  email: 'daniyar@example.com',
  phone: '+7 (777) 123-45-67',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
  role: 'both', // filmmaker, location_owner, both
  verified: false,
  joinedDate: '2023-01-15',
  location: 'Алматы, Казахстан',
  bio: 'Фотограф и видеограф с 5-летним опытом. Владелец нескольких съёмочных локаций в Алматы.',
  stats: {
    asLocationOwner: {
      listings: 3,
      bookings: 45,
      revenue: 5240000,
      rating: 4.9,
      reviews: 28,
    },
    asFilmmaker: {
      bookings: 12,
      spent: 840000,
      reviews: 8,
      shootings: 25,
    },
  },
  verificationStatus: 'pending', // none, pending, verified
  verificationDocuments: ['ID uploaded', 'Selfie uploaded'],
  portfolio: [
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400',
    'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
  ],
};

export function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string | null>('profile');
  const [avatar, setAvatar] = useState<File | null>(null);
  
  // Используем данные пользователя или mockUser
  const userData = user || mockUser;
  
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
                  src={avatar ? URL.createObjectURL(avatar) : userData.avatar}
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
                  <Text size="xl" fw={600}>{userData.name}</Text>
                  {userData.verified && (
                    <ThemeIcon size="sm" radius="xl" color="blue" variant="light">
                      <IconShieldCheck size={14} />
                    </ThemeIcon>
                  )}
                </Group>
                <Text size="sm" c="dimmed">
                  Участник с {new Date(userData.joinedDate || (userData as any).createdAt || '2023-01-01').toLocaleDateString('ru-RU', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </Text>
                {userData.role === 'filmmaker' && (
                  <Badge leftSection={<IconCamera size={12} />} variant="light" color="violet">
                    Фотограф/Режиссёр
                  </Badge>
                )}
                {userData.role === 'location_owner' && (
                  <Badge leftSection={<IconBuilding size={12} />} variant="light" color="blue">
                    Владелец локации
                  </Badge>
                )}
                {userData.role === 'both' && (
                  <Badge leftSection={<IconSparkles size={12} />} variant="light" color="grape">
                    Креатор и владелец
                  </Badge>
                )}
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
            {(userData.role === 'location_owner' || userData.role === 'both') && (
              <div>
                <Text size="sm" fw={600} mb="xs">Как владелец локаций</Text>
                <Stack gap="xs" mb="md">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Локаций</Text>
                    <Text size="sm" fw={500}>{(userData as any).stats?.asLocationOwner?.listings || 0}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Съёмок проведено</Text>
                    <Text size="sm" fw={500}>{(userData as any).stats?.asLocationOwner?.bookings || 0}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Заработано</Text>
                    <Text size="sm" fw={500}>
                      {(((userData as any).stats?.asLocationOwner?.revenue || 0) / 1000000).toFixed(1)}M ₸
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Рейтинг</Text>
                    <Group gap={4}>
                      <IconStar size={14} fill="currentColor" />
                      <Text size="sm" fw={500}>{(userData as any).stats?.asLocationOwner?.rating || 0}</Text>
                    </Group>
                  </Group>
                </Stack>
              </div>
            )}

            {(userData.role === 'filmmaker' || userData.role === 'both') && (
              <div>
                <Text size="sm" fw={600} mb="xs">Как фотограф/режиссёр</Text>
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Съёмок проведено</Text>
                    <Text size="sm" fw={500}>{(userData as any).stats?.asFilmmaker?.shootings || 0}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Бронирований</Text>
                    <Text size="sm" fw={500}>{(userData as any).stats?.asFilmmaker?.bookings || 0}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Потрачено</Text>
                    <Text size="sm" fw={500}>
                      {((userData as any).stats?.asFilmmaker?.spent || 0).toLocaleString()} ₸
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Отзывов оставлено</Text>
                    <Text size="sm" fw={500}>{(userData as any).stats?.asFilmmaker?.reviews || 0}</Text>
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
                {(userData.role === 'filmmaker' || userData.role === 'both') && (
                  <Tabs.Tab value="portfolio" leftSection={<IconVideo size={16} />}>
                    Портфолио
                  </Tabs.Tab>
                )}
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
                        { value: 'filmmaker', label: 'Фотограф/Режиссёр' },
                        { value: 'location_owner', label: 'Владелец локации' },
                        { value: 'both', label: 'И то, и другое' },
                      ]}
                      defaultValue={userData.role}
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
                              <Text size="xs" c="dimmed">{userData.email || 'daniyar@gmail.com'}</Text>
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

              {(userData.role === 'filmmaker' || userData.role === 'both') && (
                <Tabs.Panel value="portfolio" p="xl">
                  <Stack gap="lg">
                    <div>
                      <Group justify="space-between" mb="md">
                        <div>
                          <Text fw={600} size="lg">Мои работы</Text>
                          <Text size="sm" c="dimmed">Покажите свои лучшие съёмки</Text>
                        </div>
                        <Button leftSection={<IconCamera size={18} />}>
                          Добавить работу
                        </Button>
                      </Group>

                      <Grid>
                        {(userData as any).portfolio?.map((work: string, index: number) => (
                          <Grid.Col key={index} span={{ base: 12, xs: 6, sm: 4 }}>
                            <Card p={0} radius="md" withBorder style={{ overflow: 'hidden' }}>
                              <Image
                                src={work}
                                height={200}
                                alt={`Работа ${index + 1}`}
                              />
                              <Stack gap="xs" p="sm">
                                <Text size="sm" fw={500}>Проект #{index + 1}</Text>
                                <Group gap="xs">
                                  <Badge size="xs" variant="light">Фото</Badge>
                                  <Badge size="xs" variant="light" color="violet">Портрет</Badge>
                                </Group>
                              </Stack>
                            </Card>
                          </Grid.Col>
                        ))}
                      </Grid>
                    </div>

                    <Divider />

                    <div>
                      <Text fw={600} mb="md">Оборудование и навыки</Text>
                      <Stack gap="sm">
                        <Group gap="sm">
                          <Badge size="lg" variant="light">Canon 5D Mark IV</Badge>
                          <Badge size="lg" variant="light">Adobe Premiere Pro</Badge>
                          <Badge size="lg" variant="light">DaVinci Resolve</Badge>
                          <Badge size="lg" variant="light">Drone Pilot</Badge>
                        </Group>
                      </Stack>
                    </div>

                    <Divider />

                    <div>
                      <Text fw={600} mb="md">Специализация</Text>
                      <Group gap="sm">
                        <Badge leftSection={<IconCamera size={14} />} variant="outline">
                          Портретная съёмка
                        </Badge>
                        <Badge leftSection={<IconVideo size={14} />} variant="outline">
                          Музыкальные клипы
                        </Badge>
                        <Badge leftSection={<IconSparkles size={14} />} variant="outline">
                          Реклама
                        </Badge>
                      </Group>
                    </div>
                  </Stack>
                </Tabs.Panel>
              )}
            </Tabs>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}