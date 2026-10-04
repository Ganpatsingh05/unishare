// Account settings API (backend routes/account.js, mounted at /auth/account).
import { apiCall } from "@lib/api/base";

export const getAccount = async () => (await apiCall("/auth/account", { method: "GET", cache: false }))?.data || null;

/** Change the password, or set a first one on a Google-only account. Not retried. */
export const changePassword = (currentPassword, newPassword) =>
  apiCall("/auth/account/password", { method: "PUT", body: JSON.stringify({ currentPassword, newPassword }), cache: false, retries: 0 });

/** Permanently delete the account. Never retried: a partial delete must not run twice. */
export const deleteAccount = (password) =>
  apiCall("/auth/account", { method: "DELETE", body: JSON.stringify({ confirm: "DELETE", password }), cache: false, retries: 0 });
