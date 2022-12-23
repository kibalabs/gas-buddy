/// <reference types="chrome"/>
import React from 'react';

import { createRoot } from 'react-dom/client';

import { App } from './foreground/app';

const body = document.querySelector('body');
const app = document.createElement('div');
app.id = 'kiba-extension-root';
app.style.position = 'fixed';
app.style.height = '100%';
app.style.width = '100%';
app.style.top = '0';
app.style.pointerEvents = 'none';
body.append(app);

// inject react overlay
const container = document.getElementById(app.id);
const root = createRoot(container);
root.render(<React.StrictMode><App /></React.StrictMode>);

// Inject script to alert about web3 status
const script = document.createElement('script');
script.type = 'text/javascript';
// eslint-disable-next-line no-undef
script.src = chrome.runtime.getURL('injection.js');
body.appendChild(script);
