const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886"; // Default Twilio Sandbox number

const sendWhatsAppMsg = async (to, message) => {
  if (!accountSid || !authToken) {
    console.log("Twilio credentials not found. MOCK WHATSAPP LOG:");
    console.log(`TO: ${to}`);
    console.log(`MESSAGE: ${message}`);
    return { success: true, mock: true };
  }

  try {
    const client = twilio(accountSid, authToken);
    const response = await client.messages.create({
      body: message,
      from: whatsappFrom,
      to: `whatsapp:${to}`
    });
    return { success: true, sid: response.sid };
  } catch (error) {
    console.error("WhatsApp Error:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendWhatsAppMsg };
