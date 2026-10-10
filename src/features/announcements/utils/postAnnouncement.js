// Post form: limits (from POST /api/announcements validation), checks and payload.

export const LIMITS = { title: 200, body: 2000, topics: 3 };
export const POST_TOPICS = ["general", "events", "academics", "alerts", "clubs"];
export const PRIORITIES = ["low", "normal", "high"];

export const initialPost = () => ({ title: "", body: "", tags: [], priority: "normal" });

/** Field errors keyed like the form; empty when valid. */
export function validatePost(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = "title";
  if (!form.body.trim()) errors.body = "body";
  if (!form.tags.length) errors.topics = "topics";
  return errors;
}

/** Body for POST /api/announcements. */
export function toPayload(form) {
  return {
    title: form.title.trim().slice(0, LIMITS.title),
    body: form.body.trim().slice(0, LIMITS.body),
    tags: form.tags.slice(0, LIMITS.topics),
    priority: PRIORITIES.includes(form.priority) ? form.priority : "normal",
  };
}
