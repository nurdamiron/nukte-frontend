import { Container, Title, Text, Button, Grid, Card, Image, Badge, Group, Stack, Box, BackgroundImage, Center, TextInput, Select, ActionIcon } from '@mantine/core';
import { IconSearch, IconMapPin, IconCalendar, IconArrowRight, IconStar } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import classes from './HomePage.module.css';

const featuredLocations = [
  {
    id: 1,
    title: 'Современная студия в центре',
    image: 'https://images.unsplash.com/photo-1565953522043-baea26b83b7e?w=400',
    price: '50 000 ₸/день',
    rating: 4.8,
    reviews: 12,
    location: 'Алматы',
    tags: ['Студия', 'Центр']
  },
  {
    id: 2,
    title: 'Лофт с панорамными окнами',
    image: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=400',
    price: '80 000 ₸/день',
    rating: 4.9,
    reviews: 8,
    location: 'Астана',
    tags: ['Лофт', 'Вид на город']
  },
  {
    id: 3,
    title: 'Загородный дом с садом',
    image: 'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=400',
    price: '120 000 ₸/день',
    rating: 5.0,
    reviews: 5,
    location: 'Алматинская область',
    tags: ['Природа', 'Сад']
  },
];

const categories = [
  { value: 'studio', label: 'Студии' },
  { value: 'outdoor', label: 'Открытые пространства' },
  { value: 'industrial', label: 'Индустриальные' },
  { value: 'residential', label: 'Жилые помещения' },
  { value: 'commercial', label: 'Коммерческие' },
  { value: 'event', label: 'Event-пространства' },
];

export function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <Box pos="relative" h={{ base: 500, md: 600 }} mb="xl">
        <BackgroundImage
          src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1600"
          radius="md"
          h="100%"
        >
          <Box
            pos="absolute"
            inset={0}
            bg="rgba(0, 0, 0, 0.5)"
            style={{ borderRadius: 'var(--mantine-radius-md)' }}
          />
          <Center h="100%" pos="relative" style={{ zIndex: 1 }}>
            <Stack align="center" gap="xl" maw={800} px="md">
              <Title
                order={1}
                size={{ base: 32, md: 48 }}
                ta="center"
                c="white"
                fw={700}
              >
                Найдите идеальную локацию для вашей съёмки
              </Title>
              <Text
                size="xl"
                ta="center"
                c="white"
                opacity={0.9}
                maw={600}
              >
                Более 1000 уникальных пространств для фото, видео и мероприятий по всему Казахстану
              </Text>
              
              {/* Search Form */}
              <Card shadow="lg" radius="lg" p="md" w="100%" maw={700}>
                <Grid gutter="sm">
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <TextInput
                      placeholder="Где?"
                      leftSection={<IconMapPin size={18} />}
                      size="md"
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Select
                      placeholder="Тип локации"
                      data={categories}
                      size="md"
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <TextInput
                      placeholder="Дата"
                      leftSection={<IconCalendar size={18} />}
                      size="md"
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 2 }}>
                    <Button
                      fullWidth
                      size="md"
                      leftSection={<IconSearch size={18} />}
                      onClick={() => navigate('/listings')}
                    >
                      Найти
                    </Button>
                  </Grid.Col>
                </Grid>
              </Card>
            </Stack>
          </Center>
        </BackgroundImage>
      </Box>

      {/* Categories */}
      <Stack gap="xl" mb="xl">
        <Group justify="space-between" align="center">
          <Title order={2}>Популярные категории</Title>
          <Button
            variant="subtle"
            rightSection={<IconArrowRight size={16} />}
            onClick={() => navigate('/listings')}
          >
            Все категории
          </Button>
        </Group>

        <Grid>
          {categories.map((category) => (
            <Grid.Col key={category.value} span={{ base: 6, sm: 4, md: 2 }}>
              <Card
                shadow="sm"
                radius="md"
                withBorder
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/listings?category=${category.value}`)}
              >
                <Stack align="center" gap="xs">
                  <Text size="sm" fw={500}>
                    {category.label}
                  </Text>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Stack>

      {/* Featured Locations */}
      <Stack gap="xl" mb="xl">
        <Group justify="space-between" align="center">
          <Title order={2}>Рекомендуемые локации</Title>
          <Button
            variant="subtle"
            rightSection={<IconArrowRight size={16} />}
            onClick={() => navigate('/listings')}
          >
            Все локации
          </Button>
        </Group>

        <Grid>
          {featuredLocations.map((location) => (
            <Grid.Col key={location.id} span={{ base: 12, sm: 6, md: 4 }}>
              <Card
                shadow="sm"
                radius="md"
                withBorder
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/listings/${location.id}`)}
              >
                <Card.Section>
                  <Image
                    src={location.image}
                    height={200}
                    alt={location.title}
                  />
                </Card.Section>

                <Stack gap="sm" mt="md">
                  <Group justify="space-between" align="flex-start">
                    <Text fw={600} size="lg" lineClamp={1}>
                      {location.title}
                    </Text>
                    <Badge color="brand" variant="light">
                      {location.price}
                    </Badge>
                  </Group>

                  <Group gap="xs">
                    <IconMapPin size={16} />
                    <Text size="sm" c="dimmed">
                      {location.location}
                    </Text>
                  </Group>

                  <Group justify="space-between" align="center">
                    <Group gap="xs">
                      <IconStar size={16} fill="currentColor" />
                      <Text size="sm" fw={500}>
                        {location.rating}
                      </Text>
                      <Text size="sm" c="dimmed">
                        ({location.reviews} отзывов)
                      </Text>
                    </Group>
                    <Group gap={4}>
                      {location.tags.map((tag) => (
                        <Badge key={tag} size="sm" variant="dot">
                          {tag}
                        </Badge>
                      ))}
                    </Group>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Stack>

      {/* CTA Section */}
      <Card shadow="lg" radius="lg" p="xl" mb="xl" bg="brand.0">
        <Grid align="center">
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Title order={3} mb="sm">
              Есть пространство для съёмок?
            </Title>
            <Text size="lg" c="dimmed">
              Начните зарабатывать, сдавая свою локацию для фото и видеосъёмок
            </Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Button
              size="lg"
              fullWidth
              onClick={() => navigate('/host/listings/create')}
            >
              Стать хостом
            </Button>
          </Grid.Col>
        </Grid>
      </Card>
    </>
  );
}