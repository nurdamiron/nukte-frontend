import { AppShell, Burger, Group, Button, Menu, Avatar, Text, ActionIcon, Container, useMantineTheme, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { IconHome, IconBuilding, IconCalendar, IconUser, IconPlus, IconLogout, IconSearch, IconMapPin } from '@tabler/icons-react';
import { Logo } from './Logo';
import { MobileNav } from './MobileNav';
import { ThemeToggle } from './ThemeToggle';
import { VerificationBanner } from '../auth/VerificationBanner';
import { useAuth } from '../../contexts/AuthContext';
import { notifications } from '@mantine/notifications';

export function AppLayout() {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { user, logout, loading } = useAuth();

  // Don't render while loading user data
  if (loading) {
    return null;
  }

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header
        style={{
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(var(--mantine-color-body-rgb), 0.8)',
          borderBottom: '1px solid var(--mantine-color-default-border)',
        }}
      >
        <Container size="xl" h="100%">
          <Group h="100%" justify="space-between">
            <Group>
              <Burger 
                opened={opened} 
                onClick={toggle} 
                hiddenFrom="sm" 
                size="sm"
                style={{
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />
              <Logo />
              
              <Group ml="xl" gap="md" visibleFrom="sm">
                <Button
                  variant="subtle"
                  leftSection={<IconSearch size={18} />}
                  onClick={() => navigate('/listings')}
                  radius="xl"
                  style={{
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  Найти локацию
                </Button>
                {user && (user.role === 'location_owner' || user.role === 'both') && (
                  <Button
                    variant="gradient"
                    gradient={{ from: 'violet', to: 'purple', deg: 45 }}
                    leftSection={<IconPlus size={18} />}
                    onClick={() => navigate('/host/listings/create')}
                    radius="xl"
                    style={{
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(139, 69, 199, 0.35)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    Добавить
                  </Button>
                )}
              </Group>
            </Group>

            <Group gap="sm">
              <ThemeToggle />
              <ActionIcon 
                variant="subtle" 
                size="lg" 
                radius="xl" 
                hiddenFrom="sm"
                style={{
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <IconSearch size={20} />
              </ActionIcon>
              
              {user ? (
                <Menu shadow="xl" width={220} radius="xl">
                  <Menu.Target>
                    <ActionIcon 
                      variant="subtle" 
                      size="lg" 
                      radius="xl"
                      style={{
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <Avatar 
                        size="md" 
                        radius="xl" 
                        color="brand"
                        style={{
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                        }}
                      >
                        {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                      </Avatar>
                    </ActionIcon>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Label>Аккаунт</Menu.Label>
                    <Menu.Item
                      leftSection={<IconUser size={14} />}
                      onClick={() => navigate('/profile')}
                    >
                      Профиль
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconBuilding size={14} />}
                      onClick={() => navigate('/host/listings')}
                    >
                      Мои локации
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconCalendar size={14} />}
                      onClick={() => navigate('/bookings')}
                    >
                      Бронирования
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                      color="red"
                      leftSection={<IconLogout size={14} />}
                      onClick={async () => {
                        try {
                          await logout();
                          notifications.show({
                            title: 'Выход выполнен',
                            message: 'До встречи!',
                            color: 'green',
                          });
                          navigate('/');
                        } catch (error) {
                          notifications.show({
                            title: 'Ошибка',
                            message: 'Не удалось выйти из системы',
                            color: 'red',
                          });
                        }
                      }}
                    >
                      Выйти
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ) : (
                <Group gap="xs">
                  <Button 
                    variant="subtle" 
                    onClick={() => navigate('/login')}
                    radius="xl"
                    style={{
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Войти
                  </Button>
                  <Button 
                    onClick={() => navigate('/register')}
                    variant="gradient"
                    gradient={{ from: 'violet', to: 'purple', deg: 45 }}
                    radius="xl"
                    style={{
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(139, 69, 199, 0.35)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    Регистрация
                  </Button>
                </Group>
              )}
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Navbar>
        <MobileNav onClose={toggle} />
      </AppShell.Navbar>

      <AppShell.Main>
        <VerificationBanner />
        <Container size="xl">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}