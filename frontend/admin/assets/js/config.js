export const TOKEN_KEY = "resume_admin_token";
export const API_BASE_KEY = "resume_api_base";

export function getApiBase() {
  return window.localStorage.getItem(API_BASE_KEY) || window.location.origin;
}

export function setApiBase(url) {
  window.localStorage.setItem(API_BASE_KEY, url);
}
