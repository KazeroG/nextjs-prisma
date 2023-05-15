import { Buffer } from "buffer";
import puppeteer from "puppeteer";

const base64ToPdf = (base64String, outputFilePath) => {
  // Convert base64 string back to a buffer
  const pdfData = Buffer.from(base64String, "base64");

  // Write the buffer to a file
  require("fs").writeFileSync(outputFilePath, pdfData);
};

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

    // Set the response headers for file download
    res.setHeader("Content-Disposition", 'attachment; filename="output.pdf"');
    res.setHeader("Content-Type", "application/pdf");

    // Transform the base64 string to PDF characters and save to a file
    const outputFilePath = "output.pdf";
    base64ToPdf(pdfBuffer.toString("base64"), outputFilePath);

    // Send the PDF file as the response
    res.sendFile(outputFilePath);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while generating the PDF");
  }
};

export default generatePdf;
