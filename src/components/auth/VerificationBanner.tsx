import { Alert, Button, Group } from '@mantine/core';
import { IconAlertCircle, IconMail } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function VerificationBanner() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.verified) {
    return null;
  }

  return (
    <Alert
      icon={<IconAlertCircle size={16} />}
      color="yellow"
      variant="light"
      style={{ margin: '16px', borderRadius: '8px' }}
    >
      <Group justify="space-between" align="center">
        <div>
          <strong>Подтвердите ваш email</strong>
          <div style={{ fontSize: '14px', marginTop: '4px' }}>
            Для полного доступа к функциям Nukte подтвердите ваш email адрес
          </div>
        </div>
        <Button
          size="sm"
          leftSection={<IconMail size={14} />}
          onClick={() => navigate('/verify-email')}
        >
          Подтвердить
        </Button>
      </Group>
    </Alert>
  );
}