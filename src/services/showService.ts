import {
  getShow as getShowFromFirebase,
  getAllShows as getAllShowsFromFirebase,
  createShow as createShowInFirebase,
  updateShow as updateShowInFirebase,
  deleteShow as deleteShowFromFirebase,
} from '../firebaseApi';

// Storage 유틸리티 함수 import (이름 변경 및 통합)
import { uploadFile, deleteFileByUrl } from '../utils/storage';
import { Show, ShowStatus } from '../types/Show';
import * as path from 'path'; // path 모듈 import 유지


// Show 배경 이미지 파일 이름 및 경로 생성 헬퍼 함수
const generateShowBackgroundImagePath = (showId: string, originalName: string): string => {
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
  async createShow(showData: Partial<Show>): Promise<Show> {
    // 배경 이미지 없이 Show 데이터만 생성
    const newShow = await createShowInFirebase(showData);
    return newShow;
  },

  /**
   * Get all shows.
   * @returns A promise that resolves with an array of Show objects.
   */
  async getAllShows(): Promise<Show[]> {
    return await getAllShowsFromFirebase();
  },

  /**
   * Get a show by its ID.
   * @param showId The ID of the show.
   * @returns A promise that resolves with the Show object or null if not found.
   */
  async getShowById(showId: string): Promise<Show | null> {
    return await getShowFromFirebase(showId);
  },

  /**
   * Update a show by its ID.
   * @param showId The ID of the show to update.
   * @param updateData The data to update (excluding backgroundImageUrl - this is handled by updateShowBackgroundImageUrl).
   * @returns A promise that resolves with the updated Show object or null if not found.
   */
  async updateShow(showId: string, updateData: Partial<Show>): Promise<Show | null> {
    // This function now only updates show data excluding backgroundImageUrl.
    // If updateData accidentally contains backgroundImageUrl, it will be sent to Firebase API.
    // Consider adding validation here to prevent updating backgroundImageUrl via this function.

    // updateShowInFirebase returns the updated show or null
    return await updateShowInFirebase(showId, updateData);
  },

  /**
   * Delete a show by its ID.
   * @param showId The ID of the show to delete.
   * @returns A promise that resolves with true if the show was deleted, false otherwise.
   */
  async deleteShow(showId: string): Promise<boolean> {
    // Before deleting the show data, delete related files (e.g., background image)
    const showToDelete = await getShowFromFirebase(showId); // Show 정보 가져오기

    if (showToDelete && showToDelete.backgroundImageUrl) {
      try {
        // deleteFileByUrl 유틸리티 함수 사용
        await deleteFileByUrl(showToDelete.backgroundImageUrl);
        console.log(`Deleted background image for show ${showId}: ${showToDelete.backgroundImageUrl}`);
      } catch (error) {
        console.error(`Failed to delete background image for show ${showId} during deletion:`, error);
        // 오류 발생 시 로그만 남기고 계속 진행 (Show 데이터 삭제는 시도)
      }
    } else if (showToDelete) {
      console.warn(`Show with ID ${showId} has no background image to delete during deletion.`);
    } else {
      console.warn(`Show with ID ${showId} not found for deletion (background image check).`);
    }


    // Delete the show data from Firebase
    return await deleteShowFromFirebase(showId); // <-- Show 데이터 삭제
  },

  /**
   * Update the status of a show.
   * @param showId The ID of the show.
   * @param status The new status.
   * @returns A promise that resolves with true if the status was updated, false otherwise.
   */
  async updateShowStatus(showId: string, status: ShowStatus): Promise<boolean> {
    const updateData: Partial<Show> = { status };
    const updatedShow = await updateShowInFirebase(showId, updateData);
    return updatedShow !== null;
  },
  /** 특정 Show의 배경 이미지 업로드 및 URL 업데이트 서비스 함수 (Storage 유틸리티 사용) */
  async updateShowBackgroundImageUrl(showId: string, file: Express.Multer.File): Promise<Show | null> { // <-- export 키워드 제거
    // 1. 현재 Show 정보를 가져와 기존 이미지 URL 확인
    const existingShow = await getShowFromFirebase(showId);
    if (!existingShow) {
      console.warn(`Show with ID ${showId} not found for background image update.`);
      return null; // Show가 없는 경우
    }

    // 2. 기존 배경 이미지 파일 삭제 (기존 URL이 있는 경우)
    if (existingShow.backgroundImageUrl) {
      try {
        // deleteFileByUrl 유틸리티 함수 사용
        await deleteFileByUrl(existingShow.backgroundImageUrl);
        console.log(`Deleted old background image for show ${showId}: ${existingShow.backgroundImageUrl}`);
      } catch (error) {
        console.error(`Failed to delete old background image for show ${showId}:`, error);
        // 오류 발생 시 로그만 남기고 계속 진행 (새 이미지 업로드는 시도)
      }
    }

    // 3. 새로운 이미지 Firebase Storage에 업로드 및 새 URL 얻기 (Storage 유틸리티 사용)
    // 파일 이름 및 경로 생성은 여기서 담당
    const destinationPathWithFileName = generateShowBackgroundImagePath(showId, file.originalname);
    const contentType = file.mimetype; // Multer 파일 객체에서 Content Type 가져옴

    let newImageUrl: string;
    try {
      // uploadFile 유틸리티 함수 사용
      newImageUrl = await uploadFile(file.buffer, destinationPathWithFileName, contentType);
      console.log(`Uploaded new background image for show ${showId}: ${newImageUrl}`);
    } catch (error) {
      console.error(`Failed to upload new background image for show ${showId}:`, error);
      throw new Error('Failed to upload new background image'); // 새 이미지 업로드 실패 시 오류 발생
    }


    // 4. Show 데이터의 backgroundImageUrl 필드를 새 URL로 업데이트
    const updateData: Partial<Show> = { backgroundImageUrl: newImageUrl };
    const updatedShow = await updateShowInFirebase(showId, updateData); // Firebase API 호출

    if (!updatedShow) {
      // Show 데이터 업데이트 실패 시 (Firestore 문제 등)
      // 업로드된 새 이미지 파일을 삭제하는 것이 좋습니다.
      try {
        // deleteFileByUrl 유틸리티 함수 사용
        await deleteFileByUrl(newImageUrl);
        console.warn(`Cleaned up newly uploaded image ${newImageUrl} due to show update failure.`);
      } catch (cleanupError) {
        console.error(`Failed to clean up newly uploaded image ${newImageUrl}:`, cleanupError);
      }
    }

    return updatedShow;
  },

  /**
   * Delete the background image for a specific show and clear the URL in the show data.
   * @param showId The ID of the show.
   * @returns A promise that resolves with true if the process was successful, false otherwise.
   */
  async deleteShowBackgroundImage(showId: string): Promise<boolean> {
    try {
      // 1. Get the show data to find the background image URL
      const showToDelete = await getShowFromFirebase(showId);

      if (!showToDelete) {
        console.warn(`Show with ID ${showId} not found for background image deletion.`);
        // If the show doesn't exist, we can consider the operation successful in a sense
        // that there's no image to delete for that show.
        return true;
      }

      // 2. Delete the file from Firebase Storage if a URL exists
      if (showToDelete.backgroundImageUrl) {
        await deleteFileByUrl(showToDelete.backgroundImageUrl);
        console.log(`Successfully deleted background image for show ${showId}: ${showToDelete.backgroundImageUrl}`);
      } else {
        console.log(`Show with ID ${showId} has no background image URL to delete.`);
      }

      // 3. Update the show data in Firebase, setting backgroundImageUrl to ""
      await updateShowInFirebase(showId, { backgroundImageUrl: "" });
      console.log(`Successfully cleared backgroundImageUrl for show ${showId}`);

      return true; // Indicate success
    } catch (error) {
      console.error(`Failed to delete background image or update show data for show ${showId}:`, error);
      return false; // Indicate failure
    }
  },
};

export default showService;
