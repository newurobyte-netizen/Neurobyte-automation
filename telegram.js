require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { OpenAI } = require("openai");
const express = require('express');

const token = process.env.TELEGRAM_BOT_TOKEN;
const ghPat = process.env.GH_PAT;
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// --- Initialize bot in webhook mode ---
const bot = new TelegramBot(token, { polling: false });

// --- Set webhook to Render external URL ---
bot.setWebHook(`${process.env.RENDER_EXTERNAL_URL}/bot${token}`);

// --- Express server to handle webhook ---
const app = express();
app.use(express.json());

app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// --- GitHub Workflow Trigger ---
async function triggerWorkflow() {
  await fetch('https://api.github.com/repos/neurobyte-netizen/Neurobyte-automation/actions/workflows/neurobyte.yml/dispatches', {
    method: 'POST',
    headers: {
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${ghPat}`,
    },
    body: JSON.stringify({ ref: 'main' })
  });
}

// --- YouTube Stats Placeholder ---
async function getYouTubeStats() {
  return { subs: 850, views: 12340, topVideo: "AI Tools 2026", watchHours: 3200 };
}

// --- OpenAI GPT-3.5 Turbo Chat Response ---
async function chatWithAI(prompt) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",   // ✅ works for all accounts
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300
    });

    const reply = completion.choices[0].message.content;
    console.log("OpenAI Raw Response:", reply);
    return reply;
  } catch (err) {
    console.error("❌ OpenAI API error:", err);
    return "😅 Bro, OpenAI didn’t reply… check logs!";
  }
}

// --- Telegram Message Handler ---
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  console.log("📩 Received:", text);

  if (text.toLowerCase().includes('upload')) {
    bot.sendMessage(chatId, "🎬 Okay bro, I’ll upload a fresh video now!");
    triggerWorkflow();
    return;
  }
  if (text.toLowerCase().includes('subs')) {
    const stats = await getYouTubeStats();
    bot.sendMessage(chatId, `👥 Current subs: ${stats.subs}`);
    return;
  }
  if (text.toLowerCase().includes('report')) {
    const stats = await getYouTubeStats();
    bot.sendMessage(chatId, `📊 Report:\nViews: ${stats.views}\nSubs: ${stats.subs}\nTop Video: ${stats.topVideo}\nWatch Hours: ${stats.watchHours}`);
    return;
  }
  if (text.toLowerCase().includes('adsense')) {
    const stats = await getYouTubeStats();
    if (stats.subs >= 1000 && stats.watchHours >= 4000) {
      bot.sendMessage(chatId, "✅ Channel is ready for AdSense!");
    } else {
      bot.sendMessage(chatId, `⚠️ Not ready yet bro. Subs: ${stats.subs}, Watch Hours: ${stats.watchHours}. Need 1000 subs + 4000 hours.`);
    }
    return;
  }
  if (text.toLowerCase().includes('idea') || text.toLowerCase().includes('trend')) {
    bot.sendMessage(chatId, "🔥 Idea: ‘Top 5 AI Tools for 2026’ or ‘Budget Android Phones vs iPhone SE 2026’. Shorts on AI photo apps are trending 🚀");
    return;
  }

  const aiReply = await chatWithAI(text);
  bot.sendMessage(chatId, aiReply);
});

// --- Start Express server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Webhook server running on port ${PORT}`);
});
