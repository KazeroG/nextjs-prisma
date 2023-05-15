import puppeteer from "puppeteer";

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

    // Set response headers for file download
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=output.pdf",
      "Content-Length": pdfBuffer.length,
    });

    // Send the PDF buffer as the response
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while generating the PDF");
  }
};

export default generatePdf;
