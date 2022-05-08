# Instructions
First copy .env.example to .env and change the variables if you want to

```$ cp .env.example .env```

## Run docker-compose
```$ docker-compose up -d```

## Run migrations
```$ npx knex migrate:latest```

## Run seed
```$ npx knex seed:run```

## Finally, run ...
```$ yarn start:dev```

## ... and go to:
```curl -X GET http://localhost:3000/graphql```

## Queries


## Mutations