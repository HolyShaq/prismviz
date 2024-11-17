import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    extend: {
      colors: {
        primary: {
          main: 'var(--primary-main)',
          surface: 'var(--primary-surface)',
          hover: 'var(--primary-hover)',
          pressed: 'var(--primary-pressed)',
        },
        secondary: {
          main: 'var(--secondary-main)',
          surface: 'var(--secondary-surface)',
          hover: 'var(--secondary-hover)',
          pressed: 'var(--secondary-pressed)',
        },
        neutral: {
          white10: 'var(--neutral-white-10)',
          white20: 'var(--neutral-white-20)',
          white30: 'var(--neutral-white-30)',
          black100: 'var(--neutral-black-100)',
        },
        checkbox: {
          primary: 'var(--checkbox-primary)',
          secondary: 'var(--checkbox-secondary)',
          error: 'var(--checkbox-error)',
          warning: 'var(--checkbox-warning)',
          info: 'var(--checkbox-info)',
          success: 'var(--checkbox-success)',
          disabled: 'var(--checkbox-disabled)',
        },
        button: {
          primary: {
            DEFAULT: 'var(--button-primary)',
            hover: 'var(--button-primary-hover)',
            pressed: 'var(--button-primary-pressed)',
            disabled: 'var(--button-primary-disabled)',
          },
          secondary: {
            DEFAULT: 'var(--button-secondary)',
            hover: 'var(--button-secondary-hover)',
            pressed: 'var(--button-secondary-pressed)',
            disabled: 'var(--button-secondary-disabled)',
          },
          error: {
            DEFAULT: 'var(--button-error)',
            hover: 'var(--button-error-hover)',
            pressed: 'var(--button-error-pressed)',
            disabled: 'var(--button-error-disabled)',
          },
          success: {
            DEFAULT: 'var(--button-success)',
            hover: 'var(--button-success-hover)',
            pressed: 'var(--button-success-pressed)',
            disabled: 'var(--button-success-disabled)',
          },
        },
        alert: {
          primary: 'var(--alert-primary)',
          primaryBg: 'var(--alert-primary-bg)',
          primaryBorder: 'var(--alert-primary-border)',
          secondary: 'var(--alert-secondary)',
          secondaryBg: 'var(--alert-secondary-bg)',
          secondaryBorder: 'var(--alert-secondary-border)',
          success: 'var(--alert-success)',
          successBg: 'var(--alert-success-bg)',
          successBorder: 'var(--alert-success-border)',
          info: 'var(--alert-info)',
          infoBg: 'var(--alert-info-bg)',
          infoBorder: 'var(--alert-info-border)',
          warning: 'var(--alert-warning)',
          warningBg: 'var(--alert-warning-bg)',
          warningBorder: 'var(--alert-warning-border)',
          neutral: 'var(--alert-neutral)',
          neutralBg: 'var(--alert-neutral-bg)',
          neutralBorder: 'var(--alert-neutral-border)',
          error: 'var(--alert-error)',
          errorBg: 'var(--alert-error-bg)',
          errorBorder: 'var(--alert-error-border)',
        },
      },
      spacing: {
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
      },
      fontFamily: {
        primary: ['var(--font-primary)', 'sans-serif'],
      },
      fontSize: {
        h1: ['var(--font-size-h1)', { lineHeight: '1.5' }],
        h2: ['var(--font-size-h2)', { lineHeight: '1.5' }],
        h3: ['var(--font-size-h3)', { lineHeight: '1.5' }],
        h4: ['var(--font-size-h4)', { lineHeight: '1.5' }],
        h5: ['var(--font-size-h5)', { lineHeight: '1.5' }],
        h6: ['var(--font-size-h5)', { lineHeight: '1.5' }],
        p1: ['var(--font-size-p1)', { lineHeight: '1.75' }],
        p2: ['var(--font-size-p2)', { lineHeight: '1.75' }],
      },
    },
  },
  plugins: [],
};

export default config;