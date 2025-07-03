// src/api/api.ts
import Logger from '@/utils/Logger';
import { Show, ShowStatus } from '../types/Show';
import { AuthToken, UserCredentials } from '@/types/Account';
import { AUTH_TOKEN_STORAGE_KEY } from '../constants';




export const login = async (credentials: UserCredentials): Promise<{ token: AuthToken }> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Login failed with status: ${response.status}`);
    }
    const data = await response.json();
    return { token: data.token }; // Assuming the API returns { token: string }
  } catch (error) {
    Logger.error('Error during login:', error);
    throw error;
  }
}

export const logout = async () => {
  Logger.info('Logging out: Removing token from localStorage');
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY); // Assuming the token is stored as 'authToken'
}


export async function createShow(showData: Show): Promise<Show> {
  try {
    const authToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (!authToken) {
      throw new Error("Authentication token not found.");
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/shows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(showData),
    });
    if (!response.ok) {
      throw new Error(`Failed to create show with status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    Logger.error('Error creating show:', error);
    throw error;
  }
}

export async function updateShow(showData: Partial<Show>): Promise<Show> {
  try {
    const authToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (!authToken) {
      throw new Error("Authentication token not found.");
    }

    if (!showData.id) {
        throw new Error("Show ID is required for updating.");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/shows/${showData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(showData),
    });
    if (!response.ok) {
      throw new Error(`Failed to update show with status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    Logger.error('Error updating show:', error);
    throw error;
  }
}


export const fetchShows = async (): Promise<Show[]> => {
  try {
    const authToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (!authToken) {
      throw new Error("Authentication token not found.");
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/shows`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      }, method: "GET"
    });

    Logger.info(`response`, response)

    // converting
    const data = await response.json()
    const shows: Show[] = data.map((item: any) => {
      const result: Show = {
        id: item.id,
        title: item.title,
        details: item.details,
        backgroundImageUrl: item.backgroundImageUrl,
        quizzes: item.quizzes,
        status: item.status,
        url: item.url,
        createdAt: item.createdAt,
        startTime: item.startTime,
        endTime: item.endTime,
        updatedAt: item.updatedAt,
      }
      return result
    })
    return shows
  } catch (error) {
    Logger.error('Error fetching shows:', error);
    return []
  }
}

export const deleteShow = async(showId:string): Promise<void> => {
  try {
    const authToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (!authToken) {
      throw new Error("Authentication token not found.");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/shows/${showId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete show with status: ${response.status}`);
    }
  } catch (error) {
    Logger.error('Error deleting show:', error);
    throw error;
  }
}

export const updateShowBackgroundImage = async(showId:string, backgroundImage: File): Promise<void> => {
  const authToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (!authToken) {
    throw new Error("Authentication token not found.");
  }

  try {
    const formData = new FormData();
    formData.append('backgroundImage', backgroundImage);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/shows/${showId}/background-image`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        // Note: Content-Type is not needed for FormData, fetch sets it automatically
      },
      body: formData,
    });

    if (!response.ok) {
      // Attempt to read the error message from the response body if available
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || `Failed to update show background image with status: ${response.status}`;
      throw new Error(errorMessage);
    }
    // Depending on the backend, you might want to return the updated show object here
    // return await response.json();
  } catch (error) {
    Logger.error('Error updateShowBackgroundImage:', error);
    throw error;
  }
}
export const deleteShowBackgroundImage = async(showId:string): Promise<void> => {
  const authToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (!authToken) {
    throw new Error("Authentication token not found.");
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/shows/${showId}/background-image`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete show background image with status: ${response.status}`);
    }
  } catch (error) {
    Logger.error('Error deleteShowBackgroundImage:', error);
    throw error;
  }
}