module.exports = {
    theme: {
        extend: {
            borderWidth: {
                title: '0.1rem',
            },
            boxShadow: {
                '3xl': '0 1em 5em rgba(0, 0, 0, 0.3)',
                'glow': '0 0 20px rgba(0, 0, 0, 0.3)',
            },
            colors: {
                'my-gray': 'var(--my-gray)',
                'my-gray-text': 'var(--my-gray-text)',
                'my-text': 'var(--my-text)',
                'my-shadow': 'var(--my-shadow)',
                'my-shadow-dark': 'var(--my-shadow-dark)',
                'my-black': '#141414',
                'link-hover': 'var(--link-hover)',
                'light-accent': 'var(--light-accent)',
                'base-100-odd': 'var(--base-100-odd)',
            },
            fontFamily: {
                sans: ['Source Sans Pro', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
            },
            fontSize: {
                xxs: '10px',
                sm: '14px',
                base: '15px',
                lg: '20px',
                xl: '24px',
            },
            screens: {
                xxs: '374px',
                xs: '500px',
                '2sm': '825px',
                '2md': '876px',
                '4xl': { min: '1971px' },
            },
            transitionProperty: {
                height: 'height',
            },
        },
    },
    daisyui: {
        themes: [
            {
                light: {
                    'color-scheme': 'light',
                    primary: '#e0e0e0',
                    'base-content': '#222222',
                    secondary: '#c7c7c7',
                    accent: '#f28c1b',
                    'base-100': '#ffffff',
                    'base-200': '#F2F5F7',
                    'base-300': '#E5E6E6',
                    neutral: '#2B3440',
                    'neutral-focus': '#343232',
                    info: '#0000ff',
                    success: '#008000',
                    warning: '#f28c1b',
                    error: '#ff3c00',
                    '--base-100': '#ffffff',
                    '--base-200': '#F2F5F7',
                    '--base-300': '#E5E6E6',
                    '--base-100-odd': '#ececec',
                    '--my-accent': '#f28c1b',
                    '--link-hover': '#f4ae61',
                    '--my-gray': '#707070',
                    '--my-gray-text': '#6a6a6a',
                    '--my-text': '#141414',
                    '--my-shadow': '#e6e6e6',
                    '--my-shadow-dark': '#9f9f9f',
                    '--light-accent': '#9c6a0c',
                },
                dark: {
                    'color-scheme': 'dark',
                    primary: '#3b3b3b',
                    'base-content': '#DFDFDF',
                    secondary: '#d3d3d3',
                    accent: '#f28c1b',
                    'base-100': '#313131',
                    'base-200': '#222222',
                    'base-300': '#1c1c1c',
                    neutral: '#272626',
                    'neutral-focus': '#343232',
                    info: '#0000ff',
                    success: '#008000',
                    warning: '#f28c1b',
                    error: '#ff3c00',
                    '--base-100': '#313131',
                    '--base-200': '#222222',
                    '--base-300': '#1c1c1c',
                    '--base-100-odd': '#3d3d3d',
                    '--my-accent': '#f28c1b',
                    '--link-hover': '#f4ae61',
                    '--my-gray': '#aaaaaa',
                    '--my-gray-text': '#bababa',
                    '--my-text': '#eeeeee',
                    '--my-shadow': '#111',
                    '--my-shadow-dark': '#000',
                    '--light-accent': '#f1a312',
                },
            },
        ],
    },
    plugins: [require('daisyui')],
}
