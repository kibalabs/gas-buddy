import React from 'react';

import { Alignment, Box, Direction, Image, LinkBase, PaddingSize, Stack, Text } from '@kibalabs/ui-react';

export const Footer = (): React.ReactElement => {
  return (
    <Stack direction={Direction.Vertical} shouldAddGutters={true} childAlignment={Alignment.Center}>
      <LinkBase target='https://www.tokenpage.xyz?ref=gas-buddy'>
        <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true} padding={PaddingSize.Default}>
          <Text>Made by</Text>
          <Box shouldClipContent={true} width='1.5rem' height='1.5rem'>
            <Image source='https://www.tokenpage.xyz/assets/favicon.png' alternativeText='TokenPage Logo' fitType='contain' />
          </Box>
          <Text>Token Page</Text>
        </Stack>
      </LinkBase>
    </Stack>
  );
};
