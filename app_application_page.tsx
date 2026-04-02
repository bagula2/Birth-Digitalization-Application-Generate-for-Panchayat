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
}  const [parentsInfo, setParentsInfo] = useState<ParentsInfo>({
    motherName: '',
    motherAadhaar: '',
    fatherName: '',
    fatherAadhaar: '',
  });

  const [childInfo, setChildInfo] = useState<ChildInfo>({
    childName: '',
    childDob: '',
    childGender: '',
  });

  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    'Personal Information',
    'Parents Information',
    'Child Information',
    'Document Upload',
    'Review & Submit',
  ];

  // Validation Functions
  const validatePersonalInfo = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!personalInfo.applicantName.trim()) {
      newErrors.applicantName = 'Name is required';
    }
    if (!personalInfo.applicantDob) {
      newErrors.applicantDob = 'Date of birth is required';
    }
    if (!personalInfo.applicantGender) {
      newErrors.applicantGender = 'Gender is required';
    }
    if (!personalInfo.applicantPhone.match(/^[0-9]{10}$/)) {
      newErrors.applicantPhone = 'Valid 10-digit phone number is required';
    }
    if (!personalInfo.applicantAadhaar.match(/^[0-9]{12}$/)) {
      newErrors.applicantAadhaar = 'Valid 12-digit Aadhaar is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateParentsInfo = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!parentsInfo.motherName.trim()) {
      newErrors.motherName = 'Mother name is required';
    }
    if (!parentsInfo.motherAadhaar.match(/^[0-9]{12}$/)) {
      newErrors.motherAadhaar = 'Valid 12-digit Aadhaar is required';
    }
    if (!parentsInfo.fatherName.trim()) {
      newErrors.fatherName = 'Father name is required';
    }
    if (!parentsInfo.fatherAadhaar.match(/^[0-9]{12}$/)) {
      newErrors.fatherAadhaar = 'Valid 12-digit Aadhaar is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateChildInfo = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!childInfo.childName.trim()) {
      newErrors.childName = 'Child name is required';
    }
    if (!childInfo.childDob) {
      newErrors.childDob = 'Child date of birth is required';
    }
    if (!childInfo.childGender) {
      newErrors.childGender = 'Child gender is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDocuments = (): boolean => {
    if (uploadedFiles.length === 0) {
      setErrors({ documents: 'At least one document is required' });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles: any[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 250000) {
          setErrors({ fileSize: `File ${file.name} exceeds 250KB limit` });
          continue;
        }
        newFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
        });
      }
      setUploadedFiles([...uploadedFiles, ...newFiles]);
      setErrors({});
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    let isValid = false;

    switch (currentStep) {
      case 0:
        isValid = validatePersonalInfo();
        break;
      case 1:
        isValid = validateParentsInfo();
        break;
      case 2:
        isValid = validateChildInfo();
        break;
      case 3:
        isValid = validateDocuments();
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = {
        personalInfo,
        parentsInfo,
        childInfo,
        documents: uploadedFiles,
        submittedAt: new Date().toISOString(),
      };

      console.log('Form submitted:', formData);
      alert('Application submitted successfully!');
      setCurrentStep(0);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Birth Certificate Application
        </h1>
        <p className="text-gray-600 mb-6">⏱ Takes 3–5 minutes | Apply Once, Submit Once</p>

        <ProgressBar currentStep={currentStep} totalSteps={steps.length} steps={steps} />

        <form onSubmit={handleSubmit} className="mt-8">
          {/* Step 0: Personal Information */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Step 1: Personal Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={personalInfo.applicantName}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, applicantName: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.applicantName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.applicantName && (
                  <p className="text-red-500 text-sm mt-1">{errors.applicantName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  value={personalInfo.applicantDob}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, applicantDob: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.applicantDob ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.applicantDob && (
                  <p className="text-red-500 text-sm mt-1">{errors.applicantDob}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <select
                  value={personalInfo.applicantGender}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, applicantGender: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.applicantGender ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Select Gender --</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.applicantGender && (
                  <p className="text-red-500 text-sm mt-1">{errors.applicantGender}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  value={personalInfo.applicantPhone}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, applicantPhone: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.applicantPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="10-digit mobile number"
                />
                {errors.applicantPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.applicantPhone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aadhaar Number *
                </label>
                <input
                  type="text"
                  value={personalInfo.applicantAadhaar}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, applicantAadhaar: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.applicantAadhaar ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="12-digit Aadhaar number"
                />
                {errors.applicantAadhaar && (
                  <p className="text-red-500 text-sm mt-1">{errors.applicantAadhaar}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 1: Parents Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Step 2: Parents Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mother's Name *
                </label>
                <input
                  type="text"
                  value={parentsInfo.motherName}
                  onChange={(e) =>
                    setParentsInfo({ ...parentsInfo, motherName: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.motherName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter mother's full name"
                />
                {errors.motherName && (
                  <p className="text-red-500 text-sm mt-1">{errors.motherName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mother's Aadhaar Number *
                </label>
                <input
                  type="text"
                  value={parentsInfo.motherAadhaar}
                  onChange={(e) =>
                    setParentsInfo({ ...parentsInfo, motherAadhaar: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.motherAadhaar ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="12-digit Aadhaar number"
                />
                {errors.motherAadhaar && (
                  <p className="text-red-500 text-sm mt-1">{errors.motherAadhaar}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Father's Name *
                </label>
                <input
                  type="text"
                  value={parentsInfo.fatherName}
                  onChange={(e) =>
                    setParentsInfo({ ...parentsInfo, fatherName: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.fatherName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter father's full name"
                />
                {errors.fatherName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fatherName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Father's Aadhaar Number *
                </label>
                <input
                  type="text"
                  value={parentsInfo.fatherAadhaar}
                  onChange={(e) =>
                    setParentsInfo({ ...parentsInfo, fatherAadhaar: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.fatherAadhaar ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="12-digit Aadhaar number"
                />
                {errors.fatherAadhaar && (
                  <p className="text-red-500 text-sm mt-1">{errors.fatherAadhaar}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Child Information */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Step 3: Child Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Child's Name *
                </label>
                <input
                  type="text"
                  value={childInfo.childName}
                  onChange={(e) => setChildInfo({ ...childInfo, childName: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.childName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter child's full name"
                />
                {errors.childName && (
                  <p className="text-red-500 text-sm mt-1">{errors.childName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Child's Date of Birth *
                </label>
                <input
                  type="date"
                  value={childInfo.childDob}
                  onChange={(e) => setChildInfo({ ...childInfo, childDob: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.childDob ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.childDob && (
                  <p className="text-red-500 text-sm mt-1">{errors.childDob}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Child's Gender *
                </label>
                <select
                  value={childInfo.childGender}
                  onChange={(e) => setChildInfo({ ...childInfo, childGender: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.childGender ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Select Gender --</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.childGender && (
                  <p className="text-red-500 text-sm mt-1">{errors.childGender}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Document Upload */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Step 4: Document Upload</h2>
              <p className="text-gray-600 text-sm mb-4">
                Maximum file size: 250KB per document
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Documents *
                </label>
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:bg-blue-50 transition">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <p className="text-gray-700 font-medium">Click to upload or drag and drop</p>
                    <p className="text-gray-500 text-sm">PDF, JPG, PNG (max 250KB)</p>
                  </label>
                </div>
                {errors.documents && (
                  <p className="text-red-500 text-sm mt-1">{errors.documents}</p>
                )}
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h3>
                  <ul className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                      >
                        <span className="text-sm text-gray-700">
                          {file.name} ({(file.size / 1024).toFixed(2)} KB)
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
         
