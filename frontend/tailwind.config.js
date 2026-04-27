/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007bff',
        'primary-hover': '#0056b3',
        secondary: '#6c757d',
        'secondary-hover': '#5a6268',
        danger: '#dc3545',
        'danger-hover': '#c82333',
        success: '#28a745',
        'success-hover': '#218838',
        warning: '#ffc107',
        'warning-hover': '#e0a800',
        info: '#17a2b8',
        'info-hover': '#138496',
      },
      fontFamily: {
        sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
