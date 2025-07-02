import { uploadFile, deleteFileByUrl, generateShowBackgroundImagePath } from '../utils/storage';
import { Show, ShowStatus } from '../types/Show';
import { createShowInDb, deleteShowFromDb, getAllShowsFromDb, getShowFromDb, updateShowInDb } from '@/firebaseApi';
import Logger from '@/utils/Logger';

const showService = {
  async createShow(showData: Partial<Show>): Promise<Show> {
    try {
      const newShow = await createShowInDb(showData);
      return newShow;
    } catch (error) {
      Logger.error(error)
      throw error;
    }
  },
  async getShowById(showId: string): Promise<Show | null> {
    try {
      return await getShowFromDb(showId);
    } catch (error) {
      Logger.error(error)
      throw error;
    }
  },
  async getAllShows(): Promise<Show[]> {
    try {
      return await getAllShowsFromDb();
    } catch (error) {
      Logger.error(error)
      throw error;
    }
  },

  async updateShow(showId: string, updateData: Partial<Show>): Promise<Show | null> {
    try {
      const updatedShow = await updateShowInDb(showId, updateData);
      if (!updatedShow) {
        return null;
      }
      return updatedShow;
    } catch (error) {
      Logger.error(error)
      throw error;
    }
  },
  async deleteShow(showId: string): Promise<boolean> {
    try {
      const showToDelete = await getShowFromDb(showId);
      if (showToDelete && showToDelete.backgroundImageUrl) {
        await deleteFileByUrl(showToDelete.backgroundImageUrl);
      }
      return await deleteShowFromDb(showId);
    } catch (error) {
      Logger.error(error)
      throw error;
    }
  },

  async updateShowStatus(showId: string, status: ShowStatus): Promise<boolean> {
    const updateData: Partial<Show> = { status };
    const updatedShow = await updateShowInDb(showId, updateData);
    return updatedShow !== null;
  },

  async updateShowBackgroundImageUrl(showId: string, file: Express.Multer.File): Promise<Show | null> {
    try {
      const existingShow = await getShowFromDb(showId);
      if (!existingShow) {
        return null;
      }

      if (existingShow.backgroundImageUrl) {
        await deleteFileByUrl(existingShow.backgroundImageUrl);
      }

      const destinationPathWithFileName = generateShowBackgroundImagePath(showId, file.originalname);
      const contentType = file.mimetype;
      const newImageUrl = await uploadFile(file.buffer, destinationPathWithFileName, contentType);

      const updateData: Partial<Show> = { backgroundImageUrl: newImageUrl };
      const updatedShow = await updateShowInDb(showId, updateData);

      if (!updatedShow) {
        await deleteFileByUrl(newImageUrl);
        return null;
      }

      return updatedShow;
    } catch (error) {
      Logger.error(error)
      throw error;
    }
  },

  async deleteShowBackgroundImage(showId: string): Promise<boolean> {
    try {
      const showToDelete = await getShowFromDb(showId);

      if (!showToDelete) {
        return true;
      }

      if (showToDelete.backgroundImageUrl) {
        await deleteFileByUrl(showToDelete.backgroundImageUrl);
      }

      await updateShowInDb(showId, { backgroundImageUrl: "" });
      Logger.info(`Successfully cleared backgroundImageUrl for show ${showId}`);

      return true;
    } catch (error) {
      Logger.error(`Failed to delete background image or update show data for show ${showId}:`, error);
      throw error;
    }
  },
};

export default showService;
