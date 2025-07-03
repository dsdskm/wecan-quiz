// src/hooks/useManageShows.ts
import { useState, useEffect } from 'react';
import { fetchShows, deleteShow, updateShow } from '@/api/api'; // Assuming these are in api.ts
import { Show, ShowStatus } from '@/types/Show'; // Assuming these types are defined
import Logger from '@/utils/Logger'; // Assuming Logger utility

const useManageShows = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initial fetch of shows on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('loggedInUserId'); // Assuming user check is needed
    if (storedUserId) {
      const loadShows = async () => {
        setIsLoading(true);
        try {
          const fetchedShows = await fetchShows();
          Logger.info("Fetched shows:", fetchedShows);
          setShows(fetchedShows);
        } catch (error) {
          Logger.error("Error fetching shows:", error);
          // Optionally handle error display
        } finally {
          setIsLoading(false);
        }
      };
      loadShows();
    }
  }, []); // Empty dependency array means this effect runs once after the initial render

  const handleDeleteShow = async (showId: string) => {
    setIsLoading(true);
    try {
      Logger.info(`Deleting show with ID: ${showId}`);
      await deleteShow(showId);

      // After successful deletion, filter from state
      setShows(prevShows => prevShows.filter(show => show.id !== showId));

    } catch (error) {
      Logger.error(`Error deleting show ${showId}:`, error);
      // Optionally show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  const handleInternalStatusChange = async (show: Show, newStatus: ShowStatus, updatedFields?: Partial<Show>) => {
    setIsLoading(true); // Start loading
    try {
      // Determine fields to update based on new status
      const now = new Date().toISOString(); // Use ISO string for consistent date handling if backend expects it, or continue with toLocaleString if preferred
      let fieldsToUpdate: Partial<Show> = { id: show.id, status: newStatus, updatedAt: now, ...updatedFields };

      switch (newStatus) {
        case ShowStatus.InProgress:
          if (!show.startTime) {
            fieldsToUpdate.startTime = now;
            fieldsToUpdate.endTime = ""; // Ensure endTime is clear
          }
          break;
        case ShowStatus.Paused:
          fieldsToUpdate.endTime = ""; // Paused state usually clears endTime
          break;
        case ShowStatus.Completed:
          if (!show.startTime) fieldsToUpdate.startTime = show.createdAt; // Fallback if startTime somehow missing
          if (!show.endTime) fieldsToUpdate.endTime = now; // Set endTime if not already set
          break;
        case ShowStatus.Waiting:
          fieldsToUpdate.startTime =""
          fieldsToUpdate.endTime = ""
          break;
      }

      Logger.info(`Updating show status for ID: ${show.id} to ${newStatus}`, fieldsToUpdate);
      const updatedShow = await updateShow(fieldsToUpdate);

      // After successful update, refresh the entire list
      const fetchedShows = await fetchShows(); // Re-fetch all shows
      setShows(fetchedShows); // Update state with fresh data

    } catch (error) {
      Logger.error(`Error updating show status for ${show.id}:`, error);
      // Optionally show an error message to the user
    } finally {
      setIsLoading(false); // End loading
    }
  };


  return {
    shows,
    isLoading,
    handleDeleteShow,
    handleInternalStatusChange,
    // If other functions like adding a show were managed here, they would be returned too
  };
};

export default useManageShows;