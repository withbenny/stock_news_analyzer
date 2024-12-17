chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "ANALYZE_SENTIMENT") {
      (async () => {
        try {
          const tab = await getCurrentTab();
          const articleText = await getArticleTextFromTab(tab.id);
          const apiResult = await callSentimentAPI(articleText);
          sendResponse({ success: true, result: apiResult });
        } catch (error) {
          console.error("Error:", error);
          sendResponse({ success: false, error: error.message });
        }
      })();
      return true;
    }
  });
  
  async function getCurrentTab() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0];
  }
  
  function getArticleTextFromTab(tabId) {
    return new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tabId, { type: "GET_ARTICLE_TEXT" }, (response) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError.message);
        }
        if (!response || !response.text) {
          return reject("No article text found.");
        }
        resolve(response.text);
      });
    });
  }
  
  async function callSentimentAPI(text) {
    const payload = {
      text: text,
      use_chunks: true
    };
  
    const response = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error("API request failed with status " + response.status);
    }
    
    const result = await response.json();
    return result;
  }
  