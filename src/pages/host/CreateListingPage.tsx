import { Container, Title, Paper, Stepper, Button, Group, TextInput, Textarea, NumberInput, Select, MultiSelect, Grid, Text, FileButton, Image, Stack, Badge, Checkbox, Card, ActionIcon, Switch, Divider, ThemeIcon } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { IconUpload, IconPhoto, IconX, IconPlus, IconMapPin, IconCurrencyDollar, IconRuler, IconUsers, IconCar, IconWifi, IconBath, IconToolsKitchen2, IconVideo, IconCamera, IconBulb, IconDrone, IconClock, IconSun, IconMoon, IconCalendarWeek, IconBolt, IconSparkles } from '@tabler/icons-react';
import { DatePicker } from '@mantine/dates';
import { useNavigate } from 'react-router-dom';

const categories = [
  { value: 'urban', label: 'Городская локация' },
  { value: 'nature', label: 'Природа' },
  { value: 'industrial', label: 'Индустриальная' },
  { value: 'abandoned', label: 'Заброшенное место' },
  { value: 'rooftop', label: 'Крыша' },
  { value: 'modern', label: 'Современная' },
  { value: 'vintage', label: 'Винтажная' },
  { value: 'minimalist', label: 'Минимализм' },
  { value: 'historical', label: 'Историческая' },
  { value: 'underground', label: 'Подземная' },
  { value: 'water', label: 'У воды' },
  { value: 'architectural', label: 'Архитектурная' },
];

const shootingTypes = [
  { value: 'photo', label: 'Фотосессия' },
  { value: 'video', label: 'Видеосъёмка' },
  { value: 'cinema', label: 'Кино' },
  { value: 'commercial', label: 'Реклама' },
  { value: 'fashion', label: 'Мода' },
  { value: 'music_video', label: 'Музыкальный клип' },
  { value: 'documentary', label: 'Документальный фильм' },
];

const equipmentTypes = [
  { value: 'professional_cameras', label: 'Профессиональные камеры', icon: IconCamera },
  { value: 'lighting_equipment', label: 'Осветительное оборудование', icon: IconBulb },
  { value: 'drones', label: 'Дроны', icon: IconDrone },
  { value: 'tripods', label: 'Штативы' },
  { value: 'sound_equipment', label: 'Звуковое оборудование' },
  { value: 'generators', label: 'Генераторы' },
  { value: 'smoke_machines', label: 'Дым-машины' },
  { value: 'green_screen', label: 'Хромакей' },
];

