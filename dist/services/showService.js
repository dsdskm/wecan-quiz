"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showService = void 0;
const firebaseApi_1 = require("../firebaseApi"); // Import other functions from firebaseApi
exports.showService = {
    /**
     * Get all shows.
     * @returns A promise that resolves with an array of Show objects.
     */
    getAllShows() {
        return __awaiter(this, void 0, void 0, function* () {
            return []; // TODO: Implement actual get all shows logic from firebaseApi if needed. Currently not used.
        });
    },
    /**
     * Get a show by its ID.
     * @param showId The ID of the show.
     * @returns A promise that resolves with the Show object or null if not found.
     */
    getShowById(showId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, firebaseApi_1.getShowById)(showId);
        });
    },
    /**
     * Create a new show.
     * @param showData The data for the new show.
     */
    createShow(showData) {
        return __awaiter(this, void 0, void 0, function* () {
            // createShowInFirebase handles ID generation and timestamps.
            return yield (0, firebaseApi_1.createShow)(showData);
        });
    },
    /**
     * Update an existing show.
     * @param showId The ID of the show to update.
     * @param updateData The data to update the show with.
     * @returns A promise that resolves with the updated Show object or null if not found.
     */
    updateShow(showId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            // updateShowInFirebase returns the updated show or null
            return yield (0, firebaseApi_1.updateShow)(showId, updateData);
        });
    },
    /**
     * Delete a show by its ID.
     * @param showId The ID of the show to delete.
     * @returns A promise that resolves when the show is deleted.
     * @returns A promise that resolves with true if the show was deleted, false otherwise.
     */
    deleteShow(showId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, firebaseApi_1.deleteShow)(showId);
        });
    },
    /**
     * Adds a quiz ID to the show's quizzes list.
     * @param showId The ID of the show.
     * @param quizId The ID of the quiz to add.
     * @returns A promise that resolves with the updated Show object or null if not found.
     */
    addQuizToShow(showId, quizId) {
        return __awaiter(this, void 0, void 0, function* () {
            // This operation requires specific logic that is not a direct mapping to a simple Firebase update on the top-level document.
            // It involves fetching the show, modifying the quizzes array, and then updating the document.
            // The current firebaseApi.ts does not have a dedicated function for this specific array update.
            // Implementing this requires direct Firestore manipulation or adding a new function in firebaseApi.ts.
            console.warn(`addQuizToShow not fully implemented using firebaseApi. Needs specific Firestore array update logic.`);
            return null; // Placeholder, needs proper implementation
        });
    },
    removeQuizFromShow(showId, quizId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.warn(`removeQuizFromShow not implemented.`);
            return null; // Placeholder, needs proper implementation
        });
    }
};
//# sourceMappingURL=showService.js.map