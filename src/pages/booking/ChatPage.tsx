import { Container, Paper, Grid, Stack, Group, Text, Avatar, Badge, TextInput, ActionIcon, ScrollArea, Card, Button, FileButton, Image, Anchor } from '@mantine/core';
import { IconSend, IconPaperclip, IconPhone, IconVideo, IconMapPin, IconCalendar, IconClock, IconFile } from '@tabler/icons-react';
import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

const mockChat = {
  booking: {
    id: 1,
    listing: {
      title: 'Современная студия в центре',
      location: 'Алматы, Медеуский район',
      image: 'https://images.unsplash.com/photo-1565953522043-baea26b83b7e?w=400',
    },
    date: '2024-01-25',
    time: '10:00 - 14:00',
    status: 'confirmed',
    price: 40000,
  },
  host: {
    name: 'Айдар Сабиров',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    isOnline: true,
  },
  messages: [
    {
      id: 1,
      sender: 'host',
      text: 'Здравствуйте! Спасибо за бронирование. Я подтвердил вашу заявку.',
      timestamp: '10:30',
      date: '2024-01-20',
    },
    {
      id: 2,
      sender: 'guest',
      text: 'Здравствуйте! Отлично, спасибо. У меня есть несколько вопросов по локации.',
      timestamp: '10:35',
      date: '2024-01-20',
    },
    {
      id: 3,
      sender: 'guest',
      text: 'Можно ли привезти своё оборудование для освещения?',
      timestamp: '10:36',
      date: '2024-01-20',
    },
    {
      id: 4,
      sender: 'host',
      text: 'Конечно! У нас достаточно розеток и места для дополнительного оборудования.',
      timestamp: '10:40',
      date: '2024-01-20',
    },
    {
      id: 5,
      sender: 'host',
      text: 'Также у нас есть базовый комплект освещения, который вы можете использовать бесплатно.',
      timestamp: '10:41',
      date: '2024-01-20',
    },
    {
      id: 6,
      sender: 'guest',
      text: 'Отлично! А есть ли парковка для 3-4 машин?',
      timestamp: '11:00',
      date: '2024-01-20',
    },
    {
      id: 7,
      sender: 'host',
      text: 'Да, у нас есть бесплатная парковка на 5 мест прямо у входа.',
      timestamp: '11:05',
      date: '2024-01-20',
    },
    {
      id: 8,
      sender: 'host',
      type: 'file',
      fileName: 'parking_map.pdf',
      fileSize: '2.3 MB',
      text: 'Вот схема парковки и как к нам проехать',
      timestamp: '11:06',
      date: '2024-01-20',
    },
  ],
};

