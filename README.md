# Billable Hours Farcaster Frame

This is a Next.js project that creates a Farcaster frame for accepting billable hour payments in USDC. It's designed to be easily customizable and deployable.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-repo/billable-hours-frame.git
cd billable-hours-frame
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your environment variables

Copy the `.env.example` file to a new file named `.env` and fill in the required values.

```bash
cp .env.example .env
```

**Required variables:**

- `FRAME_NAME`: Your frame's name.
- `APP_URL`: The URL where your frame is hosted (on local this is localhost:3000, on prod it's your Vercel URL)
- `FRAME_IMAGE_URL`: A 3:2 aspect ratio image for the frame preview.
- `SPLASH_IMAGE_URL`: A splash image for when the frame is launched.
- `SPLASH_BACKGROUND_COLOR`: The background color for the splash screen.
- `RECIPIENT_ADDRESS`: The wallet address to receive payments.
- `BASE_RPC_URL`: A Base Mainnet RPC URL. You can get one for free from [Alchemy](https://www.alchemy.com/).
- `USDC_CONTRACT_ADDRESS`: The USDC contract address on Base Mainnet.
- `POSTGRES_URL`: Your Neon Postgres connection string. You can get a free database from [Neon](https://neon.tech/).

### 4. Configure Billable Options

Edit `src/config/billableOptions.js` to define your billable services. The format is a JavaScript array of objects, where each object has a `title` (string) and an `amount` (number).

### 5. Set up the database

Run the following command to create the `transactions` table in your database:

```bash
node scripts/setup-db.js
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Theming

This project comes with several predefined themes (Simple, Brutalist, 90s, Retro) that you can switch between using the dropdown at the top of the page.

### Customizing Existing Themes

All theme-related styles are defined using CSS variables in `src/app/globals.css` and their values are set per theme in `src/config/themes.js`.

To customize an existing theme:

1.  Open `src/config/themes.js`.
2.  Locate the theme you want to modify (e.g., `simple`, `brutalist`).
3.  Change the values of the CSS variables (e.g., `--primary-color`, `--background-color`, `--font-sans`).

Example:
```javascript
  simple: {
    '--primary-color': '#0070f3',
    '--background-color': '#ffffff',
    // ... other variables
  },
```

### Adding New Themes

To add a completely new theme:

1.  Open `src/config/themes.js`.
2.  Add a new entry to the `themes` object, following the same structure as existing themes.
3.  Define all the necessary CSS variables for your new theme.

Example:
```javascript
  myNewTheme: {
    '--primary-color': '#FF5733',
    '--background-color': '#F0F8FF',
    '--text-color': '#333333',
    // ... all other CSS variables
  },
```
4.  The new theme will automatically appear in the theme switcher dropdown.

### Changing Fonts

Fonts are also controlled by CSS variables (`--font-sans` and `--font-mono`) within each theme definition in `src/config/themes.js`.

To use a custom font:

1.  **Import the font:** If you're using Google Fonts or a similar service, import the font in `src/app/layout.js` or directly in `src/app/globals.css` using `@import` or `@font-face` rules.
    *   For Next.js `next/font` integration, follow the [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) documentation.
2.  **Update the theme:** In `src/config/themes.js`, update the `--font-sans` or `--font-mono` variable for the desired theme to your new font family.

Example (assuming 'My Custom Font' is imported):
```javascript
  myNewTheme: {
    // ... other variables
    '--font-sans': '"My Custom Font", sans-serif',
    '--font-mono': '"My Custom Font Mono", monospace',
  },
```

Remember to clear your browser cache if font changes don't appear immediately.

## How it works

1.  The main page displays the billable options defined in your `.env` file.
2.  When a user clicks a button, it initiates a USDC transfer using the Farcaster Frame SDK.
3.  After the transaction is sent, the frontend calls the `/api/verify` endpoint.
4.  The backend verifies the transaction on the Base network and saves the details to your Postgres database.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.