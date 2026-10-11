type AuthError = {
  code?: string;
} | null | undefined;

type AuthAction = "sign-in" | "sign-up";

export function authErrorMessage(
  error: AuthError,
  action: AuthAction
): string {
  switch (error?.code) {
    case "INVALID_EMAIL":
      return "সঠিক ইমেইল ঠিকানা লিখুন।";
    case "INVALID_EMAIL_OR_PASSWORD":
      return "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।";
    case "USER_ALREADY_EXISTS":
    case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
      return "এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে। সাইন ইন করুন।";
    case "PASSWORD_TOO_SHORT":
      return "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।";
    case "PASSWORD_TOO_LONG":
      return "পাসওয়ার্ড ১২৮ অক্ষরের মধ্যে রাখুন।";
    case "MISSING_OR_NULL_ORIGIN":
      return "সাইটের নিরাপত্তা সেটিংসে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।";
    case "INTERNAL_SERVER_ERROR":
    case "FAILED_TO_CREATE_USER":
    case "FAILED_TO_CREATE_SESSION":
      return action === "sign-in"
        ? "লগইন সেবা সাময়িকভাবে পাওয়া যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।"
        : "নিবন্ধন সেবা সাময়িকভাবে পাওয়া যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।";
    default:
      return action === "sign-in"
        ? "লগইন করা যায়নি। ইমেইল ও পাসওয়ার্ড যাচাই করে আবার চেষ্টা করুন।"
        : "অ্যাকাউন্ট তৈরি করা যায়নি। তথ্য যাচাই করে আবার চেষ্টা করুন।";
  }
}
