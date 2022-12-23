///<reference types="chrome"/>
import React from 'react';

import { KibaResponse, LocalStorageClient, Requester } from '@kibalabs/core';
import { MockStorage, useEventListener, useInitialization } from '@kibalabs/core-react';
import { Text, IHeadRootProviderProps, ThemeProvider, Box, ColorSettingView, LoadingSpinner, Stack, Direction, KibaIcon, Alignment, Spacing, PaddingSize } from '@kibalabs/ui-react';

import { GlobalsProvider, IGlobals } from '../globalsContext';
import { buildAppTheme } from '../theme';
import { FloatingView } from '../components/FloatingView';


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

export interface IAppProps extends IHeadRootProviderProps {
  staticPath?: string;
}

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

export const App = (props: IAppProps): React.ReactElement => {
  const [isGasTrackingEnabled, setIsGasTrackingEnabled] = React.useState<boolean>(false);
  const [trackingInterval, setTrackingInterval] = React.useState<number | null>(null);
  const [data, setData] = React.useState<Data | null>(null);
  const [connectionData, setConnectionData] = React.useState<ConnectionData | null>(null);
  console.log('isGasTrackingEnabled', isGasTrackingEnabled);

  useInitialization((): void => {
    chrome.storage.local.get(['isGasTrackingEnabled'], function(result) {
      setIsGasTrackingEnabled(result.isGasTrackingEnabled !== undefined ? result.isGasTrackingEnabled : true);
    });
    chrome.runtime.onMessage.addListener((message: unknown): void => {
      if (message.isGasTrackingEnabled !== undefined) {
        setIsGasTrackingEnabled(message.isGasTrackingEnabled);
      }
    });
  });

  React.useEffect((): void => {
    console.log('isGasTrackingEnabled changed');
    if (isGasTrackingEnabled && connectionData && connectionData.connectedAddress && connectionData.chainId === '0x1') {
      startTracking();
    } else {
      endTracking();
    }
  }, [isGasTrackingEnabled, connectionData]);

  useEventListener(window, 'message', (event: Event): void => {
    if (event.data.from === 'injection.js') {
      setConnectionData(event.data.data);
    }
  });

  const startTracking = (): void => {
    if (trackingInterval || !isGasTrackingEnabled) {
      return;
    }
    console.log('startTracking');
    setTrackingInterval(window.setInterval((): void => {
      requester.getRequest('https://ethgasprice.org/api/gas').then((response: KibaResponse): void => {
        setData(JSON.parse(response.content).data);
      });
    }, 5000));
  };

  const endTracking = (): void => {
    if (!trackingInterval) {
      return;
    }
    console.log('endTracking');
    window.clearInterval(trackingInterval);
    setTrackingInterval(null);
  }

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
