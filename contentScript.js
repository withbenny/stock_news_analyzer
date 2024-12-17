const sourceExtractors = {
    "www.fool.com": "div.article-body",
    "www.benzinga.com": "div.article-body",
    "www.globenewswire.com": "div.article-body",
    "www.foxbusiness.com": "div.article-body",
    "www.zacks.com": "div.commentary_body",
    "www.investors.com": "div.single-post-content",
    "www.business-standard.com": "div#parent_top_div",
    "www.marketwatch.com": "div.column-full",
    "www.investorideas.com": "div.col-md-9",
    "www.forbes.com": "div.article-body",
    "moneymorning.com": "div.single-content",
    "markets.businessinsider.com": "div.news-content",
    "www.kiplinger.com": "div#article-body",
    "www.cnn.com": "div.article__content",
    "edition.cnn.com": "div.article__content",
    "amp.cnn.com": "div.article__content",
    "us.cnn.com": "div.article__content",
    "www.prnewswire.com": "div.col-lg-10",
    "investingnews.com": "div.body-description",
    "apnews.com": "div.RichTextStoryBody",
    "cointelegraph.com": "div.post-content",
    "www.financialexpress.com": "div#pcl-full-content",
    "stocknews.com": "div.post_content",
    "aap.thestreet.com": "div.m-detail--body",
    "www.moneycontrol.com": "div.content_wrapper",
    "www.businessinsider.com": "div.content-lock-content",
    "decrypt.co": "div.grid-cols-1",
    "www.newswire.ca": "div.col-lg-10",
    "cfo.economictimes.indiatimes.com": "div.article-section__body__news",
    "theweek.com": "div#article-body",
    "www.ft.com": "div#article-body",
    "africa.businessinsider.com": "div.container-wrapper",
  };

  function extractArticleContent() {
    const hostname = window.location.hostname;
    const selector = sourceExtractors[hostname];
  
    if (!selector) {
      console.warn(`Source domain '${hostname}' not supported.`);
      return "";
    }
  
    const contentElement = document.querySelector(selector);
    if (contentElement) {
      const article = contentElement.innerText.trim().replace(/\s+/g, " ");
      return article;
    } else {
      console.warn(`No content found for selector '${selector}' on domain '${hostname}'.`);
      return "";
    }
  }
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "GET_ARTICLE_TEXT") {
      try {
        const articleText = extractArticleContent();
        sendResponse({ text: articleText });
      } catch (error) {
        console.error("Error extracting content:", error);
        sendResponse({ text: "" });
      }
    }
  });
  