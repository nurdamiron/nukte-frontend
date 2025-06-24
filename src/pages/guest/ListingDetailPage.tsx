import { Container, Grid, Image, Text, Title, Badge, Group, Stack, Button, Card, Avatar, Tabs, Paper, List, ThemeIcon, ActionIcon, Modal, NumberInput, Select, Textarea, Divider, Loader, Center, Alert, Skeleton, Input } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DatePicker } from '@mantine/dates';
import { Carousel } from '@mantine/carousel';
import { IconMapPin, IconStar, IconRuler, IconUsers, IconCar, IconWifi, IconBath, IconToolsKitchen2, IconCheck, IconShare, IconHeart, IconMessage, IconCalendar, IconClock, IconShieldCheck, IconFileDescription, IconAlertCircle, IconParking, IconBolt, IconAirConditioning, IconElevator } from '@tabler/icons-react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { listingsService } from '../../services/listings.service';
import { bookingsService } from '../../services/bookings.service';
import { useAuth } from '../../contexts/AuthContext';
import type { Listing, BookingCreateData, Review } from '../../types/api.types';

// Amenity icon mapping
const amenityIcons: Record<string, any> = {
  parking: IconParking,
  wifi: IconWifi,
  bathroom: IconBath,
  kitchen: IconToolsKitchen2,
  electricity: IconBolt,
  heating: IconCar,
  air_conditioning: IconAirConditioning,
  elevator: IconElevator,
};

// Amenity label mapping
const amenityLabels: Record<string, string> = {
  parking: 'Парковка',
  wifi: 'Wi-Fi',
  bathroom: 'Санузел',
  kitchen: 'Кухня',
  electricity: 'Электричество',
  heating: 'Отопление',
  air_conditioning: 'Кондиционер',
  elevator: 'Лифт',
};

