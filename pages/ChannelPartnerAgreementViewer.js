import React, { useEffect, useMemo, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useRouter } from "next/router";
import ChannelPartnerHOC from "../HOC/ChannelPartnerHOC";

// Use local static PDF for reliable behavior in all environments.
const primaryAgreementPdfUrl = "/ChannelPartner/Prosperity.pdf";
const fallbackAgreementPdfUrl = "/ChannelPartner/Template.pdf";

const ChannelPartnerAgreementViewer = () => {
  const router = useRouter();
  const { returnTo } = router.query;
  const [isClient, setIsClient] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pdfError, setPdfError] = useState("");
  const [pdfUrl, setPdfUrl] = useState(primaryAgreementPdfUrl);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Needed for pdf.js to work in the browser.
    // If your environment blocks CDN workers, tell me and we can switch to a local worker.
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }, []);

  const normalizedReturnTo = Array.isArray(returnTo) ? returnTo[0] : returnTo;

  const handleBack = () => {
    // Prefer browser history back (keeps previous page state when possible)
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    // Fallback for direct navigation to this page
    if (normalizedReturnTo) router.push(normalizedReturnTo);
    else router.back();
  };

  const pages = useMemo(() => {
    if (!numPages) return [];
    return Array.from({ length: numPages }, (_, i) => i + 1);
  }, [numPages]);

  return (
    <div className="container pt-4 pb-5">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">Agreement Document</h4>
        <button type="button" className="btn btn-outline-secondary" onClick={handleBack}>
          Back
        </button>
      </div>

      <div className="mb-3">
        <p className="mb-0 text-muted" style={{ fontSize: 14 }}>
          Please read the agreement carefully.
        </p>
      </div>

      <div
        style={{
          width: "100%",
          border: "1px solid #ddd",
          borderRadius: 6,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        {!isClient ? (
          <div style={{ padding: 16, color: "#666" }}>Loading document...</div>
        ) : (
          <Document
            file={pdfUrl}
            onLoadSuccess={({ numPages: loadedNumPages }) => setNumPages(loadedNumPages)}
            onLoadError={(err) => {
              // If agreement.pdf is missing, use existing Template.pdf as safe fallback.
              if (pdfUrl === primaryAgreementPdfUrl) {
                setPdfUrl(fallbackAgreementPdfUrl);
                return;
              }
              setNumPages(null);
              setPdfError(err?.message || "Failed to load agreement PDF.");
            }}
            loading={<div style={{ padding: 16, color: "#666" }}>Loading document...</div>}
          >
            {pages.map((pageNumber) => (
              <div
                key={pageNumber}
                style={{
                  padding: 12,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Page pageNumber={pageNumber} width={800} />
              </div>
            ))}
          </Document>
        )}
        {pdfError ? (
          <div style={{ padding: 16, color: "crimson", fontSize: 14 }}>{pdfError}</div>
        ) : null}
      </div>
    </div>
  );
};

export default ChannelPartnerHOC(ChannelPartnerAgreementViewer);

