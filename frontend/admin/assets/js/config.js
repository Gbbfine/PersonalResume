export const TOKEN_KEY = "resume_admin_token";
export const API_BASE_KEY = "resume_api_base";

export function getApiBase() {
  const savedBase = window.localStorage.getItem(API_BASE_KEY);
  if (savedBase) {
    return savedBase;
  }

  const { hostname, origin, port } = window.location;
  const isLocalStaticServer = ["localhost", "127.0.0.1"].includes(hostname) && !["80", "8080"].includes(port);
  return isLocalStaticServer ? "http://localhost:8080" : origin;
}

export function setApiBase(url) {
  window.localStorage.setItem(API_BASE_KEY, url);
}
