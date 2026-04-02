"use client";

import { useState } from "react";
import ProgressBar from "../../components/ProgressBar";

export default function Application() {

  const [step, setStep] = useState(1);

  const stepLabels = [
    "Child Details",
    "Duplicate Check",
    "Father Details",
    "Mother Details",
    "Documents",
    "Review",
    "Submit"
  ];

  const [childName, setChildName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [dob, setDob] = useState("");

  const nextStep = () => {
    if (step < 7) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div style={{ padding: 20 }}>

      <h2>Birth Certificate Application</h2>

      <p>⏱ Takes 3–5 minutes</p>

      <ProgressBar currentStep={step - 1} totalSteps={7} steps={stepLabels} />

      {/* STEP 1 */}
      {step === 1 && (
        <div>
          <h3>Step 1: Child Details</h3>

          <input
            placeholder="Child Name"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
          />

          <br /><br />

          <input
            placeholder="Mother Name"
            value={motherName}
            onChange={(e) => setMotherName(e.target.value)}
          />

          <br /><br />

          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />

          <br /><br />

          <button onClick={nextStep}>Next</button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div>
          <h3>Step 2: Duplicate Check</h3>

          <p>Click to check duplicate entry</p>

          <button onClick={() => alert("Duplicate check (logic coming next)")}>
            Check Duplicate
          </button>

          <br /><br />

          <button onClick={prevStep}>Back</button>
          <button onClick={nextStep}>Next</button>
        </div>
      )}

      {/* STEP 3–7 Placeholder */}
      {step > 2 && (
        <div>
          <h3>Step {step}</h3>
          <p>More fields coming next...</p>

          <button onClick={prevStep}>Back</button>
          <button onClick={nextStep}>Next</button>
        </div>
      )}

    </div>
  );
}
