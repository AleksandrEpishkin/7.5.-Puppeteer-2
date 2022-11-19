const { Browser } = require("puppeteer");
const { clickElement, putText, getText } = require("./lib/commands.js");

let page;

beforeEach(async () => {
  page = await browser.newPage();
  await page.goto("http://qamid.tmweb.ru/client/index.php");
});

afterEach(() => {
  page.close();
});

describe("Film booking tests", () => {
  test("Should book available ticket", async () => {
    await clickElement(page, "body > nav > a:nth-child(5)"); //выбираем дату
    await clickElement(page, "div:nth-child(2) > ul > li > a"); //выбираем время
    await clickElement(page, "div:nth-child(1) > span:nth-child(1)"); //выбираем место
    await clickElement(page, "body > main > section > button"); // нажимаем забронировать
    await page.waitForSelector("body > main > section > header > h2"); //ждем загрузки страницы
    await clickElement(page, "body > main > section > div > button"); //получить код бронирования
    const actual = await getText(page, "body > main > section > header > h2");

    expect(actual).toContain("Электронный билет");
  });

  test("Should wo tickets be booked", async () => {
    await clickElement(page, "body > nav > a:nth-child(5)"); //выбираем дату
    await clickElement(page, "div:nth-child(2) > ul > li > a"); //выбираем время
    await clickElement(page, "div:nth-child(1) > span:nth-child(10)"); //выбираем место
    await clickElement(page, "div:nth-child(1) > span:nth-child(9)"); //выбираем 2 место
    await clickElement(page, "body > main > section > button"); // нажимаем забронировать
    await page.waitForSelector("body > main > section > header > h2"); //ждем загрузки страницы
    await clickElement(page, "body > main > section > div > button"); //получить код бронирования
    const actual = await getText(page, "body > main > section > header > h2");

    expect(actual).toContain("Электронный билет");
  });

  test("Should try to book unavailable ticket", async () => {
    await clickElement(page, "body > nav > a:nth-child(5)"); //выбираем дату
    await clickElement(page, "div:nth-child(2) > ul > li > a"); //выбираем время
    await clickElement(page, "div:nth-child(1) > span:nth-child(1)"); //выбираем место
    expect(
      String(
        await page.$eval("button", (button) => {
          return button.disabled;
        })
      )
    ).toContain("true");
  });
});
