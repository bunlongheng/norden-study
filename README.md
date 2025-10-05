**README.md**

````markdown
# Norden Study Timer

A modern, responsive study timer app with Apple-inspired coverflow interface. Manage multiple study sessions with an elegant timer that tracks completion across different subjects.

## Features

-   **Coverflow Interface** - 3D Apple-style mode selector with smooth transitions
-   **Multiple Study Modes** - Reading, Writing, Math, Puzzle, Art, Music, Game
-   **Session Tracking** - Automatic completion tracking with visual feedback
-   **Celebration Effects** - Confetti and sound when completing sessions
-   **Fully Responsive** - Works perfectly on iPhone 5S to iPad Pro M4
-   **Dark/Light Mode** - Toggle between themes
-   **Customizable Duration** - 5s (test), 1min, 5min, or 15min sessions
-   **Persistent Storage** - Saves progress in localStorage
-   **No Scrolling** - Everything fits on one screen

## Tech Stack

-   **React 19** - UI framework
-   **Vite** - Build tool
-   **Tailwind CSS v3** - Styling
-   **Lucide React** - Icons
-   **localStorage API** - Data persistence

## Getting Started

### Prerequisites

-   Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/norden-study.git
cd norden-study

# Install dependencies
npm install

# Run development server
npm run dev
```
````

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

## Deployment

### Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Import from Git and select your repository
4. Build settings:
    - **Build command:** `npm run build`
    - **Publish directory:** `dist`
5. Deploy

## Usage

1. Select a study mode from the coverflow
2. Click the timer or Start button to begin
3. Timer counts down from your chosen duration
4. Switch modes anytime (progress resets)
5. Complete a session to mark it as finished
6. Configure settings via the gear icon

## Project Structure

```
norden-study/
├── src/
│   ├── App.jsx          # Main timer component
│   ├── index.css        # Tailwind imports
│   └── main.jsx         # React entry point
├── index.html
├── package.json
└── tailwind.config.js
```

## Customization

Edit `src/App.jsx` to modify:

-   Mode colors and icons
-   Timer durations
-   Animations and effects
-   UI layout

## License

MIT

## Author

Built with Claude (Anthropic)

```

Save this as `README.md` in your project root. It covers all the essential information someone needs to understand, run, and deploy your app.
```
