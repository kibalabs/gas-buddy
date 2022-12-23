///<reference types="chrome"/>
import React from 'react';

import { LocalStorageClient, Requester } from '@kibalabs/core';
import { MockStorage, useInitialization } from '@kibalabs/core-react';
import { Alignment, Box, Checkbox, Direction, Head, IHeadRootProviderProps, KibaApp, PaddingSize, Stack, Text } from '@kibalabs/ui-react';

import { GlobalsProvider, IGlobals } from './globalsContext';
import { buildAppTheme } from './theme';
import { Footer } from './components/Footer';


declare global {
  export interface Window {
    KRT_API_URL?: string;
  }
}
const requester = new Requester(undefined, undefined, false);
const localStorageClient = new LocalStorageClient(typeof window !== 'undefined' ? window.localStorage : new MockStorage());

const globals: IGlobals = {
  requester,
  localStorageClient,
};

const theme = buildAppTheme();
// const tracker = new EveryviewTracker('26c8cdc5634542969311db49441ce95b', true);

export interface IAppProps extends IHeadRootProviderProps {
  staticPath?: string;
}

export const App = (props: IAppProps): React.ReactElement => {
  const [isEnabled, setIsEnabled] = React.useState<boolean>(false);

  useInitialization((): void => {
    // tracker.initialize();
    // tracker.trackApplicationOpen();
    chrome.storage.local.get(['isGasTrackingEnabled'], function(result) {
      setIsEnabled(result.isGasTrackingEnabled !== undefined ? result.isGasTrackingEnabled : true);
    });
  });

  const onToggled = async (): Promise<void> => {
    setIsEnabled(!isEnabled);
    chrome.storage.local.set({isGasTrackingEnabled: !isEnabled});
    const tabs = await chrome.tabs.query({});
    for (let i=0; i<tabs.length; i+= 1) {
      if (!tabs[i].id) {
        continue;
      }
      try {
        await chrome.tabs.sendMessage(tabs[i].id, {isGasTrackingEnabled: !isEnabled});
      } catch (error: unknown) {
        console.error(`Failed to send to tab: ${error}`);
      }
    };
  };

  return (
    <KibaApp theme={theme} setHead={props.setHead} isFullPageApp={true}>
      <GlobalsProvider globals={globals}>
        <Box minHeight='200px' minWidth='400px'>
          <Stack direction={Direction.Vertical} shouldAddGutters={true} padding={PaddingSize.Wide} childAlignment={Alignment.Center} contentAlignment={Alignment.Fill} isFullWidth={true} isFullHeight={true}>
            <Text variant='header1'>Gas Buddy</Text>
            <Checkbox isChecked={isEnabled} onToggled={onToggled} text='Enabled' />
            <Footer />
          </Stack>
        </Box>
      </GlobalsProvider>
    </KibaApp>
  );
};
