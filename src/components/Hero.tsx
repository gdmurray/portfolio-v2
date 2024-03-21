import {Container, Flex, Heading, Stack, Text, useTheme} from "@chakra-ui/react";
import React from "react";

export function Hero(){
    const theme = useTheme()
    return (
        <Flex background={"brand.background.beige"} w={"99vw"} justifyContent={"center"}>
            <Flex w={"100%"} p={8} maxW={"7xl"} id={"section-hero"}>
                <Stack>
                    <Text color={theme.colors.brand.orange} fontSize={18}>Hello, I am</Text>
                    <Heading as={"h1"} fontSize={"6xl"}>Greg Murray</Heading>
                    <Heading as={"h2"} color={theme.colors.gray["300"]}>Full Stack Software Engineer.</Heading>
                </Stack>
            </Flex>
        </Flex>

    )
}
