import { NavLink, Stack, Text } from '@mantine/core';
import { IconHome, IconSearch, IconBuilding, IconCalendar, IconUser, IconPlus } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

interface MobileNavProps {
  onClose: () => void;
}

export function MobileNav({ onClose }: MobileNavProps) {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
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
    </Stack>
  );
}