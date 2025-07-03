'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import Footer from './components/Footer'; // Remove if Footer is in Layout
import styled from 'styled-components';
import Logger from '../utils/Logger';
import {  login } from '@/api/api';
import ErrorDialog from './components/ErrorDialog';


const LOGGED_IN_USER_ID_STORAGE_KEY = 'loggedInUserId';
const LOGIN_FAILED_MESSAGE = '로그인 실패. 아이디와 비밀번호를 확인해주세요.';
const LOGIN_ERROR_MESSAGE = '로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';

// Styled Components 정의
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #e0f7fa; /* Light blue background */
`;

const Form = styled.form`
  background-color: #ffffff; /* White background for the form */
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 400px;
`;

const FormTitle = styled.h1`
  text-align: center;
  color: #0288d1; /* Complementary blue */
  margin-bottom: 30px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 8px;
  font-weight: bold;
  color: #01579b; /* Darker blue for labels */
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #b3e5fc; /* Light blue border */
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #0288d1; /* Highlight on focus */
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  margin-top: -10px; /* Adjust spacing */
`;

const CheckboxLabel = styled.label`
  margin-left: 8px;
  color: #01579b;
  font-weight: normal;
  font-size: 0.9rem;
  cursor: pointer;
`;

const Button = styled.button`
  background-color: #0288d1; /* Blue button */
  color: #ffffff; /* White text */
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0277bd; /* Slightly darker on hover */
  }

  &:active {
    background-color: #01579b; /* Even darker when active */
  }
`;

const LoadingIndicator = styled.div`
  text-align: center;
  color: #0288d1;
  font-size: 1.1rem;
  margin-top: 10px;
`;


const HomePage: React.FC = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberId, setRememberId] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const router = useRouter();
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    Logger.info("handleSubmit");
    event.preventDefault();
    setIsLoading(true); // Set loading state to true
    try {
      const credentials = {
        userId: id,
        password: password,
      };
      const response = await login(credentials);
      if (response && response.token) {
        Logger.info(`Login successful for user ID: ${id}, token: ${response.token}`);
        localStorage.setItem('authToken', response.token); // Store the auth token
        localStorage.setItem(LOGGED_IN_USER_ID_STORAGE_KEY, id); // Store the user ID using constant
        router.push('/dashboard');
      } else {
        Logger.error(`Login failed for user ID: ${id}. Response: ${JSON.stringify(response)}`);
        setErrorMessage(LOGIN_FAILED_MESSAGE);
        setShowErrorDialog(true);
      }
    } catch (error) {
      Logger.error('Login error:', error);
      setErrorMessage(LOGIN_ERROR_MESSAGE);
      setShowErrorDialog(true);
    } finally {
      // This block will always execute after try or catch
      setIsLoading(false); // Set loading state back to false
    }
  };


  const closeErrorDialog = () => setShowErrorDialog(false);

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <FormTitle>WECAN SHOW</FormTitle> {/* You can change the title here if needed */}
        <FormGroup>
          <Label htmlFor="id">ID</Label>
          <Input type="text" id="id" value={id} onChange={(e) => setId(e.target.value)} required />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </FormGroup>
        <FormGroup>
          <CheckboxLabel htmlFor="rememberId">
            <input type="checkbox" id="rememberId" checked={rememberId} onChange={(e) => setRememberId(e.target.checked)} />
            Remember ID
          </CheckboxLabel>
        </FormGroup>
        <FormGroup>
          <CheckboxLabel htmlFor="keepLoggedIn">
            <input type="checkbox" id="keepLoggedIn" checked={keepLoggedIn} onChange={(e) => setKeepLoggedIn(e.target.checked)} />
            Keep me logged in
          </CheckboxLabel>
        </FormGroup>
        <Button type="submit" disabled={isLoading}>Login</Button>
        {isLoading && <LoadingIndicator>로그인 중...</LoadingIndicator>} {/* Show loading indicator */}
      </Form>
      {/* <Footer /> */} {/* Remove if Footer is in Layout */}
      {showErrorDialog && <ErrorDialog message={errorMessage} onClose={closeErrorDialog} />}
    </Container>
  );
};

export default HomePage;
