const { google } = require('googleapis');
const fs = require('fs');

async function uploadVideo() {
  const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY
  });

  const res = await youtube.videos.insert({
    part: 'snippet,status',
    requestBody: {
      snippet: {
        title: "NeuroByte Daily Tech Update",
        description: "Tech Simplified, Future Amplified",
        tags: ["tech", "smartphones", "AI", "NeuroByte"]
      },
      status: { privacyStatus: "public" }
    },
    media: {
      body: fs.createReadStream("output/video.mp4")
    }
  });

  console.log("✅ Video uploaded:", res.data.id);
}

uploadVideo().catch(console.error);
