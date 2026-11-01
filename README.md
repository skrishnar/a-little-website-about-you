# A Little Website About You 💌
### *An Interactive, Playful, Romantic Story for My Crush*

A fully functional, whimsical, emotionally sincere interactive website designed to express your feelings to your crush in a secret little world created just for them.

Combines elements of a 3D animated cinematic opening, romantic visual novel, playful interactive mini-game, digital scrapbook, and honest handwritten letter.

---

## ✨ Features

- **🏃‍♂️ Opening Scene: 3D Boy Letter Delivery (Upon Opening the Link!)**
  - **Cinematic Approach**: The website opens with a dreamy sunset avenue lined with warm lanterns, cherry blossom trees, and falling petals. A cute, stylized 3D cartoon boy in streetwear (hoodie, cap, joggers, and chunky sneakers) sprints from the distant horizon straight towards the screen!
  - **Nervous Offering**: He skids to a stop right in front of the viewer, pants to catch his breath, blushes brightly, and extends a glowing folded envelope with both hands (*"H-hey! I have this for you...! 💌"*).
  - **The Clumsy Drop**: In a moment of nervous excitement, his hands slip! He gasps in shock (*"Aahh!! Wait! Nooo! 😱"*), and the letter flutters forward aerodynamically in 3D, landing right at the front of the screen with a tactile paper drop sound and sparkle bounce.
  - **Comical Panic Escape**: Overcome with shy embarrassment, he clasps his hands to his bright red cheeks, spins around 180°, and comically sprints away into the sunset until disappearing over the horizon!
  - **Interactive Dropped Letter**: The letter hovers front-and-center on the screen with dynamic 3D mouse/touch parallax tilt and a pulsing golden glow.
  - **Wax Seal Unfolding**: Clicking the letter pops the red wax heart seal with celebratory confetti and a harp chime, sliding out the parchment and smoothly dissolving into the main website!
  - **Replay Anytime**: Includes a permanent `🏃‍♂️` button in the top navigation bar to watch the 3D delivery scene again whenever desired.
  - **100% Procedural & Offline Capable**: Zero external 3D model downloads needed; operates at a smooth 60 FPS on both mobile and desktop with Web Audio API sound synthesis.

- **Chapter 1: The Welcome Screen 💗**
  - Dreamy pastel canvas with floating hearts, twinkling stars, and gentle sparkles.
  - Interactive 3D envelope with a heart-shaped seal that opens with confetti.
  - Two playful buttons (*"Okay, let's go! ✨"* and *"Wait, should I be concerned? 😂"*) with funny micro-messages.
- **Chapter 2: Before We Begin (Digital Diary) 🧸**
  - Scrapbook aesthetic with washi tape, cute stickers, and sequential line-by-line diary reveals.
- **Chapter 3: The Beginning (Milestone Timeline) 🌱**
  - Responsive timeline (curved on desktop, vertical on mobile).
  - Clickable milestone cards that pop open memory modals with *"What I was thinking at the time..."* notes and optional Polaroid photos.
- **Chapter 4: The Interactive Journey Map 🗺️💞**
  - Whimsical illustrated SVG map with a winding dotted path and 5 interactive landmarks:
    1. *The Starting Point — "Where It Began"* 👋
    2. *The Conversation Café — "Just One More Conversation"* ☕
    3. *The Little Things Garden — "Things I Started Noticing"* 🌷
    4. *The Butterfly Hill — "When It Started Feeling Different"* 🦋
    5. *The Present-Day Observatory — "Where We Are Now"* 🌙
  - An animated traveler moves along the route as landmarks are visited.
  - Hidden clickable easter eggs (secret stars and clovers) with sweet/funny confession notes!
- **Chapter 5: A Very Important Investigation (Crush Quiz) 🕵️‍♀️💗**
  - 4 playful multiple-choice questions with funny animated reactions.
  - No right/wrong answers, no score, completely pressure-free.
  - Optional skip button to proceed straight to the story.
- **Chapter 6: The Present (Little Things I Shouldn't Remember, But Do) 🌻**
  - Interactive 3D flip cards with endearing details and habits.
  - Warm reflection note on how small conversations turn into something special.
- **Chapter 7: The Letter (What I Have Been Wanting to Say) 💌**
  - Soft cream parchment with custom airmail stamp.
  - Paragraph-by-paragraph reveal of your sincere, pressure-free confession.
  - *"Read that again 🥹"* button to re-experience the unfolding.
- **Chapter 8: Their Turn (No Pressure, Just Honesty) 🫶**
  - Three thoughtful response cards:
    - *"That was actually really sweet 🥹"*
    - *"I need a little time to think 🙈"*
    - *"Let's talk about this properly 💌"*
  - Gentle reassuring answers for each card.
  - Options to re-read the letter, revisit the map, or restart.
- **🎵 Built-in Procedural Music & Sound Effects**
  - Web Audio API music-box / kalimba lullaby that plays with **zero external files or downloads required**.
  - Non-intrusive: never autoplays; easily toggled via the music button in the top navigation.
  - Cute synthesized sound effects: soft runner footsteps, shy gasp, tactile paper drop, wax seal snaps, chimes, and heartbeats.
  - Support for your own custom MP3 file if you prefer a specific song!
- **♿ Accessible & Responsive**
  - Works on phones, tablets, and computers.
  - Full keyboard accessibility and reduced-motion toggle.

---

## 🚀 Quick Start (Running Locally)

**No build step or Node.js required!**

1. Simply double-click `index.html` in this folder to open it directly in Google Chrome, Microsoft Edge, Opera, Safari, or Firefox.
2. Or open `runner-demo.html` to preview the 3D Boy delivery scene standalone.
3. To publish to GitHub Pages, run `push-to-github.bat`.

---

## 🎨 How to Personalize Everything (In 5 Minutes)

You only need to edit **ONE file**:
👉 `js/storyConfig.js`

Open `js/storyConfig.js` in any text editor (VS Code, Notepad, etc.). Every single section has clear placeholder markers:

### 1. Customize the 3D Boy Runner Scene:
```javascript
runner3d: {
  enabled: true,
  speechApproach: "H-hey! I have this for you...! 💌",
  speechDrop: "Aahh!! Wait! Nooo! 😱",
  speechRunAway: "I'm too embarrassed!! Bye! 🏃‍♂️💨",
  boyOutfit: {
    hoodieColor: "#E88BA6",  // Hoodie color
    pantsColor: "#433248",   // Joggers color
    shoesColor: "#FFFFFF",   // Sneakers color
    hairColor: "#3D2B1F",    // Hair color
    capColor: "#7B61FF",     // Cap color
  }
}
```

### 2. Replace Names:
```javascript
recipient: {
  name: "Maya",            // Replace [CRUSH'S NAME]
  nickname: "May",         // Replace [THEIR NICKNAME]
},
sender: {
  name: "Lucas",           // Replace [MY NAME]
  nickname: "Lucas",       // Replace [MY NICKNAME]
}
```

### 3. Personalize the Timeline & Memories:
In `timeline.milestones` and `map.landmarks`:
- Fill in your approximate dates or seasons.
- Describe how you two met, your favorite conversation, or little habits you notice.
- Replace `thoughtAtTheTime` with what was going through your mind!

### 4. Add Photos (Optional):
Drop your photos into `assets/photos/` (e.g. `photo1.jpg`).
In `js/storyConfig.js`, set:
```javascript
photo: "assets/photos/photo1.jpg",
polaroidCaption: "That day by the lake 📸"
```
*(If no photo is provided, the card displays a sweet illustrated gradient fallback)*.
