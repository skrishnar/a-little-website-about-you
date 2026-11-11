/**
 * ==============================================================================
 * 📊 SECRET ANALYTICS TRACKER — OWNER-ONLY VISITOR PROGRESS TRACKER
 * ==============================================================================
 * Silently tracks:
 *   • Every chapter the visitor reaches (with timestamp)
 *   • Time spent on each chapter (seconds)
 *   • Furthest chapter reached
 *   • Session metadata (device type, browser, referrer, timezone)
 *
 * Data is sent to a Google Apps Script Web App → stored in YOUR Google Sheet.
 * Completely invisible to the visitor. Zero cookies, zero consent banners.
 *
 * SETUP: Replace TRACKER_ENDPOINT below with your Google Apps Script URL.
 *        See the setup guide at: /admin-setup.html
 * ==============================================================================
 */

(function () {
  'use strict';

  // ============================================================
  // 🔧 CONFIGURATION — Replace with your Apps Script URL after setup
  // ============================================================
  var TRACKER_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxmcGMoP6_JNt4XX1Nbb6WkPfNeqEB1Zi5NKf99S2qlo0NhOQpZedZX9opFcmOaa5KB/exec';

  // Chapter names matching the site's chapter order
  var CHAPTER_NAMES = [
    'Chapter 1 — Welcome & Envelope',
    'Chapter 2 — Digital Diary',
    'Chapter 3 — Milestone Timeline',
    'Chapter 4 — Favourite Things Map',
    'Chapter 5 — Little Quiz',
    'Chapter 6 — Things I Notice',
    'Chapter 7 — The Letter',
    'Chapter 8 — Their Turn / Ending'
  ];

  // ============================================================
  // SESSION STATE
  // ============================================================
  var session = {
    id: generateSessionId(),
    startTime: Date.now(),
    chapterEntryTime: Date.now(),
    currentChapter: -1,
    furthestChapter: -1,
    chapterLog: [],       // [{chapter, name, enteredAt, duration}]
    device: getDeviceInfo(),
    sent: false           // prevent duplicate sends on close
  };

  function generateSessionId() {
    return 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
  }

  function getDeviceInfo() {
    var ua = navigator.userAgent;
    var isMobile = /Mobi|Android|iPhone|iPad/i.test(ua);
    var browser = 'Unknown';
    if (/Chrome/i.test(ua) && !/Edge/i.test(ua)) browser = 'Chrome';
    else if (/Firefox/i.test(ua)) browser = 'Firefox';
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
    else if (/Edge/i.test(ua)) browser = 'Edge';
    return {
      type: isMobile ? 'Mobile' : 'Desktop',
      browser: browser,
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown',
      referrer: document.referrer || 'Direct',
      screenW: screen.width,
      screenH: screen.height
    };
  }

  // ============================================================
  // CHAPTER TRACKING
  // ============================================================
  function onChapterChange(chapterIndex) {
    var now = Date.now();

    // Log time spent on previous chapter
    if (session.currentChapter >= 0) {
      var duration = Math.round((now - session.chapterEntryTime) / 1000);
      var prev = session.chapterLog[session.chapterLog.length - 1];
      if (prev && prev.chapter === session.currentChapter) {
        prev.duration = duration;
      }
    }

    // Record new chapter
    session.currentChapter = chapterIndex;
    session.chapterEntryTime = now;

    if (chapterIndex > session.furthestChapter) {
      session.furthestChapter = chapterIndex;
    }

    var entry = {
      chapter: chapterIndex,
      name: CHAPTER_NAMES[chapterIndex] || ('Chapter ' + (chapterIndex + 1)),
      enteredAt: new Date(now).toISOString(),
      duration: null   // filled when they leave
    };
    session.chapterLog.push(entry);

    // Send a lightweight ping for this chapter visit
    ping({
      event: 'chapter_visit',
      sessionId: session.id,
      chapterIndex: chapterIndex,
      chapterName: entry.name,
      timestamp: entry.enteredAt,
      furthestSoFar: CHAPTER_NAMES[session.furthestChapter] || ''
    });
  }

  function onVideoIntroDone() {
    ping({
      event: 'video_intro_completed',
      sessionId: session.id,
      timestamp: new Date().toISOString()
    });
  }

  // ============================================================
  // FINAL SESSION SUMMARY (sent on page close / visibility change)
  // ============================================================
  function sendSessionSummary() {
    if (session.sent) return;
    session.sent = true;

    // Finalise duration for last chapter
    var now = Date.now();
    var last = session.chapterLog[session.chapterLog.length - 1];
    if (last && last.duration === null) {
      last.duration = Math.round((now - session.chapterEntryTime) / 1000);
    }

    var totalTime = Math.round((now - session.startTime) / 1000);

    ping({
      event: 'session_end',
      sessionId: session.id,
      totalTimeSeconds: totalTime,
      furthestChapter: session.furthestChapter,
      furthestChapterName: CHAPTER_NAMES[session.furthestChapter] || 'None',
      chaptersVisited: session.chapterLog.length,
      chapterJourney: session.chapterLog.map(function(c) {
        return c.name + (c.duration !== null ? ' (' + c.duration + 's)' : '');
      }).join(' → '),
      device: session.device.type,
      browser: session.device.browser,
      timezone: session.device.tz,
      referrer: session.device.referrer,
      screen: session.device.screenW + 'x' + session.device.screenH,
      timestamp: new Date().toISOString()
    });
  }

  // ============================================================
  // PING — sends data to Google Sheet via Apps Script
  // ============================================================
  function ping(payload) {
    if (!TRACKER_ENDPOINT || TRACKER_ENDPOINT === 'YOUR_APPS_SCRIPT_URL_HERE') return;

    var jsonStr = JSON.stringify(payload);

    // Use sendBeacon for session_end (guaranteed delivery on tab close)
    if (payload.event === 'session_end' && navigator.sendBeacon) {
      try {
        var blob = new Blob([jsonStr], { type: 'text/plain' });
        if (navigator.sendBeacon(TRACKER_ENDPOINT, blob)) {
          return;
        }
      } catch (e) {}
    }

    // Regular fetch (use mode: 'no-cors' & text/plain to avoid CORS preflight blocks)
    try {
      fetch(TRACKER_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: jsonStr,
        keepalive: true
      }).catch(function () {}); // silent fail
    } catch (e) {}
  }

  // ============================================================
  // HOOK INTO APP.JS chapter navigation
  // ============================================================
  function hookIntoApp() {
    // Wait for window.app to be defined (set by app.js)
    if (!window.app || !window.app.goToChapter) {
      setTimeout(hookIntoApp, 150);
      return;
    }

    // Wrap goToChapter to intercept chapter changes
    var originalGoToChapter = window.app.goToChapter;
    window.app.goToChapter = function (index) {
      onChapterChange(index);
      return originalGoToChapter.apply(this, arguments);
    };

    // Also hook into onVideoIntroDone
    var originalVideoIntroDone = window.app.onVideoIntroDone;
    window.app.onVideoIntroDone = function () {
      onVideoIntroDone();
      if (originalVideoIntroDone) return originalVideoIntroDone.apply(this, arguments);
    };
  }

  // ============================================================
  // PAGE VISIBILITY & UNLOAD EVENTS
  // ============================================================
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      sendSessionSummary();
    }
  });

  window.addEventListener('beforeunload', function () {
    sendSessionSummary();
  });

  // Also send summary after 30 minutes of inactivity (edge case)
  var inactivityTimer = null;
  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(sendSessionSummary, 30 * 60 * 1000);
  }
  document.addEventListener('mousemove', resetInactivityTimer, { passive: true });
  document.addEventListener('touchstart', resetInactivityTimer, { passive: true });
  document.addEventListener('keydown', resetInactivityTimer, { passive: true });
  resetInactivityTimer();

  // ============================================================
  // EXPOSE PUBLIC API
  // ============================================================
  window.SiteTracker = {
    onChapterChange: onChapterChange,
    onVideoIntroDone: onVideoIntroDone,
    getSession: function () { return session; }
  };

  // Start hooking after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hookIntoApp);
  } else {
    hookIntoApp();
  }

  // Log a session start ping (device info)
  setTimeout(function () {
    ping({
      event: 'session_start',
      sessionId: session.id,
      device: session.device.type,
      browser: session.device.browser,
      timezone: session.device.tz,
      referrer: session.device.referrer,
      screen: session.device.screenW + 'x' + session.device.screenH,
      timestamp: new Date(session.startTime).toISOString()
    });
  }, 500);

})();
