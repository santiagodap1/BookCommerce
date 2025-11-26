import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from './data-source';
import { User } from '../users/entities/user.entity';
import { CartItem } from '../cart/entities/cart-item.entity';

async function seed() {
  await AppDataSource.initialize();
  const userRepository = AppDataSource.getRepository(User);
  const cartRepository = AppDataSource.getRepository(CartItem);

  const email = process.env.SEED_USER_EMAIL ?? 'demo@bookcommerce.dev';
  const password = process.env.SEED_USER_PASSWORD ?? 'ChangeMe123!';
  const name = process.env.SEED_USER_NAME ?? 'Demo User';
  const isAdmin = (process.env.SEED_USER_IS_ADMIN ?? 'false').toLowerCase() === 'true';

  let user = await userRepository.findOne({ where: { email } });

  if (!user) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await userRepository.save(
      userRepository.create({
        email,
        name,
        password: hashedPassword,
        isAdmin,
      }),
    );
    console.log(`Created seed user ${email}`);
  } else {
    console.log(`Seed user ${email} already exists, skipping creation.`);
  }

  const existingItems = await cartRepository.count({ where: { user: { id: user.id } } });
  if (existingItems === 0) {
    const sampleItems = [
      {
        bookId: 'seed-book-001',
        title: 'Seeded Book One',
        author: 'Book Commerce',
        coverUrl: 'https://placehold.co/200x300?text=Book+1',
        price: 19.99,
        quantity: 1,
      },
      {
        bookId: 'seed-book-002',
        title: 'Seeded Book Two',
        author: 'Book Commerce',
        coverUrl: 'https://placehold.co/200x300?text=Book+2',
        price: 15.5,
        quantity: 2,
      },
    ];

    await cartRepository.save(
      sampleItems.map((item) =>
        cartRepository.create({
          ...item,
          user,
        }),
      ),
    );
    console.log('Inserted demo cart items');
  } else {
    console.log('Cart already contains items, skipping demo cart seed.');
  }

  await AppDataSource.destroy();
  console.log('Database seed completed');
}

seed().catch((error) => {
  console.error('Seeding failed', error);
  process.exit(1);
});
