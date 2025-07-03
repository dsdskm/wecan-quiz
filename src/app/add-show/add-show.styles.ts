import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 20px;
  background-color: #e0f7fa; /* Light blue background */
  min-height: calc(100vh - 60px); /* Adjusted minHeight for TitleBar */
  position: relative;
`;

export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #b2ebf2;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

export const HeaderIcon = styled.span`
  margin-right: 15px;
  color: #4dd0e1;
  font-size: 2.5em;
`;

export const HeaderTitle = styled.h1`
  font-size: 1.8em;
  font-weight: bold;
  margin-bottom: 5px;
  color: #00acc1;
`;

export const HeaderButtons = styled.div`
  display: flex;
  align-items: center;
`;

export const CancelButton = styled.button`
  margin-right: 10px;
  padding: 8px 20px;
  border: 1px solid #b0bec5;
  border-radius: 20px;
  background-color: white;
  cursor: pointer;
  color: #546e7a;
  font-size: 0.9em;
`;

export const CreateShowButton = styled.button`
  padding: 8px 20px;
  border: none;
  border-radius: 20px;
  background-color: #4dd0e1;
  color: white;
  cursor: pointer;
  font-size: 0.9em;
`;

export const MainSectionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const TopSection = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 20px;
`;

export const ShowDetailsAndImageContainer = styled.div`
  display: flex;
  gap: 20px;
  flex: 1;
`;

export const ShowDetailsContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;


export const ShowTitleContainer = styled.div`
  flex: 1;
  margin-right: 20px; /* Added margin-right here */
  flex-direction: column;
  margin-bottom: 15px; /* Adjust to match the gap in ShowDetailsContainer */
`;

export const SectionTitle = styled.h3`
  margin-bottom: 8px;
  color: #00bcd4;
  font-size: 1.1em;
`;

export const InputField = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #b2ebf2;
  border-radius: 4px;
  font-size: 1em;
`;

export const ImageUploadContainer = styled.div`
  flex: 1;
`;

export const FileSelectButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #b2ebf2;
  border-radius: 4px;
  background-color: #e0f7fa;
  cursor: pointer;
  color: #00acc1;
  font-size: 0.9em;
`;

export const ButtonIconSpan = styled.span`
  margin-right: 5px;
`;

export const FileSelectContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #b2ebf2;
  border-radius: 4px;
  padding: 8px;
`;

export const FileSelectLabel = styled.label`
  cursor: pointer;
`;

export const FileInput = styled.input`
  display: none;
`;

export const SelectedFileSpan = styled.span`
  font-size: 0.9em;
  color: #546e7a;
`;

export const CloudIcon = styled.div`
  margin-left: auto;
  color: #4dd0e1;
  font-size: 1.5em;
`;

export const BottomSection = styled.div`
  display: flex;
  gap: 20px;
  flex: 1; /* Use flex: 1 to make this container fill the available height */
`;

export const QuizzesSection = styled.div`
  flex: 4; /* Use flex: 4 for 40% width */
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
`;

export const QuizzesHeader = styled.div`
  display: flex;
  justify-content: space-between;\n  align-items: center;
  margin-bottom: 15px;
`;

export const QuizzesTitle = styled.h3`
  color: #00bcd4;
  font-size: 1.1em;
`;

export const QuizzesTitleIconSpan = styled.span`
  margin-right: 10px; /* Adjust as needed */
`;

export const CreateQuizTitle = styled.h3`
  margin-bottom: 16px; /* Equivalent to mb-4 in default Tailwind config */
  color: #00bcd4;
`;

export const NewQuizButton = styled.button`
  padding: 8px 15px;
  border: 1px solid #4dd0e1;
  border-radius: 4px;
  background-color: white;
  color: #4dd0e1;
  cursor: pointer;
`;

export const NoQuizzesText = styled.p`
  text-align: center;
  color: #90a4ae;
  font-style: italic;
`;

export const CreateQuizSection = styled.div`
  flex: 6; /* Use flex: 6 for 60% width */
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
`;

export const QuizFormGroup = styled.div`
  margin-bottom: 20px;
`;

export const QuizFormLabel = styled.h4`
  margin-bottom: 5px;
  color: #546e7a;
`;

export const QuizTextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #b2ebf2;
  border-radius: 4px;
  min-height: 80px;
  resize: vertical;
`;

export const QuizSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #b2ebf2;
  border-radius: 4px;
`;

export const OptionsContainer = styled.div`
  margin-bottom: 20px;
`;

export const OptionInputContainer = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
`;

export const OptionInput = styled.input`
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #b2ebf2;
  border-radius: 4px;
  margin-right: 10px;
`;

export const RemoveOptionButton = styled.button`
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  background-color: #ef9a9a;
  color: white;
  cursor: pointer;
`;

export const TimeLimitAndHint = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

export const TimeLimitContainer = styled.div`
  flex: 1;
`;

export const HintContainer = styled.div`
  flex: 1;
`;

export const ReferenceImagesAndVideos = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
`;

export const ReferenceImageContainer = styled.div`
  flex: 1;
`;

export const ReferenceVideoContainer = styled.div`
  flex: 1;
`;

export const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: auto; /* Push buttons to the bottom */
`;

export const CancelActionButton = styled.button`
  padding: 10px 20px;
  border: 1px solid #b0bec5;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  color: #546e7a;
  font-size: 1em;
`;

export const AddQuizActionButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #4dd0e1;
  color: white;
  cursor: pointer;
  font-size: 1em;
`;

export const FixedElements = styled.div`
  /* You might need to adjust the positioning based on your layout */
`;

export const NIcon = styled.div`
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
  font-size: 1.2em;
  font-weight: bold;
  border: 2px solid #00acc1;
`;