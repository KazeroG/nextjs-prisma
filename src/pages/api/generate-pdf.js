import { Buffer } from "buffer";
import puppeteer from "puppeteer";

const generatePdf = async (req, res) => {
  try {
    // Create a browser instance
    const browser = await puppeteer.launch({
      headless: "new",
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

    // Set the response headers for file download
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="techsolutionstuff.pdf"'
    );
    res.setHeader("Content-Type", "application/pdf");

    // Convert base64 string back to a buffer
    const pdfData = Buffer.from(pdfBuffer, "base64");

    // Send the PDF buffer as the response
    res.send(pdfData);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while generating the PDF");
  }
};

export default generatePdf;
