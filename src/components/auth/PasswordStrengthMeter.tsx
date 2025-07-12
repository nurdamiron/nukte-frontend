import React from 'react';
import { Progress, Text, Stack, Box, List, ThemeIcon } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';

interface PasswordStrengthMeterProps {
  password: string;
}

interface PasswordRequirement {
  re: RegExp;
  label: string;
}

const requirements: PasswordRequirement[] = [
  { re: /[0-9]/, label: 'Содержит цифру' },
  { re: /[a-z]/, label: 'Содержит строчную букву' },
  { re: /[A-Z]/, label: 'Содержит заглавную букву' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Содержит специальный символ' },
];

function getStrength(password: string): number {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
  return (
    <Text
      c={meets ? 'teal' : 'red'}
      style={{ display: 'flex', alignItems: 'center' }}
      mt={5}
      size="sm"
    >
      <ThemeIcon size={14} c={meets ? 'teal' : 'red'} mr={7}>
        {meets ? <IconCheck size={12} /> : <IconX size={12} />}
      </ThemeIcon>
      <Box ml={7}>{label}</Box>
    </Text>
  );
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const strength = getStrength(password);
  const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(password)}
    />
  ));

  return (
    <Stack gap="xs">
      <Text size="sm" c="dimmed">
        Сила пароля
      </Text>
      <Progress.Root>
        <Progress.Section value={strength} color={color} />
      </Progress.Root>
      <PasswordRequirement 
        label="Минимум 8 символов" 
        meets={password.length >= 8} 
      />
      {checks}
    </Stack>
  );
}