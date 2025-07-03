'use client';

import React from 'react';
import { useParams } from 'next/navigation';

const PLAY_PAGE_TITLE_PREFIX = "Show Play Page - Show ID: ";

const PlayShowPage: React.FC = () => {
  const params = useParams();
  const showId = params.showId;

  return (
    <div>
      <h1>Show Play Page - Show ID: {showId}</h1>
      {/* Implement show play logic here */}
    </div>
  );
};

export default PlayShowPage;