document.getElementById("analyzeBtn").addEventListener("click", () => {
    const resultDiv = document.getElementById("result");
    const loadingDiv = document.getElementById("loading");

    resultDiv.classList.add("hidden");
    loadingDiv.classList.remove("hidden");

    chrome.runtime.sendMessage({ type: "ANALYZE_SENTIMENT" }, (response) => {
      loadingDiv.classList.add("hidden");
  
      if (chrome.runtime.lastError || !response || !response.success) {
        resultDiv.classList.remove("hidden");
        resultDiv.innerHTML = `<p style="color:red;">Error: ${
          (response && response.error) || "Something went wrong."
        }</p>`;
        return;
      }

      const { sentiment, probabilities } = response.result;
      resultDiv.classList.remove("hidden");
      resultDiv.innerHTML = `
        <p><strong>Sentiment:</strong> ${sentiment}</p>
        <ul>
          <li>Bearish: ${(probabilities.Bearish * 100).toFixed(2)}%</li>
          <li>Neutral: ${(probabilities.Neutral * 100).toFixed(2)}%</li>
          <li>Bullish: ${(probabilities.Bullish * 100).toFixed(2)}%</li>
        </ul>
      `;
    });
  });
  