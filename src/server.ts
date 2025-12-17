import { createYoga } from 'graphql-yoga';
import { createSchema } from 'graphql-yoga';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { connectDB } from './db';
import { resolvers } from './schema/resolvers';
import { User } from './models/User';
import { FoundItem } from './models/FoundItem';
import { LostItem } from './models/LostItem';
import { PORT } from './config';

const typeDefs = readFileSync(join(import.meta.dir, 'schema', 'schema.graphql'), 'utf8');

const context = (request?: Request) => ({
  User,
  FoundItem,
  LostItem,
  request
});

const schema = createSchema({
  typeDefs,
  resolvers
});

const yoga = createYoga({
  schema,
  context: ({ request }) => context(request),
  graphqlEndpoint: '/graphql',
  landingPage: true
});

async function createAdminUser() {
  const adminName = 'admin';
  const adminPassword = 'adminadmin+';
  
  const existingAdmin = await User.findOne({ name: adminName });
  
  if (!existingAdmin) {
    const admin = new User({
      name: adminName,
      password: adminPassword,
      role: 'admin'
    });
    
    await admin.save();
    console.log('Администратор создан: username = admin, password = adminadmin+');
  } else if (existingAdmin.role !== 'admin') {
    existingAdmin.role = 'admin';
    await existingAdmin.save();
    console.log('Пользователь admin обновлен до роли администратора');
  }
}

async function startServer() {
  await connectDB();
  await createAdminUser();

  const server = Bun.serve({
    port: PORT,
    fetch: async (req) => {
      const url = new URL(req.url);
      
      if (url.pathname === '/graphql' || url.pathname.startsWith('/graphql')) {
        return yoga.fetch(req);
      }
      
      const safePath = join(process.cwd(), 'frontend');
      const filePath = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
      const fullPath = join(safePath, filePath);
      
      if (!fullPath.startsWith(safePath)) {
        return new Response('Forbidden', { status: 403 });
      }
      
      if (existsSync(fullPath)) {
        return new Response(Bun.file(fullPath));
      }
      
      return new Response(Bun.file(join(safePath, 'index.html')));
    }
  });

  console.log(`Server running on http://localhost:${PORT}`);
}

startServer().catch(() => process.exit(1));
