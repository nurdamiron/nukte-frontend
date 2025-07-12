import { Container, Grid, Card, Image, Text, Badge, Group, Stack, Button, TextInput, Select, RangeSlider, Checkbox, Paper, Title, Pagination, ActionIcon, Drawer, NumberInput, MultiSelect, SegmentedControl, Center, Loader, Alert, Divider, ThemeIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch, IconFilter, IconMapPin, IconStar, IconAdjustments, IconMap, IconList, IconAlertCircle, IconVideo, IconCamera, IconClock, IconBolt, IconUsers, IconSparkles } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { listingsService } from '../../services/listings.service';
import type { SearchParams, Listing, ShootingType } from '../../types/api.types';

const ITEMS_PER_PAGE = 12;

const cities = ['Все города', 'Алматы', 'Астана', 'Шымкент', 'Караганда', 'Актобе'];
const categories = [
  { value: 'all', label: 'Все локации' },
  { value: 'urban', label: 'Городские' },
  { value: 'nature', label: 'Природа' },
  { value: 'industrial', label: 'Индустриальные' },
  { value: 'abandoned', label: 'Заброшенные' },
  { value: 'rooftop', label: 'Крыши' },
  { value: 'modern', label: 'Современные' },
  { value: 'vintage', label: 'Винтажные' },
  { value: 'minimalist', label: 'Минимализм' },
];

const shootingTypes = [
  { value: 'photo', label: 'Фотосессия' },
  { value: 'video', label: 'Видеосъёмка' },
  { value: 'cinema', label: 'Кино' },
  { value: 'commercial', label: 'Реклама' },
  { value: 'fashion', label: 'Мода' },
  { value: 'music_video', label: 'Клип' },
  { value: 'documentary', label: 'Документалка' },
];

const equipmentOptions = [
  { value: 'professional_cameras', label: 'Профессиональные камеры' },
  { value: 'lighting_equipment', label: 'Световое оборудование' },
  { value: 'drones', label: 'Дроны' },
  { value: 'tripods', label: 'Штативы' },
  { value: 'sound_equipment', label: 'Звуковое оборудование' },
  { value: 'green_screen', label: 'Хромакей' },
];

