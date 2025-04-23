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

const startServer = async () => {
  try {
    // Initialize database
    const AppDataSource = await initializeDatabase();
    await seedDatabase(AppDataSource);

    // Create Express app
    const app = express();

    // Create Apollo Server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [ApolloServerPluginInlineTrace()],
    });

    // Start Apollo Server
    await server.start();
    // Apply middleware
    app.use('/graphql', cors(
        {
            origin: 'http://localhost:5173',
            credentials: true,
        }
    ), 
    express.json(), 
    expressMiddleware(server));

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