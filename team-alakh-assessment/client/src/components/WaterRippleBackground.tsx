import React from 'react';
import GalaxyBackground from './GalaxyBackground';

// Realistic ocean waves background component with galactic stars at depth
const WaterRippleBackground: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {/* Base ocean color */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(180deg, #1e3a8a 0%, #1e40af 30%, #3b82f6 60%, #111827 100%)', // fade to dark at bottom
        }}
      />
      {/* Ocean waves (same as before) */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '200%',
          height: '100%',
          background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1200 120\' preserveAspectRatio=\'none\'%3E%3Cpath d=\'M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z\' opacity=\'.25\' fill=\'%230ea5e9\'/%3E%3C/svg%3E")',
          backgroundSize: '50% 100%',
          animation: 'wave1 8s linear infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '200%',
          height: '100%',
          background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1200 120\' preserveAspectRatio=\'none\'%3E%3Cpath d=\'M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z\' opacity=\'.5\' fill=\'%2338bdf8\'/%3E%3C/svg%3E")',
          backgroundSize: '50% 100%',
          animation: 'wave2 6s linear infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '200%',
          height: '100%',
          background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1200 120\' preserveAspectRatio=\'none\'%3E%3Cpath d=\'M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z\' opacity=\'.75\' fill=\'%2360a5fa\'/%3E%3C/svg%3E")',
          backgroundSize: '50% 100%',
          animation: 'wave3 4s linear infinite',
        }}
      />
      {/* Ocean surface shimmer */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 3s ease-in-out infinite',
        }}
      />
      {/* Galactic stars at depth (masked to bottom half) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 1,
          maskImage: 'linear-gradient(to top, black 60%, transparent 90%)',
          WebkitMaskImage: 'linear-gradient(to top, black 60%, transparent 90%)',
        }}
      >
        <GalaxyBackground />
      </div>
    </div>
  );
};

export default WaterRippleBackground; 