import React from 'react';
import styled from 'styled-components';

const StyledFooter = styled.footer`
  width: 100%;
  text-align: center;
  padding: 20px 0;
`;

const StyledCopyright = styled.p`
  font-size: 0.9em;
  color: #555;
`;

const Footer: React.FC = () => {
  return (
    <StyledFooter><StyledCopyright>© 2025 wecan. All rights reserved.</StyledCopyright></StyledFooter>
  );
};

export default Footer;