export function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [opened, { open, close }] = useDisclosure(false);
  const [bookingData, setBookingData] = useState({
    date: null as Date | null,
    startTime: '',
    endTime: '',
    guestsCount: 1,
    message: '',
  });

  // Fetch listing data
  const { data: listing, isLoading, isError, error } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => listingsService.getListingById(Number(id)),
    enabled: !!id,
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: (data: BookingCreateData) => bookingsService.createBooking(data),
    onSuccess: (booking) => {
      notifications.show({
        title: 'Запрос отправлен',
        message: 'Ваш запрос на бронирование успешно отправлен хосту',
        color: 'green',
      });
      close();
      navigate(`/bookings/${booking.id}`);
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Ошибка',
        message: error.message || 'Не удалось создать бронирование',
        color: 'red',
      });
    },
  });

  const calculateDuration = () => {
    if (!bookingData.startTime || !bookingData.endTime) return 0;
    const start = parseInt(bookingData.startTime.split(':')[0]);
    const end = parseInt(bookingData.endTime.split(':')[0]);
    return end - start;
  };

  const calculateTotal = () => {
    if (!listing) return 0;
    const duration = calculateDuration();
    return duration * listing.pricePerHour;
  };

  const handleBooking = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!listing || !bookingData.date || !bookingData.startTime || !bookingData.endTime) {
      notifications.show({
        title: 'Ошибка',
        message: 'Заполните все обязательные поля',
        color: 'red',
      });
      return;
    }

    const dateStr = bookingData.date.toISOString().split('T')[0];
    
    createBookingMutation.mutate({
      listingId: listing.id,
      date: dateStr,
      startTime: bookingData.startTime,
      endTime: bookingData.endTime,
      guestsCount: bookingData.guestsCount,
      guestMessage: bookingData.message,
    });
  };

  // Get primary image URL
  const getPrimaryImage = (listing: Listing): string => {
    const primaryImage = listing.images?.find(img => img.isPrimary);
    return primaryImage?.url || listing.images?.[0]?.url || 'https://placehold.co/400x300';
  };

  // Format price display
  const formatPrice = (listing: Listing): string => {
    if (listing.pricePerDay) {
      return `${listing.pricePerDay.toLocaleString('ru-KZ')} ₸/день`;
    }
    return `${listing.pricePerHour.toLocaleString('ru-KZ')} ₸/час`;
  };

  if (isLoading) {
    return (
      <Container size="xl" my="xl">
        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Skeleton height={400} mb="xl" />
            <Skeleton height={40} width="70%" mb="md" />
            <Skeleton height={20} width="40%" mb="xl" />
            <Skeleton height={200} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Skeleton height={300} />
          </Grid.Col>
        </Grid>
      </Container>
    );
  }

  if (isError || !listing) {
    return (
      <Container size="xl" my="xl">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Ошибка загрузки"
          color="red"
        >
          {error?.message || 'Не удалось загрузить информацию о локации'}
        </Alert>
      </Container>
    );
  }

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
            mb="xl"
          >
            {listing.images?.map((image, index) => (
              <Carousel.Slide key={image.id || index}>
                <Image src={image.url} height={400} radius="md" alt={listing.title} />
              </Carousel.Slide>
            )) || (
              <Carousel.Slide>
                <Image src={getPrimaryImage(listing)} height={400} radius="md" alt={listing.title} />
              </Carousel.Slide>
            )}
          </Carousel>

          {/* Title and Location */}
          <Group justify="space-between" align="flex-start" mb="md">
            <div>
              <Title order={1} mb="xs">
                {listing.title}
              </Title>
              <Group gap="xs">
                <IconMapPin size={18} />
                <Text>{listing.city}{listing.address ? `, ${listing.address}` : ''}</Text>
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
              <Text>{listing.area} м²</Text>
            </Group>
            <Group gap="xs">
              <IconUsers size={20} />
              <Text>До {listing.maxGuests} человек</Text>
            </Group>
            <Group gap="xs">
              <IconStar size={20} fill="currentColor" />
              <Text fw={500}>{listing.rating || 0}</Text>
              <Text c="dimmed">({listing.reviewsCount || 0} отзывов)</Text>
            </Group>
          </Group>

          {/* Tabs */}
          <Tabs defaultValue="description" mb="xl">
            <Tabs.List>
              <Tabs.Tab value="description">Описание</Tabs.Tab>
              <Tabs.Tab value="amenities">Удобства</Tabs.Tab>
              <Tabs.Tab value="rules">Правила</Tabs.Tab>
              <Tabs.Tab value="reviews">Отзывы ({listing.reviewsCount || 0})</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="description" pt="xl">
              <Text style={{ whiteSpace: 'pre-line' }}>
                {listing.description}
              </Text>
            </Tabs.Panel>

            <Tabs.Panel value="amenities" pt="xl">
              <Grid>
                {listing.amenities?.map((amenity, index) => {
                  const Icon = amenityIcons[amenity] || IconCheck;
                  const label = amenityLabels[amenity] || amenity;
                  return (
                    <Grid.Col key={index} span={6}>
                      <Group gap="sm">
                        <ThemeIcon variant="light" size="lg" radius="md">
                          <Icon size={20} />
                        </ThemeIcon>
                        <Text>{label}</Text>
                      </Group>
                    </Grid.Col>
                  );
                })}
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
                {listing.rules?.split('\n').map((rule, index) => (
                  <List.Item key={index}>{rule}</List.Item>
                )) || <Text c="dimmed">Правила не указаны</Text>}
              </List>
            </Tabs.Panel>

            <Tabs.Panel value="reviews" pt="xl">
              <Stack gap="lg">
                {listing.reviews?.length ? listing.reviews.map((review: Review) => (
                  <Paper key={review.id} p="md" withBorder radius="md">
                    <Group justify="space-between" mb="sm">
                      <Group>
                        <Avatar src={review.reviewer?.avatar} radius="xl">
                          {review.reviewer?.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <div>
                          <Text fw={500}>{review.reviewer?.name || 'Гость'}</Text>
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
                        {new Date(review.createdAt).toLocaleDateString('ru-KZ')}
                      </Text>
                    </Group>
                    <Text>{review.comment}</Text>
                  </Paper>
                )) : <Text c="dimmed" ta="center">Пока нет отзывов</Text>}
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
                  {listing.pricePerHour.toLocaleString('ru-KZ')} ₸
                </Text>
                <Text c="dimmed">за час</Text>
              </Group>

              <Divider />

              <Button 
                size="lg" 
                fullWidth 
                onClick={user ? open : () => navigate('/login')}
              >
                {user ? 'Забронировать' : 'Войти для бронирования'}
              </Button>

              <Text size="xs" c="dimmed" ta="center">
                Вы пока ничего не платите
              </Text>

              <Divider />

              {/* Host Info */}
              <Group justify="space-between">
                <Group>
                  <Avatar src={listing.host?.avatar} radius="xl" size="md">
                    {listing.host?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <div>
                    <Group gap={4}>
                      <Text fw={500}>{listing.host?.name || 'Хост'}</Text>
                      {listing.host?.verified && (
                        <ThemeIcon size="sm" radius="xl" color="blue" variant="light">
                          <IconShieldCheck size={14} />
                        </ThemeIcon>
                      )}
                    </Group>
                    <Text size="xs" c="dimmed">
                      Хост с {listing.host?.createdAt ? new Date(listing.host.createdAt).toLocaleDateString('ru-KZ', { year: 'numeric', month: 'long' }) : 'недавно'}
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
                  <Text size="sm" fw={500}>~1 час</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="xs" c="dimmed">Частота ответов</Text>
                  <Text size="sm" fw={500}>98%</Text>
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
          <Input.Wrapper label="Дата" required>
            <DatePicker
              value={bookingData.date}
              onChange={(value) => setBookingData({ ...bookingData, date: value as Date | null })}
              minDate={new Date()}
            />
          </Input.Wrapper>

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
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Время окончания"
                placeholder="Выберите время"
                data={[
                  '09:00', '10:00', '11:00', '12:00', '13:00',
                  '14:00', '15:00', '16:00', '17:00', '18:00',
                  '19:00', '20:00', '21:00', '22:00',
                ]}
                value={bookingData.endTime}
                onChange={(value) => setBookingData({ ...bookingData, endTime: value || '' })}
                required
                disabled={!bookingData.startTime}
              />
            </Grid.Col>
          </Grid>

          <NumberInput
            label="Количество человек"
            min={1}
            max={listing.maxGuests}
            value={bookingData.guestsCount}
            onChange={(value) => setBookingData({ ...bookingData, guestsCount: Number(value) })}
            required
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
              <Text>{calculateDuration()} час × {listing.pricePerHour.toLocaleString('ru-KZ')} ₸</Text>
              <Text>{calculateTotal().toLocaleString('ru-KZ')} ₸</Text>
            </Group>
            <Group justify="space-between">
              <Text>Сервисный сбор</Text>
              <Text>{(calculateTotal() * 0.1).toLocaleString('ru-KZ')} ₸</Text>
            </Group>
            <Divider />
            <Group justify="space-between">
              <Text fw={600}>Итого</Text>
              <Text fw={600} size="lg">
                {(calculateTotal() * 1.1).toLocaleString('ru-KZ')} ₸
              </Text>
            </Group>
          </Stack>

          <Button 
            fullWidth 
            size="lg" 
            onClick={handleBooking}
            loading={createBookingMutation.isPending}
            disabled={!bookingData.date || !bookingData.startTime || !bookingData.endTime}
          >
            Отправить запрос на бронирование
          </Button>
        </Stack>
      </Modal>
    </Container>
  );
}