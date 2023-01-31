/// <reference types="chrome"/>
import React from 'react';

import { createRoot } from 'react-dom/client';
import { resetCss } from '@kibalabs/ui-react';

import { App } from './foreground/app';

const body = document.querySelector('body');
const appContainerWrapper = document.createElement('div');
body.append(appContainerWrapper);

const resetStyle = document.createElement('style');
resetStyle.appendChild(document.createTextNode(`
  #gassbuddy-extension-root {
    ${resetCss}
  }
`));
appContainerWrapper.append(resetStyle);

const appContainer = document.createElement('div');
appContainer.id = 'gassbuddy-extension-root';
appContainerWrapper.append(appContainer);

const root = createRoot(appContainer);
root.render(<React.StrictMode><App /></React.StrictMode>);

// Inject script to alert about web3 status
const script = document.createElement('script');
script.id = 'gasbuddy-foreground-injection';
script.type = 'text/javascript';
// eslint-disable-next-line no-undef
script.src = chrome.runtime.getURL('foreground-injection.js');
body.appendChild(script);
