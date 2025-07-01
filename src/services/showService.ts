import { Show, ShowStatus } from '../types/Show';
import { getShowById as getShowByIdFromFirebase, createShow as createShowInFirebase, updateShow as updateShowInFirebase, deleteShow as deleteShowFromFirebase, getShows as getShowsFromFirebase } from '../firebaseApi';
import { uploadFileToStorage, deleteFileFromStorageByUrl } from '../utils/storage'; // Import storage functions
import Logger from '@/utils/Logger';

export const showService = {
  async getAllShows(): Promise<Show[]> {
    return await getShowsFromFirebase();
  },

  /**
   * Get a show by its ID.
   * @param showId The ID of the show.
   * @returns A promise that resolves with the Show object or null if not found.
   */
  async getShowById(showId: string): Promise<Show | null> {
    return await getShowByIdFromFirebase(showId);
  },

  /**
   * Create a new show.
   * @param showData The data for the new show.
   */
  async createShow(showData: Show): Promise<Show> {
    // createShowInFirebase handles ID generation and timestamps.
    return await createShowInFirebase(showData);
  },

  /**
   * Update an existing show.
   * @param showId The ID of the show to update.
   * @param updateData The data to update the show with.
   * @returns A promise that resolves with the updated Show object or null if not found.
   */
  async updateShow(showId: string, updateData: any): Promise<Show | null> {
    const existingShow = await this.getShowById(showId);
    if (!existingShow) {
      return null; // Show not found
    }

    const dataToUpdate: any = { ...updateData }; // Copy update data

    // Check if backgroundImageUrl is being updated or removed
    if ('backgroundImageUrl' in updateData) {
      // If there was an existing background image, delete it from storage
      if (existingShow.backgroundImageUrl) {
        try {
          await deleteFileFromStorageByUrl(existingShow.backgroundImageUrl);
        } catch (error) {
          // Log error but continue with show update to avoid blocking
          console.error(`Failed to delete old background image for show ${showId}:`, error);
          // Decide how to handle this error: continue or stop?
          // For now, we log and continue.
        }
      }
    }
    // updateShowInFirebase returns the updated show or null
    return await updateShowInFirebase(showId, updateData);
  },

  /**
   * Delete a show by its ID.
   * @param showId The ID of the show to delete.
   * @returns A promise that resolves when the show is deleted.
   * @returns A promise that resolves with true if the show was deleted, false otherwise.
   */
  async deleteShow(showId: string): Promise<boolean> { // Change return type to boolean
    return await deleteShowFromFirebase(showId);
  },

  /**
   * Uploads a background image for a show and updates the show's backgroundImageUrl.
   * @param showId The ID of the show.
   * @param file The Multer file object to upload.
   * @returns A promise that resolves with the updated Show object or null if not found.
   */
  async uploadBackgroundImage(showId: string, file: Express.Multer.File): Promise<Show | null> {
    const show = await this.getShowById(showId);
    Logger.info(`uploadBackgroundImage showId=${showId}`,show)
    if (!show) {
      return null;
    }

    const destinationPath = `show_backgrounds/${showId}/`; // Path in storage bucket, includes showId folder
    const fileName = 'show_background.png'; // Fixed file name

    try {
      const publicUrl = await uploadFileToStorage(file.buffer, fileName, destinationPath); // Use the new path and file name

      // Update the show with the new background image URL
      const updatedShow = await this.updateShow(showId, { backgroundImageUrl: publicUrl });

      return updatedShow;
    } catch (error) {
      console.error('Error uploading background image:', error);
      throw error; // Re-throw the error to be handled by the route
    }
  },
  /**
   * Adds a quiz ID to the show's quizzes list.
   * @param showId The ID of the show.
   * @param quizId The ID of the quiz to add.
   * @returns A promise that resolves with the updated Show object or null if not found.
   */
  async addQuizToShow(showId: string, quizId: string): Promise<Show | null> {
    // This operation requires specific logic that is not a direct mapping to a simple Firebase update on the top-level document.
    const show = await this.getShowById(showId);
    if (!show) {
      return null;
    }

    // Assuming quizzes in Show are Quiz objects or IDs, update this based on actual type
    if (!show.quizzes) {
      show.quizzes = [];
    }

    // Prevent adding duplicate quiz IDs (assuming quizId is sufficient)
    if (!show.quizzes.some(quiz => quiz.id === quizId)) { // Adjust comparison if quizzes are full objects
      show.quizzes.push({ id: quizId } as any); // Add the quiz (casting as any for simplicity, use correct type)
      await this.updateShow(showId, { quizzes: show.quizzes });
    }
    return show;
  },

  async removeQuizFromShow(showId: string, quizId: string): Promise<Show | null> {
    console.warn(`removeQuizFromShow not implemented.`);
    return null; // Placeholder, needs proper implementation
  }
};