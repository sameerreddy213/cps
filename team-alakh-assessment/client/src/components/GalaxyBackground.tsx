import React, { useRef, useEffect } from 'react';

const STAR_COUNT = 180;
const STAR_MIN_RADIUS = 0.5;
const STAR_MAX_RADIUS = 2.2;
const STAR_COLORS = [
  'rgba(255,255,255,0.95)', // white
  'rgba(200,200,200,0.7)', // light gray
  'rgba(180,180,180,0.5)', // faint gray
];

const PLANET_COUNT = 2;
const PLANET_COLORS = [
  'rgba(255,255,255,0.08)', // faint white
  'rgba(200,200,200,0.06)', // faint gray
];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

interface Star {
  x: number;
  y: number;
  radius: number;
  color: string;
  blinkSpeed: number;
  blinkPhase: number;
}

interface Planet {
  x: number;
  y: number;
  radius: number;
  color: string;
}

const GalaxyBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const planetsRef = useRef<Planet[]>([]);
  const animationRef = useRef<number>();

  // Generate stars and planets
  useEffect(() => {
    const stars: Star[] = [];
    const width = window.innerWidth;
    const height = window.innerHeight;
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: randomBetween(STAR_MIN_RADIUS, STAR_MAX_RADIUS),
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        blinkSpeed: randomBetween(0.8, 2.5),
        blinkPhase: Math.random() * Math.PI * 2,
      });
    }
    starsRef.current = stars;

    // Planets (faint white/gray nebula/disks)
    const planets: Planet[] = [];
    for (let i = 0; i < PLANET_COUNT; i++) {
      planets.push({
        x: randomBetween(0.15, 0.85) * width,
        y: randomBetween(0.18, 0.7) * height,
        radius: randomBetween(100, 220),
        color: PLANET_COLORS[Math.floor(Math.random() * PLANET_COLORS.length)],
      });
    }
    planetsRef.current = planets;
  }, []);

  // Animate stars and draw planets
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      // Optionally, reposition stars and planets on resize
      starsRef.current.forEach(star => {
        star.x = Math.random() * width;
        star.y = Math.random() * height;
      });
      planetsRef.current.forEach(planet => {
        planet.x = randomBetween(0.15, 0.85) * width;
        planet.y = randomBetween(0.18, 0.7) * height;
      });
    };
    window.addEventListener('resize', handleResize);

    function drawStars(time: number) {
      if (!ctx) return;
      // Pure black background
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, width, height);
      // Draw faint nebula/planets
      for (const planet of planetsRef.current) {
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
        ctx.fillStyle = planet.color;
        ctx.shadowColor = planet.color;
        ctx.shadowBlur = 60;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      // Draw stars
      for (const star of starsRef.current) {
        const t = (time / 1000) * star.blinkSpeed + star.blinkPhase;
        const alpha = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t));
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.shadowColor = star.color;
        ctx.shadowBlur = 8 * star.radius;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(drawStars);
    }
    animationRef.current = requestAnimationFrame(drawStars);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -50,
        pointerEvents: 'none',
        background: 'none',
        transition: 'background 1s',
      }}
    />
  );
};

export default GalaxyBackground; 