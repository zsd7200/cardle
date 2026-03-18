# [Cardle](https://www.cardle.wtf/)

A Pokémon TCG daily game. WIP.

## Getting Started
Create a `.env` with the following entries:

```
MONGODB_URI=
POPULATE_PASS=
NEXT_PUBLIC_PRODUCTION_URL=
```

`MONGODB_URI` is the connection string to your MongoDB database. A free-tier Mongo database can be made using [MongoDB Cloud Services](https://www.mongodb.com/products/platform/cloud).

`POPULATE_PASS` is the password you will use to enter the `/populate` page, which allows you to fill the database with card data from [TCGDex](https://tcgdex.dev/). If not entered, will be a newly randomly generated GUID string every time the page is rendered.

> [!CAUTION]
> The value entered for `POPULATE_PASS` may not be secure. Enter a random string, do not enter anything that is used across multiple accounts or services.

`NEXT_PUBLIC_PRODUCTION_URL` is the URL used after running `npm run build` and `npm run start`. If left empty, will default to `http://localhost:3000`. Should be entered **without** trailing slash.

Then, run install command:

```bash
npm i
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. 

You may need to visit `/api/sets` manually to populate the set data, then you can optionally visit the `/populate` page to fill the database with local data to make it run a bit faster.
