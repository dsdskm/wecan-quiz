'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Show, ShowStatus } from '@/types/Show'; // Ensure updateShow is imported
import ConfirmDialog from '../components/ConfirmDialog'; // Import the new ConfirmDialog
import Image from 'next/image';
// Styled Components를 별도 파일에서 임포트합니다.
import {
  DashboardContainer,
  HeaderSection,
  HeaderLeft,
  HeaderTitle,
  CreateShowButton,
  ShowsGrid,
  ShowCard,
  ShowTitle,
  ShowInfo,
  ShowStatusIndicator,
  ShowDetails,
  UrlButton,
  ShowCardButtons,
  PlayButton,
  EditButton,
  CompleteButton,
  CloseButton,
  NoShowsMessage,
  NIcon,
  VAIcon,
} from './dashboard.styles';
import FullScreenLoadingIndicator from '../components/FullScreenLoadingIndicator';
import useConfirmDialog from '../../hooks/useConfirmDialog';
import useManageShows from '../../hooks/useManageShows'; // Import the new hook
import Logger from '@/utils/Logger';
import Link from 'next/link';
// New component for rendering a single ShowCard
const ShowCardComponent: React.FC<{
  show: Show;
  // Group handlers into a single object
  handlers: {
    handlePlayShow: (showId: string) => void; // <-- 여기로 옮깁니다.
    handleEditShow: (showId: string) => void;
    handleDeleteShow: (showId: string) => void;
    handleStatusButtonClick: (show: Show) => void;
    openConfirmDialog: (message: string, onConfirm: () => void) => void;
    handleInternalStatusChange: (show: Show, newStatus: ShowStatus, updatedFields?: Partial<Show>) => void;
  };
}> = ({ // <--- 단 하나의 props 객체를 받습니다.
  show, // props 객체에서 show를 구조 분해
  handlers, // props 객체에서 handlers 객체를 구조 분해
}) => {
    // ShowCardComponent 내부에서 Styled Components를 사용합니다.
    return (
      <ShowCard key={show.id} status={show.status as ShowStatus}>
        <ShowStatusIndicator status={show.status as ShowStatus}>
          {show.status.charAt(0).toUpperCase() + show.status.slice(1)}
        </ShowStatusIndicator>
        <CloseButton
          onClick={(event) => {
            event.stopPropagation(); // Prevent ShowCard click event from firing
            handlers.openConfirmDialog(`Are you sure you want to delete "${show.title}"? This action cannot be undone.`, () => handlers.handleDeleteShow(show.id as string));
          }}
        >
          <Image src="/cross.png" alt="Delete" width={24} height={24} />
        </CloseButton>
        <ShowStatusIndicator status={show.status as ShowStatus}>
          {' '}
          {/* Cast show.status */}
          {show.status.charAt(0).toUpperCase() + show.status.slice(1)}{' '}
          {/* Capitalize status */}
        </ShowStatusIndicator>
        {/* Position Title after status indicator */}

        <ShowTitle>{show.title}</ShowTitle>{' '}
        {/* Removed status text from title */}
        <ShowDetails>{show.details}</ShowDetails>
        {show.createdAt && <ShowInfo>📅 생성일: {show.createdAt}</ShowInfo>}
        {/* Display Start Time only if it exists */}
        {show.startTime && <ShowInfo>⏰ 시작일: {show.startTime}</ShowInfo>}

        {/* Display End Time only if it exists */}
        {show.endTime && <ShowInfo>🏁 종료일: {show.endTime}</ShowInfo>}

        {/* Display Quiz Count */}
        <ShowInfo>📖 퀴즈 개수: {show.quizzes ? show.quizzes.length : 0}</ShowInfo>

        <ShowCardButtons>
          {/* Play/Pause/Resume/Reset Button */}
          <PlayButton
            onClick={() => handlers.handleStatusButtonClick(show)} // Use the status button handler from handlers object
            disabled={
              show.status !== ShowStatus.Waiting &&
              show.status !== ShowStatus.InProgress &&
              show.status !== ShowStatus.Paused &&
              show.status !== ShowStatus.Completed
            } // Should theoretically always be enabled now? Re-evaluate if specific statuses shouldn't show the button at all
          >
            {show.status === ShowStatus.Waiting && 'Play'}
            {show.status === ShowStatus.InProgress && 'Pause'}
            {show.status === ShowStatus.Paused && 'Resume'}
            {show.status === ShowStatus.Completed && 'Reset'}
          </PlayButton>

          {/* Complete Button */}
          <CompleteButton
            onClick={() => handlers.openConfirmDialog(`Are you sure you want to mark "${show.title}" as completed"?`, () => handlers.handleInternalStatusChange(show, ShowStatus.Completed))}
            disabled={show.status === ShowStatus.Completed} // Completed 상태일 때만 비활성화
          >
            Complete
          </CompleteButton>

          <EditButton // This button likely still needs a separate handler or logic
            onClick={() => handlers.handleEditShow(show.id!)}
            disabled={show.status !== ShowStatus.Waiting} // Enable only for Waiting
          >Edit</EditButton>
        </ShowCardButtons>
        <UrlButton
          onClick={(event) => {
            event.preventDefault(); // Prevent default button behavior (e.g., form submission)
            if (show.url) {
              window.open(show.url, '_blank');
            }
          }}
          disabled={!show.url} // Use the standard disabled attribute
        >
          {/* Using a simple globe icon from public folder, replace if needed */}
          <Image
            src="/globe.svg"
            alt="URL"
            width={16}
            height={16}
            style={{ marginRight: '5px' }}
          />
          GO URL
        </UrlButton>
      </ShowCard>
    );
  };


