import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const QRCodeGenerator = ({ url }) => {
  return (
    <div style={{ textAlign: "center" }}>
      <h2>Scan this QR Code</h2>
      <div className="text-center flex justify-center mt-2">
      <QRCodeCanvas value={url} size={150} />
      </div>
      <p>URL: <a href={url} target="_blank" rel="noopener noreferrer">{url}</a></p>
    </div>
  );
};

export default QRCodeGenerator;