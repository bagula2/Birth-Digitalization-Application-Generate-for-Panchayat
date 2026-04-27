"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { ref, uploadBytes } from "firebase/storage";
import { auth, storage } from "@/lib/firebase";
import { WB_DISTRICTS, VILLAGES } from "@/lib/constants";
import { checkDuplicateEntry, checkMobileExists, getApplicationByMobile, saveApplication } from "@/lib/firestore";
import { generateApplicationPDF } from "@/lib/pdf";
import { clearOtpSession, loadOtpSession, saveOtpSession } from "@/lib/authSession";
import { ensureUnder250KB, validateIdNumber, validateMobile, validateRequiredFields } from "@/lib/validation";
import { ApplicationData } from "@/lib/types";

const selectClass = "w-full rounded border border-secondary bg-white px-3 py-3";
const inputClass = "w-full rounded border border-secondary bg-white px-3 py-3";
const steps = ["OTP", "Record", "Registration", "Child", "Birth Place", "Parents", "Address", "Review"];

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

async function compressIfImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 1280;
        const scale = Math.min(1, maxWidth / img.width);
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(file);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            resolve(new File([blob], file.name, { type: "image/jpeg" }));
          },
          "image/jpeg",
          0.75
        );
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export default function Page() {
  const [step, setStep] = useState(0);
  const [mobile, setMobile] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [duplicateMessage, setDuplicateMessage] = useState("");
  const [savedData, setSavedData] = useState<ApplicationData | null>(null);

  const [birthFile, setBirthFile] = useState<File | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [birthPreview, setBirthPreview] = useState("");
  const [idPreview, setIdPreview] = useState("");

  const [form, setForm] = useState({
    recordAvailable: "Select Option",
    registrationNumber: "",
    registrationDate: "",
    lostCertificate: "Select Option",
    childFirstName: "",
    childMiddleName: "",
    childLastName: "",
    dob: "",
    sex: "Select Option",
    birthType: "Select Option",
    placeOfBirth: "Select Option",
    hospitalType: "Select Option",
    village: "Select Option",
    fatherName: "",
    fatherIdType: "Select Option",
    fatherIdNumber: "",
    motherName: "",
    motherMobile: "",
    motherEmail: "",
    addressStreet: "",
    addressVillage: "",
    addressMouza: "",
    addressPostOffice: "",
    addressBlock: "",
    addressDistrict: "Select Option",
    addressPin: ""
  });

  const childName = useMemo(
    () => [form.childFirstName, form.childMiddleName, form.childLastName].filter(Boolean).join(" ").trim(),
    [form.childFirstName, form.childMiddleName, form.childLastName]
  );
  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  useEffect(() => {
    const session = loadOtpSession();
    if (session) {
      setMobile(session.mobile);
      setOtpVerified(true);
      setStep(1);
    }
    setSessionReady(true);
  }, []);

  const sendOtp = async () => {
    const mobileError = validateMobile(mobile);
    if (mobileError) return setStatusMessage(mobileError);

    if (await checkMobileExists(mobile)) {
      setBlocked(true);
      setStatusMessage("Application already exists");
      return;
    }

    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
    }
    window.confirmationResult = await signInWithPhoneNumber(auth, `+91${mobile}`, window.recaptchaVerifier);
    setStatusMessage("OTP sent");
  };

  const verifyOtp = async () => {
    if (!window.confirmationResult) return;
    const credential = await window.confirmationResult.confirm(otp);
    setOtpVerified(true);
    saveOtpSession({
      mobile,
      otpVerified: true,
      uid: credential.user.uid,
      verifiedAt: new Date().toISOString()
    });
    setStatusMessage("OTP verified");
    setStep(1);
  };

  const handleFile = async (
    e: ChangeEvent<HTMLInputElement>,
    set: (f: File | null) => void,
    setPreview: (p: string) => void
  ) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    const compressed = await compressIfImage(selected);
    const err = ensureUnder250KB(compressed);
    if (err) {
      setStatusMessage("File exceeds 250KB");
      set(null);
      setPreview("");
      return;
    }
    set(compressed);
    setPreview(URL.createObjectURL(compressed));
  };

  const checkDuplicate = async () => {
    const exists = await checkDuplicateEntry(childName, form.dob, form.motherName);
    const msg = exists ? "Duplicate Not Allowed" : "No duplicate found";
    setDuplicateMessage(msg);
    if (exists) setStatusMessage(msg);
  };

  const reviewStatus = async () => {
    const data = (await getApplicationByMobile(mobile)) as ApplicationData | null;
    if (!data) return setStatusMessage("No application found");
    setSavedData(data);
    setStatusMessage(`Status: ${data.status}`);
  };

  const stepValid = (): boolean => {
    if (step === 0) return otpVerified;
    if (step === 1) {
      if (form.recordAvailable === "No") {
        setStatusMessage("Visit Panchayat Office");
        return false;
      }
      return form.recordAvailable === "Yes";
    }
    if (step === 2) {
      if (!form.registrationNumber || !form.registrationDate || !birthFile) return false;
      if (form.lostCertificate === "Yes") {
        setStatusMessage("Visit Panchayat Office");
        return false;
      }
      return form.lostCertificate === "No";
    }
    if (step === 3) return Boolean(form.childFirstName && form.childLastName && form.dob && form.sex !== "Select Option" && form.birthType !== "Select Option");
    if (step === 4) {
      if (form.placeOfBirth === "Hospital") return form.hospitalType !== "Select Option";
      if (form.placeOfBirth === "Home") return form.village !== "Select Option";
      return false;
    }
    if (step === 5) {
      const idErr = validateIdNumber(form.fatherIdType, form.fatherIdNumber);
      if (idErr) {
        setStatusMessage(idErr);
        return false;
      }
      return Boolean(form.fatherName && form.motherName && form.motherMobile && idFile);
    }
    if (step === 6) return Boolean(form.addressStreet && form.addressVillage && form.addressMouza && form.addressPostOffice && form.addressBlock && form.addressDistrict !== "Select Option" && form.addressPin);
    return true;
  };

  const next = () => {
    if (!stepValid()) {
      setStatusMessage((m) => m || "Please complete required fields");
      return;
    }
    setStatusMessage("");
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stepValid()) return;
    if (await checkMobileExists(mobile)) return setStatusMessage("Application already exists");

    const requiredErrors = validateRequiredFields({
      mobile,
      recordAvailable: form.recordAvailable as "Yes" | "No",
      registrationNumber: form.registrationNumber,
      registrationDate: form.registrationDate,
      lostCertificate: form.lostCertificate as "Yes" | "No",
      childFirstName: form.childFirstName,
      childLastName: form.childLastName,
      dob: form.dob,
      sex: form.sex as "Male" | "Female",
      birthType: form.birthType as "Single" | "Twin",
      placeOfBirth: form.placeOfBirth as "Hospital" | "Home",
      fatherName: form.fatherName,
      fatherIdType: form.fatherIdType as "Aadhaar" | "EPIC" | "Ration Card" | "Passport",
      fatherIdNumber: form.fatherIdNumber,
      motherName: form.motherName,
      motherMobile: form.motherMobile,
      addressStreet: form.addressStreet,
      addressVillage: form.addressVillage,
      addressMouza: form.addressMouza,
      addressPostOffice: form.addressPostOffice,
      addressBlock: form.addressBlock,
      addressDistrict: form.addressDistrict,
      addressPin: form.addressPin
    });
    if (requiredErrors.length || !birthFile || !idFile) return setStatusMessage("Please complete required fields");

    const duplicate = await checkDuplicateEntry(childName, form.dob, form.motherName);
    if (duplicate) return setStatusMessage("Duplicate Not Allowed");

    const birthPath = `documents/${mobile}/birth_${Date.now()}`;
    const idPath = `documents/${mobile}/id_${Date.now()}`;
    await uploadBytes(ref(storage, birthPath), birthFile);
    await uploadBytes(ref(storage, idPath), idFile);

    const appData: ApplicationData = {
      mobile,
      recordAvailable: form.recordAvailable as "Yes" | "No",
      registrationNumber: form.registrationNumber,
      registrationDate: form.registrationDate,
      lostCertificate: form.lostCertificate as "Yes" | "No",
      childFirstName: form.childFirstName,
      childMiddleName: form.childMiddleName,
      childLastName: form.childLastName,
      childName,
      dob: form.dob,
      sex: form.sex as "Male" | "Female",
      birthType: form.birthType as "Single" | "Twin",
      placeOfBirth: form.placeOfBirth as "Hospital" | "Home",
      hospitalType: form.placeOfBirth === "Hospital" ? (form.hospitalType as "Government" | "Private") : undefined,
      hospitalName: form.placeOfBirth === "Hospital" ? (form.hospitalType === "Government" ? "Bagula Rural Hospital" : "Sanjibani Nursing Home") : undefined,
      village: form.placeOfBirth === "Home" ? (form.village as ApplicationData["village"]) : undefined,
      pinLocked: "741502",
      fatherName: form.fatherName,
      fatherIdType: form.fatherIdType as "Aadhaar" | "EPIC" | "Ration Card" | "Passport",
      fatherIdNumber: form.fatherIdNumber,
      motherName: form.motherName,
      motherMobile: form.motherMobile,
      motherEmail: form.motherEmail || undefined,
      addressStreet: form.addressStreet,
      addressVillage: form.addressVillage,
      addressMouza: form.addressMouza,
      addressPostOffice: form.addressPostOffice,
      addressBlock: form.addressBlock,
      addressDistrict: form.addressDistrict,
      addressPin: form.addressPin,
      addressState: "West Bengal",
      documents: {
        birthCertificatePath: birthPath,
        fatherIdPath: idPath
      },
      status: "Submitted",
      auditLog: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await saveApplication(appData);
    localStorage.setItem("birthApplicationMobile", mobile);
    setSavedData(appData);
    generateApplicationPDF(appData).save(`${mobile}_application.pdf`);
    setStatusMessage("Application submitted");
  };

  if (!sessionReady) {
    return <main className="mx-auto max-w-md px-4 py-5 text-sm">Loading session...</main>;
  }

  return (
    <main className="mx-auto max-w-md px-4 py-5">
      <h2 className="mb-3 text-lg font-bold text-primary">User Application</h2>
      {otpVerified && (
        <button
          type="button"
          className="mb-3 w-full rounded border border-primary px-3 py-2 text-sm"
          onClick={() => {
            clearOtpSession();
            setOtpVerified(false);
            setStep(0);
            setOtp("");
            setStatusMessage("Session cleared");
          }}
        >
          Logout Session
        </button>
      )}
      <p className="mb-3 text-xs">Step {step + 1} of {steps.length}: {steps[step]}</p>
      <div className="mb-4 h-2 w-full rounded bg-secondary/30"><div className="h-2 rounded bg-primary" style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>

      {step === 0 && (
        <div className="space-y-2 rounded bg-white p-3">
          <input className={inputClass} placeholder="Mobile" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))} maxLength={10} />
          <button type="button" className="w-full rounded bg-primary px-3 py-3 text-white" onClick={sendOtp}>Send OTP</button>
          <input className={inputClass} placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <button type="button" className="w-full rounded bg-secondary px-3 py-3 text-white" onClick={verifyOtp}>Verify OTP</button>
          <div id="recaptcha-container" />
          {blocked && <button type="button" className="w-full rounded bg-accent px-3 py-3" onClick={reviewStatus}>Review Application Status</button>}
        </div>
      )}

      <form onSubmit={submit} className="space-y-3 rounded bg-white p-3">
        {step === 1 && <select className={selectClass} value={form.recordAvailable} onChange={(e) => update("recordAvailable", e.target.value)}><option>Select Option</option><option>Yes</option><option>No</option></select>}

        {step === 2 && (
          <>
            <input className={inputClass} placeholder="Registration Number" value={form.registrationNumber} onChange={(e) => update("registrationNumber", e.target.value)} />
            <input className={inputClass} type="date" value={form.registrationDate} onChange={(e) => update("registrationDate", e.target.value)} />
            <input className={inputClass} type="file" accept="image/*,application/pdf" onChange={(e) => void handleFile(e, setBirthFile, setBirthPreview)} />
            {birthPreview && <img src={birthPreview} alt="Birth certificate preview" className="max-h-24 rounded object-contain" />}
            <select className={selectClass} value={form.lostCertificate} onChange={(e) => update("lostCertificate", e.target.value)}><option>Select Option</option><option>Yes</option><option>No</option></select>
          </>
        )}

        {step === 3 && (
          <>
            <input className={inputClass} placeholder="Child First Name" value={form.childFirstName} onChange={(e) => update("childFirstName", e.target.value)} />
            <input className={inputClass} placeholder="Child Middle Name" value={form.childMiddleName} onChange={(e) => update("childMiddleName", e.target.value)} />
            <input className={inputClass} placeholder="Child Last Name" value={form.childLastName} onChange={(e) => update("childLastName", e.target.value)} />
            <input className={inputClass} type="date" value={form.dob} onChange={(e) => update("dob", e.target.value)} />
            <select className={selectClass} value={form.sex} onChange={(e) => update("sex", e.target.value)}><option>Select Option</option><option>Male</option><option>Female</option></select>
            <select className={selectClass} value={form.birthType} onChange={(e) => update("birthType", e.target.value)}><option>Select Option</option><option>Single</option><option>Twin</option></select>
          </>
        )}

        {step === 4 && (
          <>
            <select className={selectClass} value={form.placeOfBirth} onChange={(e) => update("placeOfBirth", e.target.value)}><option>Select Option</option><option>Hospital</option><option>Home</option></select>
            {form.placeOfBirth === "Hospital" && <select className={selectClass} value={form.hospitalType} onChange={(e) => update("hospitalType", e.target.value)}><option>Select Option</option><option>Government</option><option>Private</option></select>}
            {form.placeOfBirth === "Home" && <select className={selectClass} value={form.village} onChange={(e) => update("village", e.target.value)}><option>Select Option</option>{VILLAGES.map((v) => <option key={v}>{v}</option>)}</select>}
            <input className={inputClass} value="741502" readOnly />
          </>
        )}

        {step === 5 && (
          <>
            <input className={inputClass} placeholder="Father Name" value={form.fatherName} onChange={(e) => update("fatherName", e.target.value)} />
            <select className={selectClass} value={form.fatherIdType} onChange={(e) => update("fatherIdType", e.target.value)}><option>Select Option</option><option>Aadhaar</option><option>EPIC</option><option>Ration Card</option><option>Passport</option></select>
            <input className={inputClass} placeholder="Father ID Number" value={form.fatherIdNumber} onChange={(e) => update("fatherIdNumber", e.target.value)} />
            <input className={inputClass} type="file" accept="image/*,application/pdf" onChange={(e) => void handleFile(e, setIdFile, setIdPreview)} />
            {idPreview && <img src={idPreview} alt="ID preview" className="max-h-24 rounded object-contain" />}
            <input className={inputClass} placeholder="Mother Name" value={form.motherName} onChange={(e) => update("motherName", e.target.value)} />
            <input className={inputClass} placeholder="Mother Mobile" value={form.motherMobile} onChange={(e) => update("motherMobile", e.target.value.replace(/\D/g, ""))} maxLength={10} />
            <input className={inputClass} placeholder="Mother Email (optional)" value={form.motherEmail} onChange={(e) => update("motherEmail", e.target.value)} />
          </>
        )}

        {step === 6 && (
          <>
            <input className={inputClass} placeholder="Street" value={form.addressStreet} onChange={(e) => update("addressStreet", e.target.value)} />
            <input className={inputClass} placeholder="Village" value={form.addressVillage} onChange={(e) => update("addressVillage", e.target.value)} />
            <input className={inputClass} placeholder="Mouza" value={form.addressMouza} onChange={(e) => update("addressMouza", e.target.value)} />
            <input className={inputClass} placeholder="Post Office" value={form.addressPostOffice} onChange={(e) => update("addressPostOffice", e.target.value)} />
            <input className={inputClass} placeholder="Block" value={form.addressBlock} onChange={(e) => update("addressBlock", e.target.value)} />
            <select className={selectClass} value={form.addressDistrict} onChange={(e) => update("addressDistrict", e.target.value)}><option>Select Option</option>{WB_DISTRICTS.map((d) => <option key={d}>{d}</option>)}</select>
            <input className={inputClass} placeholder="PIN" value={form.addressPin} onChange={(e) => update("addressPin", e.target.value.replace(/\D/g, ""))} maxLength={6} />
            <input className={inputClass} value="West Bengal" readOnly />
          </>
        )}

        {step === 7 && (
          <>
            <p className="text-xs">Review details and run duplicate check before final submit.</p>
            <button type="button" className="w-full rounded border border-primary px-3 py-3" onClick={checkDuplicate}>Check Duplicate Entry</button>
            {duplicateMessage && <p className="text-xs font-semibold text-red-700">{duplicateMessage}</p>}
            <button type="submit" className="w-full rounded bg-primary px-4 py-3 font-semibold text-white">Submit & Download PDF</button>
          </>
        )}
      </form>

      <div className="mt-3 flex gap-2">
        {step > 0 && <button type="button" className="flex-1 rounded border border-primary px-3 py-3" onClick={() => setStep((s) => Math.max(0, s - 1))}>Back</button>}
        {step > 0 && step < 7 && <button type="button" className="flex-1 rounded bg-primary px-3 py-3 text-white" onClick={next}>Next</button>}
      </div>

      <div className="mt-4 rounded bg-white p-3">
        <button type="button" className="w-full rounded bg-accent px-3 py-3" onClick={reviewStatus}>View Status / Download PDF</button>
        {savedData && (
          <button
            type="button"
            className="mt-2 w-full rounded bg-secondary px-3 py-3 text-white"
            onClick={() => generateApplicationPDF(savedData).save(`${savedData.mobile}_application.pdf`)}
          >
            Download PDF
          </button>
        )}
      </div>
      {statusMessage && <p className="mt-3 text-sm font-semibold text-primary">{statusMessage}</p>}
    </main>
  );
}
