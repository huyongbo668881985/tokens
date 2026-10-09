module.exports = {
      darkMode: 'class',
      content: ['./index.html', './privacy.html', './terms.html'],
      theme: {
        extend: {
          colors: {
            brand: {
              50: '#ecfdf5',
              100: '#d1fae5',
              500: '#10b981',
              600: '#059669',
              700: '#047857'
            },
            accent: {
              400: '#38bdf8',
              500: '#0ea5e9',
              600: '#0284c7'
            }
          },
          fontFamily: {
            mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
            sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
          }
        }
      }
    };
