/**
 * ==============================================================================
 * 🏃‍♂️ 3D BOY LETTER RUNNER — THREE.JS CINEMATIC OPENING ENGINE
 * ==============================================================================
 * A fully self-contained, procedurally rigged 3D cartoon boy delivery scene.
 * Choreography:
 * 1. Approach: Boy runs from distant sunset horizon towards the screen.
 * 2. Offering: Stops close-up, catches breath, blushes, extends glowing letter.
 * 3. Drop: Hands slip! Letter flutters and falls forward onto the screen glass.
 * 4. Panic Run: Boy gets flustered, covers face, spins 180°, sprints away!
 * 5. Interactive Letter: Dropped letter hovers in foreground with 3D mouse parallax.
 * 6. Reveal: Clicking letter pops wax seal with confetti, unfolds into the website!
 * ==============================================================================
 */

(function () {
  'use strict';

  // Global controller instance
  window.Runner3D = {
    init: initRunner,
    replay: replayDelivery,
    skip: skipToWebsite,
    openLetter: openDroppedLetter,
    isActive: false
  };

  // State Machine Constants
  const STATE = {
    INACTIVE: 0,
    APPROACHING: 1,
    OFFERING: 2,
    DROPPING: 3,
    PANIC_RUN: 4,
    LETTER_IDLE: 5,
    OPENING: 6
  };

  let currentState = STATE.INACTIVE;
  let scene, camera, renderer, clock;
  let canvas, overlay;
  let boy = null;
  let letter = null;
  let environment = null;
  let petals = null;
  let dustPool = [];
  let confettiPool = [];
  let animFrameId = null;
  let stateTime = 0;
  let footstepTimer = 0;
  let threeLoadAttempts = 0;

  // Interaction coordinates for 3D parallax
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let raycaster = null;
  let mouseVec = null;

  // Sound helper wrapper
  function playSfx(name) {
    if (!window.soundController) return;
    try {
      if (name === 'footstep' && typeof window.soundController.playRunnerFootstep === 'function') {
        window.soundController.playRunnerFootstep();
      } else if (name === 'gasp' && typeof window.soundController.playRunnerGasp === 'function') {
        window.soundController.playRunnerGasp();
      } else if (name === 'drop' && typeof window.soundController.playRunnerDrop === 'function') {
        window.soundController.playRunnerDrop();
      } else if (name === 'seal' && typeof window.soundController.playSealBreak === 'function') {
        window.soundController.playSealBreak();
      } else if (name === 'pop' && typeof window.soundController.playPop === 'function') {
        window.soundController.playPop();
      } else if (name === 'paper' && typeof window.soundController.playPaper === 'function') {
        window.soundController.playPaper();
      }
    } catch (e) {}
  }

  // DOM Elements cache
  const ui = {
    overlay: null,
    canvas: null,
    statusText: null,
    speechBubble: null,
    speechText: null,
    letterPrompt: null,
    btnSkip: null,
    btnReplay: null,
    btnOpenLetter: null,
    btnAudio: null,
    audioIcon: null
  };

  /**
   * Main Initialization
   */
  function initRunner() {
    overlay = document.getElementById('runner-3d-overlay');
    canvas = document.getElementById('runner-3d-canvas');
    if (!overlay || !canvas) return;

    // Cache UI elements
    ui.overlay = overlay;
    ui.canvas = canvas;
    ui.statusText = document.getElementById('runner-status-text');
    ui.speechBubble = document.getElementById('runner-speech-bubble');
    ui.speechText = document.getElementById('runner-speech-text');
    ui.letterPrompt = document.getElementById('runner-letter-prompt');
    ui.btnSkip = document.getElementById('btn-runner-skip');
    ui.btnReplay = document.getElementById('btn-runner-replay');
    ui.btnOpenLetter = document.getElementById('btn-open-dropped-letter');
    ui.btnAudio = document.getElementById('btn-runner-audio');
    ui.audioIcon = document.getElementById('runner-audio-icon');

    // Bind UI Buttons
    if (ui.btnSkip) ui.btnSkip.addEventListener('click', skipToWebsite);
    if (ui.btnReplay) ui.btnReplay.addEventListener('click', replayDelivery);
    if (ui.btnOpenLetter) ui.btnOpenLetter.addEventListener('click', openDroppedLetter);
    if (ui.btnAudio) {
      ui.btnAudio.addEventListener('click', () => {
        if (window.soundController) {
          const sfx = window.soundController.toggleSfx();
          if (ui.audioIcon) ui.audioIcon.textContent = sfx ? '🔔' : '🔕';
        }
      });
    }

    // Header replay button in main website
    const btnReplayNav = document.getElementById('btn-replay-boy');
    if (btnReplayNav) {
      btnReplayNav.addEventListener('click', () => {
        replayDelivery();
      });
    }

    // Check Three.js availability
    if (typeof THREE === 'undefined') {
      threeLoadAttempts++;
      if (threeLoadAttempts < 12) {
        setTimeout(initRunner, 250);
        return;
      } else {
        // Fallback: If offline or Three.js blocked, show dropped letter prompt directly
        activateOfflineFallback();
        return;
      }
    }

    // Initialize raycaster and vectors once Three is loaded
    raycaster = new THREE.Raycaster();
    mouseVec = new THREE.Vector2();

    // Setup Three.js WebGL Scene
    setupThree();
    setupEvents();

    // Start Animation Sequence
    startDeliverySequence();
  }

  /**
   * Offline / Low-End Fallback
   */
  function activateOfflineFallback() {
    Runner3D.isActive = true;
    if (ui.statusText) {
      ui.statusText.textContent = "A letter was dropped for you! 💌";
    }
    if (ui.letterPrompt) {
      ui.letterPrompt.style.display = 'block';
      setTimeout(() => {
        ui.letterPrompt.classList.add('active');
      }, 50);
    }
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.fillStyle = '#FED9E2';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = 'center';
        ctx.font = '64px sans-serif';
        ctx.fillText('🏃‍♂️💨 ➔ 💌 ➔ 🙈', canvas.width / 2, canvas.height / 2 - 40);
        ctx.font = '22px Outfit, sans-serif';
        ctx.fillStyle = '#433248';
        ctx.fillText("He dropped the letter and ran away!", canvas.width / 2, canvas.height / 2 + 20);
      }
    }
  }

  /**
   * Setup Three.js Renderer, Camera, Lights, and Environment
   */
  function setupThree() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xFFE3DC, 0.015);

    // Responsive Camera Setup
    const aspect = window.innerWidth / window.innerHeight;
    const fov = aspect < 1 ? 58 : 44;
    camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 160);
    camera.position.set(0, 1.7, 4.2);
    camera.lookAt(0, 1.25, 0);

    // WebGL Renderer
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    clock = new THREE.Clock();

    // Lights
    const hemiLight = new THREE.HemisphereLight(0xFFEBE0, 0x8C7896, 0.85);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xFFF2D9, 1.35);
    sunLight.position.set(-6, 14, 8);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 45;
    sunLight.shadow.camera.left = -6;
    sunLight.shadow.camera.right = 6;
    sunLight.shadow.camera.top = 6;
    sunLight.shadow.camera.bottom = -4;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Soft pink-lavender rim light
    const rimLight = new THREE.DirectionalLight(0xE6CCFF, 0.5);
    rimLight.position.set(6, 4, -10);
    scene.add(rimLight);

    // Build Scene Elements
    buildEnvironment();
    buildBoyCharacter();
    buildLetterObject();
    buildPetalParticles();
    buildDustParticles();
    buildConfettiParticles();

    Runner3D.isActive = true;
  }

  /**
   * Build Aesthetic Scenic Pathway, Lamp Posts, Grass, and Trees
   */
  function buildEnvironment() {
    environment = new THREE.Group();

    // Paved Pathway
    const pathGeo = new THREE.PlaneGeometry(3.6, 120, 1, 60);
    const pathMat = new THREE.MeshStandardMaterial({
      color: 0xF5E6DF,
      roughness: 0.85,
      metalness: 0.05
    });
    const pathMesh = new THREE.Mesh(pathGeo, pathMat);
    pathMesh.rotation.x = -Math.PI / 2;
    pathMesh.position.set(0, 0, -45);
    pathMesh.receiveShadow = true;
    environment.add(pathMesh);

    // Stone Curb borders
    const curbGeo = new THREE.BoxGeometry(0.25, 0.12, 120);
    const curbMat = new THREE.MeshStandardMaterial({ color: 0xDDC6BE, roughness: 0.9 });

    const leftCurb = new THREE.Mesh(curbGeo, curbMat);
    leftCurb.position.set(-1.9, 0.05, -45);
    leftCurb.receiveShadow = true;
    environment.add(leftCurb);

    const rightCurb = new THREE.Mesh(curbGeo, curbMat);
    rightCurb.position.set(1.9, 0.05, -45);
    rightCurb.receiveShadow = true;
    environment.add(rightCurb);

    // Grass Banks
    const grassGeo = new THREE.PlaneGeometry(35, 120);
    const grassMat = new THREE.MeshStandardMaterial({
      color: 0xB8E0B8,
      roughness: 0.95
    });

    const leftGrass = new THREE.Mesh(grassGeo, grassMat);
    leftGrass.rotation.x = -Math.PI / 2;
    leftGrass.position.set(-19.5, -0.01, -45);
    leftGrass.receiveShadow = true;
    environment.add(leftGrass);

    const rightGrass = new THREE.Mesh(grassGeo, grassMat);
    rightGrass.rotation.x = -Math.PI / 2;
    rightGrass.position.set(19.5, -0.01, -45);
    rightGrass.receiveShadow = true;
    environment.add(rightGrass);

    // Stylized Warm Lantern Lamp Posts along the avenue
    const lampZPositions = [-2, -14, -26, -38, -50, -62];
    const lampMat = new THREE.MeshStandardMaterial({ color: 0x4A3B4E, roughness: 0.6 });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xFFF2B2,
      emissive: 0xFFA502,
      emissiveIntensity: 0.8,
      roughness: 0.3
    });

    lampZPositions.forEach(z => {
      [-2.3, 2.3].forEach(x => {
        const lamp = new THREE.Group();
        lamp.position.set(x, 0, z);

        // Pole
        const poleGeo = new THREE.CylinderGeometry(0.06, 0.08, 3.2, 8);
        const pole = new THREE.Mesh(poleGeo, lampMat);
        pole.position.y = 1.6;
        pole.castShadow = true;
        lamp.add(pole);

        // Arm bracket pointing towards path
        const armGeo = new THREE.BoxGeometry(x < 0 ? 0.35 : -0.35, 0.05, 0.05);
        const arm = new THREE.Mesh(armGeo, lampMat);
        arm.position.set(x < 0 ? 0.15 : -0.15, 3.1, 0);
        lamp.add(arm);

        // Lantern head
        const lanternGeo = new THREE.CylinderGeometry(0.18, 0.12, 0.35, 6);
        const lantern = new THREE.Mesh(lanternGeo, glassMat);
        lantern.position.set(x < 0 ? 0.32 : -0.32, 2.9, 0);
        lamp.add(lantern);

        // Warm local point light
        const lampLight = new THREE.PointLight(0xFFD176, 0.8, 8, 2);
        lampLight.position.set(x < 0 ? 0.32 : -0.32, 2.9, 0);
        lamp.add(lampLight);

        environment.add(lamp);
      });
    });

    // Stylized Cherry Blossom Trees along the avenue
    const treeZPositions = [-6, -18, -30, -42, -54, -66];
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6E5042, roughness: 0.9 });
    const blossomColors = [0xFFB7CE, 0xFFCAD4, 0xF4AEC5, 0xFFCCD5];

    treeZPositions.forEach((z, i) => {
      [-5.2, 5.2].forEach(x => {
        const tree = new THREE.Group();
        tree.position.set(x + (Math.sin(z) * 0.4), 0, z);

        // Trunk
        const trunkGeo = new THREE.CylinderGeometry(0.2, 0.32, 3.5, 8);
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 1.75;
        trunk.castShadow = true;
        tree.add(trunk);

        // Foliage cloud clusters
        for (let j = 0; j < 4; j++) {
          const foliageColor = blossomColors[(i + j) % blossomColors.length];
          const folMat = new THREE.MeshStandardMaterial({
            color: foliageColor,
            roughness: 0.8
          });
          const folGeo = new THREE.SphereGeometry(1.0 + (j * 0.15), 8, 8);
          const folMesh = new THREE.Mesh(folGeo, folMat);
          folMesh.position.set(
            (Math.sin(j * 2) * 0.5),
            3.2 + (j * 0.4),
            (Math.cos(j * 2) * 0.5)
          );
          folMesh.castShadow = true;
          tree.add(folMesh);
        }

        environment.add(tree);
      });
    });

    scene.add(environment);
  }

  /**
   * Build Stylized Procedural 3D Cartoon Boy Character
   */
  function buildBoyCharacter() {
    const config = window.STORY_CONFIG?.runner3d?.boyOutfit || {};
    const hoodieCol = config.hoodieColor || '#E88BA6';
    const pantsCol = config.pantsColor || '#433248';
    const shoesCol = config.shoesColor || '#FFFFFF';
    const hairCol = config.hairColor || '#3D2B1F';
    const capCol = config.capColor || '#7B61FF';
    const skinCol = '#FFDFC4';

    // Materials
    const skinMat = new THREE.MeshStandardMaterial({ color: skinCol, roughness: 0.65 });
    const hairMat = new THREE.MeshStandardMaterial({ color: hairCol, roughness: 0.7 });
    const capMat = new THREE.MeshStandardMaterial({ color: capCol, roughness: 0.6 });
    const hoodieMat = new THREE.MeshStandardMaterial({ color: hoodieCol, roughness: 0.6 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: pantsCol, roughness: 0.7 });
    const shoesMat = new THREE.MeshStandardMaterial({ color: shoesCol, roughness: 0.4 });
    const shoesAccentMat = new THREE.MeshStandardMaterial({ color: hoodieCol, roughness: 0.4 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x1E242B, roughness: 0.2 });
    const whiteMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const blushMat = new THREE.MeshBasicMaterial({ color: 0xFF6B8B, transparent: true, opacity: 0.7 });

    // Root Group
    const root = new THREE.Group();
    root.position.set(0, 0, -55);

    // Soft Shadow Blob under character
    const shadowGeo = new THREE.CircleGeometry(0.55, 20);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x302028,
      transparent: true,
      opacity: 0.35
    });
    const shadowBlob = new THREE.Mesh(shadowGeo, shadowMat);
    shadowBlob.rotation.x = -Math.PI / 2;
    shadowBlob.position.y = 0.02;
    root.add(shadowBlob);

    // Hips / Pelvis
    const hips = new THREE.Group();
    hips.position.y = 1.05;
    root.add(hips);

    // Pelvis Mesh
    const pelvisGeo = new THREE.CylinderGeometry(0.24, 0.22, 0.22, 10);
    const pelvisMesh = new THREE.Mesh(pelvisGeo, pantsMat);
    pelvisMesh.castShadow = true;
    hips.add(pelvisMesh);

    // Torso (Hoodie)
    const torso = new THREE.Group();
    torso.position.y = 0.15;
    hips.add(torso);

    const torsoGeo = new THREE.CylinderGeometry(0.3, 0.26, 0.62, 12);
    const torsoMesh = new THREE.Mesh(torsoGeo, hoodieMat);
    torsoMesh.position.y = 0.28;
    torsoMesh.castShadow = true;
    torso.add(torsoMesh);

    // Kangaroo Pouch Pocket
    const pocketGeo = new THREE.BoxGeometry(0.34, 0.18, 0.12);
    const pocketMesh = new THREE.Mesh(pocketGeo, hoodieMat);
    pocketMesh.position.set(0, 0.22, 0.18);
    torso.add(pocketMesh);

    // Hoodie Cords
    const cordGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.28, 6);
    const cordMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const leftCord = new THREE.Mesh(cordGeo, cordMat);
    leftCord.position.set(-0.08, 0.36, 0.24);
    torso.add(leftCord);

    const rightCord = new THREE.Mesh(cordGeo, cordMat);
    rightCord.position.set(0.08, 0.36, 0.24);
    torso.add(rightCord);

    // Hood Folded on Back
    const hoodGeo = new THREE.TorusGeometry(0.2, 0.08, 8, 12, Math.PI);
    const hoodMesh = new THREE.Mesh(hoodGeo, hoodieMat);
    hoodMesh.rotation.x = Math.PI / 1.6;
    hoodMesh.position.set(0, 0.52, -0.16);
    torso.add(hoodMesh);

    // Neck & Head Group
    const neck = new THREE.Group();
    neck.position.y = 0.6;
    torso.add(neck);

    const headGroup = new THREE.Group();
    headGroup.position.y = 0.35;
    neck.add(headGroup);

    // Head Sphere (Cute Chibi Proportions)
    const headGeo = new THREE.SphereGeometry(0.38, 20, 20);
    headGeo.scale(1, 1.06, 0.98);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Stylized Anime Cap (Backwards or Streetwear tilt)
    const capDomeGeo = new THREE.SphereGeometry(0.395, 18, 18, 0, Math.PI * 2, 0, Math.PI / 1.7);
    const capDome = new THREE.Mesh(capDomeGeo, capMat);
    capDome.position.set(0, 0.04, -0.02);
    capDome.rotation.x = -0.2;
    headGroup.add(capDome);

    // Cap Brim / Visor
    const brimGeo = new THREE.BoxGeometry(0.36, 0.04, 0.32);
    const brimMesh = new THREE.Mesh(brimGeo, capMat);
    brimMesh.position.set(0, 0.12, -0.42);
    brimMesh.rotation.x = 0.25;
    headGroup.add(brimMesh);

    // Anime Hair Tufts under cap
    const tuftMat = hairMat;
    for (let t = -2; t <= 2; t++) {
      const tuftGeo = new THREE.ConeGeometry(0.07, 0.2, 6);
      const tuft = new THREE.Mesh(tuftGeo, tuftMat);
      tuft.position.set(t * 0.1, 0.15 - Math.abs(t) * 0.04, 0.33);
      tuft.rotation.x = -0.45;
      tuft.rotation.z = -t * 0.18;
      headGroup.add(tuft);
    }

    // Sideburns
    [-0.34, 0.34].forEach(x => {
      const sbGeo = new THREE.BoxGeometry(0.06, 0.18, 0.1);
      const sb = new THREE.Mesh(sbGeo, tuftMat);
      sb.position.set(x, 0.02, 0.08);
      headGroup.add(sb);
    });

    // Eyes (Big expressive anime eyes with dual catchlights)
    const eyeGroup = new THREE.Group();
    headGroup.add(eyeGroup);

    const eyeGeo = new THREE.SphereGeometry(0.075, 14, 14);
    eyeGeo.scale(0.85, 1.15, 0.4);

    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.14, 0.04, 0.35);
    eyeGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.14, 0.04, 0.35);
    eyeGroup.add(rightEye);

    // Eye Catchlight Sparkles (Pixar/Anime reflections)
    const catchGeo = new THREE.SphereGeometry(0.022, 8, 8);
    const leftCatch = new THREE.Mesh(catchGeo, whiteMat);
    leftCatch.position.set(-0.125, 0.065, 0.375);
    eyeGroup.add(leftCatch);

    const rightCatch = new THREE.Mesh(catchGeo, whiteMat);
    rightCatch.position.set(0.155, 0.065, 0.375);
    eyeGroup.add(rightCatch);

    // Blush Cheeks (Pulse & scale up when embarrassed!)
    const blushGeo = new THREE.CircleGeometry(0.07, 12);
    const leftBlush = new THREE.Mesh(blushGeo, blushMat);
    leftBlush.position.set(-0.21, -0.06, 0.33);
    leftBlush.rotation.y = -0.3;
    headGroup.add(leftBlush);

    const rightBlush = new THREE.Mesh(blushGeo, blushMat);
    rightBlush.position.set(0.21, -0.06, 0.33);
    rightBlush.rotation.y = 0.3;
    headGroup.add(rightBlush);

    // Animated Mouth (Smile / Shocked "O" gasp)
    const mouthGroup = new THREE.Group();
    mouthGroup.position.set(0, -0.15, 0.35);
    headGroup.add(mouthGroup);

    // Smile Mesh (curved thin cylinder)
    const smileGeo = new THREE.TorusGeometry(0.05, 0.015, 8, 12, Math.PI);
    const smileMesh = new THREE.Mesh(smileGeo, eyeMat);
    smileMesh.rotation.z = Math.PI;
    mouthGroup.add(smileMesh);

    // Gasp "O" Mesh (hidden by default)
    const gaspGeo = new THREE.TorusGeometry(0.04, 0.02, 8, 14);
    const gaspMesh = new THREE.Mesh(gaspGeo, eyeMat);
    gaspMesh.visible = false;
    mouthGroup.add(gaspMesh);

    // Left Arm Hierarchy
    const leftShoulder = new THREE.Group();
    leftShoulder.position.set(-0.35, 0.46, 0);
    torso.add(leftShoulder);

    const leftUpperArmGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.32, 10);
    const leftUpperArm = new THREE.Mesh(leftUpperArmGeo, hoodieMat);
    leftUpperArm.position.y = -0.16;
    leftUpperArm.castShadow = true;
    leftShoulder.add(leftUpperArm);

    const leftElbow = new THREE.Group();
    leftElbow.position.y = -0.32;
    leftShoulder.add(leftElbow);

    const leftForearmGeo = new THREE.CylinderGeometry(0.07, 0.065, 0.28, 10);
    const leftForearm = new THREE.Mesh(leftForearmGeo, hoodieMat);
    leftForearm.position.y = -0.14;
    leftForearm.castShadow = true;
    leftElbow.add(leftForearm);

    const leftHandGeo = new THREE.SphereGeometry(0.075, 10, 10);
    const leftHand = new THREE.Mesh(leftHandGeo, skinMat);
    leftHand.position.y = -0.3;
    leftHand.castShadow = true;
    leftElbow.add(leftHand);

    // Right Arm Hierarchy
    const rightShoulder = new THREE.Group();
    rightShoulder.position.set(0.35, 0.46, 0);
    torso.add(rightShoulder);

    const rightUpperArmGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.32, 10);
    const rightUpperArm = new THREE.Mesh(rightUpperArmGeo, hoodieMat);
    rightUpperArm.position.y = -0.16;
    rightUpperArm.castShadow = true;
    rightShoulder.add(rightUpperArm);

    const rightElbow = new THREE.Group();
    rightElbow.position.y = -0.32;
    rightShoulder.add(rightElbow);

    const rightForearmGeo = new THREE.CylinderGeometry(0.07, 0.065, 0.28, 10);
    const rightForearm = new THREE.Mesh(rightForearmGeo, hoodieMat);
    rightForearm.position.y = -0.14;
    rightForearm.castShadow = true;
    rightElbow.add(rightForearm);

    const rightHandGeo = new THREE.SphereGeometry(0.075, 10, 10);
    const rightHand = new THREE.Mesh(rightHandGeo, skinMat);
    rightHand.position.y = -0.3;
    rightHand.castShadow = true;
    rightElbow.add(rightHand);

    // Left Leg Hierarchy
    const leftHip = new THREE.Group();
    leftHip.position.set(-0.16, -0.1, 0);
    hips.add(leftHip);

    const thighGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.38, 10);
    const leftThigh = new THREE.Mesh(thighGeo, pantsMat);
    leftThigh.position.y = -0.19;
    leftThigh.castShadow = true;
    leftHip.add(leftThigh);

    const leftKnee = new THREE.Group();
    leftKnee.position.y = -0.38;
    leftHip.add(leftKnee);

    const shinGeo = new THREE.CylinderGeometry(0.09, 0.075, 0.38, 10);
    const leftShin = new THREE.Mesh(shinGeo, pantsMat);
    leftShin.position.y = -0.19;
    leftShin.castShadow = true;
    leftKnee.add(leftShin);

    // Left Chunky Sneaker
    const leftShoe = buildSneaker(shoesMat, shoesAccentMat);
    leftShoe.position.set(0, -0.38, 0.06);
    leftKnee.add(leftShoe);

    // Right Leg Hierarchy
    const rightHip = new THREE.Group();
    rightHip.position.set(0.16, -0.1, 0);
    hips.add(rightHip);

    const rightThigh = new THREE.Mesh(thighGeo, pantsMat);
    rightThigh.position.y = -0.19;
    rightThigh.castShadow = true;
    rightHip.add(rightThigh);

    const rightKnee = new THREE.Group();
    rightKnee.position.y = -0.38;
    rightHip.add(rightKnee);

    const rightShin = new THREE.Mesh(shinGeo, pantsMat);
    rightShin.position.y = -0.19;
    rightShin.castShadow = true;
    rightKnee.add(rightShin);

    // Right Chunky Sneaker
    const rightShoe = buildSneaker(shoesMat, shoesAccentMat);
    rightShoe.position.set(0, -0.38, 0.06);
    rightKnee.add(rightShoe);

    scene.add(root);

    // Expose Rig References
    boy = {
      root,
      hips,
      torso,
      neck,
      headGroup,
      eyeGroup,
      leftBlush,
      rightBlush,
      smileMesh,
      gaspMesh,
      leftShoulder,
      leftElbow,
      leftHand,
      rightShoulder,
      rightElbow,
      rightHand,
      leftHip,
      leftKnee,
      leftShoe,
      rightHip,
      rightKnee,
      rightShoe,
      shadowBlob,
      initialZ: -55,
      targetCloseZ: -3.6,
      escapeZ: -65
    };
  }

  /**
   * Helper: Build Chunky Modern Sneaker
   */
  function buildSneaker(mainMat, accentMat) {
    const shoe = new THREE.Group();

    // Thick Rubber Sole
    const soleGeo = new THREE.BoxGeometry(0.18, 0.08, 0.38);
    const soleMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.5 });
    const sole = new THREE.Mesh(soleGeo, soleMat);
    sole.position.y = 0.04;
    sole.castShadow = true;
    shoe.add(sole);

    // Upper
    const upperGeo = new THREE.BoxGeometry(0.17, 0.12, 0.34);
    const upper = new THREE.Mesh(upperGeo, mainMat);
    upper.position.set(0, 0.12, -0.02);
    upper.castShadow = true;
    shoe.add(upper);

    // Accent Stripe
    const stripeGeo = new THREE.BoxGeometry(0.18, 0.04, 0.14);
    const stripe = new THREE.Mesh(stripeGeo, accentMat);
    stripe.position.set(0, 0.11, -0.02);
    shoe.add(stripe);

    return shoe;
  }

  /**
   * Build the Folded 3D Letter Envelope with Wax Seal
   */
  function buildLetterObject() {
    const letterGroup = new THREE.Group();

    // Envelope Body
    const envWidth = 0.65;
    const envHeight = 0.44;
    const envGeo = new THREE.BoxGeometry(envWidth, envHeight, 0.025);
    const envMat = new THREE.MeshStandardMaterial({
      color: 0xFFFDF8,
      roughness: 0.55
    });
    const envMesh = new THREE.Mesh(envGeo, envMat);
    envMesh.castShadow = true;
    letterGroup.add(envMesh);

    // Flap
    const flapGeo = new THREE.ConeGeometry(envWidth * 0.48, 0.22, 3);
    const flapMat = new THREE.MeshStandardMaterial({
      color: 0xF7EFE6,
      roughness: 0.6
    });
    const flapMesh = new THREE.Mesh(flapGeo, flapMat);
    flapMesh.rotation.z = Math.PI;
    flapMesh.position.set(0, 0.1, 0.015);
    letterGroup.add(flapMesh);

    // Wax Seal Disc (Rich red seal)
    const sealGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.02, 16);
    const sealMat = new THREE.MeshStandardMaterial({
      color: 0xD63031,
      roughness: 0.35,
      metalness: 0.1
    });
    const sealMesh = new THREE.Mesh(sealGeo, sealMat);
    sealMesh.rotation.x = Math.PI / 2;
    sealMesh.position.set(0, 0, 0.025);
    letterGroup.add(sealMesh);

    // Heart Emblem on Wax Seal
    const heartShape = new THREE.Shape();
    const x = -0.025, y = -0.025;
    heartShape.moveTo(x + 0.025, y + 0.025);
    heartShape.bezierCurveTo(x + 0.025, y + 0.025, x + 0.02, y, x, y);
    heartShape.bezierCurveTo(x - 0.03, y, x - 0.03, y + 0.035, x - 0.03, y + 0.035);
    heartShape.bezierCurveTo(x - 0.03, y + 0.055, x - 0.01, y + 0.077, x + 0.025, y + 0.1);
    heartShape.bezierCurveTo(x + 0.06, y + 0.077, x + 0.08, y + 0.055, x + 0.08, y + 0.035);
    heartShape.bezierCurveTo(x + 0.08, y + 0.035, x + 0.08, y, x + 0.05, y);
    heartShape.bezierCurveTo(x + 0.035, y, x + 0.025, y + 0.025, x + 0.025, y + 0.025);

    const extrudeSettings = { depth: 0.008, bevelEnabled: false };
    const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    const heartMat = new THREE.MeshStandardMaterial({ color: 0xFF7675, roughness: 0.3 });
    const heartMesh = new THREE.Mesh(heartGeo, heartMat);
    heartMesh.scale.set(0.35, 0.35, 0.35);
    heartMesh.rotation.z = Math.PI;
    heartMesh.position.set(0.008, 0.015, 0.035);
    letterGroup.add(heartMesh);

    // Pulsing Halo Glow around the letter
    const haloGeo = new THREE.PlaneGeometry(0.85, 0.6);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xFFE082,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.position.z = -0.01;
    letterGroup.add(haloMesh);

    // Inner letter parchment that slides out when opened
    const paperGeo = new THREE.PlaneGeometry(0.58, 0.75);
    const paperMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.5,
      side: THREE.DoubleSide
    });
    const paperMesh = new THREE.Mesh(paperGeo, paperMat);
    paperMesh.position.set(0, 0, 0.005);
    paperMesh.visible = false;
    letterGroup.add(paperMesh);

    scene.add(letterGroup);

    letter = {
      group: letterGroup,
      flap: flapMesh,
      seal: sealMesh,
      heart: heartMesh,
      halo: haloMesh,
      paper: paperMesh,
      velocity: new THREE.Vector3(),
      targetGroundY: -0.65,
      targetZ: 1.25,
      isGrounded: false,
      bounceT: 0
    };
  }

  /**
   * Floating Cherry Blossom Petals System
   */
  function buildPetalParticles() {
    const count = 75;
    const group = new THREE.Group();
    const petalGeo = new THREE.PlaneGeometry(0.09, 0.13);
    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xFFB7C5,
      roughness: 0.6,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });

    const petalList = [];

    for (let i = 0; i < count; i++) {
      const p = new THREE.Mesh(petalGeo, petalMat);
      p.position.set(
        (Math.random() - 0.5) * 16,
        Math.random() * 6 + 0.5,
        -Math.random() * 60 + 5
      );
      p.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      group.add(p);

      petalList.push({
        mesh: p,
        speedY: 0.008 + Math.random() * 0.012,
        speedX: (Math.random() - 0.5) * 0.008,
        rotSpeedX: (Math.random() - 0.5) * 0.03,
        rotSpeedY: (Math.random() - 0.5) * 0.03
      });
    }

    scene.add(group);
    petals = petalList;
  }

  /**
   * Footstep Dust Cloud Particle System
   */
  function buildDustParticles() {
    const count = 24;
    const dustMat = new THREE.MeshBasicMaterial({
      color: 0xFFEBE6,
      transparent: true,
      opacity: 0
    });
    const dustGeo = new THREE.SphereGeometry(0.08, 6, 6);

    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(dustGeo, dustMat.clone());
      mesh.visible = false;
      scene.add(mesh);
      dustPool.push({
        mesh,
        life: 0,
        maxLife: 0.6,
        vel: new THREE.Vector3()
      });
    }
  }

  function spawnDust(x, y, z) {
    const p = dustPool.find(d => d.life <= 0);
    if (!p) return;
    p.mesh.position.set(x, y + 0.05, z);
    p.mesh.scale.set(1, 1, 1);
    p.mesh.material.opacity = 0.55;
    p.mesh.visible = true;
    p.vel.set(
      (Math.random() - 0.5) * 0.05,
      0.03 + Math.random() * 0.04,
      0.02 + Math.random() * 0.04
    );
    p.life = p.maxLife;
  }

  /**
   * Wax Seal Snap Heart Confetti Burst System
   */
  function buildConfettiParticles() {
    const count = 35;
    const colors = [0xFF758F, 0xFFB3C1, 0xFF4D6D, 0xFFD166, 0xC77DFF];

    for (let i = 0; i < count; i++) {
      const geo = new THREE.PlaneGeometry(0.06, 0.06);
      const mat = new THREE.MeshBasicMaterial({
        color: colors[i % colors.length],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.visible = false;
      scene.add(mesh);
      confettiPool.push({
        mesh,
        life: 0,
        maxLife: 1.2,
        vel: new THREE.Vector3(),
        rotVel: new THREE.Vector3()
      });
    }
  }

  function triggerConfettiBurst(origin) {
    confettiPool.forEach(c => {
      c.mesh.position.copy(origin);
      c.mesh.visible = true;
      c.mesh.material.opacity = 1;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.06 + Math.random() * 0.08;
      c.vel.set(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed + 0.04,
        (Math.random() - 0.5) * 0.04
      );
      c.rotVel.set(
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2
      );
      c.life = c.maxLife;
    });
  }

  /**
   * Cinematic Sequence Director & State Transitions
   */
  function startDeliverySequence() {
    currentState = STATE.APPROACHING;
    stateTime = 0;
    footstepTimer = 0;

    // Reset positions
    boy.root.position.set(0, 0, boy.initialZ);
    boy.root.rotation.y = 0;
    boy.eyeGroup.scale.set(1, 1, 1);
    boy.smileMesh.visible = true;
    boy.gaspMesh.visible = false;
    boy.leftBlush.material.opacity = 0.6;
    boy.rightBlush.material.opacity = 0.6;
    boy.leftBlush.scale.set(1, 1, 1);
    boy.rightBlush.scale.set(1, 1, 1);

    // Reset letter attached to boy's chest
    letter.isGrounded = false;
    letter.bounceT = 0;
    letter.group.position.set(0, 1.45, boy.initialZ + 0.35);
    letter.group.rotation.set(-0.35, 0, 0);
    letter.paper.visible = false;
    letter.flap.rotation.x = 0;
    letter.seal.visible = true;
    letter.heart.visible = true;

    // UI Updates
    if (ui.canvas) ui.canvas.classList.remove('clickable-letter');
    if (ui.letterPrompt) ui.letterPrompt.classList.remove('active');
    if (ui.letterPrompt) ui.letterPrompt.style.display = 'none';
    if (ui.speechBubble) {
      ui.speechBubble.classList.remove('active');
      ui.speechBubble.style.display = 'none';
    }
    if (ui.statusText) {
      ui.statusText.textContent = "Someone is running towards you... 🏃‍♂️💨";
    }

    // Start render loop
    if (!animFrameId) {
      clock.start();
      animate();
    }
  }

  /**
   * Main Animation Loop
   */
  function animate() {
    animFrameId = requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.1);
    stateTime += delta;

    // Update Mouse Parallax Smoothing
    mouse.x += (mouse.targetX - mouse.x) * 0.08;
    mouse.y += (mouse.targetY - mouse.y) * 0.08;

    // Camera Handheld Breathing / Dynamic Tilt
    camera.position.x = mouse.x * 0.2;
    camera.position.y = 1.7 + mouse.y * 0.15;
    camera.lookAt(0, 1.25, 0);

    // Update Ambient Blossom Petals
    updatePetals();

    // Update Dust Puffs
    updateDust(delta);

    // Update Confetti
    updateConfetti(delta);

    // State Machine Execution
    switch (currentState) {
      case STATE.APPROACHING:
        handleApproaching(delta);
        break;
      case STATE.OFFERING:
        handleOffering(delta);
        break;
      case STATE.DROPPING:
        handleDropping(delta);
        break;
      case STATE.PANIC_RUN:
        handlePanicRun(delta);
        break;
      case STATE.LETTER_IDLE:
        handleLetterIdle(delta);
        break;
      case STATE.OPENING:
        handleOpening(delta);
        break;
    }

    // Render Scene
    renderer.render(scene, camera);
  }

  /**
   * State 1: Approaching (Running towards screen)
   */
  function handleApproaching(delta) {
    const runSpeed = 11.5;
    boy.root.position.z += runSpeed * delta;

    // Footstep stride animation
    const strideFreq = 14;
    const stride = stateTime * strideFreq;

    // Legs running cycle
    boy.leftHip.rotation.x = Math.sin(stride) * 0.75;
    boy.leftKnee.rotation.x = Math.max(0, -Math.sin(stride + 0.5) * 1.15);

    boy.rightHip.rotation.x = -Math.sin(stride) * 0.75;
    boy.rightKnee.rotation.x = Math.max(0, Math.sin(stride - 0.5) * 1.15);

    // Hips vertical bounce and sway
    boy.hips.position.y = 1.05 + Math.abs(Math.sin(stride)) * 0.12;
    boy.torso.rotation.z = Math.sin(stride * 0.5) * 0.06;
    boy.torso.rotation.y = Math.sin(stride * 0.5) * 0.08;

    // Arms clutching the letter tightly
    boy.leftShoulder.rotation.x = -0.7 + Math.sin(stride) * 0.2;
    boy.leftElbow.rotation.x = -0.8;
    boy.rightShoulder.rotation.x = -0.7 - Math.sin(stride) * 0.2;
    boy.rightElbow.rotation.x = -0.8;

    // Letter follows chest
    letter.group.position.set(
      boy.root.position.x,
      boy.root.position.y + boy.hips.position.y + 0.35 + Math.abs(Math.sin(stride)) * 0.08,
      boy.root.position.z + 0.42
    );
    letter.group.rotation.set(-0.35, boy.torso.rotation.y, boy.torso.rotation.z);

    // Footstep Audio & Dust Emission
    footstepTimer += delta;
    if (footstepTimer > 0.22) {
      footstepTimer = 0;
      playSfx('footstep');
      const footX = Math.sin(stride) > 0 ? -0.16 : 0.16;
      spawnDust(boy.root.position.x + footX, 0, boy.root.position.z);
    }

    // Transition condition: Boy arrives close-up
    if (boy.root.position.z >= boy.targetCloseZ) {
      boy.root.position.z = boy.targetCloseZ;
      playSfx('pop');
      spawnDust(boy.root.position.x - 0.2, 0, boy.root.position.z + 0.2);
      spawnDust(boy.root.position.x + 0.2, 0, boy.root.position.z + 0.2);
      transitionToOffering();
    }
  }

  /**
   * Transition to State 2: Offering the Letter
   */
  function transitionToOffering() {
    currentState = STATE.OFFERING;
    stateTime = 0;

    // Stop legs
    boy.leftHip.rotation.x = 0;
    boy.leftKnee.rotation.x = 0;
    boy.rightHip.rotation.x = 0;
    boy.rightKnee.rotation.x = 0;
    boy.hips.position.y = 1.05;
    boy.torso.rotation.set(0, 0, 0);

    // Update Status
    if (ui.statusText) {
      ui.statusText.textContent = "He has something for you! 💌";
    }

    // Show Comic Speech Bubble
    const speechText = window.STORY_CONFIG?.runner3d?.speechApproach || "H-hey! I have this for you...! 💌";
    showSpeechBubble(speechText);
  }

  /**
   * State 2: Offering (Catching breath & extending arms with letter)
   */
  function handleOffering(delta) {
    const t = Math.min(stateTime / 1.5, 1.0);
    const ease = 1 - Math.pow(1 - t, 3);

    // Boy catches breath (panting)
    const pant = Math.sin(stateTime * 5.5) * 0.04;
    boy.torso.position.y = 0.15 + pant;
    boy.headGroup.rotation.x = -0.12 + Math.sin(stateTime * 3) * 0.03;

    // Cheeks blush brightly
    const blushScale = 1.0 + ease * 0.45;
    boy.leftBlush.scale.set(blushScale, blushScale, 1);
    boy.rightBlush.scale.set(blushScale, blushScale, 1);
    boy.leftBlush.material.opacity = 0.6 + ease * 0.35;
    boy.rightBlush.material.opacity = 0.6 + ease * 0.35;

    // Arms extend forward presenting letter
    boy.leftShoulder.rotation.x = -0.7 - ease * 0.55;
    boy.leftElbow.rotation.x = -0.8 + ease * 0.55;
    boy.rightShoulder.rotation.x = -0.7 - ease * 0.55;
    boy.rightElbow.rotation.x = -0.8 + ease * 0.55;

    // Letter held forward in front of camera
    letter.group.position.set(
      boy.root.position.x,
      1.38 + ease * 0.08 + pant,
      boy.root.position.z + 0.42 + ease * 0.65
    );
    letter.group.rotation.set(-0.25 + ease * 0.15, 0, Math.sin(stateTime * 2) * 0.03);

    // Pulse halo glow on wax seal
    letter.halo.material.opacity = 0.35 + Math.sin(stateTime * 6) * 0.2;

    // Transition condition: Time to drop!
    if (stateTime > 2.2) {
      transitionToDropping();
    }
  }

  /**
   * Transition to State 3: Dropping (Nervous Slip & Gasp)
   */
  function transitionToDropping() {
    currentState = STATE.DROPPING;
    stateTime = 0;

    // Shy gasp sound!
    playSfx('gasp');

    // Boy's surprised expression!
    boy.eyeGroup.scale.set(1.4, 1.4, 1.4);
    boy.smileMesh.visible = false;
    boy.gaspMesh.visible = true;

    // Hands flinch back
    boy.leftShoulder.rotation.x = -0.4;
    boy.rightShoulder.rotation.x = -0.4;

    // Update Speech Bubble
    const speechText = window.STORY_CONFIG?.runner3d?.speechDrop || "Aahh!! Wait! Nooo! 😱";
    showSpeechBubble(speechText);

    if (ui.statusText) {
      ui.statusText.textContent = "Oops!! He dropped it! 😱";
    }

    // Set initial physics flight velocity for letter
    letter.velocity.set(
      (Math.random() - 0.5) * 0.02,
      0.035, // slight arc upwards
      0.085  // forward momentum towards screen
    );
  }

  /**
   * State 3: Dropping (Letter aerodynamic flutter & landing)
   */
  function handleDropping(delta) {
    if (!letter.isGrounded) {
      // Apply gravity and forward glide
      letter.velocity.y -= 0.095 * delta * 60;
      letter.group.position.add(letter.velocity);

      // Aerodynamic paper flutter rotation
      letter.group.rotation.x += Math.sin(stateTime * 14) * 0.08;
      letter.group.rotation.z += Math.cos(stateTime * 10) * 0.06;
      letter.group.rotation.y += 0.02;

      // Boy trembles in shock
      boy.headGroup.rotation.z = Math.sin(stateTime * 20) * 0.04;

      // Landing detection
      if (letter.group.position.y <= letter.targetGroundY || letter.group.position.z >= letter.targetZ) {
        letter.isGrounded = true;
        letter.group.position.y = letter.targetGroundY;
        letter.group.position.z = letter.targetZ;
        letter.group.rotation.set(-0.35, 0, 0);

        // Sound effect on landing!
        playSfx('drop');

        // Sparkle puff at landing
        spawnDust(letter.group.position.x, letter.targetGroundY, letter.targetZ);
      }
    } else {
      // Soft elastic landing bounce
      letter.bounceT += delta * 12;
      const bounce = Math.abs(Math.sin(letter.bounceT)) * Math.exp(-letter.bounceT * 0.6) * 0.12;
      letter.group.position.y = letter.targetGroundY + bounce;

      // Transition condition: Boy realizes and flees!
      if (stateTime > 1.2) {
        transitionToPanicRun();
      }
    }
  }

  /**
   * Transition to State 4: Panic Run (Embarrassed Escape)
   */
  function transitionToPanicRun() {
    currentState = STATE.PANIC_RUN;
    stateTime = 0;
    footstepTimer = 0;

    // Hands clutch blushing face in embarrassment
    boy.leftShoulder.rotation.set(-1.6, 0.4, 0.2);
    boy.leftElbow.rotation.set(-1.4, 0, 0);
    boy.rightShoulder.rotation.set(-1.6, -0.4, -0.2);
    boy.rightElbow.rotation.set(-1.4, 0, 0);

    // Cheeks super red
    boy.leftBlush.scale.set(1.6, 1.6, 1);
    boy.rightBlush.scale.set(1.6, 1.6, 1);

    // Update Speech Bubble
    const speechText = window.STORY_CONFIG?.runner3d?.speechRunAway || "I'm too embarrassed!! Bye! 🏃‍♂️💨";
    showSpeechBubble(speechText);

    if (ui.statusText) {
      ui.statusText.textContent = "He's running away in embarrassment! 🏃‍♂️💨";
    }
  }

  /**
   * State 4: Panic Run (Comical double-speed sprint away)
   */
  function handlePanicRun(delta) {
    // Spin 180 degrees quickly
    if (boy.root.rotation.y < Math.PI) {
      boy.root.rotation.y = Math.min(boy.root.rotation.y + delta * 12, Math.PI);
    }

    // Sprint backwards into distance at comical high speed
    const sprintSpeed = 16.5;
    boy.root.position.z -= sprintSpeed * delta;

    // Fast comical cartoon sprint stride
    const strideFreq = 22;
    const stride = stateTime * strideFreq;

    boy.leftHip.rotation.x = Math.sin(stride) * 0.9;
    boy.leftKnee.rotation.x = Math.max(0, -Math.sin(stride + 0.5) * 1.3);
    boy.rightHip.rotation.x = -Math.sin(stride) * 0.9;
    boy.rightKnee.rotation.x = Math.max(0, Math.sin(stride - 0.5) * 1.3);

    boy.hips.position.y = 1.05 + Math.abs(Math.sin(stride)) * 0.16;

    // Dust trail behind fleeing boy
    footstepTimer += delta;
    if (footstepTimer > 0.14) {
      footstepTimer = 0;
      playSfx('footstep');
      spawnDust(boy.root.position.x, 0, boy.root.position.z);
    }

    // Dropped letter stays hovering gently in foreground
    letter.group.position.y = letter.targetGroundY + Math.sin(stateTime * 2.5) * 0.02;

    // Hide speech bubble as he gets far
    if (boy.root.position.z < -14 && ui.speechBubble) {
      ui.speechBubble.classList.remove('active');
    }

    // Transition condition: Boy has disappeared over horizon
    if (boy.root.position.z <= boy.escapeZ) {
      transitionToLetterIdle();
    }
  }

  /**
   * Transition to State 5: Dropped Letter Idle (Interactive Prompt)
   */
  function transitionToLetterIdle() {
    currentState = STATE.LETTER_IDLE;
    stateTime = 0;

    // Hide boy completely
    boy.root.visible = false;

    // Enable cursor pointer on canvas for letter interaction
    if (ui.canvas) ui.canvas.classList.add('clickable-letter');

    // Update Status
    if (ui.statusText) {
      ui.statusText.textContent = "The letter is waiting for you... ✨";
    }

    // Show Dropped Letter Interactive Prompt Card
    if (ui.letterPrompt) {
      ui.letterPrompt.style.display = 'block';
      setTimeout(() => {
        ui.letterPrompt.classList.add('active');
      }, 50);
    }
  }

  /**
   * State 5: Dropped Letter Idle (3D Parallax & Gentle Breathing)
   */
  function handleLetterIdle(delta) {
    // Floating breathing bob
    const bob = Math.sin(stateTime * 2.5) * 0.04;
    letter.group.position.y = letter.targetGroundY + bob;

    // 3D Parallax Tilt towards mouse cursor / touch
    const targetRotX = -0.32 - mouse.y * 0.35;
    const targetRotY = mouse.x * 0.45;
    const targetRotZ = -mouse.x * 0.15;

    letter.group.rotation.x += (targetRotX - letter.group.rotation.x) * 0.1;
    letter.group.rotation.y += (targetRotY - letter.group.rotation.y) * 0.1;
    letter.group.rotation.z += (targetRotZ - letter.group.rotation.z) * 0.1;

    // Pulsing halo aura
    letter.halo.material.opacity = 0.3 + Math.sin(stateTime * 4) * 0.2;
    letter.halo.scale.set(
      1.0 + Math.sin(stateTime * 4) * 0.08,
      1.0 + Math.sin(stateTime * 4) * 0.08,
      1.0
    );
  }

  /**
   * Open Dropped Letter Transition: Pop Wax Seal & Unfold
   */
  function openDroppedLetter() {
    if (currentState === STATE.OPENING) return;
    currentState = STATE.OPENING;
    stateTime = 0;

    // Sound effect: Wax seal snap & celebratory harp chime!
    playSfx('seal');

    // If 3D elements exist, trigger confetti and paper animation
    if (letter && letter.seal) {
      const sealWorldPos = new THREE.Vector3();
      letter.seal.getWorldPosition(sealWorldPos);
      triggerConfettiBurst(sealWorldPos);

      letter.seal.visible = false;
      letter.heart.visible = false;
      letter.paper.visible = true;
    }

    // Hide interactive prompt card
    if (ui.letterPrompt) {
      ui.letterPrompt.classList.remove('active');
      setTimeout(() => {
        ui.letterPrompt.style.display = 'none';
      }, 400);
    }

    // If running in offline fallback mode without 3D, finish directly
    if (typeof THREE === 'undefined' || !letter) {
      finishTransitionToSite();
    }
  }

  /**
   * State 6: Opening Animation (Flap opens, letter expands, transitions to site)
   */
  function handleOpening(delta) {
    const t = Math.min(stateTime / 1.6, 1.0);
    const ease = 1 - Math.pow(1 - t, 3);

    // Flap flips open 180 degrees
    if (letter && letter.flap) {
      letter.flap.rotation.x = ease * Math.PI;
      letter.group.position.y = letter.targetGroundY + ease * 0.75;
      letter.group.position.z = letter.targetZ + ease * 0.6;
      letter.group.rotation.set(-0.15 * (1 - ease), 0, 0);

      // Inner paper slides up out of envelope
      letter.paper.position.y = ease * 0.45;
      letter.paper.scale.set(1 + ease * 0.35, 1 + ease * 0.35, 1);
    }

    // Transition condition: Seamless fade to the main website
    if (stateTime > 1.8) {
      finishTransitionToSite();
    }
  }

  /**
   * Complete Transition to Main Website
   */
  function finishTransitionToSite() {
    if (!overlay) return;

    // Create a gentle flash transition overlay
    const flash = document.createElement('div');
    flash.className = 'runner-flash-overlay flashing';
    document.body.appendChild(flash);

    setTimeout(() => {
      // Hide the 3D overlay
      overlay.classList.add('hidden');
      Runner3D.isActive = false;

      // Start website background music if enabled in config
      if (window.soundController && window.STORY_CONFIG?.audio?.defaultMusicOn) {
        window.soundController.startMusic();
      }

      // If main app exists, ensure chapter 1 is active & progress updated
      if (window.app && typeof window.app.onLetterOpenedFromRunner === 'function') {
        window.app.onLetterOpenedFromRunner();
      }

      // Remove flash overlay
      setTimeout(() => {
        flash.style.opacity = '0';
        setTimeout(() => flash.remove(), 500);
      }, 350);
    }, 200);
  }

  /**
   * Skip Button Handler
   */
  function skipToWebsite() {
    playSfx('pop');
    if (overlay) {
      overlay.classList.add('hidden');
    }
    Runner3D.isActive = false;
    if (window.app && typeof window.app.onLetterOpenedFromRunner === 'function') {
      window.app.onLetterOpenedFromRunner();
    }
  }

  /**
   * Replay Delivery Animation
   */
  function replayDelivery() {
    playSfx('pop');
    if (!overlay) return;

    overlay.classList.remove('hidden');
    Runner3D.isActive = true;
    if (boy && boy.root) {
      boy.root.visible = true;
    }

    startDeliverySequence();
  }

  /**
   * Helper: Show Comic Speech Bubble positioned over boy's head
   */
  function showSpeechBubble(text) {
    if (!ui.speechBubble || !ui.speechText) return;
    ui.speechText.textContent = text;
    ui.speechBubble.style.display = 'block';

    updateSpeechBubblePosition();

    setTimeout(() => {
      ui.speechBubble.classList.add('active');
    }, 30);
  }

  function updateSpeechBubblePosition() {
    if (!ui.speechBubble || !boy || !camera) return;

    // Project boy's head world position to 2D screen coordinates
    const headWorldPos = new THREE.Vector3();
    boy.headGroup.getWorldPosition(headWorldPos);
    headWorldPos.y += 0.55;

    headWorldPos.project(camera);

    const x = (headWorldPos.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-(headWorldPos.y * 0.5) + 0.5) * window.innerHeight;

    ui.speechBubble.style.left = `${x}px`;
    ui.speechBubble.style.top = `${y}px`;
  }

  /**
   * Update Floating Cherry Blossom Petals
   */
  function updatePetals() {
    if (!petals) return;
    petals.forEach(p => {
      p.mesh.position.y -= p.speedY;
      p.mesh.position.x += p.speedX;
      p.mesh.rotation.x += p.rotSpeedX;
      p.mesh.rotation.y += p.rotSpeedY;

      // Loop back to top
      if (p.mesh.position.y < 0.05) {
        p.mesh.position.y = 5.5 + Math.random() * 2;
        p.mesh.position.x = (Math.random() - 0.5) * 16;
      }
    });
  }

  /**
   * Update Dust Particle Pool
   */
  function updateDust(delta) {
    dustPool.forEach(d => {
      if (d.life > 0) {
        d.life -= delta;
        d.mesh.position.add(d.vel);
        d.mesh.scale.multiplyScalar(1.035);
        d.mesh.material.opacity = (d.life / d.maxLife) * 0.5;
        if (d.life <= 0) {
          d.mesh.visible = false;
        }
      }
    });
  }

  /**
   * Update Confetti Particle Pool
   */
  function updateConfetti(delta) {
    confettiPool.forEach(c => {
      if (c.life > 0) {
        c.life -= delta;
        c.vel.y -= 0.08 * delta * 60; // gravity
        c.mesh.position.add(c.vel);
        c.mesh.rotation.x += c.rotVel.x;
        c.mesh.rotation.y += c.rotVel.y;
        c.mesh.material.opacity = Math.max(0, c.life / c.maxLife);
        if (c.life <= 0) {
          c.mesh.visible = false;
        }
      }
    });
  }

  /**
   * Event Listeners (Resize, Mouse Parallax, Raycast Clicks)
   */
  function setupEvents() {
    window.addEventListener('resize', onWindowResize);

    // Mouse move parallax
    window.addEventListener('mousemove', (e) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Touch move parallax for mobile
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        mouse.targetX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouse.targetY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    }, { passive: true });

    // Click on Canvas to trigger letter open when dropped
    if (canvas) {
      canvas.addEventListener('click', (e) => {
        if (currentState === STATE.LETTER_IDLE) {
          // Raycast test to see if letter was clicked
          if (raycaster && mouseVec && letter) {
            mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouseVec, camera);

            const intersects = raycaster.intersectObjects(letter.group.children, true);
            if (intersects.length > 0) {
              openDroppedLetter();
              return;
            }
          }
          // Also allow clicking anywhere near center in idle state
          openDroppedLetter();
        }
      });
    }

    // Keyboard support: Enter / Space to open letter or skip
    window.addEventListener('keydown', (e) => {
      if (!Runner3D.isActive) return;
      if (e.code === 'Space' || e.code === 'Enter') {
        if (currentState === STATE.LETTER_IDLE) {
          e.preventDefault();
          openDroppedLetter();
        }
      } else if (e.code === 'Escape') {
        skipToWebsite();
      }
    });
  }

  function onWindowResize() {
    if (!camera || !renderer) return;
    const aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;
    camera.fov = aspect < 1 ? 58 : 44;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (currentState === STATE.OFFERING || currentState === STATE.DROPPING) {
      updateSpeechBubblePosition();
    }
  }

  // Auto-init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRunner);
  } else {
    initRunner();
  }

})();
