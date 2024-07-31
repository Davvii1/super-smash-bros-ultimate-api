import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import fspromises from "fs/promises";

let allCharacters = [];

const getCharacters = async () => {
  const browser = await puppeteer.launch({
    defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.goto("https://www.smashbros.com/en_GB/fighter/index.html", {
    waitUntil: "load",
  });

  let characters = await page.$$eval(".fighter-list__item", (items) => {
    return items.map((item) => {
      const name = item
        .querySelector(".fighter-list__name-main")
        .innerText.replaceAll("\n", " ")
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");

      console.log(`Getting ${name} information...`);

      const series = {
        name: item
          .querySelector("use")
          .getAttributeNS("http://www.w3.org/1999/xlink", "href")
          .split("m_")[1],
      };

      const fighterNumber = item
        .querySelector(".fighter-list__num-txt")
        .innerText.split("\n")
        .join("-");

      const images = {
        bannerImage: `https://www.smashbros.com${item
          .querySelector(".fighter-list__img")
          .style.backgroundImage.split("(")[1]
          .split(")")[0]
          .replaceAll('"', "")}`,
      };

      const dlcCharacter = item.classList.contains("fighter-list__item--dlc");

      return {
        name,
        series,
        fighterNumber,
        images,
        dlcCharacter,
      };
    });
  });

  const getFullImage = async (character) => {
    const detailPage = await browser.newPage();
    await detailPage.goto(
      `https://www.smashbros.com/en_GB/fighter/${character.fighterNumber.replaceAll(
        "ᵋ",
        "e"
      )}.html`,
      {
        waitUntil: "load",
      }
    );

    const seriesImage = await detailPage.$eval(
      ".page-header-bar__ico",
      (container) => {
        return `https://www.smashbros.com${container
          .querySelector("i")
          .style.backgroundImage.split("(")[1]
          .split(")")[0]
          .replaceAll('"', "")}`;
      }
    );

    const fullImage = await detailPage.$eval(
      ".swiper-slide-active",
      (container) => {
        return container.querySelector("img").src;
      }
    );

    character.series.image = seriesImage;

    character.images.fullImage = fullImage;

    await detailPage.close();
  };

  for (const character of characters) {
    console.log(`Getting ${character.name} assets...`);
    await getFullImage(character);
  }

  allCharacters = characters;

  await browser.close();
};

const getDescription = async () => {
  const descriptionsFilePath = path.join(process.cwd(), "descriptions.json");
  const descriptionsData = await fspromises.readFile(
    descriptionsFilePath,
    "utf8"
  );
  const descriptions = JSON.parse(descriptionsData);

  const charactersWithDescription = [];
  for (const character of allCharacters) {
    console.log("Getting description for", character.name);
    const description = descriptions.filter(
      (description) => description.name === character.name
    );
    charactersWithDescription.push({
      ...character,
      description: description[0].description,
    });
  }

  allCharacters = charactersWithDescription;
};

const getAppearances = async () => {
  const browser = await puppeteer.launch({
    defaultViewport: null,
  });

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);

  const renamedCharacters = new Map([
    ["Steve / Alex", "Steve"],
    ["Pyra / Mythra", "Pyra"],
    ["R.o.b.", "R.O.B."],
    ["Mii Fighter", "Mii Brawler"],
    ["Pac-man", "Pac-Man"],
  ]);

  const charactersWithAppearances = [];
  for (const character of allCharacters) {
    console.log("Getting appearances for", character.name);
    if (Number(character.fighterNumber.split("-")[0]) > 69) {
      charactersWithAppearances.push(character);
    }
    if (!(Number(character.fighterNumber.split("-")[0]) > 69)) {
      await page.goto(
        `https://www.ssbwiki.com/${
          renamedCharacters.has(character.name)
            ? renamedCharacters.get(character.name)
            : character.name.replaceAll(" ", "_")
        }_(SSBU)`,
        {
          waitUntil: "domcontentloaded",
        }
      );

      let checkForAppearances = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll(
            "table.infobox.bordered > tbody > tr > td > a > i"
          )
        ).map((el) => el.textContent);
      });
      checkForAppearances.shift();

      if (checkForAppearances.length === 0) {
        charactersWithAppearances.push(character);
      } else {
        character.otherAppearances = checkForAppearances;
        charactersWithAppearances.push(character);
      }
    }
  }

  await page.close();

  allCharacters = charactersWithAppearances;
};

await getCharacters();
await getDescription();
await getAppearances();

const charactersJSON = JSON.stringify(allCharacters, null, 2);

fs.writeFile("characters.json", charactersJSON, (err) => {
  if (err) throw err;
  console.log("Characters data has been saved!");
  process.exit(0);
});
