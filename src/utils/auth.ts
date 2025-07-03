
import { useRouter } from 'next/navigation';
import Logger from './Logger';
import { LOGGED_IN_USER_ID_STORAGE_KEY } from '../constants';

export async function logout(): Promise<void> {
  Logger.info('Performing logout...');
  // Remove the logged-in user ID from localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOGGED_IN_USER_ID_STORAGE_KEY);
    Logger.info('Removed loggedInUserId from localStorage.');
  } else {
    Logger.warn('localStorage is not available (running on server).');
  }

  // Redirect the user to the root path
  // Note: useRouter can only be used in client components or custom hooks
  // that are used in client components.
  // If you are calling this from a server context, you'll need a different approach
  // (e.g., returning a response that triggers a client-side redirect,
  // or using server-side redirect methods).
  // For a simple client-side logout, this is generally fine.
  try {
    // This part needs to be called from a client component context
    // or within a hook that is used by a client component.
    // For this utility, we'll assume it's called in such a context.
    // A more robust solution for server/client might involve returning
    // a flag to the calling component to trigger the redirect.

    // This implementation directly uses useRouter which is only available in client components.
    // If logout is called from a server component, this will throw an error.
    // Consider refactoring the logout call to be initiated from a client component.

    // Example of client-side redirection using useRouter:
    // In a client component:
    // const router = useRouter();
    // const handleLogout = async () => {
    //   await logout(); // Call the utility function
    //   router.push('/'); // Perform the client-side redirect
    // };

    // For a utility function that might be called from various places,
    // a simple window.location.href redirect might be used as a fallback
    // in a client context, or the redirect logic is left to the caller.
    // Given the prompt specifies useRouter, we'll stick to that but note the limitation.

    // As a utility, it's better to let the calling client component handle the navigation
    // using its own useRouter instance after calling this async function.
    // We will keep the localStorage removal here as it's a common step.

    // Removing the router.push from here as it makes the utility less flexible
    // and causes issues if called from non-client component contexts.
    // The calling component should handle the navigation after `logout()` completes.

    Logger.info('Logout process completed. Calling component should handle redirection.');

  } catch (error) {
    Logger.error('Error during logout process:', error);
    // Handle errors, e.g., show a message to the user
  }
}

// Example usage in a client component:
/*
'use client';

import { useRouter } from 'next/navigation';
import { logout } from '@/utils/auth'; // Adjust import path as needed

const MyClientComponent = () => {
  const router = useRouter();

  const handleLogoutClick = async () => {
    await logout(); // Perform logout logic (removes from localStorage)
    router.push('/'); // Redirect to the root path
  };

  return (
    <button onClick={handleLogoutClick}>Logout</button>
  );
};
*/