# 🎨 Fashion Designer Studio

An AI-powered fashion design assistant that brings your sketches to life! Upload hand-drawn designs, get expert feedback from Claude, and generate photorealistic visualizations with DALL-E 3.

## ✨ Features

- **Sketch to Life**: Upload hand-drawn fashion sketches and transform them into photorealistic images
- **AI Design Consultant**: Chat with Claude for expert feedback on construction, fabric choices, and design decisions
- **Visual Generation**: Create multiple views, color variations, and styled looks of your designs
- **Construction Guides**: Get detailed step-by-step instructions for making your garments
- **Project Management**: Save and organize all your design projects
- **Personalized**: Uses your actual workspace photos as context for generations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Anthropic API key ([Get one here](https://console.anthropic.com/))
- OpenAI API key ([Get one here](https://platform.openai.com/))

### Installation

1. Clone this repository
```bash
cd fashion-designer-studio
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Edit `.env` and add your API keys:
```
ANTHROPIC_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
```

5. Run locally
```bash
npm run dev
```

6. Open http://localhost:3000 in your browser

## 🌐 Deploying to Netlify

### Option 1: Deploy via Netlify CLI

1. Install Netlify CLI
```bash
npm install -g netlify-cli
```

2. Login to Netlify
```bash
netlify login
```

3. Initialize your site
```bash
netlify init
```

4. Set environment variables
```bash
netlify env:set ANTHROPIC_API_KEY your_key_here
netlify env:set OPENAI_API_KEY your_key_here
```

5. Deploy
```bash
netlify deploy --prod
```

### Option 2: Deploy via Netlify UI

1. Push your code to GitHub
2. Go to [Netlify](https://app.netlify.com/)
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select your repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables in Site Settings → Environment Variables:
   - `ANTHROPIC_API_KEY`
   - `OPENAI_API_KEY`
7. Click "Deploy site"

## 📖 How to Use

### 1. Upload Your Sketch
- Draw your fashion design on paper
- Take a photo (or multiple photos from different angles)
- Upload to the app via drag-and-drop or file picker

### 2. Get AI Feedback
- Claude automatically analyzes your sketch
- Ask questions about construction, fabrics, or design choices
- Get clarifying questions to refine your vision

### 3. Generate Visualizations
- Click preset buttons for quick generations:
  - Different Colors
  - Different Angles
  - On Dress Form (shows on YOUR actual dress form!)
  - Styled Look
- Or write custom prompts for specific variations

### 4. Get Construction Guide
- Ask "How do I make this?"
- Receive detailed instructions including:
  - Materials needed and where to buy
  - Step-by-step construction sequence
  - Pro tips and common pitfalls
  - Estimated time and budget

### 5. Save Your Project
- Click "Save Project" to store everything
- Access saved projects from the left sidebar
- Track your design evolution over time

## 🎨 Customization

### Adding Your Workspace Photos
Your dress form photos are already included in `public/workspace/`. These are automatically used when you select "On Dress Form" generation option.

### Adjusting Color Scheme
Edit `tailwind.config.js` to customize colors to match your personal aesthetic.

## 🛠️ Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Netlify Functions (serverless)
- **AI**: Claude 4 Sonnet + DALL-E 3
- **Storage**: Browser localStorage (no database needed)

## 💡 Tips

- Upload multiple angles of your sketch for better analysis
- Save projects regularly to track iterations
- Print construction guides to keep at your sewing station
- Use the chat to brainstorm ideas before sketching

## 🐛 Troubleshooting

### Images not uploading
- Check file size (max 10MB)
- Ensure file format is JPG, PNG, or WEBP

### API errors
- Verify your API keys are correct in `.env`
- Check API key has sufficient credits
- For Netlify deployment, ensure environment variables are set in Netlify UI

### Build fails
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (should be 18+)

## 📝 License

ISC

## 🙏 Credits

Built with love for creative makers everywhere ✨

---

**Questions?** Check the code or open an issue!
