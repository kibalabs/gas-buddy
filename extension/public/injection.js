let hasWallet = false;
let connectedAddress = null;
let chainId = null;

function sendStateUpdate() {
  window.postMessage({ from: 'injection.js', data: {
    hasWallet,
    connectedAddress,
    chainId,
  }});
}

if (typeof window.ethereum !== 'undefined') {
  hasWallet = true;

  window.ethereum.request({ method: 'eth_accounts' }).then((accounts) => {
    connectedAddress = (accounts && accounts.length > 0) ? accounts[0] : null;
    sendStateUpdate();
  });

  window.ethereum.on('accountsChanged', (accounts) => {
    connectedAddress = (accounts && accounts.length > 0) ? accounts[0] : null;
    sendStateUpdate();
  });

  window.ethereum.request({ method: 'eth_chainId' }).then((newChainId) => {
    chainId = newChainId;
    sendStateUpdate();
  });

  window.ethereum.on('chainChanged', (newChainId) => {
    chainId = newChainId;
    sendStateUpdate();
  });
} else {
  sendStateUpdate();
}
