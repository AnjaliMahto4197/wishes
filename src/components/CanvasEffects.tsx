import React, { useEffect, useRef } from 'react';
import type { WishEffect } from '../types/wish';

interface CanvasEffectsProps {
  effect: WishEffect;
}

// Particle classes defined outside the useEffect / component for cleaner scope and typing
class ConfettiParticle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  shape: 'circle' | 'rect';

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * -height;
    this.size = Math.random() * 8 + 6;
    this.color = `hsl(${Math.random() * 360}, 85%, 65%)`;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 3 + 2;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 4 - 2;
    this.shape = Math.random() > 0.5 ? 'circle' : 'rect';
  }

  update(width: number, height: number) {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.y / 30) * 0.5;
    this.rotation += this.rotationSpeed;

    if (this.y > height) {
      this.y = -20;
      this.x = Math.random() * width;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    if (this.shape === 'circle') {
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    }
    ctx.restore();
  }
}

class HeartParticle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  swingRange: number;
  swingSpeed: number;
  angle: number;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = height + Math.random() * 100;
    this.size = Math.random() * 12 + 8;
    this.color = `hsla(${340 + Math.random() * 30}, 95%, 65%, ${Math.random() * 0.4 + 0.5})`;
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * 1.5 + 1.2;
    this.swingRange = Math.random() * 15 + 10;
    this.swingSpeed = Math.random() * 0.02 + 0.01;
    this.angle = Math.random() * Math.PI * 2;
  }

  update(width: number, height: number) {
    this.y -= this.speedY;
    this.angle += this.swingSpeed;
    this.x += this.speedX + Math.sin(this.angle) * 0.4;

    if (this.y < -30) {
      this.y = height + 30;
      this.x = Math.random() * width;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    const s = this.size;
    ctx.moveTo(0, 0 + s / 4);
    ctx.quadraticCurveTo(0, 0, -s / 2, 0);
    ctx.quadraticCurveTo(-s, 0, -s, 0 + s / 2);
    ctx.quadraticCurveTo(-s, 0 + s * 0.8, 0, 0 + s * 1.2);
    ctx.quadraticCurveTo(s, 0 + s * 0.8, s, 0 + s / 2);
    ctx.quadraticCurveTo(s, 0, s / 2, 0);
    ctx.quadraticCurveTo(0, 0, 0, 0 + s / 4);
    ctx.fill();
    ctx.restore();
  }
}

class FireworkSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha = 1;
  decay = Math.random() * 0.015 + 0.012;
  gravity = 0.06;
  history: { x: number; y: number }[] = [];

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.color = color;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
  }

  update() {
    this.history.push({ x: this.x, y: this.y });
    if (this.history.length > 5) this.history.shift();

    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.alpha <= 0 || this.history.length === 0) return;
    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.moveTo(this.history[0].x, this.history[0].y);
    for (let i = 1; i < this.history.length; i++) {
      ctx.lineTo(this.history[i].x, this.history[i].y);
    }
    ctx.stroke();
    ctx.restore();
  }
}

class FireworkRocket {
  x: number;
  y: number;
  targetY: number;
  speedY: number;
  color: string;
  exploded = false;
  sparks: FireworkSpark[] = [];

  constructor(width: number, height: number) {
    this.x = Math.random() * (width - 200) + 100;
    this.y = height;
    this.targetY = Math.random() * (height * 0.5) + height * 0.15;
    this.speedY = Math.random() * 5 + 7;
    this.color = `hsl(${Math.random() * 360}, 90%, 65%)`;
  }

