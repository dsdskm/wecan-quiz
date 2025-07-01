"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const firebaseApi_1 = require("../firebaseApi");
// Storage 유틸리티 함수 import (이름 변경 및 통합)
const storage_1 = require("../utils/storage");
const path = __importStar(require("path")); // path 모듈 import 유지
// Show 배경 이미지 파일 이름 및 경로 생성 헬퍼 함수
const generateShowBackgroundImagePath = (showId, originalName) => {
    const destinationDir = `show_backgrounds/${showId}/`;
    const timestamp = Date.now();
    const fileExtension = path.extname(originalName).toLowerCase();
    const fileName = `${timestamp}${fileExtension}`;
    return `${destinationDir}${fileName}`;
};
const showService = {
    /**
     * Create a new show.
     * @param showData The show data.
     * @returns A promise that resolves with the created Show object.
     */
    createShow(showData) {
        return __awaiter(this, void 0, void 0, function* () {
            // 배경 이미지 없이 Show 데이터만 생성
            const newShow = yield (0, firebaseApi_1.createShow)(showData);
            return newShow;
        });
    },
    /**
     * Get all shows.
     * @returns A promise that resolves with an array of Show objects.
     */
    getAllShows() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, firebaseApi_1.getAllShows)();
        });
    },
    /**
     * Get a show by its ID.
     * @param showId The ID of the show.
     * @returns A promise that resolves with the Show object or null if not found.
     */
    getShowById(showId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, firebaseApi_1.getShow)(showId);
        });
    },
    /**
     * Update a show by its ID.
     * @param showId The ID of the show to update.
     * @param updateData The data to update (excluding backgroundImageUrl - this is handled by updateShowBackgroundImageUrl).
     * @returns A promise that resolves with the updated Show object or null if not found.
     */
    updateShow(showId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            // This function now only updates show data excluding backgroundImageUrl.
            // If updateData accidentally contains backgroundImageUrl, it will be sent to Firebase API.
            // Consider adding validation here to prevent updating backgroundImageUrl via this function.
            // updateShowInFirebase returns the updated show or null
            return yield (0, firebaseApi_1.updateShow)(showId, updateData);
        });
    },
    /**
     * Delete a show by its ID.
     * @param showId The ID of the show to delete.
     * @returns A promise that resolves with true if the show was deleted, false otherwise.
     */
    deleteShow(showId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Before deleting the show data, delete related files (e.g., background image)
            const showToDelete = yield (0, firebaseApi_1.getShow)(showId); // Show 정보 가져오기
            if (showToDelete && showToDelete.backgroundImageUrl) {
                try {
                    // deleteFileByUrl 유틸리티 함수 사용
                    yield (0, storage_1.deleteFileByUrl)(showToDelete.backgroundImageUrl);
                    console.log(`Deleted background image for show ${showId}: ${showToDelete.backgroundImageUrl}`);
                }
                catch (error) {
                    console.error(`Failed to delete background image for show ${showId} during deletion:`, error);
                    // 오류 발생 시 로그만 남기고 계속 진행 (Show 데이터 삭제는 시도)
                }
            }
            else if (showToDelete) {
                console.warn(`Show with ID ${showId} has no background image to delete during deletion.`);
            }
            else {
                console.warn(`Show with ID ${showId} not found for deletion (background image check).`);
            }
            // Delete the show data from Firebase
            return yield (0, firebaseApi_1.deleteShow)(showId); // <-- Show 데이터 삭제
        });
    },
    /**
     * Update the status of a show.
     * @param showId The ID of the show.
     * @param status The new status.
     * @returns A promise that resolves with true if the status was updated, false otherwise.
     */
    updateShowStatus(showId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = { status };
            const updatedShow = yield (0, firebaseApi_1.updateShow)(showId, updateData);
            return updatedShow !== null;
        });
    },
    /** 특정 Show의 배경 이미지 업로드 및 URL 업데이트 서비스 함수 (Storage 유틸리티 사용) */
    updateShowBackgroundImageUrl(showId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. 현재 Show 정보를 가져와 기존 이미지 URL 확인
            const existingShow = yield (0, firebaseApi_1.getShow)(showId);
            if (!existingShow) {
                console.warn(`Show with ID ${showId} not found for background image update.`);
                return null; // Show가 없는 경우
            }
            // 2. 기존 배경 이미지 파일 삭제 (기존 URL이 있는 경우)
            if (existingShow.backgroundImageUrl) {
                try {
                    // deleteFileByUrl 유틸리티 함수 사용
                    yield (0, storage_1.deleteFileByUrl)(existingShow.backgroundImageUrl);
                    console.log(`Deleted old background image for show ${showId}: ${existingShow.backgroundImageUrl}`);
                }
                catch (error) {
                    console.error(`Failed to delete old background image for show ${showId}:`, error);
                    // 오류 발생 시 로그만 남기고 계속 진행 (새 이미지 업로드는 시도)
                }
            }
            // 3. 새로운 이미지 Firebase Storage에 업로드 및 새 URL 얻기 (Storage 유틸리티 사용)
            // 파일 이름 및 경로 생성은 여기서 담당
            const destinationPathWithFileName = generateShowBackgroundImagePath(showId, file.originalname);
            const contentType = file.mimetype; // Multer 파일 객체에서 Content Type 가져옴
            let newImageUrl;
            try {
                // uploadFile 유틸리티 함수 사용
                newImageUrl = yield (0, storage_1.uploadFile)(file.buffer, destinationPathWithFileName, contentType);
                console.log(`Uploaded new background image for show ${showId}: ${newImageUrl}`);
            }
            catch (error) {
                console.error(`Failed to upload new background image for show ${showId}:`, error);
                throw new Error('Failed to upload new background image'); // 새 이미지 업로드 실패 시 오류 발생
            }
            // 4. Show 데이터의 backgroundImageUrl 필드를 새 URL로 업데이트
            const updateData = { backgroundImageUrl: newImageUrl };
            const updatedShow = yield (0, firebaseApi_1.updateShow)(showId, updateData); // Firebase API 호출
            if (!updatedShow) {
                // Show 데이터 업데이트 실패 시 (Firestore 문제 등)
                // 업로드된 새 이미지 파일을 삭제하는 것이 좋습니다.
                try {
                    // deleteFileByUrl 유틸리티 함수 사용
                    yield (0, storage_1.deleteFileByUrl)(newImageUrl);
                    console.warn(`Cleaned up newly uploaded image ${newImageUrl} due to show update failure.`);
                }
                catch (cleanupError) {
                    console.error(`Failed to clean up newly uploaded image ${newImageUrl}:`, cleanupError);
                }
            }
            return updatedShow;
        });
    },
    /**
     * Delete the background image for a specific show and clear the URL in the show data.
     * @param showId The ID of the show.
     * @returns A promise that resolves with true if the process was successful, false otherwise.
     */
    deleteShowBackgroundImage(showId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 1. Get the show data to find the background image URL
                const showToDelete = yield (0, firebaseApi_1.getShow)(showId);
                if (!showToDelete) {
                    console.warn(`Show with ID ${showId} not found for background image deletion.`);
                    // If the show doesn't exist, we can consider the operation successful in a sense
                    // that there's no image to delete for that show.
                    return true;
                }
                // 2. Delete the file from Firebase Storage if a URL exists
                if (showToDelete.backgroundImageUrl) {
                    yield (0, storage_1.deleteFileByUrl)(showToDelete.backgroundImageUrl);
                    console.log(`Successfully deleted background image for show ${showId}: ${showToDelete.backgroundImageUrl}`);
                }
                else {
                    console.log(`Show with ID ${showId} has no background image URL to delete.`);
                }
                // 3. Update the show data in Firebase, setting backgroundImageUrl to ""
                yield (0, firebaseApi_1.updateShow)(showId, { backgroundImageUrl: "" });
                console.log(`Successfully cleared backgroundImageUrl for show ${showId}`);
                return true; // Indicate success
            }
            catch (error) {
                console.error(`Failed to delete background image or update show data for show ${showId}:`, error);
                return false; // Indicate failure
            }
        });
    },
};
exports.default = showService;
//# sourceMappingURL=showService.js.map