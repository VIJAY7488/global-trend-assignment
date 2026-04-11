const BASE_URL = "http://localhost:4000/tasks";

async function handleResponse(res) {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = json.message || json.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return json;
}

export const tasksApi = {
  async getAll(status = "") {
    const query = status ? `?status=${encodeURIComponent(status)}` : "";
    const res = await fetch(`${BASE_URL}${query}`);
    return handleResponse(res);
  },

  async create(title) {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    return handleResponse(res);
  },

  async update(id, fields) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    return handleResponse(res);
  },

  async remove(id) {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    return handleResponse(res);
  },
};