const timeRestrictions = [
  { value: 'daytime_only', label: 'Только днём', icon: IconSun },
  { value: 'nighttime_only', label: 'Только ночью', icon: IconMoon },
  { value: 'weekends_only', label: 'Только выходные', icon: IconCalendarWeek },
  { value: 'no_restrictions', label: 'Без ограничений', icon: IconClock },
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
      teamSize: 0,
      pricePerHour: 0,
      pricePerDay: 0,
      amenities: [] as string[],
      rules: '',
      availableDates: [] as string[],
      // Filming-specific fields
      allowedShootingTypes: [] as string[],
      allowedEquipment: [] as string[],
      timeRestrictions: [] as string[],
      hasElectricity: false,
      hasWifi: false,
      hasParking: false,
      hasDressingRoom: false,
      hasCatering: false,
      isWeatherDependent: false,
      noiseLevel: 'quiet',
      requiresPermit: false,
      requiresInsurance: false,
      additionalServices: '',
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
          teamSize: values.teamSize <= 0 ? 'Укажите размер команды' : null,
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
      <Group gap="md" mb="xl">
        <ThemeIcon size="xl" variant="gradient" gradient={{ from: 'violet', to: 'purple' }} radius="xl">
          <IconSparkles size={28} />
        </ThemeIcon>
        <Title order={1}>Добавить съёмочную локацию</Title>
      </Group>

      <Paper shadow="sm" p="xl" radius="md">
        <Stepper active={active} onStepClick={setActive}>
          <Stepper.Step label="Основная информация" description="Название, описание и тип локации">
            <Stack gap="md" mt="xl">
              <TextInput
                label="Название локации"
                placeholder="Например: Лофт с панорамными окнами для фотосессий"
                required
                {...form.getInputProps('title')}
              />

              <Textarea
                label="Описание"
                placeholder="Опишите атмосферу локации, её визуальные особенности, что делает её уникальной для съёмок..."
                minRows={4}
                required
                {...form.getInputProps('description')}
              />

              <Select
                label="Тип локации"
                placeholder="Выберите тип локации"
                data={categories}
                required
                {...form.getInputProps('category')}
              />

              <div>
                <Text size="sm" fw={500} mb="xs">Разрешённые типы съёмок</Text>
                <Text size="xs" c="dimmed" mb="sm">Выберите, какие виды съёмок разрешены на вашей локации</Text>
                <Grid>
                  {shootingTypes.map((type) => (
                    <Grid.Col key={type.value} span={6}>
                      <Checkbox
                        label={<Text size="sm">{type.label}</Text>}
                        value={type.value}
                        checked={form.values.allowedShootingTypes.includes(type.value)}
                        onChange={(event) => {
                          const value = event.currentTarget.value;
                          const newTypes = event.currentTarget.checked
                            ? [...form.values.allowedShootingTypes, value]
                            : form.values.allowedShootingTypes.filter((t) => t !== value);
                          form.setFieldValue('allowedShootingTypes', newTypes);
                        }}
                      />
                    </Grid.Col>
                  ))}
                </Grid>
              </div>

              <div>
                <Text size="sm" fw={500} mb="xs">Фотографии</Text>
                <Text size="xs" c="dimmed" mb="sm">Загрузите минимум 5 фотографий, показывающих разные ракурсы и возможности локации</Text>
                
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

          <Stepper.Step label="Характеристики" description="Адрес, оборудование и технические параметры">
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
                    label="Макс. размер команды"
                    placeholder="20"
                    leftSection={<IconUsers size={16} />}
                    required
                    {...form.getInputProps('teamSize')}
                  />
                </Grid.Col>
              </Grid>

              <div>
                <Text size="sm" fw={500} mb="xs">Разрешённое оборудование</Text>
                <Text size="xs" c="dimmed" mb="sm">Отметьте, какое оборудование можно использовать на локации</Text>
                <Grid>
                  {equipmentTypes.map((equipment) => (
                    <Grid.Col key={equipment.value} span={6}>
                      <Checkbox
                        label={
                          <Group gap="xs">
                            {equipment.icon && <equipment.icon size={16} />}
                            <Text size="sm">{equipment.label}</Text>
                          </Group>
                        }
                        value={equipment.value}
                        checked={form.values.allowedEquipment.includes(equipment.value)}
                        onChange={(event) => {
                          const value = event.currentTarget.value;
                          const newEquipment = event.currentTarget.checked
                            ? [...form.values.allowedEquipment, value]
                            : form.values.allowedEquipment.filter((e) => e !== value);
                          form.setFieldValue('allowedEquipment', newEquipment);
                        }}
                      />
                    </Grid.Col>
                  ))}
                </Grid>
              </div>

              <div>
                <Text size="sm" fw={500} mb="xs">Временные ограничения</Text>
                <Text size="xs" c="dimmed" mb="sm">Когда можно проводить съёмки</Text>
                <Grid>
                  {timeRestrictions.map((restriction) => (
                    <Grid.Col key={restriction.value} span={6}>
                      <Checkbox
                        label={
                          <Group gap="xs">
                            {restriction.icon && <restriction.icon size={16} />}
                            <Text size="sm">{restriction.label}</Text>
                          </Group>
                        }
                        value={restriction.value}
                        checked={form.values.timeRestrictions.includes(restriction.value)}
                        onChange={(event) => {
                          const value = event.currentTarget.value;
                          const newRestrictions = event.currentTarget.checked
                            ? [...form.values.timeRestrictions, value]
                            : form.values.timeRestrictions.filter((r) => r !== value);
                          form.setFieldValue('timeRestrictions', newRestrictions);
                        }}
                      />
                    </Grid.Col>
                  ))}
                </Grid>
              </div>

              <div>
                <Text size="sm" fw={500} mb="xs">Технические характеристики</Text>
                <Grid>
                  <Grid.Col span={6}>
                    <Switch
                      label="Электричество"
                      description="Доступно подключение к электросети"
                      checked={form.values.hasElectricity}
                      onChange={(event) => form.setFieldValue('hasElectricity', event.currentTarget.checked)}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Switch
                      label="Wi-Fi"
                      description="Доступен беспроводной интернет"
                      checked={form.values.hasWifi}
                      onChange={(event) => form.setFieldValue('hasWifi', event.currentTarget.checked)}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Switch
                      label="Парковка"
                      description="Есть место для парковки"
                      checked={form.values.hasParking}
                      onChange={(event) => form.setFieldValue('hasParking', event.currentTarget.checked)}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Switch
                      label="Гримёрная"
                      description="Есть отдельная комната для переодевания"
                      checked={form.values.hasDressingRoom}
                      onChange={(event) => form.setFieldValue('hasDressingRoom', event.currentTarget.checked)}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Switch
                      label="Кейтеринг"
                      description="Возможность организации питания"
                      checked={form.values.hasCatering}
                      onChange={(event) => form.setFieldValue('hasCatering', event.currentTarget.checked)}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Switch
                      label="Зависимость от погоды"
                      description="Съёмки зависят от погодных условий"
                      checked={form.values.isWeatherDependent}
                      onChange={(event) => form.setFieldValue('isWeatherDependent', event.currentTarget.checked)}
                    />
                  </Grid.Col>
                </Grid>
              </div>

              <div>
                <Text size="sm" fw={500} mb="xs">Дополнительные требования</Text>
                <Grid>
                  <Grid.Col span={6}>
                    <Switch
                      label="Требуется разрешение"
                      description="Нужно получить разрешение на съёмку"
                      checked={form.values.requiresPermit}
                      onChange={(event) => form.setFieldValue('requiresPermit', event.currentTarget.checked)}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Switch
                      label="Требуется страховка"
                      description="Необходимо оформить страховку"
                      checked={form.values.requiresInsurance}
                      onChange={(event) => form.setFieldValue('requiresInsurance', event.currentTarget.checked)}
                    />
                  </Grid.Col>
                </Grid>
              </div>

              <Select
                label="Уровень шума"
                placeholder="Выберите уровень шума"
                data={[
                  { value: 'quiet', label: 'Тихо (подходит для записи звука)' },
                  { value: 'moderate', label: 'Умеренный (фоновый шум)' },
                  { value: 'loud', label: 'Шумно (только для визуальных съёмок)' },
                ]}
                {...form.getInputProps('noiseLevel')}
              />

              <div>
                <Text size="sm" fw={500} mb="xs">Базовые удобства</Text>
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
                label="Правила и ограничения"
                placeholder="Опишите правила съёмок, ограничения по времени, особые требования..."
                minRows={3}
                {...form.getInputProps('rules')}
              />

              <Textarea
                label="Дополнительные услуги"
                placeholder="Опишите дополнительные услуги: аренда оборудования, помощь администратора, координация с соседями..."
                minRows={2}
                {...form.getInputProps('additionalServices')}
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