export function ChatPage() {
  const { id } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockChat.messages);
  const viewport = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'guest',
      text: message,
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
    };

    setMessages([...messages, newMessage]);
    setMessage('');
    
    // Scroll to bottom
    setTimeout(() => {
      viewport.current?.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const groupMessagesByDate = () => {
    const grouped: { [key: string]: typeof messages } = {};
    messages.forEach((msg) => {
      if (!grouped[msg.date]) {
        grouped[msg.date] = [];
      }
      grouped[msg.date].push(msg);
    });
    return grouped;
  };

  const groupedMessages = groupMessagesByDate();

  return (
    <Container size="xl" my="xl">
      <Grid gutter="xl">
        {/* Chat Section */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper shadow="sm" radius="md" withBorder h="calc(100vh - 200px)" style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Chat Header */}
            <Group p="md" justify="space-between" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
              <Group>
                <Avatar src={mockChat.host.avatar} radius="xl" />
                <div>
                  <Text fw={500}>{mockChat.host.name}</Text>
                  <Group gap={4}>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: mockChat.host.isOnline ? 'var(--mantine-color-green-6)' : 'var(--mantine-color-gray-5)',
                      }}
                    />
                    <Text size="xs" c="dimmed">
                      {mockChat.host.isOnline ? 'В сети' : 'Не в сети'}
                    </Text>
                  </Group>
                </div>
              </Group>
              <Group>
                <ActionIcon variant="light" size="lg" radius="md">
                  <IconPhone size={20} />
                </ActionIcon>
                <ActionIcon variant="light" size="lg" radius="md">
                  <IconVideo size={20} />
                </ActionIcon>
              </Group>
            </Group>

            {/* Messages */}
            <ScrollArea flex={1} p="md" viewportRef={viewport}>
              <Stack gap="md">
                {Object.entries(groupedMessages).map(([date, dayMessages]) => (
                  <div key={date}>
                    <Text size="xs" c="dimmed" ta="center" mb="md">
                      {new Date(date).toLocaleDateString('ru-RU', { 
                        day: 'numeric', 
                        month: 'long',
                        year: date === new Date().toISOString().split('T')[0] ? undefined : 'numeric'
                      })}
                    </Text>
                    {dayMessages.map((msg) => (
                      <Group
                        key={msg.id}
                        align="flex-start"
                        justify={msg.sender === 'guest' ? 'flex-end' : 'flex-start'}
                        mb="sm"
                      >
                        {msg.sender === 'host' && (
                          <Avatar src={mockChat.host.avatar} radius="xl" size="sm" />
                        )}
                        <Paper
                          p="sm"
                          radius="md"
                          maw="70%"
                          bg={msg.sender === 'guest' ? 'brand.0' : 'gray.0'}
                        >
                          {msg.type === 'file' ? (
                            <Stack gap={4}>
                              <Text size="sm">{msg.text}</Text>
                              <Paper p="xs" bg="gray.1" radius="sm">
                                <Group gap="xs">
                                  <IconFile size={20} />
                                  <div style={{ flex: 1 }}>
                                    <Anchor size="sm" fw={500}>
                                      {msg.fileName}
                                    </Anchor>
                                    <Text size="xs" c="dimmed">
                                      {msg.fileSize}
                                    </Text>
                                  </div>
                                </Group>
                              </Paper>
                            </Stack>
                          ) : (
                            <Text size="sm">{msg.text}</Text>
                          )}
                          <Text size="xs" c="dimmed" mt={4}>
                            {msg.timestamp}
                          </Text>
                        </Paper>
                      </Group>
                    ))}
                  </div>
                ))}
              </Stack>
            </ScrollArea>

            {/* Message Input */}
            <Group p="md" gap="sm" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
              <FileButton accept="image/*,application/pdf">
                {(props) => (
                  <ActionIcon {...props} variant="light" size="lg" radius="md">
                    <IconPaperclip size={20} />
                  </ActionIcon>
                )}
              </FileButton>
              <TextInput
                flex={1}
                placeholder="Введите сообщение..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                rightSection={
                  <ActionIcon onClick={sendMessage} disabled={!message.trim()}>
                    <IconSend size={18} />
                  </ActionIcon>
                }
              />
            </Group>
          </Paper>
        </Grid.Col>

        {/* Booking Info */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow="sm" radius="md" withBorder>
            <Stack gap="md">
              <Text fw={600} size="lg">Детали бронирования</Text>
              
              <Image
                src={mockChat.booking.listing.image}
                height={150}
                radius="md"
              />

              <div>
                <Text fw={500}>{mockChat.booking.listing.title}</Text>
                <Group gap="xs" mt={4}>
                  <IconMapPin size={16} />
                  <Text size="sm" c="dimmed">
                    {mockChat.booking.listing.location}
                  </Text>
                </Group>
              </div>

              <Stack gap="xs">
                <Group gap="xs">
                  <IconCalendar size={18} />
                  <Text size="sm">{mockChat.booking.date}</Text>
                </Group>
                <Group gap="xs">
                  <IconClock size={18} />
                  <Text size="sm">{mockChat.booking.time}</Text>
                </Group>
              </Stack>

              <Group justify="space-between">
                <Text>Статус</Text>
                <Badge color="green" variant="light">
                  Подтверждено
                </Badge>
              </Group>

              <Group justify="space-between">
                <Text>Стоимость</Text>
                <Text fw={600}>{mockChat.booking.price.toLocaleString()} ₸</Text>
              </Group>

              <Button fullWidth variant="light">
                Посмотреть полную информацию
              </Button>
            </Stack>
          </Card>

          {/* Quick Actions */}
          <Stack gap="sm" mt="md">
            <Button fullWidth variant="default" leftSection={<IconPhone size={18} />}>
              Позвонить хосту
            </Button>
            <Button fullWidth variant="default" leftSection={<IconMapPin size={18} />}>
              Показать на карте
            </Button>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
}