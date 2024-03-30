import { Box, Flex, Heading, HStack, Stack, useTheme } from "@chakra-ui/react";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const MotionHeading = motion(Heading);
const MotionBox = motion(Box);
export const Section = ({
    bg,
    title,
    anchor,
    children,
    isLast = false,
    baseDelay = 0,
}: {
    bg: string;
    title: string;
    anchor: string;
    children: React.ReactNode;
    isLast?: boolean;
    baseDelay?: number;
}) => {
    const ref = useRef(null);
    const inView = useInView(ref, {
        once: true,
    });

    const headerVariants = {
        visible: {
            opacity: 1,
            transition: {
                duration: 0.25,
                delay: baseDelay,
            },
        },
        hidden: {
            opacity: 0,
        },
    };

    const boxVariants = {
        visible: {
            width: "100%",
            transition: {
                duration: 0.5,
                delay: baseDelay + 0.15,
            },
        },
        hidden: {
            width: "0%",
        },
    };

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
            ref={ref}
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
                <HStack mb={4}>
                    <MotionHeading
                        initial={"hidden"}
                        animate={inView ? "visible" : "hidden"}
                        variants={headerVariants}
                        flexShrink={0}
                        display={"flex"}
                        flexDirection={"row"}
                        color={theme.colors.brand.orange}
                        size={"lg"}
                    >
                        {title}
                    </MotionHeading>
                    <MotionBox
                        initial={"hidden"}
                        animate={inView ? "visible" : "hidden"}
                        variants={boxVariants}
                    >
                        <hr style={hrStyle} />
                    </MotionBox>
                </HStack>
                {children}
            </Stack>
        </Flex>
    );
};
