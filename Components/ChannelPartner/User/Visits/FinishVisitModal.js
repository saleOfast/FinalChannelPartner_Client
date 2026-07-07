import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { getCookie, hasCookie } from 'cookies-next';

const DEMO_VISIT_CODE = '2882';

const FinishVisitModal = ({ show, setShow, visitStatus, onSendVisitCode, onVerifyVisitCode }) => {
  const clientBtnColor = hasCookie("clientBtnColor") ? getCookie("clientBtnColor") : "#293790";
  const [step, setStep] = useState('send');
  const [visitCode, setVisitCode] = useState('');

  useEffect(() => {
    if (!show) {
      setStep('send');
      setVisitCode('');
    }
  }, [show]);

  const handleClose = () => {
    setShow(false);
    setStep('send');
    setVisitCode('');
  };

  const handleSendVisitCode = () => {
    if (onSendVisitCode) {
      onSendVisitCode();
    }
    setStep('verify');
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setVisitCode(value);
  };

  const handleResendCode = () => {
    if (onSendVisitCode) {
      onSendVisitCode();
    }
  };

  const handleVerify = () => {
    if (visitCode.length !== 4) return;
    if (onVerifyVisitCode) {
      onVerifyVisitCode(visitCode);
    }
  };

  const isCodeComplete = visitCode.length === 4;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      dialogClassName="finish-visit-dialog"
      contentClassName="finish-visit-modal-content"
    >
      <Modal.Body className="finish-visit-modal-body">
        {step === 'send' ? (
          <>
            <div className="finish-visit-alert">
              <div
                className="finish-visit-alert-icon"
                style={{ color: clientBtnColor }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 12.5L10.5 15L16 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="finish-visit-alert-title">
                  Visit saved · status {visitStatus || "Upcoming"}
                </p>
                <p className="finish-visit-alert-text">
                  Tap <strong>Finish Visit</strong> to send the verification code to the CP.
                </p>
              </div>
            </div>

            <Button
              type="button"
              className="finish-visit-send-btn"
              style={{ backgroundColor: clientBtnColor, borderColor: clientBtnColor }}
              onClick={handleSendVisitCode}
            >
              Send Visit Code
            </Button>
          </>
        ) : (
          <>
            <div className="finish-visit-alert">
              <div
                className="finish-visit-alert-icon"
                style={{ color: clientBtnColor }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 7.5L12 13.5L21 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <p className="finish-visit-alert-title">
                  Visit code sent to CP
                </p>
                <p className="finish-visit-alert-text">
                  Delivered via WhatsApp &amp; Email · valid for 24 hours. Ask the CP to share it with you.
                </p>
              </div>
            </div>

            <Form.Group className="finish-visit-code-group">
              <Form.Label className="finish-visit-code-label">Enter Visit Code</Form.Label>
              <Form.Control
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={visitCode}
                onChange={handleCodeChange}
                placeholder="4-digit code"
                className="finish-visit-code-input"
              />
            </Form.Group>

            <div className="finish-visit-code-actions">
              <button
                type="button"
                className="finish-visit-demo-link"
                style={{ color: clientBtnColor }}
                onClick={() => setVisitCode(DEMO_VISIT_CODE)}
              >
                {/* Demo code: {DEMO_VISIT_CODE} · tap to fill */}
              </button>
              <button
                type="button"
                className="finish-visit-resend-link"
                style={{ color: clientBtnColor }}
                onClick={handleResendCode}
              >
                Resend code
              </button>
            </div>

            <Button
              type="button"
              className="finish-visit-verify-btn"
              disabled={!isCodeComplete}
              style={
                isCodeComplete
                  ? { backgroundColor: clientBtnColor, borderColor: clientBtnColor }
                  : undefined
              }
              onClick={handleVerify}
            >
              Verify &amp; Complete
            </Button>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default FinishVisitModal;
