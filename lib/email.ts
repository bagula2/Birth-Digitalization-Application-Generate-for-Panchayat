import emailjs from "emailjs-com";
import { ApplicationData } from "./types";

export async function sendInternalEmail(application: ApplicationData) {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const userId = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  if (!serviceId || !templateId || !userId) return;

  await emailjs.send(
    serviceId,
    templateId,
    {
      to_email: "nitush8343980898@gmail.com",
      mobile: application.mobile,
      child_name: application.childName,
      mother_name: application.motherName,
      dob: application.dob,
      status: application.status
    },
    userId
  );
}
