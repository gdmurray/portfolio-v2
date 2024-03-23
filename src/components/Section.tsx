import {Flex, Heading, Stack, useTheme} from "@chakra-ui/react";
import React from "react";


export const Section = ({bg, title, anchor, children, isLast = false}: {
    bg: string;
    title: string;
    anchor: string;
    children: React.ReactNode
    isLast?: boolean;
}) => {
    const theme = useTheme();
    const hrStyle = {
        display: "flex",
        flex: 1,
        alignSelf: "center",
        marginLeft: "1em",
        marginRight: "1em",
        color: theme.colors.brand.orange,
        borderColor: theme.colors.brand.orange,
        backgroundColor: theme.colors.brand.orange,
    }
    return (
        <Flex paddingX={{base: 2, md: 16}} background={bg} w={"99vw"} justifyContent={"center"} marginBottom={isLast ? 0 : 12}>
            <Stack w={"100%"} maxW={"7xl"} p={8} paddingY={16} id={`section-${anchor}`}>
                <Heading mb={4} display={"flex"} flexDirection={"row"} color={theme.colors.brand.orange}
                         size={"lg"}>{title}
                    <hr style={hrStyle}/>
                </Heading>
                {children}
            </Stack>
        </Flex>
    )
}
