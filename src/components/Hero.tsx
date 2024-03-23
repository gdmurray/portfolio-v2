import {Container, Flex, Heading, Stack, Text, useTheme} from "@chakra-ui/react";
import React, {useRef} from "react";
import {AnimatePresence, motion, useInView} from "framer-motion";

const MotionText = motion(Text);
const MotionHeading = motion(Heading);

export function Hero() {
    const theme = useTheme();
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, {
        once: true,
    })

    function getMotionProps(index: number) {
        return {
            initial: "hidden",
            animate: inView ? "visible" : "hidden",
            variants: {
                hidden: {opacity: 0, y: -50},
                visible: {opacity: 1, y: 0, transition: {duration: 0.5, delay: 0.25 * index}}
            }
        }
    }

    return (
        <Flex paddingX={{base: 2, md: 16}} ref={ref} background={"brand.background.beige"} w={"99vw"}
              justifyContent={"center"} marginBottom={12}>
            <Flex w={"100%"} p={8} paddingY={32} maxW={"7xl"} id={"section-hero"} alignItems={"flex-start"}>
                <AnimatePresence>
                    <Stack>
                        <MotionText
                            key={'hello'}
                            {...getMotionProps(1)}
                            color={"brand.tangerineOrange.900"} fontSize={18} fontWeight={600}>Hello, I am</MotionText>
                        <MotionHeading
                            key={'name'}
                            {...getMotionProps(2)}
                            as={"h1"} fontSize={"6xl"}>Greg Murray</MotionHeading>
                        <MotionHeading
                            key={'introduction'}
                            {...getMotionProps(3)}
                            as={"h2"} color={theme.colors.gray["600"]}>Full Stack Software Engineer.</MotionHeading>
                    </Stack>
                </AnimatePresence>
            </Flex>
        </Flex>
    )
}
