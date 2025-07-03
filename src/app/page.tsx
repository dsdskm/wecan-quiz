'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import Footer from './components/Footer'; // Remove if Footer is in Layout
import styled from 'styled-components';
import Logger from '../utils/Logger';
import {  login } from '@/api/api';
import FullScreenLoadingIndicator from './components/FullScreenLoadingIndicator';
import ErrorDialog from './components/ErrorDialog';
import { useAuth } from './layout';
import { Button, CheckboxLabel, Container, Form, FormGroup, FormTitle, Input, Label } from './page.styles';


const LOGGED_IN_USER_ID_STORAGE_KEY = 'loggedInUserId';
const LOGIN_FAILED_MESSAGE = '로그인 실패. 아이디와 비밀번호를 확인해주세요.';
const LOGIN_ERROR_MESSAGE = '로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';

const HomePage: React.FC = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberId, setRememberId] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const router = useRouter();
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setLoggedInUserId } = useAuth();

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
        setLoggedInUserId(id); // Update the Context state
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
      {isLoading && <FullScreenLoadingIndicator isOpen={isLoading} />} {/* Show loading indicator */}
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
        
      </Form>
      {/* <Footer /> */} {/* Remove if Footer is in Layout */}
      {showErrorDialog && <ErrorDialog message={errorMessage} onClose={closeErrorDialog} />}
    </Container>
  );
};

export default HomePage;
