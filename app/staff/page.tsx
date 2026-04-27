"use client";

import { useEffect, useState } from "react";
import { STAFF_NAMES } from "@/lib/constants";
import { listApplications, requestStatusChange } from "@/lib/firestore";

interface StaffApp {
  id: string;
  childName: string;
  motherName: string;
  mobile: string;
  status: string;
  documents?: { birthCertificatePath?: string; fatherIdPath?: string };
  pendingStaffAction?: { requestedBy: string; requestedStatus: string; requestedAt: string };
}

export default function Page() {
  const [name, setName] = useState("Select Option");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [apps, setApps] = useState<StaffApp[]>([]);
  const [message, setMessage] = useState("");

  const load = async () => setApps((await listApplications()) as StaffApp[]);
  useEffect(() => { if (loggedIn) void load(); }, [loggedIn]);

  const login = () => {
    if (name === "Select Option" || password !== "Deo@741502" || otp !== "8343980898") {
      return setMessage("Invalid staff credentials");
    }
    setLoggedIn(true);
    setMessage("Staff login successful");
  };

  const action = async (mobile: string, next: "Approved" | "Rejected") => {
    await requestStatusChange(mobile, next, name);
    setMessage("Staff action submitted for admin approval");
    await load();
  };

  return (
    <main className="mx-auto max-w-md px-4 py-5">
      <h2 className="mb-4 text-lg font-bold text-primary">Staff Review Panel</h2>
      {!loggedIn && (
        <div className="space-y-2 rounded bg-white p-3">
          <select className="w-full rounded border px-3 py-2" value={name} onChange={(e) => setName(e.target.value)}>
            <option>Select Option</option>
            {STAFF_NAMES.map((n) => <option key={n}>{n}</option>)}
          </select>
          <input className="w-full rounded border px-3 py-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <input className="w-full rounded border px-3 py-2" placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <button className="w-full rounded bg-primary px-3 py-2 text-white" onClick={login}>Login</button>
        </div>
      )}

      {loggedIn && (
        <div className="space-y-3">
          {apps.map((app) => (
            <article key={app.id} className="rounded bg-white p-3 text-sm">
              <p><b>{app.childName}</b> ({app.mobile})</p>
              <p>Mother: {app.motherName}</p>
              <p>Status: {app.status}</p>
              {app.pendingStaffAction && <p className="text-xs text-primary">Pending: {app.pendingStaffAction.requestedStatus} by {app.pendingStaffAction.requestedBy}</p>}
              <p className="text-xs">Docs: {app.documents?.birthCertificatePath} | {app.documents?.fatherIdPath}</p>
              <div className="mt-2 flex gap-2">
                <button className="rounded bg-accent px-3 py-1" onClick={() => action(app.mobile, "Approved")}>Approve</button>
                <button className="rounded bg-secondary px-3 py-1 text-white" onClick={() => action(app.mobile, "Rejected")}>Reject</button>
              </div>
            </article>
          ))}
        </div>
      )}
      {message && <p className="mt-3 text-sm">{message}</p>}
    </main>
  );
}
