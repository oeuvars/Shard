import type { Config } from 'tailwindcss';
import { withUt } from "uploadthing/tw";

export default withUt ({
   darkMode: ['class'],
   content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
      './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
      './src/hooks/**/*.{js,ts,jsx,tsx,mdx}',
   ],
   theme: {
      extend: {
         colors: {
            background: '#ffffff',
            foreground: '#000000',
            sidebar: {
               DEFAULT: 'hsl(220, 13%, 95%)', // Light gray background
               foreground: 'hsl(220, 15%, 20%)', // Dark gray text
               primary: 'hsl(222, 47%, 31%)', // Navy blue
               'primary-foreground': 'hsl(210, 40%, 98%)', // Very light blue
               accent: 'hsl(220, 14%, 90%)', // Lighter gray
               'accent-foreground': 'hsl(220, 15%, 25%)', // Darker gray
               border: 'hsl(220, 13%, 91%)', // Light border color
               ring: 'hsl(222, 47%, 31%, 0.3)', // Semi-transparent navy
            },
         },
         borderRadius: {
            lg: '0.5rem',
            md: '0.375rem',
            sm: '0.25rem',
         },
      },
   },
   plugins: [require('tailwindcss-animate')],
}) satisfies Config;
