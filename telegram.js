require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const token = process.env.TELEGRAM_BOT_TOKEN;
const ghPat = process.env.GH_PAT;
const AI_PROVIDER = process.env.AI_PROVIDER || "huggingface";
const hfKey = process.env.HF_API_KEY;

const bot = new TelegramBot(token, { polling: true });

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

// --- HuggingFace AI Chat Response ---
async function chatWithAI(prompt) {
  try {
    const response = await fetch("https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    });

    const data = await response.json();
    console.log("HF Raw Response:", JSON.stringify(data, null, 2)); // Debug log

    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text;
    }
    if (data?.generated_text) {
      return data.generated_text;
    }
    if (typeof data === "string") {
      return data;
    }

    return "🤖 Couldn’t generate a reply just now, but I’m still here!";
  } catch (err) {
    console.error("❌ HuggingFace API error:", err);
    return "😅 Bro, HuggingFace didn’t reply… check logs!";
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
