export default async function handler(req, res) {
  const origin = req.headers.origin;
  const allowedOrigins = [
    "http://localhost:3000",
    "https://apastron-fitness-cyc6.vercel.app" 
  ];

  //  Handle CORS Preflight (Crucial for deployed apps)
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  // Block non-POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
 
if (origin && !allowedOrigins.includes(origin)) {
   return res.status(403).json({ error: `Forbidden: ${origin} not allowed` });
}
   if (!req.headers["content-type"]?.includes("application/json")) {
    return res.status(400).json({ error: "Invalid request: Content-Type must be JSON" });
  }

  try {
    const { message, context, history } = req.body;

    // 1. Format history for Gemini
    const formattedHistory = history?.map((chat) => ({
      role: chat.role === "ai" ? "model" : "user", // Gemini expects "model"
      parts: [{ text: chat.text }],
    })) || [];

    // 2. Combine history + new message
    const contents = [
      ...formattedHistory,
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.BAMBI_VAULT_TOPRIM}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
       body: JSON.stringify({
  system_instruction: {
    parts: [{ text: context }],
  },
  contents: contents,
}),
      }
    );

    const data = await response.json();

   if (data.error) {
    console.error("API ERROR CODE:", data.error.code);
    console.error("API ERROR MESSAGE:", data.error.message);
    // DO NOT log 'data' or 'apiUrl'
}

    // 3. Handle bad responses safely
    if (!data.candidates || !data.candidates.length) {
      return res.status(200).json({
        text: "I'm having trouble responding right now. Try rephrasing slightly.",
      });
    }

    const text =
      data.candidates[0]?.content?.parts?.[0]?.text ||
      "I'm having trouble responding right now.";

    return res.status(200).json({ text });

  } catch (error) {
    console.error("AI ERROR:", error);
    return res.status(500).json({
      error: "AI request failed",
      details: error.message,
    });
  }
}