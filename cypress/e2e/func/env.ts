const env = import.meta.env
export const baseUrl = env.VITE_BASE_URL
export const apiUrl = env.VITE_API_URL
export const apiExUrl = env.VITE_API_URL + '/external/'
export const user = env.VITE_SSO_USER
export const password = env.VITE_SSO_PASSWORD
export const apiKey = env.VITE_API_KEY
export const mockUser = env.VITE_MOCK_USER_ID
