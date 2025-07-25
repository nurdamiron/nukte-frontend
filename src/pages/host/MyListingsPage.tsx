import { Container, Title, Group, Button, Grid, Card, Image, Text, Badge, Stack, Menu, ActionIcon, Tabs, NumberFormatter, Progress, Paper, ThemeIcon, SimpleGrid } from '@mantine/core';
import { IconPlus, IconDots, IconEdit, IconEye, IconTrash, IconCalendar, IconEyeOff, IconTrendingUp, IconCurrencyDollar, IconUsers, IconStar, IconVideo, IconCamera, IconSparkles } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const mockListings = [
  {
    id: 1,
    title: 'Лофт для фотосессий в центре',
    image: 'https://images.unsplash.com/photo-1565953522043-baea26b83b7e?w=400',
    status: 'active',
    views: 234,
    shootings: 12,
    revenue: 600000,
    rating: 4.8,
    reviews: 12,
    category: 'urban',
    allowedTypes: ['photo', 'video', 'commercial'],
  },
  {
    id: 2,
    title: 'Крыша с панорамным видом',
    image: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=400',
    status: 'paused',
    views: 189,
    shootings: 8,
    revenue: 640000,
    rating: 4.9,
    reviews: 8,
    category: 'rooftop',
    allowedTypes: ['photo', 'cinema', 'music_video'],
  },
  {
    id: 3,
    title: 'Заброшенный завод для съёмок',
    image: 'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=400',
    status: 'active',
    views: 156,
    shootings: 5,
    revenue: 600000,
    rating: 5.0,
    reviews: 5,
    category: 'abandoned',
    allowedTypes: ['video', 'cinema', 'documentary'],
  },
];

const stats = [
  { title: 'Всего просмотров', value: 579, icon: IconEye, color: 'blue' },
  { title: 'Съёмок проведено', value: 25, icon: IconVideo, color: 'teal' },
  { title: 'Общий доход', value: '1 840 000 ₸', icon: IconCurrencyDollar, color: 'green' },
  { title: 'Средний рейтинг', value: '4.9', icon: IconStar, color: 'yellow' },
];

