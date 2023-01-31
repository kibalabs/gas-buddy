let hasWallet = false;
let connectedAddress: string | null = null;
let chainId: string | null = null;

function sendStateUpdate(): void {
  window.postMessage({
    from: 'gasbuddy-injection',
    data: {
      hasWallet,
      connectedAddress,
      chainId,
    },
  });
}

// @ts-ignore
if (typeof window.ethereum !== 'undefined') {
  hasWallet = true;
  // @ts-ignore
  window.ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]): void => {
    connectedAddress = (accounts && accounts.length > 0) ? accounts[0] : null;
    sendStateUpdate();
  });
  // @ts-ignore
  window.ethereum.on('accountsChanged', (accounts: string[]): void => {
    connectedAddress = (accounts && accounts.length > 0) ? accounts[0] : null;
    sendStateUpdate();
  });
  // @ts-ignore
  window.ethereum.request({ method: 'eth_chainId' }).then((newChainId: string): void => {
    chainId = newChainId;
    sendStateUpdate();
  });
  // @ts-ignore
  window.ethereum.on('chainChanged', (newChainId: string) => {
    chainId = newChainId;
    sendStateUpdate();
  });
} else {
  hasWallet = false;
  sendStateUpdate();
}
