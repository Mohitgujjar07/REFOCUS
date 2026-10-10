export function getFriendlyFirebaseErrorMessage(error: any): string {
  if (!error) return "An unexpected error occurred. Please try again.";

  const code = error?.code || "";
  const message = error?.message || "";

  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email address already exists. Please sign in instead.";
    case "auth/invalid-email":
      return "Please provide a valid email address.";
    case "auth/popup-closed-by-user":
      return "Google Sign-In was closed before completing. Please try again.";
    case "auth/popup-blocked":
      return "The Google sign-in popup was blocked by your browser. Please allow popups for this site.";
    case "auth/unauthorized-domain":
      return "This domain is not yet authorized in Firebase Console. Go to Authentication > Settings > Authorized domains and add this host.";
    case "auth/operation-not-allowed":
      return "Google sign-in is not enabled. Go to Firebase Console > Authentication > Sign-in method and enable Google.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with this email under a different sign-in method.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password. Please verify your credentials.";
    case "auth/too-many-requests":
      return "Access temporarily blocked due to too many failed attempts. Please reset your password or try again later.";
    case "auth/network-request-failed":
      return "Network connection error. Please verify your internet connection.";
    case "permission-denied":
      return "Access denied: You do not have permission to read or modify this record.";
    case "unavailable":
      return "Firebase database is temporarily unavailable. Please retry shortly.";
    default:
      if (message.includes("API key not valid")) {
        return "Firebase API Key is invalid or expired. Check your .env.local configuration.";
      }
      return message || "An unexpected error occurred. Please try again.";
  }
}
