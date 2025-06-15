/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', 

  content: ["./src/**/*.{js,jsx,ts,tsx}", // This tells Tailwind to look in all .js, .jsx, .ts, .tsx files within your src folder and its subfolders
    "./public/index.html"  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

