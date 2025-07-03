"use client"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import styled from "styled-components";
import StyledComponentsRegistry from "./registry";
import Footer from "./components/Footer";
import TitleBar from "./components/TitleBar";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from 'next/navigation';

import { LOGGED_IN_USER_ID_STORAGE_KEY, ROOT_ROUTE } from "../constants";

const inter = Inter({ subsets: ["latin"] });

// Styled Components 정의 (Optional - if you have styles for body, html etc.)
const StyledBody = styled.body`
  margin: 0; // Example style
  padding: 0; // Example style
  box-sizing: border-box; // Example style
`;

interface AuthContextType {
  loggedInUserId: string;
  handleLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loggedInUserId, setLoggedInUserId] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  // Import logout and checkLoginStatus from api.ts
  const { logout } = require('@/api/api');



  const handleLogout = async () => {
    await logout(); // Use the logout function from api.ts
    setLoggedInUserId(''); // Clear user ID state
    if (pathname !== '/') {
      router.push('/'); // Redirect to login page after logout
    }
  };

  return (
    <html lang="en">
      {/* Wrap with StyledComponentsRegistry for Next.js App Directory */}
      <StyledComponentsRegistry>
        {/* Apply styled component to body if needed */}
        <StyledBody className={inter.className}>
          <AuthContext.Provider value={{ loggedInUserId, handleLogout }}>
            {pathname !== '/' && (
              <TitleBar loggedInUserId={loggedInUserId} handleLogout={handleLogout} />
            )}
            {children}
            <Footer />
          </AuthContext.Provider>
        </StyledBody>
      </StyledComponentsRegistry>
    </html>
  );
}
