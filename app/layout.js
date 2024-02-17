// import theme style scss file
'use client'

import 'styles/theme.scss';
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ChakraProvider } from '@chakra-ui/react'


export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className='bg-light'>
            <ThirdwebProvider activeChain="mumbai" clientId='f3324b0ff2cfad9f6974b1c11c89ab79'>
            <ChakraProvider>
                {children}
                </ChakraProvider>
                </ThirdwebProvider>
            </body>
        </html>
    )
}
