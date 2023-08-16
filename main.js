const puppeteer = require("puppeteer");
const axios = require("axios");
const fs = require("fs");

(async () => {
  // Ensure the screenshots directory exists
  if (!fs.existsSync("screenshots")) {
    fs.mkdirSync("screenshots");
  }

  console.log("Fetching job offers from the API...");
  const response = await axios.get("https://justjoin.it/api/offers");
  const offers = response.data;

  // Launch Puppeteer
  console.log("Launching Puppeteer...");
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // Iterate over the first 10 offers
  for (let i = 0; i < Math.min(10, offers.length); i++) {
    const offerId = offers[i].id;

    console.log(`Navigating to offer ${i + 1}: ${offerId}...`);
    try {
      await page.goto(`https://justjoin.it/offers/${offerId}`, { waitUntil: "networkidle0", timeout: 15000 });
      console.log(`Taking screenshot of offer ${i + 1}...`);
      await page.screenshot({ path: `screenshots/offer_${i + 1}_${offerId}.png`, fullPage: true });
    } catch (error) {
      console.error(`Failed to load offer ${i + 1} within 15 seconds.`);
    }
  }

  console.log("Finished taking screenshots. Closing Puppeteer...");
  await browser.close();
  console.log("Script completed successfully.");
})();
