import { Container, Grid, Image, Text, Title, Badge, Group, Stack, Button, Card, Avatar, Tabs, Paper, List, ThemeIcon, ActionIcon, Modal, NumberInput, Select, Textarea, Divider } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DatePicker } from '@mantine/dates';
import { Carousel } from '@mantine/carousel';
import { IconMapPin, IconStar, IconRuler, IconUsers, IconCar, IconWifi, IconBath, IconToolsKitchen2, IconCheck, IconShare, IconHeart, IconMessage, IconCalendar, IconClock, IconShieldCheck, IconFileDescription } from '@tabler/icons-react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const mockListing = {
  id: 1,
  title: 'Современная студия в центре города',
  images: [
    'https://images.unsplash.com/photo-1565953522043-baea26b83b7e?w=800',
    'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800',
    'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=800',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
  ],
  price: '50 000 ₸/день',
  pricePerHour: 10000,
  pricePerDay: 50000,
  rating: 4.8,
  reviews: 12,
  location: 'Алматы, Медеуский район',
  address: 'ул. Абая 150, 3 этаж',
  area: 120,
  maxGuests: 30,
  description: `Современная студия в самом сердце Алматы идеально подходит для фото и видеосъёмок любой сложности. 
  
  Пространство оборудовано профессиональным освещением, имеет высокие потолки (3.5м) и панорамные окна с видом на город. В студии есть несколько зон с разным интерьером: минималистичная белая зона, зона с кирпичной стеной, и лаунж-зона с мягкой мебелью.
  
  Мы предоставляем базовое осветительное оборудование, отражатели и штативы. Также доступна гримёрная комната с зеркалами и хорошим освещением.`,
  amenities: [
    { icon: IconCar, label: 'Бесплатная парковка' },
    { icon: IconWifi, label: 'Высокоскоростной Wi-Fi' },
    { icon: IconBath, label: 'Санузел и душ' },
    { icon: IconToolsKitchen2, label: 'Кухня' },
  ],
  rules: [
    'Курение запрещено внутри помещения',
    'Животные только по согласованию',
    'Уборка после съёмки обязательна',
    'Максимальный уровень шума до 22:00',
  ],
  host: {
    id: 1,
    name: 'Айдар Сабиров',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    verified: true,
    responseTime: '~1 час',
    responseRate: '98%',
    joinedDate: 'Январь 2023',
    listings: 3,
  },
  unavailableDates: ['2024-01-15', '2024-01-16', '2024-01-20'],
};

const reviewsData = [
  {
    id: 1,
    author: 'Мария К.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    rating: 5,
    date: '2 недели назад',
    text: 'Отличная студия! Много естественного света, удобное расположение. Хозяин очень отзывчивый.',
  },
  {
    id: 2,
    author: 'Данияр М.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    rating: 4,
    date: '1 месяц назад',
    text: 'Хорошее пространство для съёмок. Единственный минус - парковка иногда занята.',
  },
];

