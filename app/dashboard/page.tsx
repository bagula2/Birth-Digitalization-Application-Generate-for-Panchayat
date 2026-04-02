"use client";

import { useState } from "react";

export default function Application() {

  const [childName, setChildName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [dob, setDob] = useState("");

  return (
    <div style={{padding:20}}>

      <h2>Birth Application Form</h2>

      <p>⏱ Takes 3–5 minutes</p>

      <br />

      <input
        placeholder="Child Name"
        value={childName}
        onChange={(e)=>setChildName(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Mother Name"
        value={motherName}
        onChange={(e)=>setMotherName(e.target.value)}
      />

      <br /><br />

      <input
        type="date"
        value={dob}
        onChange={(e)=>setDob(e.target.value)}
      />

      <br /><br />

      <button>
        Check Duplicate
      </button>

      <br /><br />

      <button>
        Submit Application
      </button>

    </div>
  );
}
