# [Cardle](https://www.cardle.wtf/)

A Pokémon TCG daily game. WIP.

## Getting Started
Create a `.env` with the following entries:

```
POKETCG_API_KEY=
MONGODB_URI=
```

`POKETCG_API_KEY` can be obtained [from here](https://dev.pokemontcg.io/).

`MONGODB_URI` is the connection string to your MongoDB database. A free-tier Mongo database can be made using [MongoDB Cloud Services](https://www.mongodb.com/products/platform/cloud).

Then, run install command:

```bash
npm i
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. First run will take significantly longer than any subsequent runs as it has to fill the Mongo database with data.
