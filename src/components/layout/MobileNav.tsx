import { NavLink, Stack, Text, Divider, Button } from '@mantine/core';
import { IconHome, IconSearch, IconBuilding, IconCalendar, IconUser, IconPlus, IconLogin, IconUserPlus, IconLogout } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { notifications } from '@mantine/notifications';

interface MobileNavProps {
  onClose: () => void;
}

export function MobileNav({ onClose }: MobileNavProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
      notifications.show({
        title: 'Выход выполнен',
        message: 'До встречи!',
        color: 'green',
      });
      navigate('/');
      onClose();
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось выйти из системы',
        color: 'red',
      });
    }
  };

  return (
    <Stack gap="xs" p="md">
      <NavLink
        label="Главная"
        leftSection={<IconHome size={20} />}
        onClick={() => handleNavigate('/')}
      />
      <NavLink
        label="Найти локацию"
        leftSection={<IconSearch size={20} />}
        onClick={() => handleNavigate('/listings')}
      />
      
      {user ? (
        <>
          {(user.role === 'host' || user.role === 'both') && (
            <>
              <NavLink
                label="Добавить локацию"
                leftSection={<IconPlus size={20} />}
                onClick={() => handleNavigate('/host/listings/create')}
              />
              <NavLink
                label="Мои локации"
                leftSection={<IconBuilding size={20} />}
                onClick={() => handleNavigate('/host/listings')}
              />
            </>
          )}
          <NavLink
            label="Бронирования"
            leftSection={<IconCalendar size={20} />}
            onClick={() => handleNavigate('/bookings')}
          />
          <NavLink
            label="Профиль"
            leftSection={<IconUser size={20} />}
            onClick={() => handleNavigate('/profile')}
          />
          <Divider my="sm" />
          <NavLink
            label="Выйти"
            leftSection={<IconLogout size={20} />}
            onClick={handleLogout}
            color="red"
          />
        </>
      ) : (
        <>
          <Divider my="sm" />
          <Button
            fullWidth
            variant="filled"
            leftSection={<IconLogin size={20} />}
            onClick={() => handleNavigate('/login')}
          >
            Войти
          </Button>
          <Button
            fullWidth
            variant="light"
            leftSection={<IconUserPlus size={20} />}
            onClick={() => handleNavigate('/register')}
          >
            Регистрация
          </Button>
        </>
      )}
    </Stack>
  );
}