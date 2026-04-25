const API_BASE_KEY = "resume_api_base";

function normalizeBase(url) {
  if (!url) {
    return null;
  }
  return String(url).trim().replace(/\/+$/, "");
}

function getDefaultApiBase() {
  const { hostname, origin, port } = window.location;
  const isLocalStaticServer = ["localhost", "127.0.0.1"].includes(hostname) && !["80", "8080"].includes(port);
  return isLocalStaticServer ? "http://localhost:8080" : origin;
}

function getStoredApiBase() {
  return normalizeBase(window.localStorage.getItem(API_BASE_KEY));
}

function getApiBase() {
  return getStoredApiBase() || getDefaultApiBase();
}

async function doRequest(base, path) {
  const response = await fetch(`${base}${path}`, {
    headers: {
      "Content-Type": "application/json"
    }
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok || json.code !== 0) {
    throw new Error(json.message || `请求失败: ${response.status}`);
  }

  return json.data;
}

async function request(path) {
  const primary = getApiBase();

  try {
    return await doRequest(primary, path);
  } catch (error) {
    const stored = getStoredApiBase();
    const fallback = getDefaultApiBase();
    const shouldFallback = stored && stored !== fallback && error instanceof TypeError;

    if (!shouldFallback) {
      throw error;
    }

    return doRequest(fallback, path);
  }
}

export const publicApi = {
  getProfile: () => request("/api/public/profile"),
  getSkills: () => request("/api/public/skills"),
  getProjects: () => request("/api/public/projects"),
  getWorkExperiences: () => request("/api/public/work-experiences"),
  getHonors: () => request("/api/public/honors"),
  getContacts: () => request("/api/public/contacts")
};

export { getApiBase };
