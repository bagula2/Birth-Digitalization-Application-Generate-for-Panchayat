"use client";

import { useState } from "react";
import { listApplications } from "@/lib/firestore";

export default function Page() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [apps, setApps] = useState<Array<Record<string, unknown>>>([]);

  const login = async () => {
    if (id !== "NitishBiswas@zohomail.in") return;
    if (!password || otp !== "8343980898") return;
    setLoggedIn(true);
    setApps(await listApplications());
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
          {apps.map((app, i) => (
            <pre key={i} className="overflow-auto rounded bg-white p-2 text-xs">{JSON.stringify(app, null, 2)}</pre>
          ))}
        </div>
      )}
    </main>
  );
}
