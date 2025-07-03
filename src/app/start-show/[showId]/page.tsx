"use client"

import React from 'react';
import { useParams } from 'next/navigation';

const START_PAGE_TITLE_PREFIX = "Start Show Page - Show ID: ";

const StartShowPage: React.FC = () => {
  const params = useParams();
  const showId = params.showId;

  return (
    <div>
      <h1>{START_PAGE_TITLE_PREFIX}{showId}</h1>
    </div>
  );
};

export default StartShowPage;