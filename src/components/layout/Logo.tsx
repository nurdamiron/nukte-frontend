import { Group, Text } from '@mantine/core';
import { IconMapPin } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

export function Logo() {
  const navigate = useNavigate();

  return (
    <Group
      gap="xs"
      style={{ cursor: 'pointer' }}
      onClick={() => navigate('/')}
    >
      <IconMapPin size={28} stroke={2.5} style={{ color: 'var(--mantine-color-brand-6)' }} />
      <Text size="xl" fw={700} c="brand">
        Nukte
      </Text>
    </Group>
  );
}