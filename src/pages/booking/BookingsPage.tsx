import { Container, Title, Tabs, Grid, Card, Image, Text, Badge, Group, Stack, Button, Timeline, Paper, Avatar, ActionIcon } from '@mantine/core';
import { IconCalendar, IconClock, IconMapPin, IconMessage, IconFileDescription, IconCheck, IconX, IconClock2, IconStar } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mockBookings = {
  upcoming: [
    {
      id: 1,
      listing: {
        id: 1,
        title: 'Современная студия в центре',
        image: 'https://images.unsplash.com/photo-1565953522043-baea26b83b7e?w=400',
        location: 'Алматы, Медеуский район',
      },
      date: '2024-01-25',
      time: '10:00 - 14:00',
      status: 'confirmed',
      price: 40000,
      host: {
        name: 'Айдар Сабиров',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      },
    },
    {
      id: 2,
      listing: {
        id: 2,
        title: 'Лофт с панорамными окнами',
        image: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=400',
        location: 'Астана, Есильский район',
      },
      date: '2024-02-01',
      time: '14:00 - 18:00',
      status: 'pending',
      price: 60000,
      host: {
        name: 'Карина Досова',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      },
    },
  ],
  past: [
    {
      id: 3,
      listing: {
        id: 3,
        title: 'Загородный дом с садом',
        image: 'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=400',
        location: 'Алматинская область',
      },
      date: '2024-01-10',
      time: '09:00 - 18:00',
      status: 'completed',
      price: 120000,
      host: {
        name: 'Ержан Токаев',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      },
      canReview: true,
    },
  ],
  cancelled: [
    {
      id: 4,
      listing: {
        id: 4,
        title: 'Минималистичный офис',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
        location: 'Шымкент, центр',
      },
      date: '2024-01-05',
      time: '12:00 - 16:00',
      status: 'cancelled',
      price: 32000,
      host: {
        name: 'Мадина Алиева',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      },
      cancelledBy: 'host',
      reason: 'Локация недоступна в указанную дату',
    },
  ],
};

const statusColors = {
  pending: 'yellow',
  confirmed: 'green',
  completed: 'blue',
  cancelled: 'red',
};

const statusLabels = {
  pending: 'Ожидает подтверждения',
  confirmed: 'Подтверждено',
  completed: 'Завершено',
  cancelled: 'Отменено',
};

export function BookingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string | null>('upcoming');

  const renderBookingCard = (booking: any) => (
    <Card key={booking.id} shadow="sm" radius="md" withBorder>
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Image
            src={booking.listing.image}
            height={150}
            radius="md"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/listings/${booking.listing.id}`)}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 8 }}>
          <Stack gap="sm">
            <Group justify="space-between" align="flex-start">
              <div>
                <Text fw={600} size="lg">
                  {booking.listing.title}
                </Text>
                <Group gap="xs" mt={4}>
                  <IconMapPin size={16} />
                  <Text size="sm" c="dimmed">
                    {booking.listing.location}
                  </Text>
                </Group>
              </div>
              <Badge color={statusColors[booking.status]} variant="light">
                {statusLabels[booking.status]}
              </Badge>
            </Group>

            <Group gap="xl">
              <Group gap="xs">
                <IconCalendar size={16} />
                <Text size="sm">{booking.date}</Text>
              </Group>
              <Group gap="xs">
                <IconClock size={16} />
                <Text size="sm">{booking.time}</Text>
              </Group>
              <Text size="sm" fw={600}>
                {booking.price.toLocaleString()} ₸
              </Text>
            </Group>

            <Group justify="space-between" align="center">
              <Group gap="xs">
                <Avatar src={booking.host.avatar} size="sm" radius="xl" />
                <Text size="sm">{booking.host.name}</Text>
              </Group>

              <Group gap="xs">
                {booking.status === 'confirmed' && (
                  <>
                    <Button
                      size="sm"
                      variant="light"
                      leftSection={<IconMessage size={16} />}
                      onClick={() => navigate(`/bookings/${booking.id}/chat`)}
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
                  >
                    Отменить
                  </Button>
                )}
                {booking.canReview && (
                  <Button
                    size="sm"
                    leftSection={<IconStar size={16} />}
                  >
                    Оставить отзыв
                  </Button>
                )}
              </Group>
            </Group>

            {booking.status === 'cancelled' && (
              <Paper p="sm" bg="red.0" radius="sm">
                <Text size="sm" c="red">
                  Отменено {booking.cancelledBy === 'host' ? 'хостом' : 'вами'}: {booking.reason}
                </Text>
              </Paper>
            )}
          </Stack>
        </Grid.Col>
      </Grid>
    </Card>
  );

  return (
    <Container size="xl" my="xl">
      <Title order={1} mb="xl">Мои бронирования</Title>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List mb="xl">
          <Tabs.Tab value="upcoming">
            Предстоящие ({mockBookings.upcoming.length})
          </Tabs.Tab>
          <Tabs.Tab value="past">
            Прошедшие ({mockBookings.past.length})
          </Tabs.Tab>
          <Tabs.Tab value="cancelled">
            Отменённые ({mockBookings.cancelled.length})
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="upcoming">
          <Stack gap="md">
            {mockBookings.upcoming.map(renderBookingCard)}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="past">
          <Stack gap="md">
            {mockBookings.past.map(renderBookingCard)}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="cancelled">
          <Stack gap="md">
            {mockBookings.cancelled.map(renderBookingCard)}
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}