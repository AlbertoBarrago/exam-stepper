import { Step, StepResult } from '@/types/stepTypes';
import { API_BASE, API_LOGIN, API_REGISTER, API_STEPS } from '@/constants/api';
import { UserData } from '@/types/userTypes';
import { mapToCEFR, normalizeScore } from '@/services/score';

/**
 * Fetches the configuration for steps from the API.
 * Makes a network request to retrieve the data and returns the parsed result.
 * Throws an error if the fetch operation fails.
 *
 * @return {Promise<Step[]>} A promise that resolves to an array of Step objects.
 */
async function fetchStepsConfig(): Promise<Step[]> {
  const response = await fetch(`${API_BASE}${API_STEPS}`);
  console.log('API Response Status:', response.status);
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to fetch steps config. Response:', errorText);
    throw new Error(`Failed to fetch steps config: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  console.log('Fetched steps data:', data);
  return data;
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

/**
 * Saves the result (raw score and max score) for a specific step of an exam.
 *
 * @param examId The ID of the exam.
 * @param stepId The ID of the step within the exam.
 * @param rawScore The raw score obtained for the step.
 * @param maxScore The maximum possible score for the step.
 * @returns A promise that resolves to an object indicating success or failure, along with data or an error message.
 */
async function saveStepResult(
  examId: number,
  stepId: number,
  rawScore: number,
  maxScore: number,
  cefrLevel: string
): Promise<{ success: boolean; data?: never; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/exam/step-result`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ examId, stepId, rawScore, maxScore, cefrLevel }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error || 'Failed to save step result' };
    }

    return await response.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown network error occurred.';
    return { success: false, error: message };
  }
}

async function updateStepResult(stepResult: Partial<StepResult>): Promise<object> {
  const response = await fetch(`${API_BASE}/exam/step-result`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(stepResult),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

/**
 * Starts a new exam session by creating an entry in the exams table and populating exam_steps.
 *
 * @param userId The ID of the user starting the exam.
 * @param stepIds An array of step IDs that constitute this exam.
 * @returns A promise that resolves to an object indicating success or failure, along with the new examId and examSteps data, or an error message.
 */
async function startExam(
  userId: string,
  stepIds: number[]
): Promise<{ success: boolean; examId?: number; examSteps?: never[]; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/exam/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, stepIds }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error || 'Failed to start exam' };
    }

    return await response.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown network error occurred.';
    return { success: false, error: message };
  }
}

/**
 * Finalizes an exam, calculates the final score and CEFR level, and updates the exam record.
 *
 * @param examId The ID of the exam to finalize.
 * @returns A promise that resolves to an object indicating success or failure, along with the calculated final score, CEFR level, or an error message.
 */
async function finalizeExam(examId: number): Promise<{
  success: boolean;
  finalScore?: number;
  exam?: {
    cefr_level: {
      global_cefr_level: string;
      reading_cefr_level?: string;
      listening_cefr_level?: string;
      speaking_cefr_level?: string;
      writing_cefr_level?: string;
    };
    final_score: number;
    created_at: string;
  };
  error?: string;
}> {
  try {
    // Fetch all step results for the exam
    const stepResultsResponse = await fetch(`${API_BASE}/exam/${examId}/step-results`);
    if (!stepResultsResponse.ok) {
      const errorData = await stepResultsResponse.json();
      return { success: false, error: errorData.error || 'Failed to fetch step results' };
    }
    const { examSteps } = await stepResultsResponse.json();

    // Calculate individual CEFR levels and prepare for global CEFR calculation
    const sectionCefrLevels: { [key: string]: string } = {};
    const stepScoresData: { [key: string]: number } = {};
    let totalNormalizedScore = 0;
    let totalStepsWithScore = 0;

    interface ExamStepResult {
      raw_score: number;
      max_score: number;
      step_id: number;
      steps: { kind: string };
    }

    examSteps.forEach((step: ExamStepResult) => {
      const rawScore = step.raw_score || 0;
      const maxScore = step.max_score || 0;
      const stepKind = step.steps.kind.split('-')[0]; // e.g., 'reading', 'listening'

      stepScoresData[`${stepKind}_score`] = rawScore;

      if (maxScore > 0) {
        const normalizedScore = normalizeScore(rawScore, maxScore);
        sectionCefrLevels[`${stepKind}_cefr_level`] = mapToCEFR(normalizedScore);
        totalNormalizedScore += normalizedScore;
        totalStepsWithScore++;
      }
    });

    // Calculate global CEFR level
    const globalNormalizedScore =
      totalStepsWithScore > 0 ? totalNormalizedScore / totalStepsWithScore : 0;
    const globalCefrLevel = mapToCEFR(globalNormalizedScore);

    const cefrLevelData = {
      global_cefr_level: globalCefrLevel,
      ...sectionCefrLevels,
    };

    const response = await fetch(`${API_BASE}/exam/${examId}/finalize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cefrLevelData, stepScoresData }), // Send both CEFR and step scores data
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error || 'Failed to finalize exam' };
    }

    return await response.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown network error occurred.';
    return { success: false, error: message };
  }
}

export {
  fetchStepsConfig,
  login,
  register,
  saveStepResult,
  startExam,
  finalizeExam,
  updateStepResult,
};
