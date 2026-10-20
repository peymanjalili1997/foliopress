import React from 'react';
import { DeviceMockupType, ImageFilterType } from '../types/portfolio';

interface MockupFrameProps {
  deviceType: DeviceMockupType;
  imageUrl?: string;
  zoom?: number;
  filter?: ImageFilterType;
  caption?: string;
  className?: string;
}

function getFilterCss(filter?: ImageFilterType): string {
  switch (filter) {
    case 'grayscale':
      return 'grayscale(100%) contrast(1.06)';
    case 'warm':
      return 'sepia(22%) contrast(1.03) brightness(0.99)';
    case 'contrast':
      return 'contrast(1.22) saturate(0.92)';
    default:
      return 'none';
  }
}

export const MockupFrame: React.FC<MockupFrameProps> = ({
  deviceType,
  imageUrl,
  zoom = 1,
  filter = 'none',
  caption,
  className = '',
}) => {
  const filterStyle = {
    filter: getFilterCss(filter),
    transform: zoom !== 1 ? `scale(${zoom})` : undefined,
  };

  if (deviceType === 'iphone') {
    return (
      <div className={`flex flex-col items-center justify-center py-2 ${className}`}>
        {/* iPhone Body Frame */}
        <div className="relative w-[240px] h-[480px] bg-[#1C1C1E] rounded-[44px] p-[10px] shadow-[0_20px_50px_rgba(0,0,0,0.22)] ring-1 ring-stone-900/30">
          {/* Outer edge rim */}
          <div className="absolute inset-[1px] rounded-[43px] border border-stone-700/40 pointer-events-none" />

          {/* Screen Container */}
          <div className="relative w-full h-full bg-stone-900 rounded-[34px] overflow-hidden">
            {/* Dynamic Island Pill */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-20 flex items-center justify-end pr-2">
              <div className="w-2.5 h-2.5 rounded-full bg-stone-900/90 ring-1 ring-stone-800" />
            </div>

            {/* Screen Content */}
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={caption || 'Mobile UI'}
                referrerPolicy="no-referrer"
                style={filterStyle}
                className="w-full h-full object-cover transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-stone-500 text-center text-xs">
                <span>Drop Mobile Screen</span>
              </div>
            )}

            {/* Home Indicator bar */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/70 rounded-full z-20" />
          </div>
        </div>
      </div>
    );
  }

  if (deviceType === 'ipad') {
    return (
      <div className={`flex flex-col items-center justify-center py-2 ${className}`}>
        {/* iPad Body Frame */}
        <div className="relative w-[500px] h-[340px] bg-[#242426] rounded-[24px] p-[12px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] ring-1 ring-stone-900/40">
          <div className="relative w-full h-full bg-stone-900 rounded-[14px] overflow-hidden">
            {/* Front Camera notch dot */}
            <div className="absolute top-1/2 left-2 -translate-y-1/2 w-2 h-2 rounded-full bg-black ring-1 ring-stone-800 z-20" />

            {imageUrl ? (
              <img
                src={imageUrl}
                alt={caption || 'Tablet Screen'}
                referrerPolicy="no-referrer"
                style={filterStyle}
                className="w-full h-full object-cover transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-500 text-xs">
                <span>Drop Tablet UI Screen</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default: MacBook Pro Laptop Frame
  return (
    <div className={`flex flex-col items-center justify-center py-1 ${className}`}>
      {/* Laptop Lid Screen */}
      <div className="relative w-[560px] h-[330px] bg-[#161618] rounded-t-[16px] p-[10px] pb-[16px] shadow-[0_15px_40px_rgba(0,0,0,0.25)] ring-1 ring-stone-900/40">
        {/* Camera notch */}
        <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-14 h-3 bg-[#161618] rounded-b-md z-20 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-stone-900 ring-1 ring-stone-800" />
        </div>

        {/* Display Screen */}
        <div className="relative w-full h-full bg-stone-950 rounded-t-[8px] overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={caption || 'MacBook Screen'}
              referrerPolicy="no-referrer"
              style={filterStyle}
              className="w-full h-full object-cover transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-stone-500 text-xs">
              <span>Drop Desktop or Web UI Screen</span>
            </div>
          )}
        </div>
      </div>

      {/* Laptop Aluminum Bottom Base */}
      <div className="relative w-[650px] h-[14px] bg-[#C5C8CD] rounded-b-[8px] shadow-md flex items-start justify-center">
        {/* Display hinge groove */}
        <div className="w-[100px] h-[4px] bg-[#999CA3] rounded-b-sm" />
      </div>
      {/* Laptop Bottom Foot Lip */}
      <div className="w-[664px] h-[3px] bg-[#A2A5AA] rounded-b-full opacity-60" />
    </div>
  );
};
