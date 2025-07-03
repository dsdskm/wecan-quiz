'use client';
import React, { useState, useEffect } from 'react';
// Keep the import for styles if TitleBar uses it, otherwise remove it.
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// import styles from './add-show.module.css'; // Remove if not used after styled-components
import TitleBar from '../components/TitleBar';
import { DASHBOARD_ROUTE } from '../../constants';
import {
  PageContainer,
  HeaderSection,
  HeaderLeft,
  HeaderIcon,
  HeaderTitle,
  HeaderButtons,
  CancelButton,
  CreateShowButton,
  ButtonIconSpan, // Added ButtonIconSpan
  MainSectionsContainer,
  TopSection,
  ShowDetailsAndImageContainer,
  ShowTitleContainer,
  SectionTitle,
  InputField,
  ImageUploadContainer,
  FileSelectContainer, // Added FileSelectContainer
  FileSelectLabel, // Added FileSelectLabel
  FileInput, // Added FileInput
  FileSelectButton,
  SelectedFileSpan,
  CloudIcon,
  BottomSection,
  QuizzesSection,
  QuizzesHeader,
  QuizzesTitle,
  QuizzesTitleIconSpan, // Added QuizzesTitleIconSpan
  NewQuizButton,
  NoQuizzesText,
  CreateQuizSection,
  CreateQuizTitle, // Added CreateQuizTitle
  QuizFormGroup,
  QuizFormLabel,
  QuizTextArea,
  QuizSelect,
  OptionsContainer,
  OptionInputContainer,
  OptionInput,
  RemoveOptionButton,
  TimeLimitAndHint,
  TimeLimitContainer,
  HintContainer,
  ReferenceImagesAndVideos,
  ReferenceImageContainer,
  ReferenceVideoContainer,
  ActionButtonsContainer,
  CancelActionButton,
  AddQuizActionButton,
  FixedElements,
  NIcon,
  VAIcon,
  ShowDetailsContainer
} from './add-show.styles';
import { createShow } from '@/api/api';
import Logger from '@/utils/Logger';
import { Show, ShowStatus } from '@/types/Show';


import ConfirmDialog from '../components/ConfirmDialog';
import ErrorDialog from '../components/ErrorDialog';
import FullScreenLoadingIndicator from '../components/FullScreenLoadingIndicator';

