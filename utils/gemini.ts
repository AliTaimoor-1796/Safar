const GEMINI_API_KEY = "AIzaSyA06mKS9FlSlycrGjlbT7HJti1cfdQh08g";

export const sendToGemini = async (userMessage: string) => {
  try {
    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: userMessage,
              },
            ],
          },
        ],
      }),
    });

    const json = await res.json();
    const response = json?.candidates?.[0]?.content?.parts?.[0]?.text;
    return response || "Sorry, I couldn't understand that.";
  } catch (err) {
    console.error("Gemini Error:", err);
    return "Something went wrong!";
  }
};
