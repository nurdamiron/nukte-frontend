import { AppShell, Burger, Group, Button, Menu, Avatar, Text, ActionIcon, Container, useMantineTheme, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { IconHome, IconBuilding, IconCalendar, IconUser, IconPlus, IconLogout, IconSearch, IconMapPin } from '@tabler/icons-react';
import { useState } from 'react';
import { Logo } from './Logo';
import { MobileNav } from './MobileNav';

export function AppLayout() {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const [user] = useState({ name: 'Guest User', role: 'guest' }); // Временный пользователь

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Container size="xl" h="100%">
          <Group h="100%" justify="space-between">
            <Group>
              <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
              <Logo />
              
              <Group ml="xl" gap="md" visibleFrom="sm">
                <Button
                  variant="subtle"
                  leftSection={<IconSearch size={18} />}
                  onClick={() => navigate('/listings')}
                >
                  Найти локацию
                </Button>
                {user.role === 'host' && (
                  <Button
                    variant="light"
                    leftSection={<IconPlus size={18} />}
                    onClick={() => navigate('/host/listings/create')}
                  >
                    Добавить
                  </Button>
                )}
              </Group>
            </Group>

            <Group gap="sm">
              <ActionIcon variant="subtle" size="lg" radius="md" hiddenFrom="sm">
                <IconSearch size={20} />
              </ActionIcon>
              
              {user ? (
                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <ActionIcon variant="subtle" size="lg" radius="xl">
                      <Avatar size="md" radius="xl" color="brand">
                        {user.name.charAt(0)}
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
                    >
                      Выйти
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ) : (
                <Group gap="xs">
                  <Button variant="subtle" onClick={() => navigate('/login')}>
                    Войти
                  </Button>
                  <Button onClick={() => navigate('/register')}>
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
        <Container size="xl">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}