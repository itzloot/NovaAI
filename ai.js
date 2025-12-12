const chatBox = document.getElementById("chatBox");
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");

let model;

async function loadModel() {
  appendMessage("🔥 Loading Nova AI (Local Mode)...", "ai");

  model = await webllm.createWebLLM({
    model: "Phi-3-mini-4k-instruct-q4f32_1-MLC",
  });

  appendMessage("✅ Nova AI Ready (Offline Mode)", "ai");
}

loadModel();

function appendMessage(text, type) {
  const div = document.createElement("div");
  div.className = type === "user" ? "user-msg" : "ai-msg";
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", e => { if (e.key === "Enter") sendMessage(); });

async function sendMessage() {
  const msg = userInput.value.trim();
  if (!msg) return;

  appendMessage(msg, "user");
  userInput.value = "";

  const aiDiv = document.createElement("div");
  aiDiv.className = "ai-msg";
  aiDiv.innerText = "Inferno AI is generating...";
  chatBox.appendChild(aiDiv);

  // Local AI generate
  const reply = await model.chat.completions.create({
    messages: [
      { role: "user", content: msg }
    ],
    temperature: 0.7,
  });

  aiDiv.innerText = reply.choices[0].message.content;
}
const res = await model.chat.completions.create({
  messages: [
    {
      role: "system",
      content:
        "You are Nova AI — an Edge Computing Grandmaster. You specialize in ultra-low-latency inference, edge deployment, local LLM optimization, WebGPU acceleration, IoT, embedded systems, fog computing, on-device AI, micro-model execution, quantization, and real-time processing. Give expert, precise, clean, high-level technical answers."
    },
    {
      role: "user",
      content: text
    }
  ],
  temperature: 0.7
});