/**
 * ==============================================================================
 * 💌 A LITTLE WEBSITE ABOUT YOU — STORY CONFIGURATION
 * ==============================================================================
 * This is the ONLY file you need to edit to personalize the entire website!
 * Simply replace the text inside the quotes with your own memories, names,
 * and words.
 *
 * Clearly labeled placeholders look like: [CRUSH'S NAME], [MY NAME], etc.
 * Everything is fully customizable, safe, and stored strictly in your browser!
 * ==============================================================================
 */

const STORY_CONFIG = {
  // ---------------------------------------------------------------------------
  // 1. NAMES & DISPLAY SETTINGS
  // ---------------------------------------------------------------------------
  recipient: {
    name: "[CRUSH'S NAME]",           // e.g. "Sophia", "Maya", "Alex", "Sam"
    nickname: "[THEIR NICKNAME]",       // Optional cute nickname or leave same
  },
  sender: {
    name: "[MY NAME]",                 // e.g. "Lucas", "Jordan", "Chris"
    nickname: "[MY NICKNAME]",         // e.g. "Your favorite overthinker"
  },

  // ---------------------------------------------------------------------------
  // 2. CHAPTER 1: WELCOME SCREEN (A Tiny Surprise)
  // ---------------------------------------------------------------------------
  welcome: {
    badge: "A little secret just for you ✨",
    greeting: "Hi, {CRUSH_NAME} 🫣💗",
    subheading: "Okay... so I made a little something for you.",
    openButtonText: "Open it? 👀",
    unfoldedHeading: "First of all, congratulations!",
    unfoldedText: "You have officially been selected for a very unnecessary but surprisingly important little adventure. 😂💌",
    readyPrompt: "Ready to find out what this is about?",
    choiceA: {
      buttonText: "Okay, let's go! ✨",
      microMessage: "I love the enthusiasm! Buckle up, it's 100% wholesome and completely harmless. 🚀",
    },
    choiceB: {
      buttonText: "Wait, should I be concerned? 😂",
      microMessage: "Only concerned about how much effort I put into this. No actual hazards ahead, promise! 🙈",
    },
  },

  // ---------------------------------------------------------------------------
  // 3. CHAPTER 2: BEFORE WE BEGIN (A Tiny Introduction - Digital Diary)
  // ---------------------------------------------------------------------------
  intro: {
    heading: "Before you judge me, hear me out. 🙈",
    diaryDate: "A quiet evening · Sometime recently 🌙",
    lines: [
      "So... this isn't a school project.",
      "And no, I haven't suddenly become a web designer for no reason. 😂",
      "I just had something on my mind, and somehow making a tiny website about it seemed easier than saying it out loud.",
      "Anyway, this little corner of the internet is about you, me, and the little things that got us here.",
      "Don't worry. There's no exam at the end. Probably. 👀"
    ],
    stickers: [
      { emoji: "🧸", label: "Emotional support bear" },
      { emoji: "☕", label: "Caffeine fueled" },
      { emoji: "✨", label: "Zero regrets (mostly)" },
    ],
    nextButtonText: "Okay, now I'm curious... ✨",
  },

  // ---------------------------------------------------------------------------
  // 4. CHAPTER 3: THE BEGINNING (Milestone Timeline)
  // ---------------------------------------------------------------------------
  timeline: {
    heading: "Chapter 1: It Started Somewhere... 🌱",
    subtitle: "A few moments along the way that felt a little bigger than they seemed at the time. (Click any card to peek inside!)",
    milestones: [
      {
        id: "milestone-1",
        date: "[APPROXIMATE DATE / TIMEFRAME - e.g. September 2023]",
        title: "The First Hello 👋",
        shortSummary: "Every story starts somewhere. Ours started with [HOW WE FIRST MET OR TALKED].",
        fullStory: "Looking back, it's funny how a normal day turns into something memorable. We ended up talking about [FIRST TOPIC OR SITUATION], and even though it was brief, I remember walking away thinking you were someone genuinely fun to talk to.",
        thoughtAtTheTime: "“They're really cool. I hope we get to talk again.”",
        icon: "👋",
        photo: null, // Set to a file path like "assets/photos/photo1.jpg" if you have one!
        polaroidCaption: "Where it all kicked off 📸",
      },
      {
        id: "milestone-2",
        date: "[TIMEFRAME - e.g. A couple weeks later]",
        title: "The First Impression 👀",
        shortSummary: "My first impression of you was [MY FIRST IMPRESSION]. Little did I know...",
        fullStory: "Right away, I noticed your [A QUALITY YOU NOTICED, e.g. quick wit / warm smile / laugh / passion for books]. You had this way of making the atmosphere lighter without even trying.",
        thoughtAtTheTime: "“Okay, they have an infectious energy and I definitely need to pay attention.”",
        icon: "👀",
        photo: null,
        polaroidCaption: "First impression: 10/10 🌟",
      },
      {
        id: "milestone-3",
        date: "[TIMEFRAME - e.g. That one memorable evening]",
        title: "That One Conversation 💬",
        shortSummary: "Remember [A CONVERSATION OR FUNNY MOMENT]? Maybe it seemed ordinary at the time, but I remembered it.",
        fullStory: "We got caught in this random conversation about [WHAT YOU TALKED ABOUT - e.g. a silly debate / favorite songs / late night thoughts]. Time completely slipped away, and I didn't want the conversation to wrap up.",
        thoughtAtTheTime: "“Wait, how has it already been two hours? When did talking become this effortless?”",
        icon: "💬",
        photo: null,
        polaroidCaption: "Could talk to you for hours ☕",
      },
      {
        id: "milestone-4",
        date: "[TIMEFRAME - e.g. A few months in]",
        title: "Wait, Why Am I Smiling? 🫠",
        shortSummary: "Somewhere along the way, talking to you started feeling a little different.",
        fullStory: "I caught myself picking up my phone just hoping to see a notification from you, or laughing at a joke you made hours after you said it. That was the moment I realized this wasn't just ordinary banter anymore.",
        thoughtAtTheTime: "“Uh oh. I think I'm in trouble here.” 🫣",
        icon: "🫠",
        photo: null,
        polaroidCaption: "The smiling-at-my-phone era 📱",
      },
      {
        id: "milestone-5",
        date: "[TIMEFRAME - e.g. Recently]",
        title: "The Little Things 🌷",
        shortSummary: "Your [A HABIT, QUALITY, OR SMALL THING I LIKE] became one of those little things I found myself noticing.",
        fullStory: "It's always the small details: the way you [A CUTE HABIT OR MANNERISM], how passionate you get when discussing [THEIR FAVORITE THING], and your genuine kindness to people around you. You make being yourself look effortless.",
        thoughtAtTheTime: "“I really, really admire this person.”",
        icon: "🌷",
        photo: null,
        polaroidCaption: "It's always the small things 🌸",
      },
    ],
    nextButtonText: "Explore our story map 🗺️✨",
  },

  // ---------------------------------------------------------------------------
  // 5. CHAPTER 4: THE INTERACTIVE JOURNEY MAP
  // ---------------------------------------------------------------------------
  map: {
    heading: "The Little Adventure Map 🗺️💞",
    subtitle: "Click each landmark along our winding path to unlock the memories. Watch our little traveler make their way across!",
    landmarks: [
      {
        id: 1,
        title: "The Starting Point",
        subtitle: "Where It Began 👋",
        icon: "🌱",
        color: "#FFDCE5",
        story: "How we first met or started talking. It was simple, completely unplanned, but looking back, it was the start of something that became very special to me.",
        memoryDetail: "[INSERT MEMORY: How you crossed paths, your first message, or that first shared laugh.]",
        thoughtNote: "Every great story starts with a simple hello.",
        photo: null,
      },
      {
        id: 2,
        title: "The Conversation Café",
        subtitle: "Just One More Conversation ☕",
        icon: "☕",
        color: "#FFF8EC",
        story: "A conversation or interaction I remember vividly. The banter, the jokes, and the feeling that talking to you was the easiest thing in the world.",
        memoryDetail: "[INSERT MEMORY: That one funny debate, late-night chat, or coffee catch-up that made you smile.]",
        thoughtNote: "Could order 100 cups of coffee if it meant staying in this conversation.",
        photo: null,
      },
      {
        id: 3,
        title: "The Little Things Garden",
        subtitle: "Things I Started Noticing 🌷",
        icon: "🌷",
        color: "#DDF2FF",
        story: "The small qualities and habits I appreciate about you. You probably don't even realize you do them, but they never fail to brighten my day.",
        memoryDetail: "[INSERT MEMORY: Their laugh, the way they talk about things they love, their kindness.]",
        thoughtNote: "Flowers bloom, but your smile wins every single time.",
        photo: null,
      },
      {
        id: 4,
        title: "The Butterfly Hill",
        subtitle: "When It Started Feeling Different 🦋",
        icon: "🦋",
        color: "#E9E0FF",
        story: "The exact moment or season when I began to realize that I might have a little crush on you. Yes, literal butterflies were involved.",
        memoryDetail: "[INSERT MEMORY: The day you realized your heart skipped a beat when they walked in or texted.]",
        thoughtNote: "Yep, butterflies confirmed. No scientific explanation needed.",
        photo: null,
      },
      {
        id: 5,
        title: "The Present-Day Observatory",
        subtitle: "Where We Are Now 🌙",
        icon: "🔭",
        color: "#FFDCC5",
        story: "Where we stand today under the stars. How much I value our connection right now, and how grateful I am for every moment we share.",
        memoryDetail: "[INSERT MEMORY: How grateful you are for them right now and how much you enjoy where you two are.]",
        thoughtNote: "Looking at the stars, but honestly, having you in my life shines brighter.",
        photo: null,
      },
    ],
    easterEggs: [
      {
        id: "star-1",
        label: "Hidden Star ⭐",
        message: "Okay, I admit it. I put way too much thought into this. 😭💗",
        icon: "⭐"
      },
      {
        id: "star-2",
        label: "Secret Clover 🍀",
        message: "Fun fact: I smiled like an idiot while coding this part. 🫣",
        icon: "🍀"
      },
      {
        id: "star-3",
        label: "Floating Cloud ☁️",
        message: "You found a secret star! You get +100 imaginary cool points. ⭐✨",
        icon: "☁️"
      }
    ],
    nextButtonText: "Take the quiz 🕵️‍♀️💗",
  },

  // ---------------------------------------------------------------------------
  // 6. CHAPTER 5: THE CRUSH QUIZ (A Very Important Investigation)
  // ---------------------------------------------------------------------------
  quiz: {
    heading: "Time for a very serious investigation. 🕵️‍♀️💗",
    subtitle: "I have a few extremely important questions. Please answer responsibly. (I am absolutely not going to overthink your answers.) 😂",
    skipButtonText: "Skip directly to the story 🏃‍♀️",
    completionMessage: "Thank you for participating in this completely unscientific investigation. 😂💗",
    nextButtonText: "Okay, what's next? ✨",
    questions: [
      {
        id: "q1",
        question: "Question 1: How would you describe us?",
        options: [
          {
            text: "Partners in random conversations 😂",
            response: "Accurate! The random conversational tangents are unmatched. 📝",
          },
          {
            text: "Two people who somehow keep talking 👀",
            response: "And somehow never run out of things to say. Duly noted! ☕",
          },
          {
            text: "Still figuring that out 🤔",
            response: "Fair enough! The investigation committee respects a mysterious vibe. 🕵️",
          },
          {
            text: "Let's not make me answer that yet 🙈",
            response: "Pleading the fifth! Very wise legal strategy. 😂",
          },
        ],
      },
      {
        id: "q2",
        question: "Question 2: If we had a completely free day, what would be your vibe?",
        options: [
          {
            text: "Food and endless conversations 🍕",
            response: "The gold standard of human connection. Food + talking = perfection. 🍕",
          },
          {
            text: "A random adventure 🚗",
            response: "No map, good playlist, and seeing where the day takes us? Sign me up. 🚗💨",
          },
          {
            text: "A movie and doing absolutely nothing 🍿",
            response: "Peak comfort unlocked. Snacks, zero pressure, 10/10 plan. 🍿",
          },
          {
            text: "Something spontaneous. No plans! ✨",
            response: "Living life on the edge! The best memories usually have zero plans anyway. 💫",
          },
        ],
      },
      {
        id: "q3",
        question: "Question 3: What's your current review of this little website?",
        options: [
          {
            text: "Cute, I'll give you that 🥹",
            response: "Mission accomplished! That's already all I could have hoped for. 💗",
          },
          {
            text: "Why is this actually entertaining? 😂",
            response: "Because I spent an unreasonable amount of time making it fun! 😂✨",
          },
          {
            text: "I have questions. Many questions. 👀",
            response: "All will be revealed very shortly... hold tight! 🔍",
          },
          {
            text: "I am judging the developer's sanity. 😭",
            response: "That's completely valid. My sanity was sacrificed for this aesthetic. 🫡",
          },
        ],
      },
      {
        id: "q4",
        question: "Question 4: One last question... What do you think this website is actually about?",
        options: [
          {
            text: "An elaborate prank 😂",
            response: "A prank with custom pastel CSS?! I respect your trust issues. 😂",
          },
          {
            text: "A very specific appreciation project 💌",
            response: "You are getting warmer... very, very warm. 🌷",
          },
          {
            text: "Someone has something to say, don't they? 👀",
            response: "Caught red-handed. Yes, someone definitely does. 🫣",
          },
          {
            text: "I honestly have no idea! 🤷",
            response: "The mystery is about to unfold. Next chapter has the answers! 🎁",
          },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // 7. CHAPTER 6: THE PRESENT (Little Things I Shouldn't Remember, But Do)
  // ---------------------------------------------------------------------------
  present: {
    heading: "And Here We Are... 🌻",
    subtitle: "Little Things I Probably Shouldn't Remember, But Do",
    reflection: "I don't think every meaningful thing begins with a big moment. Sometimes it's just the random conversations, the little jokes, the comfort of talking, and realizing that someone has slowly become a person you look forward to hearing from.",
    cards: [
      {
        id: "card-1",
        title: "Your Personality",
        prompt: "Something I admire about you ✨",
        reveal: "[DESCRIBE SOMETHING ABOUT THEIR PERSONALITY: e.g. How genuinely kind you are, how you light up when talking about your passions, or your great sense of humor.]",
        icon: "✨",
        tag: "Admirable trait"
      },
      {
        id: "card-2",
        title: "Words That Stuck",
        prompt: "Something you said that stayed with me 💬",
        reveal: "[DESCRIBE A QUOTE OR MOMENT: e.g. That time you told me [X], or when you cheered me up when I was having an off day.]",
        icon: "💬",
        tag: "Unforgettable"
      },
      {
        id: "card-3",
        title: "The Little Habit",
        prompt: "A small detail I find endearing 🌷",
        reveal: "[DESCRIBE A HABIT: e.g. The way you tilt your head when thinking, your signature laugh, or how you get excited about little things.]",
        icon: "🌷",
        tag: "Endearing detail"
      },
      {
        id: "card-4",
        title: "An Unexpected Smile",
        prompt: "A moment that made me unexpectedly happy ☀️",
        reveal: "[DESCRIBE A MOMENT: e.g. A random text in the middle of a busy day, sharing a silly meme, or a quiet moment we shared.]",
        icon: "☀️",
        tag: "Pure joy"
      },
      {
        id: "card-5",
        title: "Looking Ahead",
        prompt: "Something I look forward to when we talk 💌",
        reveal: "[DESCRIBE WHAT YOU LOOK FORWARD TO: e.g. How comfortable it feels, hearing your perspective, and never having to pretend to be someone else.]",
        icon: "💌",
        tag: "Always a highlight"
      },
    ],
    nextButtonText: "The letter I've been writing... 💌",
  },

  // ---------------------------------------------------------------------------
  // 8. CHAPTER 7: THE LETTER (What I Have Been Wanting to Say)
  // ---------------------------------------------------------------------------
  letter: {
    heading: "Okay... jokes aside for a second. 🥹",
    envelopeButtonText: "Open the letter 💌",
    rereadButtonText: "Read that again 🥹",
    paragraphs: [
      "Honestly, I don't really know how to say this without feeling a little awkward. So naturally, I made an entire website instead. 😂",
      "But somewhere along the way, I started looking forward to our conversations a little more than I expected.",
      "I began noticing the little things about you, remembering random moments, and smiling about conversations long after they had ended.",
      "And I think the truth is... I've developed a little crush on you. 🙈❤️",
      "I didn't want to make this a big, dramatic confession or put you in an uncomfortable position. I just wanted to be honest about how I feel.",
      "I don't know what you're thinking, and I don't expect you to feel the same way. I just thought you deserved to know.",
      "Whatever your answer is, I hope we can be honest with each other. And, yes, I hope you at least appreciate the amount of effort that went into this ridiculously elaborate website. 😂💗"
    ],
    closing: "From someone who spent an unreasonable amount of time figuring out how to say a simple thing. ❤️",
    signature: "[MY NAME OR NICKNAME]",
    nextButtonText: "Your turn, maybe? 🫶",
  },

  // ---------------------------------------------------------------------------
  // 9. CHAPTER 8: THEIR TURN (No Pressure, Just Honesty)
  // ---------------------------------------------------------------------------
  theirTurn: {
    heading: "Okay, I've said my piece. Your turn, maybe? 💗",
    introText: "I know that was a lot of website for one little confession. 😂\n\nYou don't have to figure everything out right now. I just wanted to tell you how I feel, and I'd rather hear what you genuinely think than have you feel like you need to give me a particular answer.",
    responseCards: [
      {
        id: "resp-1",
        cardTitle: "That was actually really sweet 🥹",
        icon: "🥹",
        color: "#FFDCE5",
        revealMessage: "I'm glad it made you smile. That's a pretty good ending to this little adventure already. 💗",
        subtext: "Whatever happens next, knowing this brightened your day is enough for me."
      },
      {
        id: "resp-2",
        cardTitle: "I need a little time to think 🙈",
        icon: "🙈",
        color: "#FFF8EC",
        revealMessage: "Of course. Take your time. No pressure, and no deadline. 🌷",
        subtext: "Take all the space you need. Our comfort with each other comes first."
      },
      {
        id: "resp-3",
        cardTitle: "Let's talk about this properly 💌",
        icon: "💌",
        color: "#E9E0FF",
        revealMessage: "Okay. Let's talk — honestly, comfortably, and without making it more complicated than it needs to be. 🫶",
        subtext: "Whenever you're ready, reach out however you usually do. Coffee or a quiet chat is always open."
      },
    ],
    footerMessage: "Made with a little courage, several overthought decisions, and a whole lot of heart. ❤️",
    revisitLetterText: "Re-read the letter 💌",
    revisitMapText: "Explore the map again 🗺️",
    restartText: "Start from the beginning 🔄",
  },

  // ---------------------------------------------------------------------------
  // 10. AUDIO SETTINGS
  // ---------------------------------------------------------------------------
  audio: {
    // If you have a custom music file, drop it in assets/music.mp3 and set this path:
    customMusicPath: "", // e.g. "assets/music.mp3"
    // Built-in procedural ambient lofi chime music box plays when enabled!
    defaultMusicOn: false,
    defaultSfxOn: true,
  }
};

// Make config globally available
window.STORY_CONFIG = STORY_CONFIG;
