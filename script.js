document.addEventListener("DOMContentLoaded", () => {
    /* =========== Cached Elements =========== */
    const $   = (id) => document.getElementById(id);
  
    const profileIcon = $("profile-icon");
    const dropdown    = $("dropdown-menu");
    const loginBtn    = $("login-btn");
    const signupBtn   = $("signup-btn");
    const loginModal  = $("login-modal");
    const signupModal = $("signup-modal");
  
    const welcome     = $("welcome-screen");
    const startBtn    = $("start-chatting");
  
    const sidebar     = $("sidebar");
    const chatbox     = $("chatbot-container");
    const closeBtn    = $("close-btn");
  
    const sendBtn     = $("send-btn");
    const voiceBtn    = $("voice-btn");
    const fileUp      = $("file-upload");
  
    const input       = $("chatbot-input");
    const msgs        = $("chatbot-messages");
  
    const histBtn     = $("history-btn");
    const clrHistBtn  = $("clear-history-btn");
    const histBox     = $("chat-history");
  
    /* =========== UI Toggles =========== */
    profileIcon.onclick = () => {
      dropdown.style.display =
        dropdown.style.display === "flex" ? "none" : "flex";
    };
  
    loginBtn.onclick  = () => { loginModal.style.display  = "flex"; dropdown.style.display = "none"; };
    signupBtn.onclick = () => { signupModal.style.display = "flex"; dropdown.style.display = "none"; };
  
    document.querySelectorAll(".close").forEach(btn => {
      btn.onclick = () => $(btn.dataset.close).style.display = "none";
    });
  
    startBtn.onclick = () => {
      welcome.style.display = "none";
      sidebar.style.display = "flex";
      chatbox.style.display = "flex";
    };
    closeBtn.onclick = () => location.reload();
  
    /* =========== Chat functions =========== */
    const append = (sender, text) => {
      const div = document.createElement("div");
      div.className = `message ${sender}`;
      div.textContent = text;
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
    };
  
    const sendMessage = () => {
      const text = input.value.trim();
      if (!text) return;
      append("user", text);
      input.value = "";
      getBotResponse(text);
    };
  
    sendBtn.onclick  = sendMessage;
    input.onkeypress = (e) => { if (e.key === "Enter") sendMessage(); };
  
    /* =========== OpenAI Fetch (demo) =========== */
    async function getBotResponse(userMsg) {
      //  !!! Replace with backend proxy in production !!!
      const apiKey = "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";
      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + apiKey,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMsg }],
            max_tokens: 150,
          }),
        });
        const data = await res.json();
        append("bot", data.choices[0].message.content);
      } catch {
        append("bot", "⚠️ Could not reach chatbot.");
      }
    }
  
    /* =========== Extras =========== */
    voiceBtn.onclick = () => {
      if (!("webkitSpeechRecognition" in window)) return alert("Voice not supported.");
      const rec = new webkitSpeechRecognition();
      rec.lang = "en-US";
      rec.start();
      voiceBtn.textContent = "🎙️ Listening…";
      rec.onresult = (e) => {
        input.value = e.results[0][0].transcript;
        sendMessage();
        voiceBtn.textContent = "🎤";
      };
      rec.onerror = () => {
        append("bot", "⚠️ Voice error.");
        voiceBtn.textContent = "🎤";
      };
      rec.onend   = () => { voiceBtn.textContent = "🎤"; };
    };
  
    fileUp.onchange = (e) => {
      const f = e.target.files[0];
      if (f) append("user", "📄 Uploaded: " + f.name);
    };
  
    histBtn.onclick   = () => { histBox.style.display = histBox.style.display === "block" ? "none" : "block"; };
    clrHistBtn.onclick= () => { msgs.innerHTML = ""; histBox.innerHTML = ""; };
  });
  