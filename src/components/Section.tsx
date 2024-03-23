import { Flex, Heading, Stack, useTheme } from "@chakra-ui/react";
import React from "react";

export const Section = ({
    bg,
    title,
    anchor,
    children,
    isLast = false,
}: {
    bg: string;
    title: string;
    anchor: string;
    children: React.ReactNode;
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
    };

    function getPaddingProps() {
        if (bg === "brand.background.green") {
            return {
                // paddingTop: 16 + 12,
                paddingY: 16 + 12,
            };
        }
        return {
            paddingY: 16,
        };
    }

    return (
        <Flex
            paddingX={{ base: 0, md: 16 }}
            background={bg}
            w={"100vw"}
            justifyContent={"center"}
            marginBottom={isLast ? 0 : 12}
        >
            <Stack
                w={"100%"}
                maxW={"7xl"}
                paddingX={8}
                {...getPaddingProps()}
                id={`section-${anchor}`}
            >
                <Heading
                    mb={4}
                    display={"flex"}
                    flexDirection={"row"}
                    color={theme.colors.brand.orange}
                    size={"lg"}
                >
                    {title}
                    <hr style={hrStyle} />
                </Heading>
                {children}
            </Stack>
        </Flex>
    );
};
