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
    res.json(jsonData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read or parse characters data file" });
  }
  // const filePath = path.join(process.cwd(), "characters.json");

  //fs.readFileSync("/characters.json", "utf8", (err, data) => {
  //  if (err) {
  //    return response
  //      .status(500)
  //      .json({ error: "Failed to read characters data file" });
  //  }

  //  try {
  //    const jsonData = JSON.parse(data);
  //    response.json(jsonData);
  //  } catch (parseError) {
  //    response
  //      .status(500)
  //      .json({ error: "Failed to parse characters JSON data" });
  //  }
  response.send("Characters");
  });
});

export default app
