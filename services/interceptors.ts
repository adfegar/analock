import axios from "axios";
import { refreshToken } from "./auth.services";
import { getStorageUserData, setStorageUserData } from "./storage.services";
import { getAccessToken, setAccessToken } from "../constants/auth.constants";
import { navigationRef } from "../App";

export const AXIOS_INSTANCE = axios.create();

export const API_ERRORS = {
  TOKEN_EXPIRED: "token expired",
  COOKIE_NOT_SET: "refreshToken cookie must be set",
};

AXIOS_INSTANCE.interceptors.request.use((request) => {
  console.log(request.url);
  const allowedUrls = /\/api\/v1\/auth\/*/g;
  if (request.url !== undefined && !allowedUrls.test(request.url)) {
    const accessToken = getAccessToken();
    request.headers.Authorization = `Bearer ${accessToken}`;
  }

  return request;
});

AXIOS_INSTANCE.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { config, response } = error;
    if (response && response.status === 401) {
      try {
        const refreshTokenResponse = await refreshToken();
        if (refreshTokenResponse !== undefined) {
          console.log(refreshTokenResponse);
          setAccessToken(refreshTokenResponse.token);
          return AXIOS_INSTANCE.request(config);
        }
      } catch (err) {
        console.log(err);
        const userData = getStorageUserData();
        userData.authenticated = false;
        setStorageUserData(userData);
        if (navigationRef.isReady()) {
          navigationRef.resetRoot({
            index: 0,
            routes: [{ name: "Login" }],
          });
        }
      }
    }
    return Promise.reject(error);
  },
);
