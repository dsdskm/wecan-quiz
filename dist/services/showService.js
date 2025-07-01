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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showService = void 0;
const firebaseApi_1 = require("../firebaseApi");
const storage_1 = require("../utils/storage"); // Import storage functions
const Logger_1 = __importDefault(require("@/utils/Logger"));
exports.showService = {
    getAllShows() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, firebaseApi_1.getShows)();
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
            const existingShow = yield this.getShowById(showId);
            if (!existingShow) {
                return null; // Show not found
            }
            const dataToUpdate = Object.assign({}, updateData); // Copy update data
            // Check if backgroundImageUrl is being updated or removed
            if ('backgroundImageUrl' in updateData) {
                // If there was an existing background image, delete it from storage
                if (existingShow.backgroundImageUrl) {
                    try {
                        yield (0, storage_1.deleteFileFromStorageByUrl)(existingShow.backgroundImageUrl);
                    }
                    catch (error) {
                        // Log error but continue with show update to avoid blocking
                        console.error(`Failed to delete old background image for show ${showId}:`, error);
                        // Decide how to handle this error: continue or stop?
                        // For now, we log and continue.
                    }
                }
            }
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
     * Uploads a background image for a show and updates the show's backgroundImageUrl.
     * @param showId The ID of the show.
     * @param file The Multer file object to upload.
     * @returns A promise that resolves with the updated Show object or null if not found.
     */
    uploadBackgroundImage(showId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const show = yield this.getShowById(showId);
            Logger_1.default.info(`uploadBackgroundImage showId=${showId}`, show);
            if (!show) {
                return null;
            }
            const destinationPath = `show_backgrounds/${showId}/`; // Path in storage bucket, includes showId folder
            const fileName = 'show_background.png'; // Fixed file name
            try {
                const publicUrl = yield (0, storage_1.uploadFileToStorage)(file.buffer, fileName, destinationPath); // Use the new path and file name
                // Update the show with the new background image URL
                const updatedShow = yield this.updateShow(showId, { backgroundImageUrl: publicUrl });
                return updatedShow;
            }
            catch (error) {
                console.error('Error uploading background image:', error);
                throw error; // Re-throw the error to be handled by the route
            }
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
            const show = yield this.getShowById(showId);
            if (!show) {
                return null;
            }
            // Assuming quizzes in Show are Quiz objects or IDs, update this based on actual type
            if (!show.quizzes) {
                show.quizzes = [];
            }
            // Prevent adding duplicate quiz IDs (assuming quizId is sufficient)
            if (!show.quizzes.some(quiz => quiz.id === quizId)) { // Adjust comparison if quizzes are full objects
                show.quizzes.push({ id: quizId }); // Add the quiz (casting as any for simplicity, use correct type)
                yield this.updateShow(showId, { quizzes: show.quizzes });
            }
            return show;
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