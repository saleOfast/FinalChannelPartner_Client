// Proxies the agreement PDF so the browser can render it inline (not force-download).
// This avoids `Content-Disposition: attachment` behavior from the external host.

const PDF_URL = "https://admin.theprosperity.in/images/adh/Prosperity.pdf";

export default async function handler(req, res) {
  try {
    const range = req.headers.range;

    // Some PDF renderers (like PDF.js) request byte ranges.
    // Supporting Range avoids blank/failed inline rendering.
    const requestHeaders = {
      Accept: "application/pdf,*/*",
      "User-Agent": "Mozilla/5.0 (compatible; LeadShyneAgreementProxy/1.0)",
      ...(range ? { Range: range } : {}),
    };

    const pdfRes = await fetch(PDF_URL, { headers: requestHeaders });

    if (!pdfRes.ok) {
      res.status(pdfRes.status).json({ message: "Failed to fetch agreement PDF" });
      return;
    }

    const arrayBuffer = await pdfRes.arrayBuffer();
    const pdfBuffer = Buffer.from(arrayBuffer);
    const contentType = (pdfRes.headers.get("content-type") || "").toLowerCase();
    const isPdfByType = contentType.includes("application/pdf");
    const isPdfBySignature = pdfBuffer.slice(0, 4).toString() === "%PDF";

    // In production the upstream may return an HTML error/login page with status 200.
    // Returning that as PDF causes "Invalid PDF structure" in react-pdf.
    if (!isPdfByType && !isPdfBySignature) {
      res.status(502).json({
        message:
          "Upstream did not return a valid PDF. Please whitelist server access or host the agreement PDF in project public folder.",
      });
      return;
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader('Content-Disposition', 'inline; filename="Brokerage-Bill.pdf"');
    res.setHeader("Cache-Control", "no-store");

    if (range) {
      const contentRange = pdfRes.headers.get("content-range");
      const contentLength = pdfRes.headers.get("content-length");
      if (contentRange) res.setHeader("Content-Range", contentRange);
      if (contentLength) res.setHeader("Content-Length", contentLength);
      res.setHeader("Accept-Ranges", "bytes");
      res.status(206).send(pdfBuffer);
      return;
    }

    res.status(200).send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: "Agreement PDF proxy error" });
  }
}

