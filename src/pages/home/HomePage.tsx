import { Container, Title, Text, Button, Grid, Card, Image, Badge, Group, Stack, Box, BackgroundImage, Center, TextInput, Select, ActionIcon, ThemeIcon, Transition, Paper, Overlay, Skeleton, Alert } from '@mantine/core';
import { IconSearch, IconMapPin, IconCalendar, IconArrowRight, IconStar, IconPhoto, IconTrees, IconBuildingSkyscraper, IconHome, IconBuildingStore, IconBalloon, IconSparkles, IconAlertCircle, IconVideo, IconBuildingFactory, IconBuildingCastle, IconTree, IconMountain, IconMusic, IconDeviceGamepad2 } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { listingsService } from '../../services/listings.service';
import type { Listing } from '../../types/api.types';
import classes from './HomePage.module.css';


const categories = [
  { value: 'urban', label: 'Городские локации', icon: IconBuildingSkyscraper, color: 'blue' },
  { value: 'nature', label: 'Природа', icon: IconTrees, color: 'green' },
  { value: 'industrial', label: 'Индустриальные', icon: IconBuildingFactory, color: 'orange' },
  { value: 'abandoned', label: 'Заброшенные места', icon: IconBuildingCastle, color: 'dark' },
  { value: 'rooftop', label: 'Крыши', icon: IconMountain, color: 'cyan' },
  { value: 'modern', label: 'Современные', icon: IconHome, color: 'pink' },
  { value: 'vintage', label: 'Винтажные', icon: IconMusic, color: 'yellow' },
  { value: 'minimalist', label: 'Минимализм', icon: IconDeviceGamepad2, color: 'gray' },
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
      urban: 'Городская локация',
      nature: 'Природа',
      industrial: 'Индустриальная',
      abandoned: 'Заброшенное место',
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
                Найдите идеальную локацию для съёмки
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
                Уникальные локации для фото, видео, кино и рекламы. От городских крыш до заброшенных заводов
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
                  backgroundColor: 'var(--mantine-color-body)',
                  border: '1px solid var(--mantine-color-default-border)',
                  opacity: 0.95
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
                        placeholder="Тип съёмки"
                        data={[
                          { value: 'photo', label: 'Фотосессия' },
                          { value: 'video', label: 'Видеосъёмка' },
                          { value: 'cinema', label: 'Кино' },
                          { value: 'commercial', label: 'Реклама' },
                          { value: 'fashion', label: 'Мода' },
                          { value: 'music_video', label: 'Клип' },
                          { value: 'documentary', label: 'Документалка' },
                        ]}
                        leftSection={
                          <ThemeIcon size="sm" variant="light" color="grape" radius="xl">
                            <IconVideo size={16} />
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
                    <Badge size="sm" variant="light" color="violet" style={{ cursor: 'pointer' }}>Крыши</Badge>
                    <Badge size="sm" variant="light" color="grape" style={{ cursor: 'pointer' }}>Заброшки</Badge>
                    <Badge size="sm" variant="light" color="pink" style={{ cursor: 'pointer' }}>Природа</Badge>
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
                  background: `linear-gradient(135deg, color-mix(in srgb, var(--mantine-color-${category.color}-6) 20%, transparent) 0%, color-mix(in srgb, var(--mantine-color-${category.color}-6) 10%, transparent) 100%)`,
                  border: `2px solid color-mix(in srgb, var(--mantine-color-${category.color}-6) 30%, transparent)`,
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
                  e.currentTarget.style.boxShadow = `0 12px 24px color-mix(in srgb, var(--mantine-color-${category.color}-6) 40%, transparent)`;
                  e.currentTarget.style.borderColor = `color-mix(in srgb, var(--mantine-color-${category.color}-6) 50%, transparent)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = `color-mix(in srgb, var(--mantine-color-${category.color}-6) 30%, transparent)`;
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
                    background: `color-mix(in srgb, var(--mantine-color-${category.color}-6) 25%, transparent)`,
                    opacity: 0.5,
                  }}
                />
                <Stack align="center" gap="xs" style={{ position: 'relative', zIndex: 1 }}>
                  <ThemeIcon 
                    size={44} 
                    variant="light" 
                    color={category.color} 
                    radius="xl"
                    style={{
                      boxShadow: `0 4px 12px color-mix(in srgb, var(--mantine-color-${category.color}-6) 30%, transparent)`,
                    }}
                  >
                    <category.icon size={26} />
                  </ThemeIcon>
                  <Text 
                    size="sm" 
                    fw={600} 
                    ta="center"
                    style={{ 
                      color: `var(--mantine-color-${category.color}-4)`,
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
          <div>
            <Title order={2} mb={4}>
              <Group gap="xs">
                <ThemeIcon size="lg" variant="gradient" gradient={{ from: 'orange', to: 'red' }} radius="xl">
                  <IconPhoto size={20} />
                </ThemeIcon>
                Топовые локации для съёмок
              </Group>
            </Title>
            <Text size="sm" c="dimmed">Самые популярные места среди фотографов и режиссёров</Text>
          </div>
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
            {[...Array(8)].map((_, index) => (
              <Grid.Col key={index} span={{ base: 12, xs: 6, sm: 6, md: 4, lg: 3 }}>
                <Card shadow="xl" radius="xl" withBorder h="100%" style={{
                  backdropFilter: 'blur(10px)',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}>
                  <Card.Section>
                    <Skeleton height={200} radius="xl" />
                  </Card.Section>
                  <Stack gap="sm" mt="md">
                    <Skeleton height={24} radius="xl" />
                    <Skeleton height={16} width="70%" radius="xl" />
                    <Skeleton height={14} width="50%" radius="xl" />
                    <Group gap="xs" justify="space-between">
                      <Skeleton height={20} width="60%" radius="xl" />
                      <Skeleton height={28} width="80px" radius="xl" />
                    </Group>
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
                shadow="xl"
                radius="xl"
                withBorder
                h="100%"
                style={{ 
                  cursor: 'pointer', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  overflow: 'hidden',
                  backdropFilter: 'blur(10px)',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
                onClick={() => navigate(`/listings/${location.id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
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
                    radius="xl"
                    style={{ 
                      position: 'absolute', 
                      top: 16, 
                      right: 16,
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <Group gap={4}>
                      <IconStar size={14} fill="currentColor" style={{ color: '#FFD43B' }} />
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
                      gradient={{ from: 'violet', to: 'purple', deg: 45 }}
                      radius="xl"
                      size="lg"
                      style={{ 
                        flexShrink: 0,
                        boxShadow: '0 4px 12px rgba(139, 69, 199, 0.3)',
                      }}
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
      <Card shadow="lg" radius="lg" p="xl" mb="xl" withBorder style={{
        background: 'linear-gradient(135deg, rgba(108, 43, 217, 0.1) 0%, rgba(216, 180, 254, 0.1) 100%)',
        border: '2px solid rgba(108, 43, 217, 0.2)'
      }}>
        <Grid align="center">
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Group gap="sm" mb="sm">
              <ThemeIcon size="lg" variant="gradient" gradient={{ from: 'violet', to: 'purple' }} radius="xl">
                <IconSparkles size={24} />
              </ThemeIcon>
              <Title order={3}>
                Сдавайте свою локацию для съёмок
              </Title>
            </Group>
            <Text size="lg" c="dimmed">
              Превратите своё пространство в источник дохода. Крыша, лофт, заброшка или квартира — всё подойдёт!
            </Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Button
              size="lg"
              fullWidth
              variant="gradient"
              gradient={{ from: 'violet', to: 'purple' }}
              onClick={() => navigate('/host/listings/create')}
              leftSection={<IconPhoto size={20} />}
            >
              Разместить локацию
            </Button>
          </Grid.Col>
        </Grid>
      </Card>
    </>
  );
}