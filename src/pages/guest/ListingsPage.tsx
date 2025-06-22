import { Container, Grid, Card, Image, Text, Badge, Group, Stack, Button, TextInput, Select, RangeSlider, Checkbox, Paper, Title, Pagination, ActionIcon, Drawer, NumberInput, MultiSelect, SegmentedControl, Center, Loader } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch, IconFilter, IconMapPin, IconStar, IconAdjustments, IconMap, IconList } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mockListings = [
  {
    id: 1,
    title: 'Современная студия в центре',
    image: 'https://images.unsplash.com/photo-1565953522043-baea26b83b7e?w=400',
    price: '50 000 ₸/день',
    pricePerHour: 10000,
    rating: 4.8,
    reviews: 12,
    location: 'Алматы, Медеуский район',
    area: 120,
    maxGuests: 30,
    tags: ['Студия', 'Центр'],
    amenities: ['parking', 'wifi', 'bathroom'],
  },
  {
    id: 2,
    title: 'Лофт с панорамными окнами',
    image: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=400',
    price: '80 000 ₸/день',
    pricePerHour: 15000,
    rating: 4.9,
    reviews: 8,
    location: 'Астана, Есильский район',
    area: 200,
    maxGuests: 50,
    tags: ['Лофт', 'Вид на город'],
    amenities: ['parking', 'wifi', 'bathroom', 'kitchen'],
  },
  {
    id: 3,
    title: 'Загородный дом с садом',
    image: 'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=400',
    price: '120 000 ₸/день',
    pricePerHour: 20000,
    rating: 5.0,
    reviews: 5,
    location: 'Алматинская область',
    area: 300,
    maxGuests: 100,
    tags: ['Природа', 'Сад'],
    amenities: ['parking', 'wifi', 'bathroom', 'kitchen', 'heating'],
  },
  {
    id: 4,
    title: 'Минималистичный офис',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
    price: '40 000 ₸/день',
    pricePerHour: 8000,
    rating: 4.7,
    reviews: 15,
    location: 'Шымкент, центр',
    area: 80,
    maxGuests: 20,
    tags: ['Офис', 'Минимализм'],
    amenities: ['wifi', 'bathroom', 'air_conditioning'],
  },
];

const cities = ['Все города', 'Алматы', 'Астана', 'Шымкент', 'Караганда', 'Актобе'];
const categories = [
  { value: 'all', label: 'Все категории' },
  { value: 'studio', label: 'Студии' },
  { value: 'outdoor', label: 'Открытые пространства' },
  { value: 'industrial', label: 'Индустриальные' },
  { value: 'residential', label: 'Жилые помещения' },
  { value: 'commercial', label: 'Коммерческие' },
];

const amenitiesOptions = [
  { value: 'parking', label: 'Парковка' },
  { value: 'wifi', label: 'Wi-Fi' },
  { value: 'bathroom', label: 'Санузел' },
  { value: 'kitchen', label: 'Кухня' },
  { value: 'electricity', label: 'Электричество' },
  { value: 'heating', label: 'Отопление' },
  { value: 'air_conditioning', label: 'Кондиционер' },
  { value: 'elevator', label: 'Лифт' },
];

