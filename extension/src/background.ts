/// <reference types="chrome"/>
// eslint-disable-next-line no-undef
chrome.runtime.onInstalled.addListener((installedDetails: chrome.runtime.InstalledDetails): void => {
  // default state goes here
  // this runs ONE TIME ONLY (unless the user reinstalls your extension)
  // eslint-disable-next-line no-console
  console.log('onInstalled');
  // eslint-disable-next-line no-undef
  if (installedDetails.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    // eslint-disable-next-line no-undef
    chrome.tabs.create({
      url: 'index.html',
    });
  }
});

// eslint-disable-next-line no-undef
chrome.tabs.onUpdated.addListener((tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab): void => {
  // eslint-disable-next-line no-console
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
