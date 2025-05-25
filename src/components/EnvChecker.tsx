'use client';

import { useEffect, useState } from 'react';

const EnvChecker: React.FC = () => {
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Check if the environment variable is defined
    const apiKey = process.env.NEXT_PUBLIC_SENSAY_API_KEY_SECRET;
    setHasApiKey(!!apiKey);
  }, []);

  if (hasApiKey === null) return null;

  return (
    <div className={`text-xs rounded-md px-2 py-1 ${hasApiKey ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
      .env API Key: {hasApiKey ? 'Found ✓' : 'Not found ✗'}
    </div>
  );
};

export default EnvChecker;