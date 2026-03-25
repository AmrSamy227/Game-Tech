'use client';

import { useState } from 'react';

interface DeveloperLogoProps {
  developerLogo: string;
  firstDev: string;
  size?: string;
  textSize?: string;
}

export default function DeveloperLogo({ 
  developerLogo, 
  firstDev, 
  size = "w-10 h-10",
  textSize = "text-lg"
}: DeveloperLogoProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div className={`${size} bg-white rounded flex items-center justify-center overflow-hidden`}>
        <span className={`${textSize} font-bold text-gray-800`}>
          {firstDev.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <div className={`${size} bg-white rounded flex items-center justify-center overflow-hidden`}>
      <img 
        src={developerLogo} 
        alt={firstDev}
        className="w-full h-full object-contain mix-blend-multiply"
        onError={() => setImageError(true)}
      />
    </div>
  );
}