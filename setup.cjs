const fs = require('fs');

const htmlContent = fs.readFileSync('../netstat_landing.html', 'utf8');

// 1. Extract style blocks
const cssMatches = htmlContent.match(/<style>([\s\S]*?)<\/style>/g) || [];
let customCss = '';
cssMatches.forEach(block => {
    let content = block.replace(/<\/?style>/g, '');
    if (!content.includes('tailwind.config')) {
        customCss += content + '\n';
    }
});

let styleCss = `@import "tailwindcss";
@import "tailwindcss/theme.css";

/* Custom Theme from tailwind-config script */
@theme {
  --color-inverse-primary: #405f91;
  --color-on-tertiary-fixed-variant: #713619;
  --color-on-surface-variant: #c4c6d0;
  --color-secondary-container: #0257b4;
  --color-tertiary-fixed: #ffdbcd;
  --color-surface-bright: #38393d;
  --color-on-primary-container: #7594ca;
  --color-error-container: #93000a;
  --color-secondary-fixed-dim: #acc7ff;
  --color-error: #ffb4ab;
  --color-surface-variant: #333538;
  --color-on-primary: #073060;
  --color-on-error-container: #ffdad6;
  --color-on-error: #690005;
  --color-secondary-fixed: #d7e2ff;
  --color-inverse-on-surface: #2f3034;
  --color-on-tertiary-container: #cd805d;
  --color-on-secondary-fixed: #001a40;
  --color-tertiary: #ffb596;
  --color-on-surface: #e3e2e7;
  --color-surface-container: #1e2023;
  --color-on-tertiary-fixed: #360f00;
  --color-primary-fixed-dim: #a9c7ff;
  --color-surface-dim: #121317;
  --color-surface-container-high: #292a2e;
  --color-on-tertiary: #552005;
  --color-on-secondary-fixed-variant: #004491;
  --color-primary-fixed: #d6e3ff;
  --color-surface-tint: #a9c7ff;
  --color-inverse-surface: #e3e2e7;
  --color-outline-variant: #43474f;
  --color-primary: #a9c7ff;
  --color-primary-container: #002b5b;
  --color-surface-container-lowest: #0d0e11;
  --color-on-secondary-container: #bcd1ff;
  --color-on-background: #e3e2e7;
  --color-on-secondary: #002f67;
  --color-surface-container-highest: #333538;
  --color-on-primary-fixed: #001b3d;
  --color-on-primary-fixed-variant: #264778;
  --color-tertiary-fixed-dim: #ffb596;
  --color-background: #121317;
  --color-tertiary-container: #4f1c02;
  --color-secondary: #acc7ff;
  --color-surface: #121317;
  --color-outline: #8d909a;
  --color-surface-container-low: #1a1c1f;

  --font-telemetry-data: Space Grotesk;
  --font-display-lg: Plus Jakarta Sans;
  --font-body-standard: Plus Jakarta Sans;
  --font-drama-italic: Newsreader;
  --font-headline-md: Plus Jakarta Sans;

  --text-telemetry-data: 14px;
  --text-telemetry-data--line-height: 1.4;
  --text-telemetry-data--letter-spacing: 0.05em;
  --text-telemetry-data--font-weight: 500;

  --text-display-lg: 72px;
  --text-display-lg--line-height: 1.1;
  --text-display-lg--letter-spacing: -0.04em;
  --text-display-lg--font-weight: 700;

  --text-body-standard: 16px;
  --text-body-standard--line-height: 1.6;
  --text-body-standard--font-weight: 400;

  --text-drama-italic: 24px;
  --text-drama-italic--line-height: 1.5;
  --text-drama-italic--font-weight: 400;

  --text-headline-md: 32px;
  --text-headline-md--line-height: 1.2;
  --text-headline-md--letter-spacing: -0.02em;
  --text-headline-md--font-weight: 600;

  --spacing-stack-lg: 3rem;
  --spacing-container-padding: 2.5rem;
  --spacing-stack-md: 1.5rem;
  --spacing-margin-global: 4rem;
  --spacing-gutter-grid: 2rem;
  --spacing-stack-sm: 0.5rem;
}

${customCss}
`;

fs.writeFileSync('style.css', styleCss);

// 2. Prepare index.html
let newHtml = htmlContent
    // Remove the tailwind cdn script
    .replace(/<script src="https:\/\/cdn.tailwindcss.com\?.*?><\/script>/, '')
    // Remove the tailwind-config script block
    .replace(/<script id="tailwind-config">[\s\S]*?<\/script>/, '')
    // Remove all original style blocks
    .replace(/<style>[\s\S]*?<\/style>/g, '')
    // Insert link to our style.css before </head>
    .replace(/<\/head>/, '  <link rel="stylesheet" href="/style.css">\n</head>')
    // Insert script to main.js before </body>
    .replace(/<\/body>/, '  <script type="module" src="/main.js"></script>\n</body>');

fs.writeFileSync('index.html', newHtml);

// 3. Prepare main.js
fs.writeFileSync('main.js', `console.log('App running!');`);

console.log('Setup complete!');