export function ListingsPage() {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    search: '',
    city: 'Все города',
    category: 'all',
    priceRange: [0, 200000] as [number, number],
    area: [0, 500] as [number, number],
    amenities: [] as string[],
  });

  return (
    <Container size="xl" my="xl">
      {/* Header */}
      <Stack gap="lg" mb="xl">
        <Title order={1}>Найти локацию для съёмки</Title>
        
        {/* Search Bar */}
        <Grid gutter="sm">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              size="md"
              placeholder="Поиск по названию или описанию..."
              leftSection={<IconSearch size={18} />}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 2 }}>
            <Select
              size="md"
              placeholder="Город"
              data={cities}
              value={filters.city}
              onChange={(value) => setFilters({ ...filters, city: value || 'Все города' })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 2 }}>
            <Select
              size="md"
              placeholder="Категория"
              data={categories}
              value={filters.category}
              onChange={(value) => setFilters({ ...filters, category: value || 'all' })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 2 }}>
            <Group gap="xs">
              <Button
                size="md"
                variant="light"
                leftSection={<IconAdjustments size={18} />}
                onClick={open}
                fullWidth
              >
                Фильтры
              </Button>
              <SegmentedControl
                size="md"
                value={viewMode}
                onChange={setViewMode}
                data={[
                  { label: <IconList size={18} />, value: 'grid' },
                  { label: <IconMap size={18} />, value: 'map' },
                ]}
              />
            </Group>
          </Grid.Col>
        </Grid>
      </Stack>

      {/* Results */}
      <Group justify="space-between" mb="md">
        <Text c="dimmed">Найдено {mockListings.length} локаций</Text>
        <Select
          size="sm"
          placeholder="Сортировка"
          data={[
            { value: 'popular', label: 'По популярности' },
            { value: 'price_asc', label: 'Сначала дешевые' },
            { value: 'price_desc', label: 'Сначала дорогие' },
            { value: 'rating', label: 'По рейтингу' },
          ]}
          defaultValue="popular"
        />
      </Group>

      {/* Listings Grid */}
      {viewMode === 'grid' ? (
        <Grid mb="xl">
          {mockListings.map((listing) => (
            <Grid.Col key={listing.id} span={{ base: 12, sm: 6, md: 4 }}>
              <Card
                shadow="sm"
                radius="md"
                withBorder
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/listings/${listing.id}`)}
              >
                <Card.Section>
                  <Image
                    src={listing.image}
                    height={200}
                    alt={listing.title}
                  />
                </Card.Section>

                <Stack gap="sm" mt="md">
                  <Group justify="space-between" align="flex-start">
                    <Text fw={600} size="lg" lineClamp={1}>
                      {listing.title}
                    </Text>
                    <Badge color="brand" variant="light">
                      {listing.price}
                    </Badge>
                  </Group>

                  <Group gap="xs">
                    <IconMapPin size={16} />
                    <Text size="sm" c="dimmed">
                      {listing.location}
                    </Text>
                  </Group>

                  <Group justify="space-between">
                    <Group gap="xs">
                      <IconStar size={16} fill="currentColor" />
                      <Text size="sm" fw={500}>
                        {listing.rating}
                      </Text>
                      <Text size="sm" c="dimmed">
                        ({listing.reviews})
                      </Text>
                    </Group>
                    <Group gap="xs">
                      <Text size="xs" c="dimmed">
                        {listing.area} м² • до {listing.maxGuests} чел
                      </Text>
                    </Group>
                  </Group>

                  <Group gap={4}>
                    {listing.tags.map((tag) => (
                      <Badge key={tag} size="sm" variant="dot">
                        {tag}
                      </Badge>
                    ))}
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      ) : (
        <Center h={400}>
          <Text c="dimmed">Карта в разработке</Text>
        </Center>
      )}

      {/* Pagination */}
      <Center>
        <Pagination total={5} />
      </Center>

      {/* Filters Drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        title="Фильтры"
        position="right"
        size="sm"
      >
        <Stack gap="lg">
          <div>
            <Text size="sm" fw={500} mb="xs">
              Цена за день (₸)
            </Text>
            <RangeSlider
              min={0}
              max={200000}
              step={5000}
              value={filters.priceRange}
              onChange={(value) => setFilters({ ...filters, priceRange: value })}
              marks={[
                { value: 0, label: '0' },
                { value: 100000, label: '100к' },
                { value: 200000, label: '200к' },
              ]}
              mb="sm"
            />
            <Group grow>
              <NumberInput
                size="sm"
                placeholder="От"
                value={filters.priceRange[0]}
                onChange={(value) => 
                  setFilters({ ...filters, priceRange: [Number(value), filters.priceRange[1]] })
                }
              />
              <NumberInput
                size="sm"
                placeholder="До"
                value={filters.priceRange[1]}
                onChange={(value) => 
                  setFilters({ ...filters, priceRange: [filters.priceRange[0], Number(value)] })
                }
              />
            </Group>
          </div>

          <div>
            <Text size="sm" fw={500} mb="xs">
              Площадь (м²)
            </Text>
            <RangeSlider
              min={0}
              max={500}
              step={10}
              value={filters.area}
              onChange={(value) => setFilters({ ...filters, area: value })}
              marks={[
                { value: 0, label: '0' },
                { value: 250, label: '250' },
                { value: 500, label: '500' },
              ]}
              mb="sm"
            />
          </div>

          <MultiSelect
            label="Удобства"
            placeholder="Выберите удобства"
            data={amenitiesOptions}
            value={filters.amenities}
            onChange={(value) => setFilters({ ...filters, amenities: value })}
          />

          <Group grow mt="xl">
            <Button variant="default" onClick={() => {
              setFilters({
                search: '',
                city: 'Все города',
                category: 'all',
                priceRange: [0, 200000],
                area: [0, 500],
                amenities: [],
              });
              close();
            }}>
              Сбросить
            </Button>
            <Button onClick={close}>
              Применить
            </Button>
          </Group>
        </Stack>
      </Drawer>
    </Container>
  );
}