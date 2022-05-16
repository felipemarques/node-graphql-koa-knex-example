import dotenv from "dotenv";
dotenv.config({ path: __dirname+'/../.env' });

import "reflect-metadata";
import database from './database';
import Koa from 'koa';
import KoaRouter from 'koa-router';
import { buildSchema } from 'type-graphql'
import { ApolloServer, gql} from 'apollo-server-koa';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import PlanetResolver from './resolvers/PlanetResolver';
import SpaceCenterResolver from "./resolvers/SpaceCenterResolver";
import FlightResolver from "./resolvers/FlightResolver";
import BookingResolver from "./resolvers/BookingResolver";

const env = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3000;

export async function createKoaServer(): Promise<Koa> {
    const app = new Koa();
    const router = new KoaRouter();

    const server = await createApolloServer(app)

    router.get("/status", (ctxt:any) => {
        ctxt.body = { success: true };
    });

    router.post("/graphql", server.getMiddleware());
    router.get("/graphql", server.getMiddleware());

    app.use(router.routes());
    app.use(router.allowedMethods());

    app.listen(PORT)
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
    console.log(`🚀 Server GraphQL ready at http://localhost:${PORT}${server.graphqlPath}`);

    return app
}

export async function createApolloServer(app: Koa):Promise<ApolloServer> {
  
    const errorHandler = (err: Error) => {
        console.log("Error while running resolver", {
          error: err
        });
      
        if (env === 'production') {
            return new Error("Internal server error");
        }

        if (process.env.APP_DEBUG == "true") {
            return err
        }

        return new Error(err.message);
    };

    const schema = async () => {
        return await buildSchema({
            resolvers: [
                PlanetResolver,
                SpaceCenterResolver,
                BookingResolver,
                FlightResolver,
            ]
        })
    }

    const server = new ApolloServer({
        csrfPrevention: true,
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground
        ],
        formatError: errorHandler,
        schema: await schema(),
        context: ({ req, res }: any) => {
            return {
              req,
              res,
              db: database,
        //       //dataloaders,
        //       //repositories,
            }
        }
    });

    await server.start()

    return server;
}

createKoaServer()