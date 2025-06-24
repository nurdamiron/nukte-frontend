import { Container, Title, Text, Button, Grid, Card, Image, Badge, Group, Stack, Box, BackgroundImage, Center, TextInput, Select, ActionIcon, ThemeIcon, Transition, Paper, Overlay, Skeleton, Alert } from '@mantine/core';
import { IconSearch, IconMapPin, IconCalendar, IconArrowRight, IconStar, IconPhoto, IconTrees, IconBuildingSkyscraper, IconHome, IconBuildingStore, IconBalloon, IconSparkles, IconAlertCircle } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { listingsService } from '../../services/listings.service';
import type { Listing } from '../../types/api.types';
import classes from './HomePage.module.css';


const categories = [
  { value: 'studio', label: 'Студии', icon: IconPhoto, color: 'blue' },
  { value: 'outdoor', label: 'Открытые пространства', icon: IconTrees, color: 'green' },
  { value: 'industrial', label: 'Индустриальные', icon: IconBuildingSkyscraper, color: 'orange' },
  { value: 'residential', label: 'Жилые помещения', icon: IconHome, color: 'pink' },
  { value: 'commercial', label: 'Коммерческие', icon: IconBuildingStore, color: 'gray' },
  { value: 'event', label: 'Event-пространства', icon: IconBalloon, color: 'violet' },
];

