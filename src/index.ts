import Koa from 'koa';
import KoaRouter from 'koa-router';

import { ApolloServer, gql} from 'apollo-server-koa';
import { 
    ApolloServerPluginLandingPageGraphQLPlayground 
} from 'apollo-server-core';

import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/../.env' });

const PORT = process.env.PORT || 3000;

export async function createKoaServer(): Promise<Koa> {
    const app = new Koa();
    const router = new KoaRouter();

    const server = await createApolloServer(app)

    router.get("/healthz", (ctxt:any) => {
        ctxt.body = { success: true };
    });

    router.post("/graphql", server.getMiddleware());
    router.get("/graphql", server.getMiddleware());

    app.use(router.routes());
    app.use(router.allowedMethods());

    app.listen(PORT)
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);

    return app
}

export async function createApolloServer(app: Koa):Promise<ApolloServer> {
  
    const typeDefs = gql`
        type Example {
            message: String
        }
    
        type Query {
            queryExample: Example
        }
    
        type Mutation {
            mutationExample: Example
        }
    `;

    const resolvers = {
        Query: {
            queryExample: (parent: any, args: any, context: any) => {
              return {
                message: "This is the message from the query resolver.",
              };
            },
          },
          Mutation: {
            mutationExample: (parent: any, args: any, context: any) => {
              console.log("Perform mutation here before responding.");
      
              return {
                message: "This is the message from the mutation resolver.",
              };
            },
          },
    }

    const errorHandler = (err: Error) => {
        console.log("Error while running resolver", {
          error: err
        });
      
        // Hide all internals by default
        // Change that when we introduce custom error instances
        return new Error("Internal server error");
    };

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        csrfPrevention: true,
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground
        ],
        formatError: errorHandler
    });

    await server.start()

    return server;
}

createKoaServer()