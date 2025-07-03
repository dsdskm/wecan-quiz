// src/app/dashboard/dashboard.styles.ts
import styled from 'styled-components';
import { ShowStatus } from '@/types/Show'; // Assuming ShowStatus is needed for typing

// Styled Components 정의
export const DashboardContainer = styled.div`
  padding: 20px;
  background-color: #e0f7fa; /* Light blue background */
  min-height: calc(100vh - 60px); /* Adjusted minHeight for TitleBar */
  position: relative;
`;

// Header section for title and create button
export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #b2ebf2;
`;

// Header left section for title and potential other elements
export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

export const HeaderTitle = styled.h1`
  font-size: 1.8em;
  font-weight: bold;
  margin-bottom: 5px;
  color: #00acc1;
`;

// Button to create a new show
export const CreateShowButton = styled.button`
  padding: 8px 20px;
  border: none;
  border-radius: 20px;
  background-color: #4dd0e1;
  color: white;
  cursor: pointer; /* Indicate clickable */
  font-size: 0.9em;
`;

export const ShowsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  gap: 20px;
`;

// Card component to display individual show information
export const ShowCard = styled.div<{ status: ShowStatus }>`
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  border-left: 5px solid;
  min-height: 200px; /* Ensure cards have a minimum height */
  position: relative; /* Needed for absolute positioning of status indicator */

  /* Visual cue on the left border based on status */
  border-left-color: ${(props) => {
    switch (props.status) {
      case ShowStatus.Waiting:
        return '#ffb74d'; // Orange
      case ShowStatus.InProgress:
        return '#81c784'; // Green
      case ShowStatus.Paused:
        return '#e0e0e0'; // Grey
      case ShowStatus.Completed:
        return '#4dd0e1'; // Cyan
      default:
        return '#ccc'; // Default color
    }
  }};

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Add stronger shadow on hover */
    transform: translateY(-5px);
  }
`;

// Title of the show within the card
export const ShowTitle = styled.h3`
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 8px;
  color: #00acc1;
  word-break: break-word; /* Prevent long titles from overflowing */
`;

// Container for various show information details
export const ShowInfo = styled.div`
  font-size: 0.9em;
  color: #546e7a;
  margin-bottom: 4px; /* Reduced margin for tighter info display */
  display: flex;
  align-items: center; /* Align items vertically */
`;

// Indicator for the show status with different colors
export const ShowStatusIndicator = styled.span<{ status: ShowStatus }>`
  position: absolute; /* Position absolutely within ShowCard */
  top: 10px; /* 10px from the top */
  left: 10px; /* 10px from the left */
  font-weight: bold;
  display: inline-block; // Use inline-block to allow background color and padding
  padding: 2px 8px; // Add some padding
  border-radius: 12px; // Rounded corners
  font-size: 0.7em; /* Smaller font size for indicator */
  text-transform: capitalize; /* Capitalize the first letter */
  color: ${(props) => {
    switch (props.status) {
      case ShowStatus.Waiting:
        return '#ff9800'; // Slightly lighter orange for text
      case ShowStatus.InProgress:
        return '#4caf50'; // Slightly lighter green for text
      case ShowStatus.Paused:
        return '#757575'; // Slightly lighter grey for text
      case ShowStatus.Completed:
        return '#00bcd4'; // Slightly lighter cyan for text
      default:
        return '#000'; // Default color
    }
  }};
  background-color: ${(props) => {
    switch (props.status) {
      case ShowStatus.Waiting:
        return '#fff3e0'; // Very light orange background
      case ShowStatus.InProgress:
        return '#e8f5e9'; // Very light green background
      case ShowStatus.Paused:
        return '#f5f5f5'; // Very light grey background
      case ShowStatus.Completed:
        return '#e0f7fa'; // Very light cyan background
      default:
        return '#fff'; // Default background
    }
  }};
  margin-left: 5px;
`;

// Detailed description of the show
export const ShowDetails = styled.p`
  font-size: 0.85em; /* Slightly smaller font for details */
  color: #546e7a;
  margin-bottom: 15px;
  margin-top: 5px; // Added margin-top to create space below title
  word-break: break-word;
`;

export const UrlButton = styled.button`
  display: inline-flex; /* Use flexbox for centering */
  align-items: center; /* Vertically center content */
  justify-content: center; /* Horizontally center content */
  margin-top: 15px; // Adjust margin-top to position below details
  margin-bottom: 15px; // Adjust margin-bottom for space before buttons
  padding: 5px 10px; /* Add some padding */
  background-color: #00bcd4; /* Cyan background */
  color: white;
  border-radius: 4px;
  text-decoration: none; /* Remove underline */
  font-size: 0.9em; /* Keep font size consistent */
  transition: background-color 0.2s ease-in-out;
  cursor: pointer;
  &:disabled {
    background-color: #e0e0e0; /* Light gray background */
    color: #757575; /* Darker gray text */
    cursor: not-allowed; // Indicate not clickable
  }

  &:hover:not(:disabled) {
    background-color: #00acc1; /* Darker cyan on hover */
  }
`;

// Container for action buttons within the show card
export const ShowCardButtons = styled.div`
  display: flex;
  gap: 10px; /* 이 줄을 추가합니다. */
  margin-top: auto; /* Push buttons to the bottom */
  align-items: center; /* Align buttons vertically */
`;

// Button to play the show
export const PlayButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: #4dd0e1;
  color: white;
  cursor: pointer;
  font-size: 0.8em;
  margin-left: 10px; /* Add left margin for spacing */
  &:disabled {
    background-color: #e0e0e0; /* Light gray background */
    cursor: not-allowed; /* Indicate not clickable */
  }
  &:first-child {
    margin-left: 0; /* No left margin for the first button */
  }
`;

// Button to edit the show
export const EditButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #b0bec5;
  border-radius: 4px;
  background-color: white; /* White background */
  color: #546e7a; /* Dark text color */
  cursor: pointer;
  &:disabled {
    background-color: #f5f5f5; /* Lighter gray background */
    color: #b0bec5; /* Lighter text color */
    // cursor: not-allowed; /* Indicate not clickable */
  font-size: 0.8em;
`;

// Button to mark the show as complete
export const CompleteButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #4caf50; /* Green border */
  border-radius: 4px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  &:disabled {
    background-color: #a5d6a7; /* Lighter green background */
    cursor: not-allowed; /* Indicate not clickable */
  }
  font-size: 0.8em;
`;

// Close button positioned at the top right of the ShowCard
export const CloseButton = styled.button`
 position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10; /* 다른 요소 위에 표시되도록 z-index 설정 */
  font-size: 1.2em; /* X 텍스트 크기 조절 */
  color: #757575; /* X 텍스트 색상 */

  &:hover {
    color: #e57373; /* 호버 시 색상 변경 */
  }
`;

// Message displayed when no shows are available
export const NoShowsMessage = styled.div`
  text-align: center;
  font-size: 1.2em;
  color: #546e7a;
  margin-top: 50px; /* Adjust as needed */
  display: flex;
  justify-content: center;
`;

export const NIcon = styled.div`
  display: none; /* Hide the N icon */
  position: fixed;
  bottom: 20px;
  left: 20px;
  width: 40px;
  height: 40px;
  background-color: #37474f;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2em;
  font-weight: bold;
`;

// Floating action button to create a new show
export const VAIcon = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background-color: #e0f7fa;
  color: #00acc1;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em; /* Increase font size for '+' icon */
  cursor: pointer; /* Indicate clickable */
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 2px solid #00acc1;
`;