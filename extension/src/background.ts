///<reference types="chrome"/>
console.log("Hello background");

chrome.runtime.onInstalled.addListener((installedDetails: chrome.runtime.InstalledDetails): void => {
  // default state goes here
  // this runs ONE TIME ONLY (unless the user reinstalls your extension)
  console.log('onInstalled');
  if (installedDetails.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({
      url: 'index.html'
    });
  }
});

chrome.tabs.onUpdated.addListener((tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab): void => {
  console.log('onUpdated', tabId, changeInfo, tab);
  // if (tab.url && changeInfo.status === 'complete' && /^https/.test(tab.url)) {
  //   chrome.scripting.executeScript({
  //     target: { tabId: tabId },
  //     files: ["./foreground.js"]
  //   }).then((): void => {
  //     console.log("INJECTED THE FOREGROUND SCRIPT.");
  //   }).catch((error: unknown): void => {
  //     console.log(error)
  //   });
  // }
});


