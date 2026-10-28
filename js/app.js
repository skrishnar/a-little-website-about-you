/**
 * ==============================================================================
 * 💌 A LITTLE WEBSITE ABOUT YOU — MAIN APPLICATION CONTROLLER
 * ==============================================================================
 * Manages state, chapter transitions, map routing, quiz mini-game, modals,
 * polaroid flips, animations, sound triggers, and configuration binding.
 * ==============================================================================
 */

(function () {
  'use strict';

  // State object
  const state = {
    currentChapter: 0, // 0-indexed: Chapters 1 to 8
    totalChapters: 8,
    visitedLandmarks: new Set(),
    quizCurrentQuestion: 0,
    quizAnswers: {},
    envelopeOpened: false,
    letterOpened: false,
    reducedMotion: false,
    visitedChapters: new Set([0]),
  };

  // Helper: Text Interpolation for Placeholders
  function formatText(text) {
    if (!text) return '';
    const config = window.STORY_CONFIG;
    const crushName = config.recipient?.name || 'You';
    const crushNick = config.recipient?.nickname || crushName;
    const myName = config.sender?.name || 'Me';
    const myNick = config.sender?.nickname || myName;

    return text
      .replace(/{CRUSH_NAME}/g, crushName)
      .replace(/\[CRUSH'S NAME\]/g, crushName)
      .replace(/{CRUSH_NICKNAME}/g, crushNick)
      .replace(/\[THEIR NICKNAME\]/g, crushNick)
      .replace(/{MY_NAME}/g, myName)
      .replace(/\[MY NAME\]/g, myName)
      .replace(/{MY_NICKNAME}/g, myNick)
      .replace(/\[MY NICKNAME\]/g, myNick);
  }

  // DOM Elements Cache
  const elements = {};

  function cacheDOMElements() {
    elements.particleCanvas = document.getElementById('particle-canvas');
    elements.chapterSections = document.querySelectorAll('.chapter-section');
    elements.progressFill = document.getElementById('nav-progress-fill');
    elements.progressText = document.getElementById('nav-progress-text');
    elements.musicBtn = document.getElementById('btn-music-toggle');
    elements.sfxBtn = document.getElementById('btn-sfx-toggle');
    elements.motionBtn = document.getElementById('btn-motion-toggle');
    elements.homeBtn = document.getElementById('btn-home');

    // Modal elements
    elements.modalOverlay = document.getElementById('app-modal');
    elements.modalCloseBtn = document.getElementById('modal-close-btn');
    elements.modalIcon = document.getElementById('modal-icon');
    elements.modalTitle = document.getElementById('modal-title');
    elements.modalSubtitle = document.getElementById('modal-subtitle');
    elements.modalBody = document.getElementById('modal-body');
    elements.modalThought = document.getElementById('modal-thought');
    elements.modalPolaroid = document.getElementById('modal-polaroid');
    elements.modalPolaroidImg = document.getElementById('modal-polaroid-img');
    elements.modalPolaroidCaption = document.getElementById('modal-polaroid-caption');

    // Toast
    elements.toast = document.getElementById('easter-egg-toast');
    elements.toastMsg = document.getElementById('toast-message');
  }

  // ============================================================================
  // CHAPTER NAVIGATION
  // ============================================================================
  function goToChapter(chapterIndex) {
    if (chapterIndex < 0 || chapterIndex >= state.totalChapters) return;

    state.currentChapter = chapterIndex;
    state.visitedChapters.add(chapterIndex);

    // Update chapter visibility
    elements.chapterSections.forEach((section, idx) => {
      if (idx === chapterIndex) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });

    // Update progress pill & bar
    const progressPercent = ((chapterIndex + 1) / state.totalChapters) * 100;
    if (elements.progressFill) {
      elements.progressFill.style.width = `${progressPercent}%`;
    }
    if (elements.progressText) {
      elements.progressText.textContent = `A little adventure · ${chapterIndex + 1} of ${state.totalChapters}`;
    }

    // Scroll gracefully to top
    window.scrollTo({ top: 0, behavior: state.reducedMotion ? 'auto' : 'smooth' });

    // Trigger Chapter-Specific setups
    onChapterEnter(chapterIndex);

    // Trigger sound
    window.soundController?.playPop();
  }

  function onChapterEnter(chapterIndex) {
    switch (chapterIndex) {
      case 1: // Chapter 2: Diary
        revealDiaryLines();
        break;
      case 3: // Chapter 4: Map
        initMapInteractive();
        break;
      case 4: // Chapter 5: Quiz
        renderQuizQuestion(state.quizCurrentQuestion);
        break;
      case 6: // Chapter 7: Letter
        if (state.letterOpened) {
          revealLetterParagraphs();
        }
        break;
      default:
        break;
    }
  }

  // ============================================================================
  // CHAPTER 1: WELCOME SCREEN SETUP
  // ============================================================================
  function initChapter1() {
    const config = window.STORY_CONFIG.welcome;
    const crushGreeting = document.getElementById('welcome-greeting');
    const welcomeSub = document.getElementById('welcome-sub');
    const openEnvelopeBtn = document.getElementById('btn-open-envelope');
    const envelopeBox = document.getElementById('welcome-envelope-box');
    const welcomeReveal = document.getElementById('welcome-reveal');

    const choiceABtn = document.getElementById('btn-choice-a');
    const choiceBBtn = document.getElementById('btn-choice-b');
    const microFeedback = document.getElementById('welcome-micro-feedback');

    if (crushGreeting) crushGreeting.textContent = formatText(config.greeting);
    if (welcomeSub) welcomeSub.textContent = formatText(config.subheading);

    const handleOpenEnvelope = () => {
      if (state.envelopeOpened) return;
      state.envelopeOpened = true;

      window.soundController?.playPaper();
      window.soundController?.playChime();
      if (window.particleEngine) {
        const rect = envelopeBox.getBoundingClientRect();
        window.particleEngine.burstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);
      }

      envelopeBox.classList.add('opened');
      openEnvelopeBtn.style.display = 'none';

      setTimeout(() => {
        welcomeReveal.style.display = 'block';
      }, 450);
    };

    if (openEnvelopeBtn) openEnvelopeBtn.addEventListener('click', handleOpenEnvelope);
    if (envelopeBox) envelopeBox.addEventListener('click', handleOpenEnvelope);

    if (choiceABtn) {
      choiceABtn.textContent = formatText(config.choiceA.buttonText);
      choiceABtn.addEventListener('click', () => {
        window.soundController?.playPop();
        microFeedback.textContent = formatText(config.choiceA.microMessage);
        microFeedback.style.display = 'block';
        setTimeout(() => goToChapter(1), 1400);
      });
    }

    if (choiceBBtn) {
      choiceBBtn.textContent = formatText(config.choiceB.buttonText);
      choiceBBtn.addEventListener('click', () => {
        window.soundController?.playPop();
        microFeedback.textContent = formatText(config.choiceB.microMessage);
        microFeedback.style.display = 'block';
        setTimeout(() => goToChapter(1), 1600);
      });
    }
  }

  // ============================================================================
  // CHAPTER 2: DIGITAL DIARY SETUP
  // ============================================================================
  function initChapter2() {
    const config = window.STORY_CONFIG.intro;
    const heading = document.getElementById('diary-heading');
    const dateTag = document.getElementById('diary-date-tag');
    const linesContainer = document.getElementById('diary-lines-list');
    const stickersRow = document.getElementById('diary-stickers-row');
    const nextBtn = document.getElementById('btn-diary-next');

    if (heading) heading.textContent = formatText(config.heading);
    if (dateTag) dateTag.textContent = formatText(config.diaryDate);

    // Build lines
    if (linesContainer) {
      linesContainer.innerHTML = '';
      config.lines.forEach((lineText, idx) => {
        const lineEl = document.createElement('div');
        lineEl.className = 'diary-line';
        lineEl.textContent = formatText(lineText);
        lineEl.dataset.index = idx;
        linesContainer.appendChild(lineEl);
      });
    }

    // Build stickers
    if (stickersRow) {
      stickersRow.innerHTML = '';
      config.stickers.forEach((st, idx) => {
        const stEl = document.createElement('div');
        stEl.className = 'diary-sticker';
        stEl.style.setProperty('--rot', (idx % 2 === 0 ? -4 : 4) * (idx + 1));
        stEl.innerHTML = `<span>${st.emoji}</span> <span>${formatText(st.label)}</span>`;
        stickersRow.appendChild(stEl);
      });
    }

    if (nextBtn) {
      nextBtn.textContent = formatText(config.nextButtonText);
      nextBtn.addEventListener('click', () => goToChapter(2));
    }
  }

  function revealDiaryLines() {
    const lines = document.querySelectorAll('.diary-line');
    lines.forEach((line, index) => {
      setTimeout(() => {
        line.classList.add('revealed');
        window.soundController?.playPop();
      }, (index + 1) * 350);
    });
  }

  // ============================================================================
  // CHAPTER 3: TIMELINE SETUP
  // ============================================================================
  function initChapter3() {
    const config = window.STORY_CONFIG.timeline;
    const heading = document.getElementById('timeline-heading');
    const subtitle = document.getElementById('timeline-subtitle');
    const itemsList = document.getElementById('timeline-items-list');
    const nextBtn = document.getElementById('btn-timeline-next');

    if (heading) heading.textContent = formatText(config.heading);
    if (subtitle) subtitle.textContent = formatText(config.subtitle);

    if (itemsList) {
      itemsList.innerHTML = '';
      config.milestones.forEach((item) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'timeline-item';

        itemEl.innerHTML = `
          <div class="timeline-node-pin">${item.icon || '🌸'}</div>
          <div class="timeline-content-card" tabindex="0" role="button" aria-label="Open milestone ${item.title}">
            <div class="timeline-date-tag">${formatText(item.date)}</div>
            <h4 class="timeline-card-title">${formatText(item.title)}</h4>
            <p class="timeline-card-summary">${formatText(item.shortSummary)}</p>
            <div class="timeline-click-hint">
              <span>Peek inside memory</span>
              <span>✨</span>
            </div>
          </div>
        `;

        const card = itemEl.querySelector('.timeline-content-card');
        const openMemory = () => {
          window.soundController?.playPop();
          openModal({
            icon: item.icon || '🌸',
            title: formatText(item.title),
            subtitle: formatText(item.date),
            body: formatText(item.fullStory),
            thought: formatText(item.thoughtAtTheTime),
            photo: item.photo,
            polaroidCaption: item.polaroidCaption || item.title,
          });
        };

        card.addEventListener('click', openMemory);
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openMemory();
          }
        });

        itemsList.appendChild(itemEl);
      });
    }

    if (nextBtn) {
      nextBtn.textContent = formatText(config.nextButtonText);
      nextBtn.addEventListener('click', () => goToChapter(3));
    }
  }

  // ============================================================================
  // CHAPTER 4: THE INTERACTIVE JOURNEY MAP
  // ============================================================================
  // Coordinates mapped to SVG viewBox 0 0 800 480
  const landmarkPositions = [
    { x: 100, y: 390 }, // 1. Starting Point
    { x: 250, y: 220 }, // 2. Conversation Café
    { x: 420, y: 340 }, // 3. Little Things Garden
    { x: 580, y: 160 }, // 4. Butterfly Hill
    { x: 710, y: 300 }, // 5. Present-Day Observatory
  ];

  function initChapter4() {
    const config = window.STORY_CONFIG.map;
    const heading = document.getElementById('map-heading');
    const subtitle = document.getElementById('map-subtitle');
    const board = document.getElementById('map-interactive-board');
    const nextBtn = document.getElementById('btn-map-next');

    if (heading) heading.textContent = formatText(config.heading);
    if (subtitle) subtitle.textContent = formatText(config.subtitle);

    if (nextBtn) {
      nextBtn.textContent = formatText(config.nextButtonText);
      nextBtn.addEventListener('click', () => goToChapter(4));
    }

    // Render Nodes onto Map container
    if (board) {
      // Remove any previously rendered map nodes
      board.querySelectorAll('.map-node, .easter-egg, .map-traveler').forEach(n => n.remove());

      // Create traveler avatar (paper plane or cute heart)
      const traveler = document.createElement('div');
      traveler.className = 'map-traveler';
      traveler.id = 'map-traveler-avatar';
      traveler.innerHTML = '✈️';
      traveler.setAttribute('title', 'Your little adventure traveler');
      // Position at start
      const startPos = landmarkPositions[0];
      traveler.style.left = `${(startPos.x / 800) * 100}%`;
      traveler.style.top = `${(startPos.y / 480) * 100}%`;
      board.appendChild(traveler);

      // Render Landmark Nodes
      config.landmarks.forEach((lm, idx) => {
        const pos = landmarkPositions[idx] || { x: 100 * (idx + 1), y: 200 };
        const node = document.createElement('button');
        node.className = 'map-node';
        node.id = `map-node-${lm.id}`;
        node.style.left = `${(pos.x / 800) * 100}%`;
        node.style.top = `${(pos.y / 480) * 100}%`;
        node.setAttribute('aria-label', `Landmark ${lm.id}: ${lm.title}`);

        node.innerHTML = `
          <div class="map-node-icon">${lm.icon}</div>
          <div class="map-node-info">
            <span class="map-node-title">${formatText(lm.title)}</span>
            <span class="map-node-sub">${formatText(lm.subtitle)}</span>
          </div>
        `;

        node.addEventListener('click', () => {
          onLandmarkClick(lm, pos, idx);
        });

        board.appendChild(node);
      });

      // Render Easter Eggs along path
      const eggPositions = [
        { x: 180, y: 130 },
        { x: 340, y: 410 },
        { x: 500, y: 110 }
      ];

      config.easterEggs.forEach((egg, idx) => {
        const ePos = eggPositions[idx] || { x: 200, y: 200 };
        const eggBtn = document.createElement('button');
        eggBtn.className = 'easter-egg';
        eggBtn.style.left = `${(ePos.x / 800) * 100}%`;
        eggBtn.style.top = `${(ePos.y / 480) * 100}%`;
        eggBtn.innerHTML = egg.icon;
        eggBtn.setAttribute('title', egg.label);

        eggBtn.addEventListener('click', () => {
          window.soundController?.playChime();
          showEasterEggToast(formatText(egg.message));
        });

        board.appendChild(eggBtn);
      });
    }
  }

  function initMapInteractive() {
    // When entering the map chapter, update traveler position
    updateTravelerPosition();
  }

  function onLandmarkClick(landmark, pos, index) {
    state.visitedLandmarks.add(landmark.id);

    // Update node appearance
    const node = document.getElementById(`map-node-${landmark.id}`);
    if (node) node.classList.add('completed');

    // Move traveler to this landmark
    moveTravelerTo(pos);

    // Play chime sound
    window.soundController?.playChime();

    // Trigger mini confetti
    if (window.particleEngine) {
      const board = document.getElementById('map-interactive-board');
      const bRect = board.getBoundingClientRect();
      const originX = bRect.left + (pos.x / 800) * bRect.width;
      const originY = bRect.top + (pos.y / 480) * bRect.height;
      window.particleEngine.burstConfetti(originX, originY, 20);
    }

    // Open Landmark Modal
    openModal({
      icon: landmark.icon,
      title: formatText(landmark.title),
      subtitle: formatText(landmark.subtitle),
      body: `${formatText(landmark.story)}\n\n${formatText(landmark.memoryDetail)}`,
      thought: formatText(landmark.thoughtNote),
      photo: landmark.photo,
      polaroidCaption: landmark.title,
    });
  }

  function moveTravelerTo(pos) {
    const traveler = document.getElementById('map-traveler-avatar');
    if (!traveler) return;
    traveler.style.left = `${(pos.x / 800) * 100}%`;
    traveler.style.top = `${(pos.y / 480) * 100}%`;
  }

  function updateTravelerPosition() {
    const highestVisited = Math.max(0, ...Array.from(state.visitedLandmarks));
    const targetIdx = highestVisited > 0 ? highestVisited - 1 : 0;
    const pos = landmarkPositions[targetIdx];
    if (pos) moveTravelerTo(pos);
  }

  function showEasterEggToast(message) {
    if (!elements.toast || !elements.toastMsg) return;
    elements.toastMsg.textContent = message;
    elements.toast.classList.add('show');

    if (window.particleEngine) {
      window.particleEngine.burstConfetti(window.innerWidth / 2, window.innerHeight - 50, 15);
    }

    setTimeout(() => {
      elements.toast.classList.remove('show');
    }, 4000);
  }

  // ============================================================================
  // CHAPTER 5: THE CRUSH QUIZ
  // ============================================================================
  function initChapter5() {
    const config = window.STORY_CONFIG.quiz;
    const heading = document.getElementById('quiz-heading');
    const subtitle = document.getElementById('quiz-subtitle');
    const skipBtn = document.getElementById('btn-quiz-skip');
    const nextBtn = document.getElementById('btn-quiz-next');

    if (heading) heading.textContent = formatText(config.heading);
    if (subtitle) subtitle.textContent = formatText(config.subtitle);

    if (skipBtn) {
      skipBtn.textContent = formatText(config.skipButtonText);
      skipBtn.addEventListener('click', () => {
        window.soundController?.playPop();
        goToChapter(5); // Proceed to Chapter 6
      });
    }

    if (nextBtn) {
      nextBtn.textContent = formatText(config.nextButtonText);
      nextBtn.addEventListener('click', () => {
        goToChapter(5); // Proceed to Chapter 6
      });
    }

    renderQuizQuestion(0);
  }

  function renderQuizQuestion(qIdx) {
    const config = window.STORY_CONFIG.quiz;
    const qCount = config.questions.length;
    const container = document.getElementById('quiz-dynamic-area');
    const dotsContainer = document.getElementById('quiz-dots-container');
    const feedbackBox = document.getElementById('quiz-feedback-box');
    const completeArea = document.getElementById('quiz-completed-area');

    if (!container) return;

    if (qIdx >= qCount) {
      // Quiz Finished
      container.style.display = 'none';
      if (feedbackBox) feedbackBox.style.display = 'none';
      if (completeArea) {
        completeArea.style.display = 'block';
        window.soundController?.playChime();
        if (window.particleEngine) {
          window.particleEngine.burstConfetti(window.innerWidth / 2, window.innerHeight / 2, 45);
        }
      }
      return;
    }

    // Active question
    container.style.display = 'block';
    if (completeArea) completeArea.style.display = 'none';
    if (feedbackBox) feedbackBox.style.display = 'none';

    // Render Dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < qCount; i++) {
        const dot = document.createElement('div');
        dot.className = `quiz-dot ${i === qIdx ? 'active' : (i < qIdx ? 'completed' : '')}`;
        dotsContainer.appendChild(dot);
      }
    }

    const currentQ = config.questions[qIdx];
    container.innerHTML = `
      <div class="quiz-badge">Question ${qIdx + 1} of ${qCount}</div>
      <h3 class="quiz-question-title">${formatText(currentQ.question)}</h3>
      <div class="quiz-options-list" id="quiz-options-list"></div>
    `;

    const optionsList = container.querySelector('#quiz-options-list');
    currentQ.options.forEach((opt, optIdx) => {
      const optBtn = document.createElement('button');
      optBtn.className = 'quiz-option-btn';
      optBtn.innerHTML = `<span>${formatText(opt.text)}</span> <span>👉</span>`;

      optBtn.addEventListener('click', () => {
        window.soundController?.playPop();
        // Highlight selection
        optionsList.querySelectorAll('.quiz-option-btn').forEach(b => b.classList.remove('selected'));
        optBtn.classList.add('selected');

        // Store state locally
        state.quizAnswers[currentQ.id] = opt.text;

        // Display cute micro response
        if (feedbackBox) {
          feedbackBox.textContent = formatText(opt.response);
          feedbackBox.style.display = 'block';
        }

        // Advance question automatically after short pause
        setTimeout(() => {
          state.quizCurrentQuestion = qIdx + 1;
          renderQuizQuestion(state.quizCurrentQuestion);
        }, 1800);
      });

      optionsList.appendChild(optBtn);
    });
  }

  // ============================================================================
  // CHAPTER 6: THE PRESENT (Memory Cards)
  // ============================================================================
  function initChapter6() {
    const config = window.STORY_CONFIG.present;
    const heading = document.getElementById('present-heading');
    const subtitle = document.getElementById('present-subtitle');
    const cardsGrid = document.getElementById('memory-cards-grid');
    const reflectionQuote = document.getElementById('present-reflection-quote');
    const nextBtn = document.getElementById('btn-present-next');

    if (heading) heading.textContent = formatText(config.heading);
    if (subtitle) subtitle.textContent = formatText(config.subtitle);
    if (reflectionQuote) reflectionQuote.textContent = formatText(config.reflection);

    if (cardsGrid) {
      cardsGrid.innerHTML = '';
      config.cards.forEach((card) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'memory-flip-card';
        cardEl.setAttribute('tabindex', '0');
        cardEl.setAttribute('role', 'button');
        cardEl.setAttribute('aria-label', `Memory card: ${card.title}`);

        cardEl.innerHTML = `
          <div class="memory-card-inner">
            <div class="memory-card-front">
              <span class="memory-tag">${card.tag}</span>
              <div class="memory-card-icon">${card.icon}</div>
              <h4 class="memory-prompt-text">${formatText(card.prompt)}</h4>
              <span style="font-size: 0.85rem; color: var(--color-rose-dark); font-weight: 600;">Click to unfold 💌</span>
            </div>
            <div class="memory-card-back">
              <span class="memory-tag" style="background: rgba(255,255,255,0.7);">${card.title}</span>
              <p class="memory-reveal-text">${formatText(card.reveal)}</p>
              <span style="font-size: 0.8rem; color: var(--color-plum-light); font-style: italic;">(Tap again to flip back)</span>
            </div>
          </div>
        `;

        const toggleFlip = () => {
          cardEl.classList.toggle('flipped');
          window.soundController?.playPop();
        };

        cardEl.addEventListener('click', toggleFlip);
        cardEl.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleFlip();
          }
        });

        cardsGrid.appendChild(cardEl);
      });
    }

    if (nextBtn) {
      nextBtn.textContent = formatText(config.nextButtonText);
      nextBtn.addEventListener('click', () => goToChapter(6));
    }
  }

  // ============================================================================
  // CHAPTER 7: THE LETTER
  // ============================================================================
  function initChapter7() {
    const config = window.STORY_CONFIG.letter;
    const heading = document.getElementById('letter-heading');
    const openBtn = document.getElementById('btn-open-letter');
    const envelopeHero = document.getElementById('letter-envelope-hero');
    const parchment = document.getElementById('letter-parchment');
    const paragraphsList = document.getElementById('letter-paragraphs-list');
    const closingText = document.getElementById('letter-closing-text');
    const signature = document.getElementById('letter-signature');
    const rereadBtn = document.getElementById('btn-letter-reread');
    const nextBtn = document.getElementById('btn-letter-next');

    if (heading) heading.textContent = formatText(config.heading);
    if (openBtn) openBtn.textContent = formatText(config.envelopeButtonText);
    if (rereadBtn) rereadBtn.textContent = formatText(config.rereadButtonText);
    if (closingText) closingText.textContent = formatText(config.closing);
    if (signature) signature.textContent = formatText(config.signature);

    if (nextBtn) {
      nextBtn.textContent = formatText(config.nextButtonText);
      nextBtn.addEventListener('click', () => goToChapter(7));
    }

    // Build paragraphs
    if (paragraphsList) {
      paragraphsList.innerHTML = '';
      config.paragraphs.forEach((pText, idx) => {
        const p = document.createElement('p');
        p.className = 'letter-p';
        p.textContent = formatText(pText);
        p.dataset.index = idx;
        paragraphsList.appendChild(p);
      });
    }

    const handleOpenLetter = () => {
      state.letterOpened = true;
      window.soundController?.playPaper();
      window.soundController?.playHeartbeat();

      if (window.particleEngine) {
        window.particleEngine.burstConfetti(window.innerWidth / 2, window.innerHeight / 2, 40);
      }

      envelopeHero.style.display = 'none';
      parchment.classList.add('revealed');
      revealLetterParagraphs();
    };

    if (openBtn) openBtn.addEventListener('click', handleOpenLetter);

    if (rereadBtn) {
      rereadBtn.addEventListener('click', () => {
        window.soundController?.playPaper();
        const paragraphs = document.querySelectorAll('.letter-p');
        paragraphs.forEach(p => p.classList.remove('revealed'));
        revealLetterParagraphs();
      });
    }
  }

  function revealLetterParagraphs() {
    const paragraphs = document.querySelectorAll('.letter-p');
    paragraphs.forEach((p, idx) => {
      setTimeout(() => {
        p.classList.add('revealed');
      }, (idx + 1) * 600);
    });
  }

  // ============================================================================
  // CHAPTER 8: THEIR TURN (No Pressure, Just Honesty)
  // ============================================================================
  function initChapter8() {
    const config = window.STORY_CONFIG.theirTurn;
    const heading = document.getElementById('their-turn-heading');
    const introText = document.getElementById('their-turn-intro');
    const cardsGrid = document.getElementById('response-cards-grid');
    const revealCard = document.getElementById('response-reveal-card');
    const revealTitle = document.getElementById('response-reveal-title');
    const revealSub = document.getElementById('response-reveal-sub');
    const footerMsg = document.getElementById('their-turn-footer-msg');

    const rereadLetterBtn = document.getElementById('btn-revisit-letter');
    const revisitMapBtn = document.getElementById('btn-revisit-map');
    const restartBtn = document.getElementById('btn-restart-experience');

    if (heading) heading.textContent = formatText(config.heading);
    if (introText) introText.textContent = formatText(config.introText);
    if (footerMsg) footerMsg.textContent = formatText(config.footerMessage);

    if (rereadLetterBtn) {
      rereadLetterBtn.textContent = formatText(config.revisitLetterText);
      rereadLetterBtn.addEventListener('click', () => goToChapter(6));
    }
    if (revisitMapBtn) {
      revisitMapBtn.textContent = formatText(config.revisitMapText);
      revisitMapBtn.addEventListener('click', () => goToChapter(3));
    }
    if (restartBtn) {
      restartBtn.textContent = formatText(config.restartText);
      restartBtn.addEventListener('click', () => {
        window.soundController?.playChime();
        goToChapter(0);
      });
    }

    if (cardsGrid) {
      cardsGrid.innerHTML = '';
      config.responseCards.forEach((rc) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'response-card';
        cardEl.setAttribute('tabindex', '0');
        cardEl.setAttribute('role', 'button');
        cardEl.setAttribute('aria-label', `Response option: ${rc.cardTitle}`);

        cardEl.innerHTML = `
          <div class="response-card-icon">${rc.icon}</div>
          <h4 class="response-card-title">${formatText(rc.cardTitle)}</h4>
        `;

        const selectCard = () => {
          cardsGrid.querySelectorAll('.response-card').forEach(c => c.classList.remove('active'));
          cardEl.classList.add('active');

          window.soundController?.playHeartbeat();
          if (window.particleEngine) {
            window.particleEngine.burstConfetti(window.innerWidth / 2, window.innerHeight / 2, 35);
          }

          if (revealCard && revealTitle && revealSub) {
            revealTitle.textContent = formatText(rc.revealMessage);
            revealSub.textContent = formatText(rc.subtext);
            revealCard.style.display = 'block';
            revealCard.scrollIntoView({ behavior: state.reducedMotion ? 'auto' : 'smooth', block: 'nearest' });
          }
        };

        cardEl.addEventListener('click', selectCard);
        cardEl.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectCard();
          }
        });

        cardsGrid.appendChild(cardEl);
      });
    }
  }

  // ============================================================================
  // MODAL MANAGER
  // ============================================================================
  function openModal(data) {
    if (!elements.modalOverlay) return;

    if (elements.modalIcon) elements.modalIcon.textContent = data.icon || '🌸';
    if (elements.modalTitle) elements.modalTitle.textContent = data.title || '';
    if (elements.modalSubtitle) elements.modalSubtitle.textContent = data.subtitle || '';
    if (elements.modalBody) elements.modalBody.textContent = data.body || '';

    if (elements.modalThought && data.thought) {
      elements.modalThought.textContent = data.thought;
      elements.modalThought.style.display = 'block';
    } else if (elements.modalThought) {
      elements.modalThought.style.display = 'none';
    }

    // Photo handling
    if (elements.modalPolaroid && elements.modalPolaroidImg) {
      if (data.photo && data.photo.trim() !== '') {
        elements.modalPolaroidImg.src = data.photo;
        elements.modalPolaroidImg.style.display = 'block';
        elements.modalPolaroidCaption.textContent = data.polaroidCaption || '';
        elements.modalPolaroid.style.display = 'block';
      } else {
        elements.modalPolaroid.style.display = 'none';
      }
    }

    elements.modalOverlay.classList.add('open');
    if (elements.modalCloseBtn) elements.modalCloseBtn.focus();
  }

  function closeModal() {
    if (!elements.modalOverlay) return;
    elements.modalOverlay.classList.remove('open');
    window.soundController?.playPop();
  }

  function initModalEvents() {
    if (elements.modalCloseBtn) elements.modalCloseBtn.addEventListener('click', closeModal);
    if (elements.modalOverlay) {
      elements.modalOverlay.addEventListener('click', (e) => {
        if (e.target === elements.modalOverlay) closeModal();
      });
    }
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && elements.modalOverlay?.classList.contains('open')) {
        closeModal();
      }
    });
  }

  // ============================================================================
  // CONTROLS & EVENT LISTENERS
  // ============================================================================
  function initControls() {
    // Music Toggle Button
    if (elements.musicBtn) {
      elements.musicBtn.addEventListener('click', () => {
        const isPlaying = window.soundController?.toggleMusic();
        elements.musicBtn.classList.toggle('active', isPlaying);
        elements.musicBtn.innerHTML = isPlaying ? '🎵' : '🔇';
        elements.musicBtn.setAttribute('title', isPlaying ? 'Pause Music' : 'Play Background Music');
      });
    }

    // SFX Toggle Button
    if (elements.sfxBtn) {
      elements.sfxBtn.addEventListener('click', () => {
        const sfxOn = window.soundController?.toggleSfx();
        elements.sfxBtn.classList.toggle('active', sfxOn);
        elements.sfxBtn.innerHTML = sfxOn ? '🔔' : '🔕';
        elements.sfxBtn.setAttribute('title', sfxOn ? 'Mute Sound Effects' : 'Enable Sound Effects');
      });
    }

    // Reduced Motion Toggle Button
    if (elements.motionBtn) {
      elements.motionBtn.addEventListener('click', () => {
        state.reducedMotion = !state.reducedMotion;
        document.body.classList.toggle('reduced-motion', state.reducedMotion);
        elements.motionBtn.classList.toggle('active', state.reducedMotion);
        elements.motionBtn.innerHTML = state.reducedMotion ? '⏸️' : '✨';
        elements.motionBtn.setAttribute('title', state.reducedMotion ? 'Enable Animations' : 'Reduce Motion');
        if (window.particleEngine) {
          window.particleEngine.setReducedMotion(state.reducedMotion);
        }
      });
    }

    // Home / Restart Button
    if (elements.homeBtn) {
      elements.homeBtn.addEventListener('click', () => {
        goToChapter(0);
      });
    }

    // Global keyboard shortcuts (M: Music, S: SFX)
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'm' || e.key === 'M') {
        elements.musicBtn?.click();
      } else if (e.key === 's' || e.key === 'S') {
        elements.sfxBtn?.click();
      }
    });
  }

  // ============================================================================
  // APP INITIALIZATION
  // ============================================================================
  function initApp() {
    cacheDOMElements();

    // Initialize Particle Canvas
    if (window.ParticleEngine) {
      window.particleEngine = new window.ParticleEngine('particle-canvas');
    }

    // Initialize all chapter modules
    initChapter1();
    initChapter2();
    initChapter3();
    initChapter4();
    initChapter5();
    initChapter6();
    initChapter7();
    initChapter8();

    // Initialize Modal and Global Controls
    initModalEvents();
    initControls();

    // Start on Chapter 1 (index 0)
    goToChapter(0);

    console.log("💌 A Little Website About You initialized with love.");
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
