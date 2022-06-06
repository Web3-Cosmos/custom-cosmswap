module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        pc: { max: '99999px' },
        tablet: { max: '1280px' },
        mobile: { max: '1000px' }
      },
      backgroundColor: {
        current: 'currentColor',
        'primary': 'var(--primary)',
        'stack-1': 'var(--bg-stack-1)',
        'stack-2': 'var(--bg-stack-2)',
        'stack-3': 'var(--bg-stack-3)',
        'stack-4': 'var(--bg-stack-4)',
        'transparent': 'transparent',
        'inherit': 'inherit',
      },
      textColor: {
        current: 'currentColor',
        'default': 'var(--primary)',
        'primary': 'var(--text-primary)',
        'secondary': 'var(--text-secondary)',
        'tertiary': 'var(--text-tertiary)',
        'disabled': 'var(--text-disabled)',
      },
      borderColor: {
        current: 'currentColor',
        'primary': 'var(--primary)',
        'stack-1': 'var(--bg-stack-1)',
        'stack-2': 'var(--bg-stack-2)',
        'stack-3': 'var(--bg-stack-3)',
        'stack-4': 'var(--bg-stack-4)',
      },
      ringColor: {
        current: 'currentColor',
        'primary': 'var(--primary)',
      }
    },
  },
  plugins: [],
}
