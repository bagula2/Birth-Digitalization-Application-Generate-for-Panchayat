import jsPDF from "jspdf";
import { ApplicationData } from "./types";

const MARGIN = 12;
const PAGE_HEIGHT = 297;

function render(doc: jsPDF, app: ApplicationData, fontSize: number): boolean {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(fontSize);
  let y = MARGIN;
  const maxWidth = 210 - MARGIN * 2;
  const lineHeight = fontSize * 0.42 + 2.1;

  const push = (text: string, gap = lineHeight) => {
    const lines = doc.splitTextToSize(text, maxWidth) as string[];
    lines.forEach((line) => {
      doc.text(line, MARGIN, y);
      y += gap;
    });
  };

  push("To,");
  push("Sub-Registrar,");
  push("Bagula 2 No Gram Panchayat", lineHeight + 1);
  push("Subject: Application for Birth Certificate Digitalization", lineHeight + 1);
  push(`Name of Child: ${app.childName}`);
  push(`DOB: ${app.dob} | Sex: ${app.sex} | Birth Type: ${app.birthType}`);
  push(`Mother: ${app.motherName} (${app.motherMobile})`);
  push(`Father: ${app.fatherName} | ID: ${app.fatherIdType} ${app.fatherIdNumber}`);
  push(`Registration No: ${app.registrationNumber} on ${app.registrationDate}`);
  push(`Place of Birth: ${app.placeOfBirth} ${app.hospitalName ? `(${app.hospitalName})` : app.village ?? ""}`);
  push(`Address: ${app.addressStreet}, ${app.addressVillage}, ${app.addressMouza}, ${app.addressPostOffice}, ${app.addressBlock}, ${app.addressDistrict}, ${app.addressPin}, West Bengal`, lineHeight + 1);
  push("Declaration: I confirm all data provided is true and subject to verification.", lineHeight + 1);
  push("Applicant Signature: _____________________");
  push("Date: _____________________");

  return y <= PAGE_HEIGHT - MARGIN;
}

export function generateApplicationPDF(app: ApplicationData) {
  for (let fontSize = 11; fontSize >= 8; fontSize -= 1) {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    if (render(doc, app, fontSize)) return doc;
  }

  const fallback = new jsPDF({ unit: "mm", format: "a4" });
  render(fallback, app, 8);
  return fallback;
}
