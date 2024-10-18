# Super Smash Bros. Ultimate API <!-- omit in toc -->

<div style="text-align: center;">
   <img src="./assets/SSBU-Logo.webp" alt="SSBU Logo" width="200" />
</div>

Unofficial API for Super Smash Bros. Ultimate Fighters, implementing web scrapping from [Fighters | Super Smash Bros. Ultimate - Official Site](https://www.smashbros.com/en_GB/fighter/index.html).

This project was developed with Javascript, using Puppeteer and Express.js, currently hosted [here](https://super-smash-bros-ultimate-api.onrender.com) with Render.

> [!NOTE]
> Pull request are welcome to help the API grow.

> [!WARNING]
> Because of the application being hosted in Render, sometimes request may take 50 seconds or more to be completed, if you don't want this, run the project locally. 

## Table of content <!-- omit in toc -->
- [Using the API](#using-the-api)
- [Run project locally](#run-project-locally)
- [Supported Requests](#supported-requests)

## Using the API

1. You can use the API making a request to the [hosted Render domain](https://super-smash-bros-ultimate-api.onrender.com).
2. You can clone the project locally and follow the next steps.

## Run project locally

1. Clone the project.
2. Install dependencies.
   
   ```
   npm install
   ```
> [!NOTE]
> The current API Fighters data will be inside [`characters.json`](https://github.com/Davvii1/super-smash-bros-ultimate-api/blob/main/characters.json).

3. If you want to get the data again, using Puppeteer to perform web scrapping, use the seed command, this will execute the code inside [`seed.js`](https://github.com/Davvii1/super-smash-bros-ultimate-api/blob/main/seed.js).
   
   ```
   npm run seed
   ```
4. If you only want to start making requests you can run the Express.js API by running the start command.
 
   ```
   npm run start
   ```

## Supported Requests
Currently GET requests are permitted to get ALL of the fighters and get fighters by their fighterNumber

| Request Type | Endpoint | Description |
|---------------| --------------- | --------------- |
| GET | /api/characters | GET all fighters |
| GET | /api/characters/[id] | GET specific fighter by their id(fighterNumber)
| GET | /api/characters/series/[seriesName] | GET specific series by their id |
| GET | /api/characters/name/[name] | GET specific fighter by name |

