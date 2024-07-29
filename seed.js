import puppeteer from "puppeteer";
import fs from "fs";

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
    console.log(`Getting ${character.name} information...`);
    await getFullImage(character);
  }

  const charactersJSON = JSON.stringify(characters, null, 2);

  fs.writeFile("characters.json", charactersJSON, (err) => {
    if (err) throw err;
    console.log("Characters data has been saved!");
  });

  await browser.close();
};

getCharacters();
