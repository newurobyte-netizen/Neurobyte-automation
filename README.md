# NeuroByte Telegram Bot

## Setup
1. Push repo to GitHub
2. In Render dashboard → add environment variables:
   - TELEGRAM_BOT_TOKEN
   - GH_PAT
   - AI_PROVIDER=huggingface
   - HF_API_KEY
3. Set start command: `npm start`
4. Deploy → bot runs 24/7

## Notes
- HuggingFace is the default AI provider.
- Do not commit your real `.env` file, only `.env.example`.
