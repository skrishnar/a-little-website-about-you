/**
 * ==============================================================================
 * ✨ FLOATING PASTEL PARTICLES & CELEBRATION CONFETTI
 * ==============================================================================
 * Renders dreamy ambient floating hearts, twinkling stars, and sparkles on a
 * background canvas. Also provides celebratory confetti bursts on achievements!
 * ==============================================================================
 */

class ParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.confetti = [];
    this.animId = null;
    this.reducedMotion = false;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.colors = ['#FFDCE5', '#E9E0FF', '#FFF8EC', '#FFDCC5', '#DDF2FF', '#E88BA6'];

    this.init();
    this.bindEvents();
  }

  init() {
    this.resize();
    this.createAmbientParticles(40);
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());

    // Listen for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reducedMotion = mediaQuery.matches;
    mediaQuery.addEventListener('change', (e) => {
      this.reducedMotion = e.matches;
    });
  }

  createAmbientParticles(count) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 8 + 4,
        speedY: (Math.random() * 0.4 + 0.15) * -1, // float upward
        speedX: (Math.random() - 0.5) * 0.3,
        type: Math.random() > 0.4 ? 'heart' : (Math.random() > 0.5 ? 'star' : 'sparkle'),
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        opacity: Math.random() * 0.5 + 0.25,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        pulse: Math.random() * Math.PI,
      });
    }
  }

  drawHeart(ctx, x, y, size, color, opacity, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(size / 15, size / 15);
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-5, -6, -10, 0, 0, 10);
    ctx.bezierCurveTo(10, 0, 5, -6, 0, 0);
    ctx.fill();
    ctx.restore();
  }

  drawStar(ctx, x, y, size, color, opacity, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      ctx.lineTo(Math.cos((18 + i * 90) * Math.PI / 180) * size,
                 -Math.sin((18 + i * 90) * Math.PI / 180) * size);
      ctx.lineTo(Math.cos((54 + i * 90) * Math.PI / 180) * (size * 0.35),
                 -Math.sin((54 + i * 90) * Math.PI / 180) * (size * 0.35));
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawSparkle(ctx, x, y, size, color, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  burstConfetti(originX, originY, count = 35) {
    if (this.reducedMotion) return;
    const x = originX || this.width / 2;
    const y = originY || this.height / 2;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      this.confetti.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: Math.random() * 7 + 4,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        life: 1.0,
        decay: Math.random() * 0.015 + 0.01,
        type: Math.random() > 0.4 ? 'rect' : 'circle',
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (!this.reducedMotion) {
      // Update & Draw Ambient
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;
        p.pulse += 0.03;

        const currentOpacity = p.opacity + Math.sin(p.pulse) * 0.15;
        const clampedOpacity = Math.max(0.1, Math.min(0.8, currentOpacity));

        if (p.type === 'heart') {
          this.drawHeart(this.ctx, p.x, p.y, p.size, p.color, clampedOpacity, p.rotation);
        } else if (p.type === 'star') {
          this.drawStar(this.ctx, p.x, p.y, p.size, p.color, clampedOpacity, p.rotation);
        } else {
          this.drawSparkle(this.ctx, p.x, p.y, p.size, p.color, clampedOpacity);
        }

        // Wrap around edges
        if (p.y < -20) {
          p.y = this.height + 15;
          p.x = Math.random() * this.width;
        }
        if (p.x < -20) p.x = this.width + 10;
        if (p.x > this.width + 20) p.x = -10;
      }

      // Update & Draw Confetti
      for (let i = this.confetti.length - 1; i >= 0; i--) {
        const c = this.confetti[i];
        c.x += c.vx;
        c.y += c.vy;
        c.vy += 0.22; // gravity
        c.vx *= 0.98; // air resistance
        c.rotation += c.rotSpeed;
        c.life -= c.decay;

        if (c.life <= 0) {
          this.confetti.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.translate(c.x, c.y);
        this.ctx.rotate(c.rotation * Math.PI / 180);
        this.ctx.fillStyle = c.color;
        this.ctx.globalAlpha = c.life;

        if (c.type === 'rect') {
          this.ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 1.4);
        } else {
          this.ctx.beginPath();
          this.ctx.arc(0, 0, c.size / 2, 0, Math.PI * 2);
          this.ctx.fill();
        }
        this.ctx.restore();
      }
    }

    this.animId = requestAnimationFrame(() => this.animate());
  }

  setReducedMotion(enabled) {
    this.reducedMotion = enabled;
  }
}

window.ParticleEngine = ParticleEngine;
