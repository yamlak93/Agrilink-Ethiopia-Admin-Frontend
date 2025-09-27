import axios from 'axios';

/**
 * Creates a centralized Axios client with a pre-configured base URL
 * and a response interceptor to handle authentication errors globally.
 */
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api/admin', // Set your API's base URL here
});

/**
 * Axios Response Interceptor
 * This function will be called for every API response.
 */
apiClient.interceptors.response.use(
  /**
   * If the response is successful (status code in the 2xx range),
   * we just pass it through.
   */
  (response) => {
    return response;
  },
  /**
   * If the response has an error, this function is triggered.
   */
  (error) => {
    // Check if the error response exists and has a 401 Unauthorized status
    if (error.response && error.response.status === 401) {
      const responseData = error.response.data;

      // Check for the specific redirect signal sent by our backend middleware
      if (responseData && responseData.redirect === true && responseData.redirectTo) {
        console.error('Session expired or token is invalid. Redirecting to login page...');

        // 1. Clear the expired token and any other user-related data from storage
        localStorage.removeItem('token');
        
        // 2. Perform the client-side redirect.
        // Using window.location.href ensures a full page reload, which clears
        // any sensitive data held in component state.
        window.location.href = responseData.redirectTo;
        
        // 3. Return a new, non-resolving promise to prevent the original
        // component's .catch() block from running and showing a generic error.
        return new Promise(() => {});
      }
    }
    
    // For all other types of errors (e.g., 500, network errors),
    // we reject the promise so the component's local .catch() block can handle it.
    return Promise.reject(error);
  }
);

export default apiClient;
