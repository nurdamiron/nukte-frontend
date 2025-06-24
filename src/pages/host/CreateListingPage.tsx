import { Container, Title, Paper, Stepper, Button, Group, TextInput, Textarea, NumberInput, Select, MultiSelect, Grid, Text, FileButton, Image, Stack, Badge, Checkbox, Card, ActionIcon } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { IconUpload, IconPhoto, IconX, IconPlus, IconMapPin, IconCurrencyDollar, IconRuler, IconUsers, IconCar, IconWifi, IconBath, IconToolsKitchen2 } from '@tabler/icons-react';
import { DatePicker } from '@mantine/dates';
import { useNavigate } from 'react-router-dom';

const categories = [
  { value: 'studio', label: 'Студия' },
  { value: 'outdoor', label: 'Открытое пространство' },
  { value: 'industrial', label: 'Индустриальное' },
  { value: 'residential', label: 'Жилое помещение' },
  { value: 'commercial', label: 'Коммерческое' },
  { value: 'event', label: 'Event-пространство' },
];

const amenities = [
  { value: 'parking', label: 'Парковка', icon: IconCar },
  { value: 'wifi', label: 'Wi-Fi', icon: IconWifi },
  { value: 'bathroom', label: 'Санузел', icon: IconBath },
  { value: 'kitchen', label: 'Кухня', icon: IconToolsKitchen2 },
  { value: 'electricity', label: 'Электричество' },
  { value: 'heating', label: 'Отопление' },
  { value: 'air_conditioning', label: 'Кондиционер' },
  { value: 'elevator', label: 'Лифт' },
];

