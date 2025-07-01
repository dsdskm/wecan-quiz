import { Show, ShowStatus } from '../types/Show';
import { getShowById as getShowByIdFromFirebase, createShow as createShowInFirebase, updateShow as updateShowInFirebase, deleteShow as deleteShowFromFirebase } from '../firebaseApi'; // Import other functions from firebaseApi

export const showService = {
  /**
   * Get all shows.
   * @returns A promise that resolves with an array of Show objects.
   */
  async getAllShows(): Promise<Show[]> {
    return []; // TODO: Implement actual get all shows logic from firebaseApi if needed. Currently not used.
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
   * Adds a quiz ID to the show's quizzes list.
   * @param showId The ID of the show.
   * @param quizId The ID of the quiz to add.
   * @returns A promise that resolves with the updated Show object or null if not found.
   */
  async addQuizToShow(showId: string, quizId: string): Promise<Show | null> {
    // This operation requires specific logic that is not a direct mapping to a simple Firebase update on the top-level document.
    // It involves fetching the show, modifying the quizzes array, and then updating the document.
    // The current firebaseApi.ts does not have a dedicated function for this specific array update.
    // Implementing this requires direct Firestore manipulation or adding a new function in firebaseApi.ts.
    console.warn(`addQuizToShow not fully implemented using firebaseApi. Needs specific Firestore array update logic.`);
    return null; // Placeholder, needs proper implementation
  },

  async removeQuizFromShow(showId: string, quizId: string): Promise<Show | null> {
    console.warn(`removeQuizFromShow not implemented.`);
    return null; // Placeholder, needs proper implementation
  }
};