export function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [bookingData, setBookingData] = useState({
    date: null as Date | null,
    startTime: '',
    duration: 1,
    guests: 1,
    message: '',
  });

  const calculateTotal = () => {
    return bookingData.duration * mockListing.pricePerHour;
  };

  return (
    <Container size="xl" my="xl">
      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 8 }}>
          {/* Image Gallery */}
          <Carousel
            withIndicators
            height={400}
            slideSize="100%"
            slideGap="md"
            loop
            mb="xl"
          >
            {mockListing.images.map((image, index) => (
              <Carousel.Slide key={index}>
                <Image src={image} height={400} radius="md" />
              </Carousel.Slide>
            ))}
          </Carousel>

          {/* Title and Location */}
          <Group justify="space-between" align="flex-start" mb="md">
            <div>
              <Title order={1} mb="xs">
                {mockListing.title}
              </Title>
              <Group gap="xs">
                <IconMapPin size={18} />
                <Text>{mockListing.location}</Text>
              </Group>
            </div>
            <Group>
              <ActionIcon variant="default" size="lg" radius="md">
                <IconShare size={20} />
              </ActionIcon>
              <ActionIcon variant="default" size="lg" radius="md">
                <IconHeart size={20} />
              </ActionIcon>
            </Group>
          </Group>

          {/* Quick Info */}
          <Group gap="xl" mb="xl">
            <Group gap="xs">
              <IconRuler size={20} />
              <Text>{mockListing.area} м²</Text>
            </Group>
            <Group gap="xs">
              <IconUsers size={20} />
              <Text>До {mockListing.maxGuests} человек</Text>
            </Group>
            <Group gap="xs">
              <IconStar size={20} fill="currentColor" />
              <Text fw={500}>{mockListing.rating}</Text>
              <Text c="dimmed">({mockListing.reviews} отзывов)</Text>
            </Group>
          </Group>

          {/* Tabs */}
          <Tabs defaultValue="description" mb="xl">
            <Tabs.List>
              <Tabs.Tab value="description">Описание</Tabs.Tab>
              <Tabs.Tab value="amenities">Удобства</Tabs.Tab>
              <Tabs.Tab value="rules">Правила</Tabs.Tab>
              <Tabs.Tab value="reviews">Отзывы ({mockListing.reviews})</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="description" pt="xl">
              <Text style={{ whiteSpace: 'pre-line' }}>
                {mockListing.description}
              </Text>
            </Tabs.Panel>

            <Tabs.Panel value="amenities" pt="xl">
              <Grid>
                {mockListing.amenities.map((amenity, index) => (
                  <Grid.Col key={index} span={6}>
                    <Group gap="sm">
                      <ThemeIcon variant="light" size="lg" radius="md">
                        <amenity.icon size={20} />
                      </ThemeIcon>
                      <Text>{amenity.label}</Text>
                    </Group>
                  </Grid.Col>
                ))}
              </Grid>
            </Tabs.Panel>

            <Tabs.Panel value="rules" pt="xl">
              <List
                spacing="sm"
                icon={
                  <ThemeIcon color="red" size={24} radius="xl">
                    <IconCheck size={16} />
                  </ThemeIcon>
                }
              >
                {mockListing.rules.map((rule, index) => (
                  <List.Item key={index}>{rule}</List.Item>
                ))}
              </List>
            </Tabs.Panel>

            <Tabs.Panel value="reviews" pt="xl">
              <Stack gap="lg">
                {reviewsData.map((review) => (
                  <Paper key={review.id} p="md" withBorder radius="md">
                    <Group justify="space-between" mb="sm">
                      <Group>
                        <Avatar src={review.avatar} radius="xl" />
                        <div>
                          <Text fw={500}>{review.author}</Text>
                          <Group gap="xs">
                            {[...Array(5)].map((_, i) => (
                              <IconStar
                                key={i}
                                size={14}
                                fill={i < review.rating ? 'currentColor' : 'none'}
                              />
                            ))}
                          </Group>
                        </div>
                      </Group>
                      <Text size="sm" c="dimmed">
                        {review.date}
                      </Text>
                    </Group>
                    <Text>{review.text}</Text>
                  </Paper>
                ))}
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Grid.Col>

        {/* Booking Card */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow="lg" radius="md" withBorder style={{ position: 'sticky', top: 20 }}>
            <Stack gap="md">
              <Group justify="space-between">
                <Text size="xl" fw={700}>
                  {mockListing.pricePerHour.toLocaleString()} ₸
                </Text>
                <Text c="dimmed">за час</Text>
              </Group>

              <Divider />

              <Button size="lg" fullWidth onClick={open}>
                Забронировать
              </Button>

              <Text size="xs" c="dimmed" ta="center">
                Вы пока ничего не платите
              </Text>

              <Divider />

              {/* Host Info */}
              <Group justify="space-between">
                <Group>
                  <Avatar src={mockListing.host.avatar} radius="xl" size="md" />
                  <div>
                    <Group gap={4}>
                      <Text fw={500}>{mockListing.host.name}</Text>
                      {mockListing.host.verified && (
                        <ThemeIcon size="sm" radius="xl" color="blue" variant="light">
                          <IconShieldCheck size={14} />
                        </ThemeIcon>
                      )}
                    </Group>
                    <Text size="xs" c="dimmed">
                      Хост с {mockListing.host.joinedDate}
                    </Text>
                  </div>
                </Group>
                <Button variant="light" size="sm" leftSection={<IconMessage size={16} />}>
                  Написать
                </Button>
              </Group>

              <Grid gutter="xs">
                <Grid.Col span={6}>
                  <Text size="xs" c="dimmed">Время ответа</Text>
                  <Text size="sm" fw={500}>{mockListing.host.responseTime}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="xs" c="dimmed">Частота ответов</Text>
                  <Text size="sm" fw={500}>{mockListing.host.responseRate}</Text>
                </Grid.Col>
              </Grid>
            </Stack>
          </Card>

          {/* Additional Info */}
          <Stack gap="sm" mt="md">
            <Paper p="sm" withBorder radius="md">
              <Group gap="xs">
                <IconCalendar size={20} />
                <Text size="sm">Бесплатная отмена за 24 часа</Text>
              </Group>
            </Paper>
            <Paper p="sm" withBorder radius="md">
              <Group gap="xs">
                <IconShieldCheck size={20} />
                <Text size="sm">Страхование включено</Text>
              </Group>
            </Paper>
            <Paper p="sm" withBorder radius="md">
              <Group gap="xs">
                <IconFileDescription size={20} />
                <Text size="sm">Помощь с пермитами</Text>
              </Group>
            </Paper>
          </Stack>
        </Grid.Col>
      </Grid>

      {/* Booking Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title="Бронирование локации"
        size="md"
      >
        <Stack gap="md">
          <DatePicker
            label="Дата съёмки"
            placeholder="Выберите дату"
            value={bookingData.date}
            onChange={(value) => setBookingData({ ...bookingData, date: value })}
            excludeDate={(date) => mockListing.unavailableDates.includes(date.toISOString().split('T')[0])}
          />

          <Grid>
            <Grid.Col span={6}>
              <Select
                label="Время начала"
                placeholder="Выберите время"
                data={[
                  '08:00', '09:00', '10:00', '11:00', '12:00',
                  '13:00', '14:00', '15:00', '16:00', '17:00',
                  '18:00', '19:00', '20:00',
                ]}
                value={bookingData.startTime}
                onChange={(value) => setBookingData({ ...bookingData, startTime: value || '' })}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Длительность (часов)"
                min={1}
                max={12}
                value={bookingData.duration}
                onChange={(value) => setBookingData({ ...bookingData, duration: Number(value) })}
              />
            </Grid.Col>
          </Grid>

          <NumberInput
            label="Количество человек"
            min={1}
            max={mockListing.maxGuests}
            value={bookingData.guests}
            onChange={(value) => setBookingData({ ...bookingData, guests: Number(value) })}
          />

          <Textarea
            label="Сообщение хосту"
            placeholder="Расскажите о вашем проекте..."
            minRows={3}
            value={bookingData.message}
            onChange={(e) => setBookingData({ ...bookingData, message: e.target.value })}
          />

          <Divider />

          <Stack gap="xs">
            <Group justify="space-between">
              <Text>{bookingData.duration} час × {mockListing.pricePerHour.toLocaleString()} ₸</Text>
              <Text>{(bookingData.duration * mockListing.pricePerHour).toLocaleString()} ₸</Text>
            </Group>
            <Group justify="space-between">
              <Text>Сервисный сбор</Text>
              <Text>{(calculateTotal() * 0.1).toLocaleString()} ₸</Text>
            </Group>
            <Divider />
            <Group justify="space-between">
              <Text fw={600}>Итого</Text>
              <Text fw={600} size="lg">
                {(calculateTotal() * 1.1).toLocaleString()} ₸
              </Text>
            </Group>
          </Stack>

          <Button fullWidth size="lg" onClick={() => {
            close();
            navigate('/bookings/new');
          }}>
            Отправить запрос на бронирование
          </Button>
        </Stack>
      </Modal>
    </Container>
  );
}