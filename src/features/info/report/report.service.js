// Reports go to the UniShare team's Google Form (there is no reports API for
// students yet). Field ids are the form's own and must not change.
const FORM_URL = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSe0m0oz-Jzx_QQCPmZtLjbvZY3uUW7gRL3-waTH3jg8-OZuQg/formResponse";

/**
 * Send a report. Google Forms can't be read back cross-origin, so a request
 * that leaves the browser counts as sent; a network failure is a real error.
 * @returns {Promise<{success: boolean}>}
 */
export async function submitReport({ name, email, type, details, where, urgency }) {
  const body = new URLSearchParams({
    "entry.2005620554": name || "Not signed in",
    "entry.1045781291": email || "Not given",
    "entry.1065046570": type,
    "entry.839337160": where ? `${details}\n\nWhere: ${where}` : details,
    "entry.1166974658": urgency,
  });
  try {
    await fetch(FORM_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() });
    return { success: true };
  } catch {
    return { success: false };
  }
}
