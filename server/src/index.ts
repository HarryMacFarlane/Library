import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './schema/typeDefs';
import { resolvers } from './resolvers';
import { initializeDatabase } from './config/database';
import cors from 'cors';
import { seedDatabase } from './seed/seed';
import session from 'express-session';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { User } from './entities/User';

// Extend Express Request type to include session
declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

interface Context {
  req: Request;
  res: Response;
  session: any;
  user?: User;
}

const startServer = async () => {
  try {
    // Initialize database
    const AppDataSource = await initializeDatabase();
    await seedDatabase(AppDataSource);

    // Create Express app
    const app = express();

    // Session configuration
    app.use(session({
      secret: 'your-secret-key', // Change this to a secure secret in production
      resave: false,
      saveUninitialized: false,
      genid: () => {
        return uuidv4();
      },
      name: "qid",
      cookie: {
        signed: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      }
    }));

    // Create Apollo Server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [ApolloServerPluginInlineTrace()],
    });

    // Start Apollo Server
    await server.start();

    // Apply middleware
    app.use('/graphql', 
      cors({
        origin: 'http://localhost:5173',
        credentials: true,
      }),
      express.json(),
      expressMiddleware(server, {
        context: async ({ req, res }: { req: Request; res: Response }) => {
          const context: Context = {
            req,
            res,
            session: req.session
          };

          // Load user if session exists
          if (req.session.userId) {
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({ id: req.session.userId });
            if (user) {
              context.user = user;
            }
          }

          return context;
        }
      })
    );

    // Start server
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}/graphql`);
    });

    // Handle shutdown
    process.on('SIGINT', async () => {
      await AppDataSource.destroy();
      process.exit(0);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();