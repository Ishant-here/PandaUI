const axios = require("axios");

const FREE_MODELS = [
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "tngtech/deepseek-r1t2-chimera:free",
  "deepseek/deepseek-chat-v3.1:free",
  "z-ai/glm-4.5-air:free",
  "openrouter/free",
];

const askAI = async (messages) => {
  if (!messages?.length) throw new Error("Empty messages array");

  const prefilledMessages = [...messages, { role: "assistant", content: "{" }];

  let lastError = null;

  for (const model of FREE_MODELS) {
    try {
      console.log(`\n🚀 Trying: ${model}`);

      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model,
          messages: prefilledMessages,
          temperature: 0.3,
          max_tokens: 4000,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "PandaUI",
            "Content-Type": "application/json",
          },
          timeout: 40000,
        }
      );

      const raw = response.data?.choices?.[0]?.message?.content;
      if (!raw?.trim()) {
        lastError = `Empty content from ${model}`;
        continue;
      }

      let content = "{" + raw;

      // ✅ FIX: Collapse "{{" to "{" (AI sometimes adds its own brace)
      content = content.replace(/^\{\{+/, "{");

      // ✅ Skip safety responses
      if (content.toLowerCase().includes("user safety")) {
        lastError = `Safety response from ${model}`;
        continue;
      }

      // ✅ Validate it starts with {
      if (!content.trim().startsWith("{")) {
        lastError = `Non-JSON response from ${model}`;
        continue;
      }

      console.log(`✅ Success with ${model}`);
      console.log(`Response preview: ${content.substring(0, 200)}`);
      return content;
    } catch (error) {
      const errMsg = error.response?.data?.error?.message || error.message;
      console.error(`❌ ${model} failed: ${errMsg}`);
      lastError = errMsg;
    }
  }

  throw new Error(`All models failed. Last: ${lastError}`);
};

module.exports = askAI;