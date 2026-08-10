/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E07856',
        secondary: '#F5E6D3',
        accent: '#87AE73',
        background: '#FAF9F6',
        surface: '#F0EAD6',
        'text-primary': '#2C2C2C',
        'text-secondary': '#666666',
        border: '#D4C5B0',
        success: '#6B8E23',
        'studio-wood': '#8B7355',
      },
      fontFamily: {
        'heading': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'card': '16px',
        'button': '8px',
        'input': '8px',
      },
    },
  },
  plugins: [],
};
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              

