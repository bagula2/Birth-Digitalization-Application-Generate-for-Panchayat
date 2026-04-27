export type AppStatus = "Submitted" | "Under Review" | "Approved" | "Rejected";

export interface AuditLogEntry {
  staffName: string;
  action: "Approve" | "Reject" | "Edit";
  timestamp: string;
  notes?: string;
}

export interface PendingStaffAction {
  requestedBy: string;
  requestedStatus: AppStatus;
  requestedAt: string;
  previousStatus: AppStatus;
}

export interface ApplicationData {
  mobile: string;
  recordAvailable: "Yes" | "No";
  registrationNumber: string;
  registrationDate: string;
  lostCertificate: "Yes" | "No";
  childFirstName: string;
  childMiddleName: string;
  childLastName: string;
  childName: string;
  dob: string;
  sex: "Male" | "Female";
  birthType: "Single" | "Twin";
  placeOfBirth: "Hospital" | "Home";
  hospitalType?: "Government" | "Private";
  hospitalName?: string;
  village?: "Bagula CT" | "Muragacha" | "Madna" | "Hatibandha" | "Sahapur";
  pinLocked: "741502";
  fatherName: string;
  fatherIdType: "Aadhaar" | "EPIC" | "Ration Card" | "Passport";
  fatherIdNumber: string;
  motherName: string;
  motherMobile: string;
  motherEmail?: string;
  addressStreet: string;
  addressVillage: string;
  addressMouza: string;
  addressPostOffice: string;
  addressBlock: string;
  addressDistrict: string;
  addressPin: string;
  addressState: "West Bengal";
  documents: {
    birthCertificatePath: string;
    fatherIdPath: string;
  };
  status: AppStatus;
  auditLog: AuditLogEntry[];
  pendingStaffAction?: PendingStaffAction;
  createdAt: string;
  updatedAt: string;
}
