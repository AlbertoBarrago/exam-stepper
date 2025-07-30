import { Step } from '@/types/stepTypes';
import { API_BASE, API_LOGIN, API_STEPS } from '@/constants/api';
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
  let response = null;
  try {
    response = await fetch(`${API_BASE}${API_LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
  }
  return response!.json();
}

export { fetchStepsConfig, login };
