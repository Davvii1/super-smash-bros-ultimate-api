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

export default app;
