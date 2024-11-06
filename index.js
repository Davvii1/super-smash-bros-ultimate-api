import express from "express";
import path from "path";
import fs from "fs/promises";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

app.get("/", (request, response) => {
  response.send("Super Smash Bros Ultimate API");
});


// Ruta para obtener todos los personajes
app.get("/api/characters", async (request, response) => {
  try {
    const filePath = path.join(process.cwd(), "characters.json");
    const data = await fs.readFile(filePath, "utf8");
    const jsonData = JSON.parse(data);
    response.json(jsonData);
  } catch (err) {
    console.error(err);
    response
      .status(500)
      .json({ error: "Failed to read or parse characters data file" });
  }
});


// Ruta para buscar por número de luchador
app.get("/api/characters/:id", async (request, response) => {
  try {
    const filePath = path.join(process.cwd(), "characters.json");
    const data = await fs.readFile(filePath, "utf8");
    const jsonData = JSON.parse(data);

    const character = jsonData.filter(
      (character) =>
        character.fighterNumber.replaceAll("ᵋ", "e") === request.params.id
    );

    response.json(character[0]);
  } catch (err) {
    console.error(err);
    response
      .status(500)
      .json({ error: "Failed to read or parse characters data file" });
  }
});

// Ruta para buscar por serie
app.get("/api/characters/series/:seriesName", async (request, response) => {
  const seriesName = request.params.seriesName.toLowerCase(); // Convertimos a minúsculas para comparación
  try {
    const filePath = path.join(process.cwd(), "characters.json");
    const data = await fs.readFile(filePath, "utf8");
    const jsonData = JSON.parse(data);

    const charactersInSeries = jsonData.filter(c => c.series.name.toLowerCase() === seriesName);

    if (charactersInSeries.length > 0) {
      response.json(charactersInSeries);
    } else {
      response.status(404).json({ error: "No characters found in this series" });
    }
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: "Failed to read or parse characters data file" });
  }
});

// Ruta para buscar personaje por nombre
app.get("/api/characters/name/:name", async (request, response) => {
  const characterName = request.params.name.toLowerCase(); // Convertimos a minúsculas para comparación
  try {
    const filePath = path.join(process.cwd(), "characters.json");
    const data = await fs.readFile(filePath, "utf8");
    const jsonData = JSON.parse(data);

    const character = jsonData.find(c => c.name.toLowerCase() === characterName);

    if (character) {
      response.json(character);
    } else {
      response.status(404).json({ error: "Character not found" });
    }
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: "Failed to read or parse characters data file" });
  }
});


export default app;