const DashboardPage: React.FC = () => {
  const { confirmDialog, openConfirmDialog, closeConfirmDialog } = useConfirmDialog();
  const { shows, isLoading, handleDeleteShow, handleInternalStatusChange } = useManageShows();
  const router = useRouter();

  // Removed local shows, isLoading, and useEffect for fetching as they are now in the hook

  const handlePlayShow = (showId: string) => {
    Logger.info(`Initiating Play for show with ID: ${showId}`);
    router.push(`/play/${showId}`); // Navigate to the play page
  };

  const handleEditShow = (showId: string) => {
    Logger.info(`Editing show with ID: ${showId}`);
    // Add your navigation logic here
  };

  const handleStatusButtonClick = (show: Show) => { // This function now primarily handles opening the confirmation dialog
    switch (show.status) {
      case ShowStatus.Waiting: // Play button (Waiting -> InProgress)
        openConfirmDialog(`Are you sure you want to start "${show.title}"?`, () => handleInternalStatusChange(show, ShowStatus.InProgress));
        break;
      case ShowStatus.InProgress: // Pause button (InProgress -> Paused)
        openConfirmDialog(`Are you sure you want to pause "${show.title}"?`, () => handleInternalStatusChange(show, ShowStatus.Paused));
        break;
      case ShowStatus.Paused: // Resume button (Paused -> InProgress)
        openConfirmDialog(`Are you sure you want to resume "${show.title}"?`, () => handleInternalStatusChange(show, ShowStatus.InProgress));
        break;
      case ShowStatus.Completed: // Reset button (Completed -> Waiting)
        openConfirmDialog(`Are you sure you want to reset "${show.title}"?`, () => handleInternalStatusChange(show, ShowStatus.Waiting));
        break;
    }
  };


  return (
    <div>
      <FullScreenLoadingIndicator isOpen={isLoading} />
      <DashboardContainer>
        <HeaderSection>
          <HeaderLeft>
            <HeaderTitle>Dashboard</HeaderTitle>
            {/* Removed Link and CreateShowButton from here */}
          </HeaderLeft>
          {/* Added Create New Show button as a Link */}
          <CreateShowButton as={Link} href="/add-show">
            <span style={{ marginRight: '5px' }}>+</span> Create New Show
          </CreateShowButton>
        </HeaderSection>

        {shows.length === 0 ? (
          <NoShowsMessage>
            등록된 쇼가 없습니다. 새로운 쇼를 만들어보세요!
          </NoShowsMessage>
        ) : (
          <ShowsGrid>
            {shows.map((show, index) => {
              return (
                <ShowCardComponent // <--- ShowCardComponent 사용
                  key={show.id || index}
                  show={show}
                  handlers={{
                    handlePlayShow: handlePlayShow, // Included in handlers
                    handleEditShow: handleEditShow,
                    handleDeleteShow: handleDeleteShow,
                    handleStatusButtonClick: handleStatusButtonClick,
                    openConfirmDialog: openConfirmDialog,
                    handleInternalStatusChange: handleInternalStatusChange,
                  }}
                />
              );
            })}
          </ShowsGrid>
        )}

        {/* Error/Confirmation Dialog */}
        {confirmDialog && (
          <ConfirmDialog
            isOpen={confirmDialog.isOpen}
            message={confirmDialog.message}
            onClose={closeConfirmDialog}
            onConfirm={() => { confirmDialog.onConfirm(); closeConfirmDialog(); }} />
        )}

      </DashboardContainer>
    </div>
  );
};
export default DashboardPage;
