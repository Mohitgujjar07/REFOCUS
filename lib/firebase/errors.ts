export function getFriendlyFirebaseErrorMessage(error: any): string {
  if (!error) return "An unexpected error occurred. Please try again.";

  const code = error?.code || "";
  const message = error?.message || "";

  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email address already exists. Please sign in instead.";
    case "auth/invalid-email":
      return "Please provide a valid email address.";
    case "auth/operation-not-allowed":
      return "Email/Password sign-in is not enabled in the Firebase Console.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters with letters and numbers.";
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