export function CreateListingPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [images, setImages] = useState<File[]>([]);
  
  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      category: '',
      address: '',
      city: '',
      area: 0,
      maxGuests: 0,
      pricePerHour: 0,
      pricePerDay: 0,
      amenities: [] as string[],
      rules: '',
      availableDates: [] as string[],
    },
    validate: (values) => {
      if (active === 0) {
        return {
          title: values.title.length < 5 ? 'Минимум 5 символов' : null,
          description: values.description.length < 50 ? 'Минимум 50 символов' : null,
          category: !values.category ? 'Выберите категорию' : null,
        };
      }
      if (active === 1) {
        return {
          address: !values.address ? 'Укажите адрес' : null,
          city: !values.city ? 'Укажите город' : null,
          area: values.area <= 0 ? 'Укажите площадь' : null,
          maxGuests: values.maxGuests <= 0 ? 'Укажите количество' : null,
        };
      }
      if (active === 2) {
        return {
          pricePerHour: values.pricePerHour <= 0 ? 'Укажите цену' : null,
        };
      }
      return {};
    },
  });

  const nextStep = () => {
    const validation = form.validate();
    if (!validation.hasErrors) {
      setActive((current) => (current < 3 ? current + 1 : current));
    }
  };

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const handleSubmit = () => {
    console.log(form.values, images);
    navigate('/host/listings');
  };

  return (
    <Container size="lg" my="xl">
      <Title order={1} mb="xl">Добавить новую локацию</Title>

      <Paper shadow="sm" p="xl" radius="md">
        <Stepper active={active} onStepClick={setActive}>
          <Stepper.Step label="Основная информация" description="Название и описание">
            <Stack gap="md" mt="xl">
              <TextInput
                label="Название локации"
                placeholder="Например: Современная студия в центре города"
                required
                {...form.getInputProps('title')}
              />

              <Textarea
                label="Описание"
                placeholder="Опишите вашу локацию, её особенности и преимущества..."
                minRows={4}
                required
                {...form.getInputProps('description')}
              />

              <Select
                label="Категория"
                placeholder="Выберите категорию"
                data={categories}
                required
                {...form.getInputProps('category')}
              />

              <div>
                <Text size="sm" fw={500} mb="xs">Фотографии</Text>
                <Text size="xs" c="dimmed" mb="sm">Загрузите минимум 5 фотографий</Text>
                
                <Grid gutter="sm">
                  {images.map((image, index) => (
                    <Grid.Col key={index} span={3}>
                      <Card p={0} pos="relative">
                        <Image
                          src={URL.createObjectURL(image)}
                          height={120}
                          alt=""
                        />
                        <ActionIcon
                          pos="absolute"
                          top={4}
                          right={4}
                          color="red"
                          variant="filled"
                          size="sm"
                          onClick={() => setImages(images.filter((_, i) => i !== index))}
                        >
                          <IconX size={14} />
                        </ActionIcon>
                      </Card>
                    </Grid.Col>
                  ))}
                  
                  <Grid.Col span={3}>
                    <FileButton
                      onChange={(files) => files && setImages([...images, ...files])}
                      accept="image/*"
                      multiple
                    >
                      {(props) => (
                        <Card
                          {...props}
                          h={120}
                          style={{ cursor: 'pointer', border: '2px dashed var(--mantine-color-gray-4)' }}
                        >
                          <Stack h="100%" align="center" justify="center" gap="xs">
                            <IconUpload size={24} color="gray" />
                            <Text size="xs" c="dimmed">Загрузить</Text>
                          </Stack>
                        </Card>
                      )}
                    </FileButton>
                  </Grid.Col>
                </Grid>
              </div>
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="Характеристики" description="Адрес и параметры">
            <Stack gap="md" mt="xl">
              <TextInput
                label="Адрес"
                placeholder="Улица, дом"
                leftSection={<IconMapPin size={16} />}
                required
                {...form.getInputProps('address')}
              />

              <Select
                label="Город"
                placeholder="Выберите город"
                data={['Алматы', 'Астана', 'Шымкент', 'Караганда', 'Актобе', 'Тараз', 'Павлодар', 'Усть-Каменогорск']}
                required
                {...form.getInputProps('city')}
              />

              <Grid>
                <Grid.Col span={6}>
                  <NumberInput
                    label="Площадь (м²)"
                    placeholder="100"
                    leftSection={<IconRuler size={16} />}
                    required
                    {...form.getInputProps('area')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <NumberInput
                    label="Макс. человек"
                    placeholder="20"
                    leftSection={<IconUsers size={16} />}
                    required
                    {...form.getInputProps('maxGuests')}
                  />
                </Grid.Col>
              </Grid>

              <div>
                <Text size="sm" fw={500} mb="xs">Удобства</Text>
                <Grid>
                  {amenities.map((amenity) => (
                    <Grid.Col key={amenity.value} span={6}>
                      <Checkbox
                        label={
                          <Group gap="xs">
                            {amenity.icon && <amenity.icon size={16} />}
                            <Text size="sm">{amenity.label}</Text>
                          </Group>
                        }
                        value={amenity.value}
                        checked={form.values.amenities.includes(amenity.value)}
                        onChange={(event) => {
                          const value = event.currentTarget.value;
                          const newAmenities = event.currentTarget.checked
                            ? [...form.values.amenities, value]
                            : form.values.amenities.filter((a) => a !== value);
                          form.setFieldValue('amenities', newAmenities);
                        }}
                      />
                    </Grid.Col>
                  ))}
                </Grid>
              </div>

              <Textarea
                label="Правила локации"
                placeholder="Опишите правила использования вашей локации..."
                minRows={3}
                {...form.getInputProps('rules')}
              />
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="Цены и доступность" description="Стоимость и календарь">
            <Stack gap="md" mt="xl">
              <Grid>
                <Grid.Col span={6}>
                  <NumberInput
                    label="Цена за час"
                    placeholder="10000"
                    leftSection={<IconCurrencyDollar size={16} />}
                    rightSection={<Text size="sm" c="dimmed">₸</Text>}
                    required
                    {...form.getInputProps('pricePerHour')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <NumberInput
                    label="Цена за день"
                    placeholder="50000"
                    leftSection={<IconCurrencyDollar size={16} />}
                    rightSection={<Text size="sm" c="dimmed">₸</Text>}
                    {...form.getInputProps('pricePerDay')}
                  />
                </Grid.Col>
              </Grid>

              <div>
                <Text size="sm" fw={500} mb="xs">Недоступные даты</Text>
                <Text size="xs" c="dimmed" mb="sm">Отметьте даты, когда локация недоступна</Text>
                <DatePicker
                  type="multiple"
                  value={form.values.availableDates}
                  onChange={(value) => form.setFieldValue('availableDates', value)}
                />
              </div>
            </Stack>
          </Stepper.Step>

          <Stepper.Completed>
            <Stack align="center" mt="xl">
              <Title order={3}>Готово!</Title>
              <Text c="dimmed">Ваша локация готова к публикации</Text>
              <Button size="lg" onClick={handleSubmit}>
                Опубликовать локацию
              </Button>
            </Stack>
          </Stepper.Completed>
        </Stepper>

        <Group justify="center" mt="xl">
          {active > 0 && active < 3 && (
            <Button variant="default" onClick={prevStep}>
              Назад
            </Button>
          )}
          {active < 3 && (
            <Button onClick={nextStep}>
              Далее
            </Button>
          )}
        </Group>
      </Paper>
    </Container>
  );
}