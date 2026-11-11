/**
 * ==============================================================================
 * 🎬 VIDEO INTRO CONTROLLER
 * ==============================================================================
 * Handles the full-screen video opening sequence:
 *   1. Autoplays the runner video (muted for autoplay policy)
 *   2. Shows a sound-toggle so user can unmute
 *   3. When video ends → reveals the "dropped letter" CTA
 *   4. Opening the letter dismisses the overlay and enters the main website
 * ==============================================================================
 */

(function () {
  'use strict';

  window.VideoIntro = {
    init: initVideoIntro,
    skip: skipIntro,
    replay: replayIntro
  };

  let overlay, video, skipBtn, replayBtn, soundBtn, letterCard, openLetterBtn;
  let progressBar, progressFill, timeLabel;
  let hasSkipped = false;

  function initVideoIntro() {
    overlay    = document.getElementById('video-intro-overlay');
    video      = document.getElementById('intro-video');
    skipBtn    = document.getElementById('btn-vi-skip');
    replayBtn  = document.getElementById('btn-vi-replay');
    soundBtn   = document.getElementById('btn-vi-sound');
    letterCard = document.getElementById('vi-letter-card');
    openLetterBtn = document.getElementById('btn-vi-open-letter');
    progressBar   = document.getElementById('vi-progress-bar');
    progressFill  = document.getElementById('vi-progress-fill');
    timeLabel     = document.getElementById('vi-time-label');

    if (!overlay || !video) return;

    // Wire buttons
    if (skipBtn)        skipBtn.addEventListener('click', skipIntro);
    if (replayBtn)      replayBtn.addEventListener('click', replayIntro);
    if (openLetterBtn)  openLetterBtn.addEventListener('click', openLetterAndEnter);
    if (soundBtn)       soundBtn.addEventListener('click', toggleSound);

    // Allow clicking the letter card itself too
    if (letterCard) {
      letterCard.addEventListener('click', function(e) {
        if (e.target === openLetterBtn || openLetterBtn.contains(e.target)) return;
        openLetterAndEnter();
      });
    }

    // Video events
    video.addEventListener('timeupdate', onVideoProgress);
    video.addEventListener('ended', onVideoEnded);
    video.addEventListener('canplay', () => {
      video.play().catch(() => {
        // Autoplay blocked → show play hint
        showPlayHint();
      });
    });

    // Keyboard shortcut
    document.addEventListener('keydown', (e) => {
      if (!overlay || overlay.classList.contains('vi-hidden')) return;
      if (e.key === 'Escape' || e.key === ' ') skipIntro();
      if (e.key === 'Enter' && letterCard && !letterCard.classList.contains('vi-card-hidden')) {
        openLetterAndEnter();
      }
    });

    // Start
    video.load();
  }

  function onVideoProgress() {
    if (!video.duration) return;
    const pct = (video.currentTime / video.duration) * 100;
    if (progressFill) progressFill.style.width = pct + '%';
    if (timeLabel) {
      const remaining = Math.ceil(video.duration - video.currentTime);
      timeLabel.textContent = remaining > 0 ? remaining + 's' : '';
    }
  }

  function onVideoEnded() {
    showLetterCard();
  }

  function showLetterCard() {
    if (letterCard) {
      letterCard.classList.remove('vi-card-hidden');
      letterCard.classList.add('vi-card-visible');
    }
    // Hide skip/progress controls
    if (skipBtn) skipBtn.style.opacity = '0';
    if (progressBar) progressBar.style.opacity = '0';
    if (timeLabel) timeLabel.style.opacity = '0';
    // Show replay
    if (replayBtn) replayBtn.style.opacity = '1';
    // Burst confetti around letter
    burstConfettiOnCard();
  }

  function skipIntro() {
    if (hasSkipped) return;
    hasSkipped = true;
    video.pause();
    openLetterAndEnter();
  }

  function replayIntro() {
    hasSkipped = false;
    // Hide letter card
    if (letterCard) {
      letterCard.classList.add('vi-card-hidden');
      letterCard.classList.remove('vi-card-visible');
    }
    // Restore UI
    if (skipBtn) skipBtn.style.opacity = '1';
    if (progressBar) progressBar.style.opacity = '1';
    if (timeLabel) timeLabel.style.opacity = '1';
    if (replayBtn) replayBtn.style.opacity = '0';

    video.currentTime = 0;
    video.play().catch(() => {});
  }

  function openLetterAndEnter() {
    // Confetti burst
    burstConfettiGlobal();

    // Fade the overlay out
    if (overlay) {
      overlay.classList.add('vi-fade-out');
      setTimeout(() => {
        overlay.classList.add('vi-hidden');
        overlay.style.display = 'none';
        // Hand off to main app
        if (window.app && typeof window.app.onVideoIntroDone === 'function') {
          window.app.onVideoIntroDone();
        } else {
          // Fallback: just show the main content
          document.getElementById('main-nav')?.classList.remove('hidden');
          document.querySelector('main')?.classList.remove('hidden');
        }
      }, 900);
    }
  }

  function toggleSound() {
    if (!video) return;
    video.muted = !video.muted;
    if (soundBtn) {
      soundBtn.innerHTML = video.muted
        ? '<span>🔇</span>'
        : '<span>🔊</span>';
    }
  }

  function showPlayHint() {
    // On autoplay block, clicking anywhere starts video
    const hint = document.getElementById('vi-play-hint');
    if (hint) hint.style.display = 'flex';
    overlay && overlay.addEventListener('click', function startOnClick() {
      video.play().catch(() => {});
      if (hint) hint.style.display = 'none';
      overlay.removeEventListener('click', startOnClick);
    }, { once: true });
  }

  function burstConfettiOnCard() {
    if (!window.particleEngine) return;
    try {
      const card = document.getElementById('vi-letter-card');
      if (!card) return;
      const r = card.getBoundingClientRect();
      window.particleEngine.burstConfetti(r.left + r.width / 2, r.top + r.height / 2, 30);
    } catch(e) {}
  }

  function burstConfettiGlobal() {
    if (!window.particleEngine) return;
    try {
      window.particleEngine.burstConfetti(window.innerWidth / 2, window.innerHeight / 2, 60);
    } catch(e) {}
  }

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVideoIntro);
  } else {
    initVideoIntro();
  }

})();
