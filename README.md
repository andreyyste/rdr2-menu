# 🤠 RDR2 Menu - Personal Academic Hub

Welcome to **RDR2 Menu**, a personal web hub themed around the iconic *Red Dead Redemption 2* Pause Menu. This project is built for survival in the harsh wilderness of academia, equipping you with all the functional tools you need to track your "missions" (courses, assignments, and tasks).

![RDR2 Menu Concept](https://images.unsplash.com/photo-1508349937151-22b68b72d5d7?q=80&w=2000&auto=format&fit=crop)

---

## ✨ Features (The Camp Upgrades)

Despite the gritty Western aesthetic, this hub is packed with modern, functional tools powered by custom logic and local storage:

*   ⌚ **Interactive Pocket Watch:** An RDR2-style analog watch that rotates in real-time based on your local clock.
*   🗺️ **Road Map & Academic Checklist:** A zoomable, interactive map interface featuring a dynamic To-Do List to track your courses or side-quests.
*   📈 **Progress Tracker (SKS & GPA):** Arthur Morgan might not care about grades, but you do. Features an automatic SKS tracker and GPA (IPK) weighted calculator with visual progress bars.
*   📅 **Bounty Board Calendar:** A comprehensive calendar to log assignments and events. Includes custom themes (*Classic*, *Blood*, *Sand*), desktop reminder notifications, and JSON data export/import functionality.
*   🔗 **Help & Custom Links:** A card-based bookmark system for your important links—from university portals to the RDR2 Wiki.

---

## 🛠️ The Armory (Tech Stack)

This project is built using the "Holy Trinity"—no heavy frameworks, just pure horsepower. It has recently been refactored for maximum maintainability:

*   **HTML5:** The skeletal structure.
*   **CSS3:** Custom styling to achieve that gritty, vintage aesthetic. Modularized into logical components (`main.css`, `menu.css`, `map.css`, `progress.css`, `calendar.css`, `help.css`).
*   **Vanilla JavaScript:** The brains behind the operation, handling all the interactive logic, separated into neat modules (`clock.js`, `menu.js`, `map.js`, `progress.js`, `calendar.js`, `help.js`).
*   **LocalStorage API:** Ensures your calendar, GPA data, and checklists stay saved directly on your device without needing a backend.

---

## 🚀 Getting Started

Since this is a vanilla HTML/CSS/JS project, you don't need any complex build tools.

1.  Clone this repository:
    ```bash
    git clone https://github.com/andreyyste/rdr2-menu.git
    ```
2.  Open `index.html` in your favorite modern browser. (For the best experience, use a local server like VSCode Live Server to prevent strict CORS restrictions on local files, although it works fine without it!).

---

## ⚠️ Bounty Notice

*   **Responsiveness:** The UI is currently optimized for desktop. If you open this on a phone and it looks like a stagecoach wreck, consider it part of the retro charm.
*   **Data Privacy:** All data (checklists, calendar events, links) is stored locally on your browser via `LocalStorage`. Clearing your browser data will wipe your progress, so remember to use the **Export** feature in the Calendar tab!

---

*“We’re more ghosts than people.”* — Arthur Morgan
