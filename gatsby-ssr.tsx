import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './src/@chakra-ui/gatsby-plugin/theme'; // Adjust the path to where your theme is defined

export const wrapRootElement = ({ element }) => {
    return (
        <ChakraProvider theme={theme}>
            {element}
        </ChakraProvider>
    );
};
