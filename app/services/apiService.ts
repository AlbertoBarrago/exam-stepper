import { Step } from '@/types/stepTypes';
import { API_BASE, API_LOGIN, API_REGISTER, API_STEPS } from '@/constants/api';
import { UserData } from '@/types/userTypes';

/**
 * Fetches the configuration for steps from the API.
 * Makes a network request to retrieve the data and returns the parsed result.
 * Throws an error if the fetch operation fails.
 *
 * @return {Promise<Step[]>} A promise that resolves to an array of Step objects.
 */
async function fetchStepsConfig(): Promise<Step[]> {
  const response = await fetch(`${API_BASE}${API_STEPS}`);
  if (!response.ok) {
    throw new Error('Failed to fetch steps config');
  }
  return await response.json();
}

/**
 * Authenticates a user with the provided email and password.
 *
 * @param username
 * @param {string} password - The password associated with the user's account.
 * @return {UserData} A promise that resolves to the JSON response of the authentication request.
 */
async function login(
  username: string,
  password: string
): Promise<{ success: boolean; user?: UserData; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}${API_LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || `Login failed with status: ${response.status}`,
        };
      } catch (e) {
        console.error(e);
        return { success: false, error: `Login failed with status: ${response.status}` };
      }
    }
    return await response.json();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'An unknown network error occurred during login.';
    return { success: false, error: message };
  }
}

/**
 * Registers a new user with the provided email and password.
 *
 * @param username
 * @param {string} password - The password for the new user.
 * @param displayName
 * @return {Promise<{ success: boolean; user?: UserData; error?: string }>} A promise that resolves to the JSON response of the registration request.
 */
async function register(
  username: string,
  password: string,
  displayName: string
): Promise<{ success: boolean; user?: UserData; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}${API_REGISTER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        displayName,
      }),
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || `Registration failed with status: ${response.status}`,
        };
      } catch (e) {
        console.error(e);
        return { success: false, error: `Registration failed with status: ${response.status}` };
      }
    }
    return await response.json();
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'An unknown network error occurred during registration.';
    return { success: false, error: message };
  }
}

export { fetchStepsConfig, login, register };
