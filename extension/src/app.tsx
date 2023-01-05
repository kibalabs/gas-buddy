/// <reference types="chrome"/>
import React from 'react';

import { LocalStorageClient, Requester, KibaResponse } from '@kibalabs/core';
import { MockStorage, useInitialization } from '@kibalabs/core-react';
import { Alignment, Box, Checkbox, Direction, IHeadRootProviderProps, Image, KibaApp, KibaIcon, LoadingSpinner, PaddingSize, Spacing, Stack, Text } from '@kibalabs/ui-react';

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

interface GasData {
  fast: number;
  priceUSD: number;
  rapid: number;
  slow: number;
  standard: number;
}

export const App = (props: IAppProps): React.ReactElement => {
  const [isEnabled, setIsEnabled] = React.useState<boolean>(false);
  const [trackingInterval, setTrackingInterval] = React.useState<number | null>(null);
  const [data, setData] = React.useState<GasData | null>(null);

  useInitialization((): void => {
    // tracker.initialize();
    // tracker.trackApplicationOpen();
    // eslint-disable-next-line no-undef
    chrome.storage.local.get(['isGasTrackingEnabled'], (result) => {
      setIsEnabled(result.isGasTrackingEnabled !== undefined ? result.isGasTrackingEnabled : true);
    });
  });

  const updateData = React.useCallback((): void => {
    requester.getRequest('https://ethgasprice.org/api/gas').then((response: KibaResponse): void => {
      const newData = JSON.parse(response.content).data;
      setData(newData);
    });
  }, [requester]);

  React.useEffect((): (() => void) => {
    updateData();
    setTrackingInterval(window.setInterval((): void => {
      updateData()
    }, 5000));
    return (): void => {
      if (trackingInterval) {
        window.clearInterval(trackingInterval);
      }
    };
  }, [updateData]);

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
            <Stack direction={Direction.Horizontal} shouldAddGutters={true} childAlignment={Alignment.Center}>
              <Image width='4em' height='4em' source='/assets/icon.png' />
              <Text variant='header1'>Gas Buddy</Text>
            </Stack>
            <Checkbox isChecked={isEnabled} onToggled={onToggled} text='Enabled' />
            <Box height='10em'>
              <Stack direction={Direction.Vertical} contentAlignment={Alignment.Center} childAlignment={Alignment.Center} isFullHeight={true} isFullWidth={true}>
                {!data ? (
                  <LoadingSpinner />
                ) : (
                  <React.Fragment>
                    <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center}>
                      <KibaIcon variant='small' iconId='bs-fuel-pump-fill' />
                      <Spacing variant={PaddingSize.Narrow} />
                      <Text>{data.standard}</Text>
                    </Stack>
                    <Spacing />
                    <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center}>
                      <KibaIcon iconId='bs-lightning-charge-fill' />
                      <Spacing variant={PaddingSize.Narrow2} />
                      <Text>{data.rapid}</Text>
                    </Stack>
                    <Spacing />
                    <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center}>
                      <Text>$</Text>
                      <Spacing variant={PaddingSize.Narrow2} />
                      <Text>{Math.floor(data.priceUSD)}</Text>
                    </Stack>
                  </React.Fragment>
                )}
              </Stack>
            </Box>
            <Footer />
          </Stack>
        </Box>
      </GlobalsProvider>
    </KibaApp>
  );
};
