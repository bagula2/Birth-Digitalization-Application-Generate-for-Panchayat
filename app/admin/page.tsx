"use client";

import { useState } from "react";
import { listApplications, resolveStaffAction } from "@/lib/firestore";

export default function Page() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [apps, setApps] = useState<Array<Record<string, unknown>>>([]);
  const [message, setMessage] = useState("");

  const load = async () => setApps(await listApplications());

  const login = async () => {
    if (id !== "NitishBiswas@zohomail.in") return;
    if (!password || otp !== "8343980898") return;
    setLoggedIn(true);
    await load();
  };

  const decide = async (mobile: string, approve: boolean) => {
    await resolveStaffAction(mobile, "Admin", approve);
    setMessage(approve ? "Staff request approved" : "Staff request rejected");
    await load();
  };

  return (
    <main className="mx-auto max-w-md px-4 py-5">
      <h2 className="mb-4 text-lg font-bold text-primary">Admin Control</h2>
      {!loggedIn ? (
        <div className="space-y-2 rounded bg-white p-3">
          <input className="w-full rounded border px-3 py-2" placeholder="Admin ID" value={id} onChange={(e) => setId(e.target.value)} />
          <input className="w-full rounded border px-3 py-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <input className="w-full rounded border px-3 py-2" placeholder="Email OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <button className="w-full rounded bg-primary px-3 py-2 text-white" onClick={login}>Login</button>
        </div>
      ) : (
        <div className="space-y-2">
          {apps.map((app, i) => {
            const pending = (app.pendingStaffAction as { requestedStatus?: string } | undefined);
            return (
              <div key={i} className="rounded bg-white p-2 text-xs">
                <pre className="overflow-auto">{JSON.stringify(app, null, 2)}</pre>
                {pending && (
                  <div className="mt-2 flex gap-2">
                    <button className="rounded bg-accent px-2 py-1" onClick={() => decide(String(app.mobile), true)}>Approve Staff Edit</button>
                    <button className="rounded bg-secondary px-2 py-1 text-white" onClick={() => decide(String(app.mobile), false)}>Reject Staff Edit</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
          {message && <p className="mt-3 text-sm">{message}</p>}
    </main>
  );
}
