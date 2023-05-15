import { Buffer } from "buffer";
import puppeteer from "puppeteer";
import fs from "fs";

const generatePdf = async (req, res) => {
  try {
    // Create a browser instance
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox"], // Add this line to pass the --no-sandbox flag
    });

    // Create a new page
    const page = await browser.newPage();

    // Get HTML content from the request body
    const { html } = req.body;

    // Set the HTML content
    await page.setContent(html, { waitUntil: "domcontentloaded" });

    // To reflect CSS used for screens instead of print
    await page.emulateMediaType("screen");

    // Generate the PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
    });

    // Close the browser instance
    await browser.close();

    // Create a writable stream
    const writableStream = fs.createWriteStream("output.pdf");

    // Pipe the PDF buffer to the writable stream
    writableStream.write(pdfBuffer);

    res.status(200).send("PDF saved temporarily in the browser cache");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while generating the PDF");
  }
};

export default generatePdf;
