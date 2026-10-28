# A Little Website About You 💌
### *An Interactive, Playful, Romantic Story for My Crush*

A fully functional, whimsical, emotionally sincere interactive website designed to express your feelings to your crush in a secret little world created just for them.

Combines elements of a romantic visual novel, a playful interactive mini-game, a digital scrapbook, and an honest handwritten letter.

---

## ✨ Features

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
  - Cute synthesized sound effects: soft clicks, paper unfolds, chimes, and heartbeats.
  - Support for your own custom MP3 file if you prefer a specific song!
- **♿ Accessible & Responsive**
  - Works on phones, tablets, and computers.
  - Full keyboard accessibility and reduced-motion toggle.

---

## 🚀 Quick Start (Running Locally)

**No build step or Node.js required!**

1. Simply double-click `index.html` in this folder to open it directly in Google Chrome, Microsoft Edge, Opera, Safari, or Firefox.
2. Alternatively, you can serve it with any local server (e.g., VS Code *Live Server*, Python `python -m http.server`, etc.).

---

## 🎨 How to Personalize Everything (In 5 Minutes)

You only need to edit **ONE file**:
👉 `js/storyConfig.js`

Open `js/storyConfig.js` in any text editor (VS Code, Notepad, etc.). Every single section has clear placeholder markers:

### 1. Replace Names:
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

### 2. Personalize the Timeline & Memories:
In `timeline.milestones` and `map.landmarks`:
- Fill in your approximate dates or seasons.
- Describe how you two met, your favorite conversation, or little habits you notice.
- Replace `thoughtAtTheTime` with what was going through your mind!

### 3. Add Photos (Optional):
Drop your photos into `assets/photos/` (e.g. `photo1.jpg`).
In `js/storyConfig.js`, set:
```javascript
photo: "assets/photos/photo1.jpg",
polaroidCaption: "That day by the lake 📸"
```
*(If no photo is provided, the card displays a sweet illustrated gradient fallback)*.

### 4. Personalize the Letter:
In `letter.paragraphs`:
- Edit or add your own words to make it 100% genuine and true to your voice.

### 5. Custom Background Music (Optional):
By default, the website generates a gentle procedural music-box melody in the browser.
If you have a special song you want to play:
1. Save your music file as `assets/music.mp3`.
2. In `js/storyConfig.js`, set:
   ```javascript
   audio: {
     customMusicPath: "assets/music.mp3",
   }
   ```

---

## 🌐 Sharing / Deploying to the Web (Free)

To send a private link to your crush:

### Option A: GitHub Pages (Recommended)
1. Create a free repository on [GitHub](https://github.com).
2. Upload the files in this folder.
3. Go to **Settings > Pages > Branch: main > Save**.
4. GitHub will give you a link (e.g. `https://yourusername.github.io/a-little-website-about-you/`).

### Option B: Netlify or Vercel
1. Go to [Netlify Drop](https://app.netlify.com/drop).
2. Drag and drop this folder directly onto the page.
3. Netlify will instantly give you a free, live web URL to share!

---

## ❤️ Credits & Privacy

- All state and quiz choices are kept strictly in the visitor's browser.
- No analytics, cookies, tracking, or remote databases.
- Made with care, courage, and a whole lot of heart!