const AddShowPage: React.FC = () => {
  const [loggedInUserId, setLoggedInUserId] = useState('');
  const [showTitle, setShowTitle] = useState('');
  const [showDetails, setShowDetails] = useState('');
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);

  // State for the new quiz form
  const [quizQuestion, setQuizQuestion] = useState('');
  const [quizType, setQuizType] = useState('Multiple Choice'); // Default type
  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState<string[]>(['', '', '', '']); // Default 4 options
  const [timeLimit, setTimeLimit] = useState('30 seconds'); // Default time limit
  const [quizHint, setQuizHint] = useState('');
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [referenceVideo, setReferenceVideo] = useState<File | null>(null);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const router = useRouter();

  useEffect(() => {
    const storedUserId = localStorage.getItem('loggedInUserId');
    if (storedUserId) {
      setLoggedInUserId(storedUserId);
    }
  }, []); // Empty dependency array means this effect runs once after the initial render

  const handleCreateShow = async () => {
    // Validate title field
    if (!showTitle.trim()) {
      setErrorMessage('Title is required.');
      setShowErrorDialog(true);
      return; // Prevent further action if title is empty
    }
    // If title is not empty, show the confirmation dialog
    setShowConfirmDialog(true);
  };

  const confirmCreateShow = async () => {
    Logger.info("handleCreateShow")
    // Collect show data from the form
    const newShow: Show = {
      status: ShowStatus.Waiting,
      details: showDetails,
      title: showTitle,
      quizzes: [],
      url: '',
      backgroundImageUrl: '',
      createdAt: '',
      startTime: '',
      endTime: '',
      updatedAt: ''
    };

    setShowConfirmDialog(false); // Close confirmation dialog
    setIsLoading(true); // Start loading

    try {
      const createdShow = await createShow(newShow); // Call the API function
      Logger.info('Show creation initiated:', createdShow); // Placeholder
      router.push(DASHBOARD_ROUTE); // Navigate to the dashboard on success
    } catch (error) {
      // Handle errors
      Logger.error('Error creating show:', error);
      setErrorMessage('Failed to create show. Please try again.');
      setShowErrorDialog(true);
    } finally {
      // Ensure loading is set to false regardless of success or failure
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Confirmation Dialog */}
      <ConfirmDialog isOpen={showConfirmDialog} onClose={() => setShowConfirmDialog(false)} onConfirm={confirmCreateShow} message="Are you sure you want to create this show?" />
      {/* Loading Indicator */}
      <FullScreenLoadingIndicator isOpen={isLoading} />
      {/* Error Dialog */}
      {showErrorDialog && (
        <ErrorDialog onClose={() => setShowErrorDialog(false)} message={errorMessage} />
      )}

      {/* Main Content Area */}
      <PageContainer>
        {/* Header Section (Moved outside the main grid for full width) */}
        <HeaderSection>
          {/* Left side: Title and Description */}
          <HeaderLeft>
            <HeaderIcon>+</HeaderIcon> {/* Icon placeholder */}
            <div>
              <HeaderTitle as="h1">
                Create New Show
              </HeaderTitle>
            </div>
          </HeaderLeft>
          {/* Right side: Buttons */}
          <HeaderButtons>
            <Link href={DASHBOARD_ROUTE} passHref>
              <CancelButton>
                <ButtonIconSpan>🚫</ButtonIconSpan> {/* Icon placeholder */}
                Cancel
              </CancelButton>
            </Link>

            <CreateShowButton onClick={handleCreateShow}>
              <ButtonIconSpan>💾</ButtonIconSpan> {/* Icon placeholder */}
              Create Show
            </CreateShowButton>
          </HeaderButtons>
        </HeaderSection>

        {/* Main sections container: Show Details (top) and Quizzes/Create Quiz (bottom) */}
        <MainSectionsContainer>
          {/* Top Section: Show Details */}
          <TopSection>
            {/* Container for Show Title and Background Image */}
            <ShowDetailsAndImageContainer>
              {/* Show Title */}
              <ShowTitleContainer>
                <div>
                  <SectionTitle>Show Title</SectionTitle>
                  <InputField
                    type="text"
                    placeholder="Enter a catchy title for your show"
                    value={showTitle}
                    onChange={(e) => setShowTitle(e.target.value)}
                  />
                </div>
              </ShowTitleContainer>
              {/* Background Image */}
              <ImageUploadContainer>
                <div>
                  <SectionTitle as="h3">Background Image (Optional)</SectionTitle>
                  <FileSelectContainer> {/* Replaced div with FileSelectContainer */}
                    <FileSelectLabel htmlFor="backgroundImageUpload"> {/* Replaced label with FileSelectLabel */}
                      <FileSelectButton>
                        파일 선택
                      </FileSelectButton>
                    </FileSelectLabel>
                    <FileInput // Replaced input with FileInput
                      type="file"
                      id="backgroundImageUpload"
                      onChange={(e) => setBackgroundImage(e.target.files ? e.target.files[0] : null)}
                    />
                    <SelectedFileSpan>{backgroundImage ? backgroundImage.name : '선택된 파일 없음'}</SelectedFileSpan>
                  </FileSelectContainer>
                </div>
              </ImageUploadContainer>
            </ShowDetailsAndImageContainer>

            {/* Show Details */}
            <ShowDetailsContainer>
              <SectionTitle>Show Details</SectionTitle>
              <QuizTextArea
                placeholder="Enter details about your show"
                value={showDetails}
                onChange={(e) => setShowDetails(e.target.value)}
              />
            </ShowDetailsContainer>
          </TopSection>

          {/* Bottom Section: Quizzes and Create New Quiz (side-by-side) */}
          <BottomSection>
            {/* Left Half: Quizzes (40%) */}
            <QuizzesSection>
              {/* Quizzes Section Content */}
              <QuizzesHeader>
                <QuizzesTitle>
                  <QuizzesTitleIconSpan>📚</QuizzesTitleIconSpan> {/* Replaced span with QuizzesTitleIconSpan */}
                  Quizzes
                </QuizzesTitle>
                <NewQuizButton>
                  <ButtonIconSpan>+</ButtonIconSpan> {/* Replaced span with ButtonIconSpan */}
                  New
                </NewQuizButton>
              </QuizzesHeader>
              <NoQuizzesText>
                No quizzes added yet.
                <br />
                Click "New" to add your first quiz!
              </NoQuizzesText>
              {/* Placeholder for quiz items */}
              <div style={{ marginTop: '15px' }}>
                {/* Example placeholder item */}
                {/* <div style={{ border: '1px solid #b2ebf2', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}>Quiz Item 1</div> */}
              </div>
            </QuizzesSection>

            {/* Right Half: Create New Quiz (60%) */}
            <CreateQuizSection>
              <CreateQuizTitle>Create New Quiz</CreateQuizTitle> {/* Replaced h3 with CreateQuizTitle */}

              <QuizFormGroup>
                <QuizFormLabel as="h4">Question</QuizFormLabel>
                <QuizTextArea
                  placeholder="Enter the quiz question"
                  value={quizQuestion}
                  onChange={(e) => setQuizQuestion(e.target.value)}
                ></QuizTextArea>
              </QuizFormGroup>

              <QuizFormGroup>
                <QuizFormLabel>Quiz Type</QuizFormLabel>
                <QuizSelect as="select" value={quizType} onChange={(e) => setQuizType(e.target.value)}>
                  <option>Multiple Choice</option>
                  {/* Add other quiz types as needed */}
                </QuizSelect>
              </QuizFormGroup>

              <OptionsContainer>
                <h4 style={{ marginBottom: '10px', color: '#546e7a' }}>Multiple Choice Options</h4>
                {/* Placeholder for multiple choice options */}
                <OptionInputContainer>
                  {multipleChoiceOptions.map((option, index) => (
                    <OptionInputContainer key={index}>
                      <OptionInput
                        type="text"
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...multipleChoiceOptions];
                          newOptions[index] = e.target.value;
                          setMultipleChoiceOptions(newOptions);
                        }}
                      />
                      <RemoveOptionButton>
                        ×
                      </RemoveOptionButton>
                    </OptionInputContainer>
                  ))}
                </OptionInputContainer>

                {/* Add more options as needed */}
              </OptionsContainer>

              {/* Time Limit and Hint */}
              <TimeLimitAndHint>
                <TimeLimitContainer>
                  <QuizFormLabel as="h4">Time Limit</QuizFormLabel>
                  <QuizSelect as="select" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)}>
                    <option>30 seconds</option>
                    {/* Add other time limit options as needed */}
                  </QuizSelect>
                </TimeLimitContainer>
                <HintContainer>
                  <QuizFormLabel as="h4">Hint (Optional)</QuizFormLabel>
                  <InputField
                    type="text"
                    placeholder="Enter a hint for the quiz"
                    value={quizHint}
                    onChange={(e) => setQuizHint(e.target.value)}
                  />
                </HintContainer>
              </TimeLimitAndHint>

              {/* Reference Images and Videos */}
              <ReferenceImagesAndVideos>
                <ReferenceImageContainer>
                  <QuizFormLabel>Reference Image (Optional, max 2MB)</QuizFormLabel>
                  <FileSelectContainer> {/* Replaced div with FileSelectContainer */}
                    <FileSelectLabel htmlFor="referenceImageUpload"> {/* Replaced label with FileSelectLabel */}
                      <FileSelectButton>
                        파일 선택
                      </FileSelectButton>
                    </FileSelectLabel>
                    <FileInput // Replaced input with FileInput
                      type="file"
                      id="referenceImageUpload"
                      onChange={(e) => setReferenceImage(e.target.files ? e.target.files[0] : null)}
                    />
                    <SelectedFileSpan>{referenceImage ? referenceImage.name : '선택된 파일 없음'}</SelectedFileSpan>
                  </FileSelectContainer>
                </ReferenceImageContainer>
                <ReferenceVideoContainer>
                  <QuizFormLabel>Reference Video (Optional, max 10MB)</QuizFormLabel>
                  <FileSelectContainer> {/* Replaced div with FileSelectContainer */}
                    <FileSelectLabel htmlFor="referenceVideoUpload"> {/* Replaced label with FileSelectLabel */}
                      <FileSelectButton>
                        파일 선택
                      </FileSelectButton>
                    </FileSelectLabel>
                    <FileInput // Replaced input with FileInput
                      type="file"
                      id="referenceVideoUpload"
                      onChange={(e) => setReferenceVideo(e.target.files ? e.target.files[0] : null)}
                    />
                    <SelectedFileSpan>{referenceVideo ? referenceVideo.name : '선택된 파일 없음'}</SelectedFileSpan>
                  </FileSelectContainer>
                </ReferenceVideoContainer>
              </ReferenceImagesAndVideos>

              {/* Action Buttons */}
              <ActionButtonsContainer>
                <Link href={DASHBOARD_ROUTE} passHref>
                  <CancelActionButton>Cancel</CancelActionButton>
                </Link>
                <AddQuizActionButton>Add Quiz</AddQuizActionButton>
              </ActionButtonsContainer>
            </CreateQuizSection>
          </BottomSection>

          {/* Fixed positioned elements (like the 'N' and 'VA' icons) */}
          {/* Consider if these should also be styled components */}
          <NIcon>N</NIcon>
          <VAIcon>VA</VAIcon>
        </MainSectionsContainer>
      </PageContainer>


    </div>

  );
};
export default AddShowPage;