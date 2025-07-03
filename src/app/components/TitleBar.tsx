import React from 'react';
import { SITE_TITLE } from '@/constants';
import styled from 'styled-components';

const HeaderDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f0f0f0; /* Example background color */
  border-bottom: 1px solid #ccc; /* Example border */
`;

const SiteTitleDiv = styled.div`
  font-size: 1.5em;
  font-weight: bold;
`;

const UserInfoDiv = styled.div`
  display: flex;
  align-items: center;
`;

const UserNameSpan = styled.span`
  margin-right: 10px;
`;

const LogoutButton = styled.button`
  padding: 5px 10px;
  background-color: #e74c3c; /* Example button color */
  color: white;
  border: none;
  border-radius: 4px;
  z-index: 1000; /* Ensure it's above other elements */
  pointer-events: auto; /* Ensure it receives click events */
  cursor: pointer;

  &:hover {
    background-color: #c0392b; /* Example hover color */
  }
`;

interface TitleBarProps {
  loggedInUserId: string;
  handleLogout: () => void;
}

const TitleBar: React.FC<TitleBarProps> = ({
  loggedInUserId,
  handleLogout,
}) => {
  return (
    <HeaderDiv>
      <SiteTitleDiv>{SITE_TITLE}</SiteTitleDiv>
      <UserInfoDiv>
        <UserNameSpan>{loggedInUserId}</UserNameSpan>{' '}
        <LogoutButton onClick={() => {
          handleLogout();
        }}>Logout</LogoutButton>
      </UserInfoDiv>
    </HeaderDiv>
  );
};

export default TitleBar;