import { Step } from '@/types/stepTypes';
import { API_BASE, API_LOGIN, API_STEPS } from '@/const/api';

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

async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE}${API_LOGIN}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  return response.json();
}

export { fetchStepsConfig };
