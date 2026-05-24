# VendorAnalyzer

VendorAnalyzer is a web application that cleans and normalizes vendor contact data from nonprofit accounting databases. It uses the OpenAI API to intelligently parse inconsistently formatted vendor information and standardizes it into structured, easy-to-use records.

## Features

- **AI-Powered Normalization** – Uses OpenAI's GPT-3 (`text-davinci-003`) to parse and normalize messy vendor data.
- **Chunked Processing** – Automatically splits large datasets into token-safe chunks for reliable API usage.
- **Real-Time Progress** – Displays a progress indicator while data is being processed.
- **Structured Output** – Presents normalized results in a table with the following fields:
  - Vendor Name
  - Contact Name
  - Address
  - City
  - State
  - Zip Code

## Tech Stack

- **JavaScript** (Vanilla ES6+)
- **HTML5 / CSS3**
- **Webpack 5** – Bundling and HTML generation
- **dotenv-webpack** – Environment variable management
- **OpenAI API** – Text completion via `text-davinci-003`

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/)
- An [OpenAI API key](https://platform.openai.com/account/api-keys)

## Installation

```bash
# Clone the repository
git clone https://github.com/ksamavati/VendorAnalyzer.git
cd VendorAnalyzer

# Install dependencies
npm install
```

## Configuration

Create a `.env` file in the root of the project and add your OpenAI API key:

```
MY_API_KEY="your-openai-api-key-here"
```

> **Important:** Never commit your `.env` file or expose your API key in source code. Make sure `.env` is listed in your `.gitignore`.

## Running the App

Build the project with Webpack:

```bash
npx webpack
```

Then open `dist/index.html` in your browser, or serve it locally:

```bash
npx webpack serve
# Visit http://localhost:8080
```

## Usage

1. **Paste your vendor data** into the **Dataset** textarea. Data should be in a loosely formatted, pipe-delimited or plain-text format, for example:
   ```
   Al's Plumbing Heating & Cooling LLC P.O. Box 2106 Los Angeles
   ```

2. **Customize the prompt** (optional) to adjust how the AI interprets and normalizes the data.

3. **Click "Generate"** to start processing. A progress bar will appear while the application sends chunks of your data to the OpenAI API.

4. **View the results** in the output table once processing is complete. Each row will contain a normalized vendor record.

## Project Structure

```
VendorAnalyzer/
├── .env                  # Environment variables (API key — do not commit)
├── .gitignore
├── .hintrc               # WebHint linting configuration
├── index.html            # Main HTML page
├── script.js             # Application logic
├── style.css             # Styles
├── webpack.config.js     # Webpack configuration
└── package.json
```

## License

This project does not currently specify a license.
