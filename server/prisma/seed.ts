import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Очистка существующих данных (для разработки)
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();
  console.log('🧹 База данных очищена');

  // Создание услуг
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Экспресс-мойка',
        description: 'Быстрая наружная мойка кузова с сушкой.',
        priceFrom: 500,
        duration: 30,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Комплекс "Стандарт"',
        description: 'Кузов, коврики, пылесос салона, протирка пластика.',
        priceFrom: 1200,
        duration: 60,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Детейлинг-полировка',
        description: 'Многоступенчатая полировка ЛКП с защитой.',
        priceFrom: 6000,
        duration: 240,
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Создано ${services.length} услуг`);

  // Хешируем пароли
  const adminPassword = await bcrypt.hash('admin123', 10);
  const testPassword = await bcrypt.hash('test123', 10);

  // Создание администратора
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@detailing.ru',
      phone: '+79001234567',
      name: 'Администратор',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log(`✅ Создан администратор: ${adminUser.email} (пароль: admin123)`);

  // Создание тестового клиента
  const testUser = await prisma.user.create({
    data: {
      email: 'test@example.com',
      phone: '+79991234567',
      name: 'Тестовый Пользователь',
      password: testPassword,
      role: 'CLIENT',
    },
  });

  console.log(`✅ Создан тестовый клиент: ${testUser.email} (пароль: test123)`);
  console.log('🎉 Seed выполнен успешно!');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