const timeOptions = [
  { value: 'daytime_only', label: 'Только днём' },
  { value: 'nighttime_only', label: 'Только ночью' },
  { value: 'weekends_only', label: 'Только выходные' },
  { value: 'no_restrictions', label: 'Без ограничений' },
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [opened, { open, close }] = useDisclosure(false);
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>('createdAt:desc');
  
  // Initialize filters from URL params
  const [filters, setFilters] = useState({
    search: searchParams.get('query') || '',
    city: searchParams.get('city') || '',
    category: searchParams.get('category') || '',
    priceRange: [0, 200000] as [number, number],
    area: [0, 500] as [number, number],
    teamSize: [1, 50] as [number, number],
    amenities: [] as string[],
    shootingTypes: [] as ShootingType[],
    allowedEquipment: [] as string[],
    timeRestrictions: [] as string[],
    hasElectricity: false,
    hasWifi: false,
    hasParking: false,
    requiresPermit: false,
  });

  // Debounce search input
  const [debouncedSearch] = useDebouncedValue(filters.search, 500);

  // Build query parameters
  const buildQueryParams = (): SearchParams => {
    const [sortField, sortOrder] = sortBy.split(':') as [any, 'asc' | 'desc'];
    
    const params: SearchParams = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      sortBy: sortField,
      sortOrder,
    };

    if (debouncedSearch) params.query = debouncedSearch;
    if (filters.city && filters.city !== 'Все города') params.city = filters.city;
    if (filters.category && filters.category !== 'all') params.category = filters.category;
    if (filters.priceRange[0] > 0) params.priceMin = filters.priceRange[0];
    if (filters.priceRange[1] < 200000) params.priceMax = filters.priceRange[1];
    if (filters.area[0] > 0) params.areaMin = filters.area[0];
    if (filters.area[1] < 500) params.areaMax = filters.area[1];
    if (filters.teamSize[0] > 1) params.teamSizeMin = filters.teamSize[0];
    if (filters.teamSize[1] < 50) params.teamSizeMax = filters.teamSize[1];
    if (filters.amenities.length > 0) params.amenities = filters.amenities;
    if (filters.shootingTypes.length > 0) params.shootingTypes = filters.shootingTypes;
    if (filters.allowedEquipment.length > 0) params.allowedEquipment = filters.allowedEquipment;
    if (filters.timeRestrictions.length > 0) params.timeRestrictions = filters.timeRestrictions;
    if (filters.hasElectricity) params.hasElectricity = true;
    if (filters.hasWifi) params.hasWifi = true;
    if (filters.hasParking) params.hasParking = true;
    if (filters.requiresPermit) params.requiresPermit = true;

    return params;
  };

  // Fetch listings using React Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['listings', debouncedSearch, filters, currentPage, sortBy],
    queryFn: () => listingsService.searchListings(buildQueryParams()),
  });

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('query', filters.search);
    if (filters.city && filters.city !== 'Все города') params.set('city', filters.city);
    if (filters.category && filters.category !== 'all') params.set('category', filters.category);
    setSearchParams(params);
  }, [filters.search, filters.city, filters.category]);

  // Get primary image URL for a listing
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

  // Get listing location
  const getLocation = (listing: Listing): string => {
    return `${listing.city}${listing.address ? ', ' + listing.address : ''}`;
  };

  // Get category display name
  const getCategoryLabel = (category: string): string => {
    const categoryMap: Record<string, string> = {
      urban: 'Городская',
      nature: 'Природа',
      industrial: 'Индустриальная',
      abandoned: 'Заброшенная',
      rooftop: 'Крыша',
      modern: 'Современная',
      vintage: 'Винтажная',
      minimalist: 'Минимализм',
      historical: 'Историческая',
      underground: 'Подземная',
      water: 'У воды',
      architectural: 'Архитектурная',
    };
    return categoryMap[category] || category;
  };

  return (
    <Container size="xl" my="xl">
      {/* Header */}
      <Stack gap="lg" mb="xl">
        <Group gap="md">
          <ThemeIcon size="xl" variant="gradient" gradient={{ from: 'violet', to: 'purple' }} radius="xl">
            <IconSparkles size={28} />
          </ThemeIcon>
          <Title order={1}>Найти локацию для съёмки</Title>
        </Group>
        
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
              onChange={(value) => {
                setFilters({ ...filters, city: value || '' });
                setCurrentPage(1);
              }}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 2 }}>
            <Select
              size="md"
              placeholder="Тип локации"
              data={categories}
              value={filters.category}
              onChange={(value) => {
                setFilters({ ...filters, category: value || '' });
                setCurrentPage(1);
              }}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 2 }}>
            <Select
              size="md"
              placeholder="Тип съёмки"
              data={[
                { value: '', label: 'Все типы' },
                ...shootingTypes
              ]}
              value={filters.shootingTypes[0] || ''}
              onChange={(value) => {
                setFilters({ ...filters, shootingTypes: value ? [value] : [] });
                setCurrentPage(1);
              }}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 1 }}>
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
        <Text c="dimmed">
          {isLoading ? 'Загрузка...' : data ? `Найдено ${data.total} локаций` : 'Нет результатов'}
        </Text>
        <Select
          size="sm"
          placeholder="Сортировка"
          data={[
            { value: 'createdAt:desc', label: 'По новизне' },
            { value: 'price:asc', label: 'Сначала дешевые' },
            { value: 'price:desc', label: 'Сначала дорогие' },
            { value: 'rating:desc', label: 'По рейтингу' },
          ]}
          value={sortBy}
          onChange={(value) => {
            setSortBy(value || 'createdAt:desc');
            setCurrentPage(1);
          }}
        />
      </Group>

      {/* Loading State */}
      {isLoading && (
        <Center h={400}>
          <Loader size="lg" />
        </Center>
      )}

      {/* Error State */}
      {isError && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Ошибка загрузки"
          color="red"
          mb="xl"
        >
          {error?.message || 'Не удалось загрузить локации. Попробуйте обновить страницу.'}
        </Alert>
      )}

      {/* Listings Grid */}
      {!isLoading && !isError && viewMode === 'grid' && data?.data ? (
        <Grid mb="xl">
          {data.data.map((listing) => (
            <Grid.Col key={listing.id} span={{ base: 12, xs: 6, sm: 6, md: 4, lg: 3 }}>
              <Card
                shadow="sm"
                radius="md"
                withBorder
                h="100%"
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                onClick={() => navigate(`/listings/${listing.id}`)}
              >
                <Card.Section>
                  <Image
                    src={getPrimaryImage(listing)}
                    height={200}
                    alt={listing.title}
                  />
                </Card.Section>

                <Stack gap="sm" mt="md" style={{ flex: 1 }}>
                  <Group justify="space-between" align="flex-start" wrap="nowrap">
                    <Text fw={600} size="lg" lineClamp={2} style={{ flex: 1 }}>
                      {listing.title}
                    </Text>
                    <Badge color="brand" variant="light" size="sm" style={{ flexShrink: 0 }}>
                      {formatPrice(listing)}
                    </Badge>
                  </Group>

                  <Group gap="xs">
                    <IconMapPin size={16} style={{ flexShrink: 0 }} />
                    <Text size="sm" c="dimmed" lineClamp={1}>
                      {getLocation(listing)}
                    </Text>
                  </Group>

                  <Group justify="space-between" wrap="wrap" gap="xs">
                    <Group gap="xs">
                      <IconStar size={16} fill="currentColor" />
                      <Text size="sm" fw={500}>
                        {listing.rating || 0}
                      </Text>
                      <Text size="sm" c="dimmed">
                        ({listing.reviewsCount || 0})
                      </Text>
                    </Group>
                    <Text size="xs" c="dimmed">
                      {listing.area} м² • до {listing.teamSize || listing.maxGuests} чел
                    </Text>
                  </Group>

                  <Group gap={4} style={{ marginTop: 'auto' }}>
                    <Badge size="sm" variant="dot">
                      {getCategoryLabel(listing.category)}
                    </Badge>
                    {listing.amenities?.slice(0, 2).map((amenity) => (
                      <Badge key={amenity} size="sm" variant="dot" color="gray">
                        {amenity}
                      </Badge>
                    ))}
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      ) : viewMode === 'map' ? (
        <Center h={400}>
          <Text c="dimmed">Карта в разработке</Text>
        </Center>
      ) : null}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <Center>
          <Pagination 
            total={data.totalPages} 
            value={currentPage}
            onChange={setCurrentPage}
            mt="xl"
          />
        </Center>
      )}

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

          <div>
            <Text size="sm" fw={500} mb="xs">
              Размер команды
            </Text>
            <RangeSlider
              min={1}
              max={50}
              step={1}
              value={filters.teamSize}
              onChange={(value) => setFilters({ ...filters, teamSize: value })}
              marks={[
                { value: 1, label: '1' },
                { value: 25, label: '25' },
                { value: 50, label: '50' },
              ]}
              mb="sm"
            />
          </div>

          <Divider label="Съёмочные характеристики" />

          <MultiSelect
            label="Типы съёмок"
            placeholder="Выберите типы съёмок"
            data={shootingTypes}
            value={filters.shootingTypes}
            onChange={(value) => setFilters({ ...filters, shootingTypes: value as ShootingType[] })}
          />

          <MultiSelect
            label="Разрешённое оборудование"
            placeholder="Выберите оборудование"
            data={equipmentOptions}
            value={filters.allowedEquipment}
            onChange={(value) => setFilters({ ...filters, allowedEquipment: value })}
          />

          <MultiSelect
            label="Временные ограничения"
            placeholder="Выберите ограничения"
            data={timeOptions}
            value={filters.timeRestrictions}
            onChange={(value) => setFilters({ ...filters, timeRestrictions: value })}
          />

          <Divider label="Технические характеристики" />

          <Stack gap="sm">
            <Checkbox
              label="Электричество"
              checked={filters.hasElectricity}
              onChange={(event) => setFilters({ ...filters, hasElectricity: event.currentTarget.checked })}
            />
            <Checkbox
              label="Wi-Fi"
              checked={filters.hasWifi}
              onChange={(event) => setFilters({ ...filters, hasWifi: event.currentTarget.checked })}
            />
            <Checkbox
              label="Парковка"
              checked={filters.hasParking}
              onChange={(event) => setFilters({ ...filters, hasParking: event.currentTarget.checked })}
            />
            <Checkbox
              label="Требуется разрешение"
              checked={filters.requiresPermit}
              onChange={(event) => setFilters({ ...filters, requiresPermit: event.currentTarget.checked })}
            />
          </Stack>

          <Divider label="Базовые удобства" />

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
                city: '',
                category: '',
                priceRange: [0, 200000],
                area: [0, 500],
                teamSize: [1, 50],
                amenities: [],
                shootingTypes: [],
                allowedEquipment: [],
                timeRestrictions: [],
                hasElectricity: false,
                hasWifi: false,
                hasParking: false,
                requiresPermit: false,
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