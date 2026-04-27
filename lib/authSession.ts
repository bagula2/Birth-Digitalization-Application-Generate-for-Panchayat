export interface OtpSession {
  mobile: string;
  uid: string;
  verifiedAt: string;
  otpVerified: true;
}

const SESSION_KEY = "birthAuthSession";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

export function saveOtpSession(session: OtpSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function loadOtpSession(): OtpSession | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as OtpSession;
    const age = Date.now() - new Date(parsed.verifiedAt).getTime();
    if (!parsed.mobile || !parsed.uid || !parsed.otpVerified || Number.isNaN(age) || age > SESSION_TTL_MS) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function clearOtpSession() {
  localStorage.removeItem(SESSION_KEY);
}
