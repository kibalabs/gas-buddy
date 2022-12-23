/// <reference types="chrome"/>
import React from 'react';

import { KibaResponse, LocalStorageClient, Requester } from '@kibalabs/core';
import { MockStorage, useEventListener, useInitialization } from '@kibalabs/core-react';
import { Alignment, Box, ColorSettingView, Direction, KibaIcon, LoadingSpinner, PaddingSize, Spacing, Stack, Text, ThemeProvider } from '@kibalabs/ui-react';

import { FloatingView } from '../components/FloatingView';
import { GlobalsProvider, IGlobals } from '../globalsContext';
import { buildAppTheme } from '../theme';


declare global {
  export interface Window {
    KRT_API_URL?: string;
  }
}

const requester = new Requester(undefined, undefined, false);
const localStorageClient = new LocalStorageClient(typeof window !== 'undefined' ? window.localStorage : new MockStorage());

const theme = buildAppTheme();
// const tracker = new EveryviewTracker('26c8cdc5634542969311db49441ce95b', true);

const globals: IGlobals = {
  requester,
  localStorageClient,
};

interface Data {
  fast: number;
  priceUSD: number;
  rapid: number;
  slow: number;
  standard: number;
}

interface ConnectionData {
  connectedAddress: string | null;
  chainId: string;
}

export const App = (): React.ReactElement => {
  const [isGasTrackingEnabled, setIsGasTrackingEnabled] = React.useState<boolean>(false);
  const [trackingInterval, setTrackingInterval] = React.useState<number | null>(null);
  const [data, setData] = React.useState<Data | null>(null);
  const [connectionData, setConnectionData] = React.useState<ConnectionData | null>(null);

  useInitialization((): void => {
    // eslint-disable-next-line no-undef
    chrome.storage.local.get(['isGasTrackingEnabled'], (result) => {
      setIsGasTrackingEnabled(result.isGasTrackingEnabled !== undefined ? result.isGasTrackingEnabled : true);
    });
    // eslint-disable-next-line no-undef
    chrome.runtime.onMessage.addListener((message: unknown): void => {
      if (message.isGasTrackingEnabled !== undefined) {
        setIsGasTrackingEnabled(message.isGasTrackingEnabled);
      }
    });
  });

  useEventListener(window, 'message', (event: Event): void => {
    if (event.data.from === 'injection.js') {
      setConnectionData(event.data.data);
    }
  });

  const startTracking = React.useCallback((): void => {
    if (trackingInterval || !isGasTrackingEnabled) {
      return;
    }
    setTrackingInterval(window.setInterval((): void => {
      requester.getRequest('https://ethgasprice.org/api/gas').then((response: KibaResponse): void => {
        setData(JSON.parse(response.content).data);
      });
    }, 5000));
  }, [trackingInterval, isGasTrackingEnabled]);

  const endTracking = React.useCallback((): void => {
    if (!trackingInterval) {
      return;
    }
    window.clearInterval(trackingInterval);
    setTrackingInterval(null);
  }, [trackingInterval]);

  React.useEffect((): void => {
    if (isGasTrackingEnabled && connectionData && connectionData.connectedAddress && connectionData.chainId === '0x1') {
      startTracking();
    } else {
      endTracking();
    }
  }, [isGasTrackingEnabled, connectionData, startTracking, endTracking]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalsProvider globals={globals}>
        <ColorSettingView>
          {isGasTrackingEnabled && trackingInterval && (
            <FloatingView isFullWidth={false} isFullHeight={false} positionBottom='0' positionRight='0'>
              <Box variant='topBar' isFullHeight={false} isFullWidth={false} shouldClipContent={true}>
                <Stack direction={Direction.Horizontal} isFullWidth={false} childAlignment={Alignment.Center} contentAlignment={Alignment.Center}>
                  {data ? (
                    <React.Fragment>
                      <KibaIcon variant='small2' iconId='bs-fuel-pump-fill' />
                      <Spacing variant={PaddingSize.Narrow} />
                      <Text variant='note'>{data.standard}</Text>
                      <Spacing />
                      <KibaIcon variant='small' iconId='bs-lightning-charge-fill' />
                      <Spacing variant={PaddingSize.Narrow2} />
                      <Text variant='note'>{data.rapid}</Text>
                      <Spacing />
                      <Text variant='note'>$</Text>
                      <Spacing variant={PaddingSize.Narrow2} />
                      <Text variant='note'>{data.priceUSD}</Text>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <LoadingSpinner variant='small' />
                      <Spacing variant={PaddingSize.Narrow} />
                      <Text variant='note'>Loading gas price</Text>
                    </React.Fragment>
                  )}
                </Stack>
              </Box>
            </FloatingView>
          )}
        </ColorSettingView>
      </GlobalsProvider>
    </ThemeProvider>
  );
};
