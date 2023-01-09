/// <reference types="chrome"/>
import React from 'react';

import { createRoot } from 'react-dom/client';

import { App } from './foreground/app';

const body = document.querySelector('body');
const app = document.createElement('div');
app.id = 'gasbuddy-extension-root';
// app.style.position = 'fixed';
// app.style.height = '100%';
// app.style.width = '100%';
// app.style.top = '0';
// app.style.pointerEvents = 'none';
// app.style.zIndex = '1000';
body.append(app);

// inject react overlay
const container = document.getElementById(app.id);
const root = createRoot(container);
root.render(<React.StrictMode><App /></React.StrictMode>);

// Inject script to alert about web3 status
const script = document.createElement('script');
script.id = 'gasbuddy-foreground-injection';
script.type = 'text/javascript';
// eslint-disable-next-line no-undef
script.src = chrome.runtime.getURL('foreground-injection.js');
body.appendChild(script);
