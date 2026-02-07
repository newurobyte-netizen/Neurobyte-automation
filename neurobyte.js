const fs = require('fs');
const axios = require('axios');

async function generateScript(topic) {
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4",
      messages: [{ role: "user", content: `Write a 3-minute YouTube script about ${topic}` }]
    },
    { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
  );
  return response.data.choices[0].message.content;
}

async function generateVideo(scriptText) {
  fs.writeFileSync("output/script.txt", scriptText);
  console.log("✅ Script saved. Next: integrate TTS + FFmpeg for video.");
}

(async () => {
  const topic = "Latest budget smartphones in 2026";
  const script = await generateScript(topic);
  await generateVideo(script);
})();
