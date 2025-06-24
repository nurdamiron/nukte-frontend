import { Container, Title, Tabs, Grid, Card, Image, Text, Badge, Group, Stack, Button, Timeline, Paper, Avatar, ActionIcon, Center, Loader, Alert, Skeleton } from '@mantine/core';
import { IconCalendar, IconClock, IconMapPin, IconMessage, IconFileDescription, IconStar, IconAlertCircle } from '@tabler/icons-react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { bookingsService } from '../../services/bookings.service';
import { useAuth } from '../../contexts/AuthContext';
import type { Booking } from '../../types/api.types';

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

const statusColors: Record<BookingStatus, string> = {
  pending: 'yellow',
  confirmed: 'green',
  completed: 'blue',
  cancelled: 'red',
};

const statusLabels: Record<BookingStatus, string> = {
  pending: 'Ожидает подтверждения',
  confirmed: 'Подтверждено',
  completed: 'Завершено',
  cancelled: 'Отменено',
};

export function BookingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string | null>('upcoming');

  // Fetch bookings
  const { data: bookingsResponse, isLoading, isError, error } = useQuery({
    queryKey: ['bookings', 'guest'],
    queryFn: () => bookingsService.getMyBookings({ role: 'guest' }),
    enabled: !!user,
  });

  const bookings = bookingsResponse?.data || [];

  // Cancel booking mutation
  const cancelBookingMutation = useMutation({
    mutationFn: (bookingId: number) => bookingsService.cancelBooking(bookingId),
    onSuccess: () => {
      notifications.show({
        title: 'Бронирование отменено',
        message: 'Ваше бронирование успешно отменено',
        color: 'green',
      });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Ошибка',
        message: error.message || 'Не удалось отменить бронирование',
        color: 'red',
      });
    },
  });

  // Categorize bookings
  const categorizedBookings = useMemo(() => {
    if (!bookings) return { upcoming: [], past: [], cancelled: [] };

    const now = new Date();
    const upcoming: Booking[] = [];
    const past: Booking[] = [];
    const cancelled: Booking[] = [];

    bookings.forEach((booking) => {
      const bookingDate = new Date(`${booking.date}T${booking.endTime}`);
      
      if (booking.status === 'cancelled') {
        cancelled.push(booking);
      } else if (bookingDate < now || booking.status === 'completed') {
        past.push(booking);
      } else {
        upcoming.push(booking);
      }
    });

    return { upcoming, past, cancelled };
  }, [bookings]);

  // Get primary image URL
  const getPrimaryImage = (booking: Booking): string => {
    const images = booking.listing?.images;
    if (!images || images.length === 0) return 'https://placehold.co/400x300';
    
    const primaryImage = images.find(img => img.isPrimary);
    return primaryImage?.url || images[0].url;
  };

  // Format time range
  const formatTimeRange = (booking: Booking): string => {
    return `${booking.startTime} - ${booking.endTime}`;
  };

  // Format date
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-KZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Check if can review
  const canReview = (booking: Booking): boolean => {
    if (booking.status !== 'completed') return false;
    // TODO: Check if review exists when review feature is implemented
    
    const completedDate = new Date(booking.updatedAt || booking.createdAt);
    const daysSinceCompleted = Math.floor((Date.now() - completedDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceCompleted <= 14; // Can review within 14 days
  };

  const renderBookingCard = (booking: Booking) => (
    <Card key={booking.id} shadow="sm" radius="md" withBorder h="100%">
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, xs: 5, sm: 4, md: 3 }}>
          <Image
            src={getPrimaryImage(booking)}
            height={150}
            radius="md"
            style={{ cursor: 'pointer', objectFit: 'cover' }}
            onClick={() => navigate(`/listings/${booking.listing?.id}`)}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, xs: 7, sm: 8, md: 9 }}>
          <Stack gap="sm">
            <Group justify="space-between" align="flex-start">
              <div>
                <Text fw={600} size="lg" lineClamp={2}>
                  {booking.listing?.title || 'Локация'}
                </Text>
                <Group gap="xs" mt={4}>
                  <IconMapPin size={16} />
                  <Text size="sm" c="dimmed">
                    {booking.listing?.city || 'Не указано'}
                  </Text>
                </Group>
              </div>
              <Badge color={statusColors[booking.status]} variant="light">
                {statusLabels[booking.status]}
              </Badge>
            </Group>

            <Group gap="xl" wrap="wrap">
              <Group gap="xs">
                <IconCalendar size={16} />
                <Text size="sm">{formatDate(booking.date)}</Text>
              </Group>
              <Group gap="xs">
                <IconClock size={16} />
                <Text size="sm">{formatTimeRange(booking)}</Text>
              </Group>
              <Text size="sm" fw={600}>
                {booking.totalPrice.toLocaleString('ru-KZ')} ₸
              </Text>
            </Group>

            <Group justify="space-between" align="center" wrap="wrap" gap="xs">
              <Group gap="xs">
                <Avatar src={booking.host?.avatar} size="sm" radius="xl">
                  {booking.host?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Text size="sm">{booking.host?.name || 'Хост'}</Text>
              </Group>

              <Group gap="xs">
                {booking.status === 'confirmed' && (
                  <>
                    <Button
                      size="sm"
                      variant="light"
                      leftSection={<IconMessage size={16} />}
                      onClick={() => navigate(`/messages?bookingId=${booking.id}`)}
                    >
                      Чат
                    </Button>
                    <Button
                      size="sm"
                      variant="light"
                      leftSection={<IconFileDescription size={16} />}
                    >
                      Детали
                    </Button>
                  </>
                )}
                {booking.status === 'pending' && (
                  <Button
                    size="sm"
                    variant="light"
                    color="red"
                    onClick={() => {
                      if (window.confirm('Вы уверены, что хотите отменить бронирование?')) {
                        cancelBookingMutation.mutate(booking.id);
                      }
                    }}
                    loading={cancelBookingMutation.isPending}
                  >
                    Отменить
                  </Button>
                )}
                {canReview(booking) && (
                  <Button
                    size="sm"
                    leftSection={<IconStar size={16} />}
                  >
                    Оставить отзыв
                  </Button>
                )}
              </Group>
            </Group>

            {booking.status === 'cancelled' && booking.cancellationReason && (
              <Paper p="sm" bg="red.0" radius="sm">
                <Text size="sm" c="red">
                  Отменено: {booking.cancellationReason}
                </Text>
              </Paper>
            )}
          </Stack>
        </Grid.Col>
      </Grid>
    </Card>
  );

  if (!user) {
    return (
      <Container size="xl" my="xl">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Авторизуйтесь"
          color="blue"
        >
          Для просмотра бронирований необходимо войти в систему
        </Alert>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container size="xl" my="xl">
        <Title order={1} mb="xl">Мои бронирования</Title>
        <Stack gap="md">
          {[...Array(3)].map((_, index) => (
            <Card key={index} shadow="sm" radius="md" withBorder>
              <Grid gutter="md">
                <Grid.Col span={{ base: 12, xs: 5, sm: 4, md: 3 }}>
                  <Skeleton height={150} radius="md" />
                </Grid.Col>
                <Grid.Col span={{ base: 12, xs: 7, sm: 8, md: 9 }}>
                  <Stack gap="sm">
                    <Skeleton height={24} width="70%" />
                    <Skeleton height={16} width="40%" />
                    <Group gap="xl">
                      <Skeleton height={16} width={100} />
                      <Skeleton height={16} width={100} />
                      <Skeleton height={16} width={80} />
                    </Group>
                  </Stack>
                </Grid.Col>
              </Grid>
            </Card>
          ))}
        </Stack>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container size="xl" my="xl">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Ошибка загрузки"
          color="red"
        >
          {error?.message || 'Не удалось загрузить бронирования'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" my="xl">
      <Title order={1} mb="xl">Мои бронирования</Title>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List mb="xl">
          <Tabs.Tab value="upcoming">
            Предстоящие ({categorizedBookings.upcoming.length})
          </Tabs.Tab>
          <Tabs.Tab value="past">
            Прошедшие ({categorizedBookings.past.length})
          </Tabs.Tab>
          <Tabs.Tab value="cancelled">
            Отменённые ({categorizedBookings.cancelled.length})
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="upcoming">
          <Stack gap="md">
            {categorizedBookings.upcoming.length > 0 ? (
              categorizedBookings.upcoming.map(renderBookingCard)
            ) : (
              <Text c="dimmed" ta="center" py="xl">
                У вас нет предстоящих бронирований
              </Text>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="past">
          <Stack gap="md">
            {categorizedBookings.past.length > 0 ? (
              categorizedBookings.past.map(renderBookingCard)
            ) : (
              <Text c="dimmed" ta="center" py="xl">
                У вас нет прошедших бронирований
              </Text>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="cancelled">
          <Stack gap="md">
            {categorizedBookings.cancelled.length > 0 ? (
              categorizedBookings.cancelled.map(renderBookingCard)
            ) : (
              <Text c="dimmed" ta="center" py="xl">
                У вас нет отменённых бронирований
              </Text>
            )}
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}