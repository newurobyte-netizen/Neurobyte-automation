const { default: makeWASocket, useMultiFileAuthState } = require('@adiwajshing/baileys');

async function sendNotification(message) {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');
  const sock = makeWASocket({ auth: state });

  await sock.ev.on('creds.update', saveCreds);

  const jid = process.env.WHATSAPP_SESSION;
  await sock.sendMessage(jid, { text: message });

  console.log("✅ WhatsApp notification sent:", message);
}

sendNotification("NeuroByte automation completed successfully!");
