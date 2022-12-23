/// <reference types="chrome"/>
import React from 'react';

import { LocalStorageClient, Requester } from '@kibalabs/core';
import { MockStorage, useInitialization } from '@kibalabs/core-react';
import { Alignment, Box, Checkbox, Direction, IHeadRootProviderProps, KibaApp, PaddingSize, Stack, Text } from '@kibalabs/ui-react';

import { Footer } from './components/Footer';
import { GlobalsProvider, IGlobals } from './globalsContext';
import { buildAppTheme } from './theme';


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
    // eslint-disable-next-line no-undef
    chrome.storage.local.get(['isGasTrackingEnabled'], (result) => {
      setIsEnabled(result.isGasTrackingEnabled !== undefined ? result.isGasTrackingEnabled : true);
    });
  });

  const onToggled = async (): Promise<void> => {
    setIsEnabled(!isEnabled);
    // eslint-disable-next-line no-undef
    chrome.storage.local.set({ isGasTrackingEnabled: !isEnabled });
    // eslint-disable-next-line no-undef
    const tabs = await chrome.tabs.query({});
    for (let i = 0; i < tabs.length; i += 1) {
      if (tabs[i].id) {
        try {
          // eslint-disable-next-line no-undef, no-await-in-loop
          await chrome.tabs.sendMessage(tabs[i].id, { isGasTrackingEnabled: !isEnabled });
        } catch (error: unknown) {
          console.error(`Failed to send to tab: ${error}`);
        }
      }
    }
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