  update(onExplode: (x: number, y: number, color: string) => void) {
    if (!this.exploded) {
      this.y -= this.speedY;
      if (this.y <= this.targetY) {
        this.exploded = true;
        onExplode(this.x, this.y, this.color);
        for (let i = 0; i < 60; i++) {
          this.sparks.push(new FireworkSpark(this.x, this.y, this.color));
        }
      }
    } else {
      this.sparks.forEach((s) => s.update());
      this.sparks = this.sparks.filter((s) => s.alpha > 0);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.exploded) {
      ctx.save();
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else {
      this.sparks.forEach((s) => s.draw(ctx));
    }
  }
}

class LeafParticle {
  x: number;
  y: number;
  size: number;
  colors = ['#e07a5f', '#f4a261', '#81b29a', '#b56576', '#d62246'];
  color: string;
  speedX: number;
  speedY: number;
  sway: number;
  swaySpeed: number;
  angle: number;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * -height;
    this.size = Math.random() * 12 + 10;
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * 1.2 + 0.8;
    this.sway = Math.random() * 20 + 10;
    this.swaySpeed = Math.random() * 0.015 + 0.005;
    this.angle = Math.random() * Math.PI;
  }

  update(width: number, height: number) {
    this.y += this.speedY;
    this.angle += this.swaySpeed;
    this.x += this.speedX + Math.sin(this.angle) * 0.6;

    if (this.y > height + 20) {
      this.y = -20;
      this.x = Math.random() * width;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    const w = this.size;
    const h = this.size * 0.6;
    ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-w / 2, 0);
    ctx.lineTo(w / 2 + 3, 0);
    ctx.stroke();
    ctx.restore();
  }
}

class SparkleParticle {
  x: number;
  y: number;
  size: number;
  color: string;
  phase: number;
  phaseSpeed: number;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 3 + 1.5;
    this.color = `rgba(255, 235, 150, ${Math.random() * 0.5 + 0.4})`;
    this.phase = Math.random() * Math.PI * 2;
    this.phaseSpeed = Math.random() * 0.04 + 0.02;
  }

  update() {
    this.phase += this.phaseSpeed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const opacity = (Math.sin(this.phase) + 1) / 2;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    const r = this.size;
    ctx.moveTo(0, -r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.quadraticCurveTo(0, 0, 0, r);
    ctx.quadraticCurveTo(0, 0, -r, 0);
    ctx.quadraticCurveTo(0, 0, 0, -r);
    ctx.fill();
    ctx.restore();
  }
}

export const CanvasEffects: React.FC<CanvasEffectsProps> = ({ effect }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize lists
    const confettiList: ConfettiParticle[] = [];
    const heartList: HeartParticle[] = [];
    const leafList: LeafParticle[] = [];
    const sparkleList: SparkleParticle[] = [];
    let fireworkList: FireworkRocket[] = [];

    if (effect === 'confetti') {
      for (let i = 0; i < 110; i++) confettiList.push(new ConfettiParticle(width, height));
    } else if (effect === 'hearts') {
      for (let i = 0; i < 65; i++) heartList.push(new HeartParticle(width, height));
    } else if (effect === 'leaves') {
      for (let i = 0; i < 45; i++) leafList.push(new LeafParticle(width, height));
    } else if (effect === 'sparkles') {
      for (let i = 0; i < 100; i++) sparkleList.push(new SparkleParticle(width, height));
    }

    let fireworkTimer = 0;

    const animate = () => {
      // Use clean type guard
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      if (effect === 'confetti') {
        confettiList.forEach((p) => {
          p.update(width, height);
          p.draw(ctx);
        });
      } else if (effect === 'hearts') {
        heartList.forEach((p) => {
          p.update(width, height);
          p.draw(ctx);
        });
      } else if (effect === 'leaves') {
        leafList.forEach((p) => {
          p.update(width, height);
          p.draw(ctx);
        });
      } else if (effect === 'sparkles') {
        sparkleList.forEach((p) => {
          p.update();
          p.draw(ctx);
        });
      } else if (effect === 'fireworks') {
        fireworkTimer++;
        if (fireworkTimer % 45 === 0 && fireworkList.length < 5) {
          fireworkList.push(new FireworkRocket(width, height));
        }

        fireworkList.forEach((f) => {
          f.update(() => {});
          f.draw(ctx);
        });

        fireworkList = fireworkList.filter((f) => !f.exploded || f.sparks.length > 0);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [effect]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    />
  );
};

export default CanvasEffects;