export function MyListingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string | null>('all');

  return (
    <Container size="xl" my="xl">
      <Group justify="space-between" mb="xl">
        <Group gap="md">
          <ThemeIcon size="xl" variant="gradient" gradient={{ from: 'violet', to: 'purple' }} radius="xl">
            <IconSparkles size={28} />
          </ThemeIcon>
          <Title order={1}>Мои локации для съёмок</Title>
        </Group>
        <Button
          leftSection={<IconPlus size={18} />}
          onClick={() => navigate('/host/listings/create')}
          variant="gradient"
          gradient={{ from: 'violet', to: 'purple', deg: 45 }}
        >
          Добавить локацию
        </Button>
      </Group>

      {/* Statistics */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mb="xl">
        {stats.map((stat) => (
          <Paper key={stat.title} shadow="sm" p="md" radius="md">
            <Group justify="space-between">
              <div>
                <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                  {stat.title}
                </Text>
                <Text fw={700} size="xl">
                  {stat.value}
                </Text>
              </div>
              <ThemeIcon color={stat.color} variant="light" size="xl" radius="md">
                <stat.icon size={24} />
              </ThemeIcon>
            </Group>
          </Paper>
        ))}
      </SimpleGrid>

      {/* Listings */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List mb="lg">
          <Tabs.Tab value="all">Все ({mockListings.length})</Tabs.Tab>
          <Tabs.Tab value="active">Активные ({mockListings.filter(l => l.status === 'active').length})</Tabs.Tab>
          <Tabs.Tab value="paused">На паузе ({mockListings.filter(l => l.status === 'paused').length})</Tabs.Tab>
        </Tabs.List>

        <Grid>
          {mockListings
            .filter(listing => 
              activeTab === 'all' || 
              (activeTab === 'active' && listing.status === 'active') ||
              (activeTab === 'paused' && listing.status === 'paused')
            )
            .map((listing) => (
              <Grid.Col key={listing.id} span={{ base: 12, xs: 6, sm: 6, md: 4, lg: 3 }}>
                <Card shadow="sm" radius="md" withBorder h="100%" style={{ display: 'flex', flexDirection: 'column' }}>
                  <Card.Section pos="relative">
                    <Image
                      src={listing.image}
                      height={200}
                      alt={listing.title}
                    />
                    <Badge
                      pos="absolute"
                      top={10}
                      left={10}
                      variant="filled"
                      color={listing.status === 'active' ? 'green' : 'gray'}
                    >
                      {listing.status === 'active' ? 'Активна' : 'На паузе'}
                    </Badge>
                    <Menu position="bottom-end" shadow="md">
                      <Menu.Target>
                        <ActionIcon
                          pos="absolute"
                          top={10}
                          right={10}
                          variant="white"
                          radius="md"
                        >
                          <IconDots size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item leftSection={<IconEdit size={14} />}>
                          Редактировать
                        </Menu.Item>
                        <Menu.Item leftSection={<IconCalendar size={14} />}>
                          Календарь съёмок
                        </Menu.Item>
                        <Menu.Item 
                          leftSection={listing.status === 'active' ? <IconEyeOff size={14} /> : <IconEye size={14} />}
                        >
                          {listing.status === 'active' ? 'Поставить на паузу' : 'Активировать'}
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item color="red" leftSection={<IconTrash size={14} />}>
                          Удалить
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Card.Section>

                  <Stack gap="sm" mt="md" style={{ flex: 1 }}>
                    <Text fw={600} size="lg" lineClamp={2} style={{ minHeight: "3.2em" }}>
                      {listing.title}
                    </Text>

                    <Group gap="xs">
                      {listing.allowedTypes.map((type) => (
                        <Badge key={type} size="xs" variant="light">
                          {type === 'photo' ? 'Фото' : 
                           type === 'video' ? 'Видео' :
                           type === 'cinema' ? 'Кино' :
                           type === 'commercial' ? 'Реклама' :
                           type === 'music_video' ? 'Клип' :
                           type === 'documentary' ? 'Док' : type}
                        </Badge>
                      ))}
                    </Group>

                    <Grid gutter="xs">
                      <Grid.Col span={4}>
                        <Text size="xs" c="dimmed">Просмотры</Text>
                        <Group gap={4}>
                          <IconEye size={14} />
                          <Text size="sm" fw={500}>{listing.views}</Text>
                        </Group>
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <Text size="xs" c="dimmed">Съёмок</Text>
                        <Group gap={4}>
                          <IconVideo size={14} />
                          <Text size="sm" fw={500}>{listing.shootings}</Text>
                        </Group>
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <Text size="xs" c="dimmed">Рейтинг</Text>
                        <Group gap={4}>
                          <IconStar size={14} fill="currentColor" />
                          <Text size="sm" fw={500}>{listing.rating}</Text>
                        </Group>
                      </Grid.Col>
                    </Grid>

                    <div>
                      <Group justify="space-between" mb={4}>
                        <Text size="xs" c="dimmed">Доход за месяц</Text>
                        <Text size="sm" fw={600}>
                          <NumberFormatter value={listing.revenue} thousandSeparator=" " suffix=" ₸" />
                        </Text>
                      </Group>
                      <Progress value={listing.revenue / 10000} size="sm" />
                    </div>

                    <Group gap="xs" style={{ marginTop: 'auto' }}>
                      <Button
                        size="sm"
                        variant="light"
                        fullWidth
                        onClick={() => navigate(`/host/listings/${listing.id}`)}
                      >
                        Управление
                      </Button>
                      <ActionIcon
                        size="lg"
                        variant="light"
                        title="Статистика"
                      >
                        <IconTrendingUp size={16} />
                      </ActionIcon>
                    </Group>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
        </Grid>
      </Tabs>
    </Container>
  );
}