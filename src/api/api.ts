import axios, {AxiosResponse, type AxiosInstance, InternalAxiosRequestConfig} from 'axios';
import {BaseApiResponse} from "~/api/types";
import {useUserDataStore} from "~/stores/userData";
import {showError} from "~/composables/alert";

export type ApiResponse<T = null> = AxiosResponse<BaseApiResponse<T>>;

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    config.headers.apiKey = import.meta.env.VITE_API_KEY
    const accessToken = useUserDataStore().accessToken;
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const token = useUserDataStore().accessToken;
      if(token) {
        /*try {
          const refreshToken = await refreshTokenApi();
          const newAccessToken = refreshToken.data.data?.api_token
          if(newAccessToken) {
            useUserDataStore().setToken(newAccessToken);
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          }else {
            store.dispatch(clearToken());
            store.dispatch(clearUserProfile());
            router.push('/login');
          }
        }catch(error) {
          console.error(error);
          store.dispatch(clearToken());
          store.dispatch(clearUserProfile());
          router.push('/login');
          return Promise.reject(error);
        }*/
      }else {
        //clear token and redirect to login
      }

      //eg. redirect to login
      return api(originalRequest);
    }else {
      console.log('error >>> ', error)
      showError(error.message)
      return Promise.reject(error);
    }
    // return Promise.reject(error);
  }
);

export default api;
