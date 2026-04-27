import { ApplicationData } from "./types";

export const MAX_FILE_SIZE = 250 * 1024;

export function validateIdNumber(idType: string, idNumber: string): string | null {
  if (!idNumber.trim()) return "ID Number is mandatory";
  if (idType === "Aadhaar" && !/^\d{12}$/.test(idNumber)) return "Invalid ID format";
  return null;
}

export function validateMobile(mobile: string): string | null {
  return /^\d{10}$/.test(mobile) ? null : "Enter valid 10-digit mobile";
}

export function validateRequiredFields(data: Partial<ApplicationData>): string[] {
  const required: (keyof ApplicationData)[] = [
    "mobile", "recordAvailable", "registrationNumber", "registrationDate", "lostCertificate", "childFirstName", "childLastName", "dob", "sex", "birthType", "placeOfBirth", "fatherName", "fatherIdType", "fatherIdNumber", "motherName", "motherMobile", "addressStreet", "addressVillage", "addressMouza", "addressPostOffice", "addressBlock", "addressDistrict", "addressPin"
  ];
  return required.filter((k) => !String(data[k] ?? "").trim()).map((k) => `${k} is required`);
}

export function ensureUnder250KB(file: File): string | null {
  return file.size <= MAX_FILE_SIZE ? null : "File exceeds 250KB";
}
