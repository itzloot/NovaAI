const chatWindow = document.getElementById("chatWindow");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

let memory = []; // Level 10 long-term memory

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = "message " + sender;
  div.innerText = text;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

sendBtn.onclick = () => sendMessage();
input.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const msg = input.value.trim();
  if (!msg) return;

  addMessage(msg, "user");
  input.value = "";

  const aiBubble = document.createElement("div");
  aiBubble.className = "message ai";
  aiBubble.innerText = "Inferno AI is generating…";
  chatWindow.appendChild(aiBubble);

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      model: "llama3.1",
      stream: true,
      prompt: `
You are INFERNO AI LEVEL 10.

Rules:
- You act like an advanced Jarvis AI.
- You have long-term memory: ${JSON.stringify(memory)}
- You execute reasoning chains.
- You analyze, think, decide, and respond with high intelligence.
- You specialize in edge computing & ultra low latency.
- Always return powerful, structured, professional responses.

User: ${msg}
AI:`})
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    try {
      const json = JSON.parse(chunk);
      fullText += json.response;
      aiBubble.innerText = fullText;
    } catch (e) {}
  }

  memory.push({ user: msg, ai: fullText }); // Save to Level 10 memory
}