export function HomePage() {
  const navigate = useNavigate();

  // Fetch featured listings from API
  const { data: featuredListings, isLoading: isLoadingFeatured, isError: isErrorFeatured } = useQuery({
    queryKey: ['featured-listings'],
    queryFn: () => listingsService.getListings({ 
      limit: 8, 
      sortBy: 'rating',
      sortOrder: 'desc' 
    }),
  });

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

  // Get category display name
  const getCategoryLabel = (category: string): string => {
    const categoryMap: Record<string, string> = {
      studio: 'Студия',
      outdoor: 'Открытое пространство',
      industrial: 'Индустриальное',
      residential: 'Жилое помещение',
      commercial: 'Коммерческое',
      event: 'Event-пространство',
    };
    return categoryMap[category] || category;
  };

  return (
    <>
      {/* Hero Section */}
      <Box pos="relative" h={{ base: 450, xs: 500, sm: 550, md: 600 }} mb="xl">
        <BackgroundImage
          src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1600"
          radius="md"
          h="100%"
        >
          <Box
            pos="absolute"
            inset={0}
            bg="linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 100%)"
            style={{ borderRadius: 'var(--mantine-radius-md)' }}
          />
          <Center h="100%" pos="relative" style={{ zIndex: 1 }}>
            <Stack align="center" gap="xl" maw={1000} px="md" py="xl">
              <Title
                order={1}
                size="xl"
                ta="center"
                c="white"
                fw={700}
                px="md"
                style={{ 
                  textShadow: '0 2px 20px rgba(0, 0, 0, 0.5)',
                  lineHeight: 1.2
                }}
              >
                Найдите идеальную локацию для вашей съёмки
              </Title>
              <Text
                size="lg"
                ta="center"
                c="white"
                opacity={0.9}
                maw={700}
                px="md"
                style={{ textShadow: '0 1px 10px rgba(0, 0, 0, 0.5)' }}
              >
                Более 1000 уникальных пространств для фото, видео и мероприятий по всему Казахстану
              </Text>
              
              {/* Search Form */}
              <Paper 
                shadow="xl" 
                radius="xl" 
                p={{ base: "md", sm: "lg", md: "xl" }} 
                w="100%" 
                maw={1000} 
                style={{ 
                  backdropFilter: 'blur(20px)', 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.5)'
                }}
              >
                <Stack gap="sm">
                  <Grid gutter="md">
                    <Grid.Col span={{ base: 12, xs: 12, sm: 12, md: 5 }}>
                      <TextInput
                        placeholder="Город или адрес"
                        leftSection={
                          <ThemeIcon size="sm" variant="light" color="violet" radius="xl">
                            <IconMapPin size={16} />
                          </ThemeIcon>
                        }
                        size="md"
                        radius="md"
                        styles={{
                          input: {
                            border: '2px solid var(--mantine-color-gray-2)',
                            transition: 'border-color 0.2s ease',
                            '&:focus': {
                              borderColor: 'var(--mantine-color-violet-4)',
                            }
                          }
                        }}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, xs: 12, sm: 6, md: 3 }}>
                      <Select
                        placeholder="Тип локации"
                        data={categories.map(cat => ({ 
                          value: cat.value, 
                          label: cat.label,
                        }))}
                        leftSection={
                          <ThemeIcon size="sm" variant="light" color="grape" radius="xl">
                            <IconBuildingStore size={16} />
                          </ThemeIcon>
                        }
                        size="md"
                        radius="md"
                        styles={{
                          input: {
                            border: '2px solid var(--mantine-color-gray-2)',
                            transition: 'border-color 0.2s ease',
                            '&:focus': {
                              borderColor: 'var(--mantine-color-grape-4)',
                            }
                          }
                        }}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, xs: 12, sm: 6, md: 2 }}>
                      <TextInput
                        placeholder="Дата"
                        leftSection={
                          <ThemeIcon size="sm" variant="light" color="pink" radius="xl">
                            <IconCalendar size={16} />
                          </ThemeIcon>
                        }
                        size="md"
                        radius="md"
                        styles={{
                          input: {
                            border: '2px solid var(--mantine-color-gray-2)',
                            transition: 'border-color 0.2s ease',
                            '&:focus': {
                              borderColor: 'var(--mantine-color-pink-4)',
                            }
                          }
                        }}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, xs: 12, sm: 6, md: 2 }}>
                      <Button
                        fullWidth
                        size="md"
                        leftSection={<IconSearch size={18} />}
                        rightSection={<IconSparkles size={16} />}
                        onClick={() => navigate('/listings')}
                        variant="gradient"
                        gradient={{ from: 'violet', to: 'grape', deg: 45 }}
                        radius="md"
                        style={{
                          fontWeight: 600,
                          height: '100%',
                          minHeight: 42,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(134, 46, 156, 0.35)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0) scale(1)';
                          e.currentTarget.style.boxShadow = '';
                        }}
                      >
                        Найти
                      </Button>
                    </Grid.Col>
                  </Grid>
                  
                  {/* Popular searches on mobile */}
                  <Group gap="xs" style={{ display: 'flex' }} hiddenFrom="md">
                    <Text size="xs" c="dimmed">Популярное:</Text>
                    <Badge size="sm" variant="light" color="violet" style={{ cursor: 'pointer' }}>Студии</Badge>
                    <Badge size="sm" variant="light" color="grape" style={{ cursor: 'pointer' }}>Лофты</Badge>
                    <Badge size="sm" variant="light" color="pink" style={{ cursor: 'pointer' }}>На природе</Badge>
                  </Group>
                </Stack>
              </Paper>
            </Stack>
          </Center>
        </BackgroundImage>
      </Box>

      {/* Categories */}
      <Stack gap="xl" mb="xl">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2} mb={4}>
              <Group gap="xs">
                <ThemeIcon size="lg" variant="gradient" gradient={{ from: 'violet', to: 'grape' }} radius="xl">
                  <IconSparkles size={20} />
                </ThemeIcon>
                Популярные категории
              </Group>
            </Title>
            <Text size="sm" c="dimmed">Выберите идеальное пространство для вашего проекта</Text>
          </div>
          <Button
            variant="subtle"
            rightSection={<IconArrowRight size={16} />}
            onClick={() => navigate('/listings')}
            style={{ 
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            Все категории
          </Button>
        </Group>

        <Grid>
          {categories.map((category) => (
            <Grid.Col key={category.value} span={{ base: 12, xs: 6, sm: 4, md: 3, lg: 2 }}>
              <Paper
                p="md"
                radius="lg"
                h={110}
                style={{ 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: `linear-gradient(135deg, var(--mantine-color-${category.color}-0) 0%, var(--mantine-color-${category.color}-1) 100%)`,
                  border: `2px solid var(--mantine-color-${category.color}-2)`,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onClick={() => {
                      const params = new URLSearchParams();
                      params.set('category', category.value);
                      navigate(`/listings?${params.toString()}`);
                    }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                  e.currentTarget.style.boxShadow = `0 12px 24px var(--mantine-color-${category.color}-3)`;
                  e.currentTarget.style.borderColor = `var(--mantine-color-${category.color}-4)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = `var(--mantine-color-${category.color}-2)`;
                }}
              >
                <Box
                  style={{
                    position: 'absolute',
                    top: -30,
                    right: -30,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: `var(--mantine-color-${category.color}-1)`,
                    opacity: 0.3,
                  }}
                />
                <Stack align="center" gap="xs" style={{ position: 'relative', zIndex: 1 }}>
                  <ThemeIcon 
                    size={44} 
                    variant="white" 
                    color={category.color} 
                    radius="xl"
                    style={{
                      boxShadow: `0 4px 12px var(--mantine-color-${category.color}-3)`,
                    }}
                  >
                    <category.icon size={26} />
                  </ThemeIcon>
                  <Text 
                    size="sm" 
                    fw={600} 
                    ta="center"
                    style={{ 
                      color: `var(--mantine-color-${category.color}-9)`,
                      letterSpacing: '0.5px'
                    }}
                  >
                    {category.label}
                  </Text>
                </Stack>
              </Paper>
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

        {/* Loading State */}
        {isLoadingFeatured && (
          <Grid>
            {[...Array(4)].map((_, index) => (
              <Grid.Col key={index} span={{ base: 12, xs: 6, sm: 6, md: 4, lg: 3 }}>
                <Card shadow="sm" radius="md" withBorder h="100%">
                  <Card.Section>
                    <Skeleton height={200} />
                  </Card.Section>
                  <Stack gap="sm" mt="md">
                    <Skeleton height={20} />
                    <Skeleton height={16} width="70%" />
                    <Skeleton height={14} width="50%" />
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        )}

        {/* Error State */}
        {isErrorFeatured && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Ошибка загрузки"
            color="red"
          >
            Не удалось загрузить рекомендуемые локации
          </Alert>
        )}

        {/* Featured Listings */}
        {!isLoadingFeatured && !isErrorFeatured && featuredListings?.data && (
          <Grid>
            {featuredListings.data.slice(0, 8).map((location) => (
            <Grid.Col key={location.id} span={{ base: 12, xs: 6, sm: 6, md: 4, lg: 3 }}>
              <Card
                shadow="sm"
                radius="md"
                withBorder
                h="100%"
                style={{ 
                  cursor: 'pointer', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  overflow: 'hidden'
                }}
                onClick={() => navigate(`/listings/${location.id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 20px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <Card.Section style={{ position: 'relative', overflow: 'hidden' }}>
                  <Image
                    src={getPrimaryImage(location)}
                    height={200}
                    alt={location.title}
                    style={{ transition: 'transform 0.3s ease' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                  <Badge
                    size="sm"
                    variant="filled"
                    color="dark"
                    style={{ 
                      position: 'absolute', 
                      top: 12, 
                      right: 12,
                      backgroundColor: 'rgba(0, 0, 0, 0.7)'
                    }}
                  >
                    <Group gap={4}>
                      <IconStar size={14} fill="currentColor" />
                      {location.rating || 0}
                    </Group>
                  </Badge>
                </Card.Section>

                <Stack gap="sm" mt="md" style={{ flex: 1 }}>
                  <Group justify="space-between" align="flex-start" wrap="nowrap">
                    <Text fw={600} size="lg" lineClamp={2} style={{ flex: 1 }}>
                      {location.title}
                    </Text>
                    <Badge 
                      variant="gradient" 
                      gradient={{ from: 'violet', to: 'grape' }}
                      style={{ flexShrink: 0 }}
                    >
                      {formatPrice(location)}
                    </Badge>
                  </Group>

                  <Group gap="xs">
                    <IconMapPin size={16} style={{ flexShrink: 0 }} />
                    <Text size="sm" c="dimmed" lineClamp={1}>
                      {location.city}
                    </Text>
                  </Group>

                  <div style={{ marginTop: 'auto' }}>
                    <Group justify="space-between" align="center" mb="xs">
                      <Group gap="xs">
                        <IconStar size={16} fill="currentColor" style={{ color: '#FFD43B' }} />
                        <Text size="sm" fw={500}>
                          {location.rating || 0}
                        </Text>
                        <Text size="sm" c="dimmed">
                          ({location.reviewsCount || 0} отзывов)
                        </Text>
                      </Group>
                    </Group>
                    <Group gap={4}>
                      <Badge size="xs" variant="dot">
                        {getCategoryLabel(location.category)}
                      </Badge>
                      {location.amenities?.slice(0, 1).map((amenity) => (
                        <Badge key={amenity} size="xs" variant="dot" color="gray">
                          {amenity}
                        </Badge>
                      ))}
                    </Group>
                  </div>
                </Stack>
              </Card>
            </Grid.Col>
            ))}
          </Grid>
        )}
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