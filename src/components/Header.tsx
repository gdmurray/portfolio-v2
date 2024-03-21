import {Avatar, Box, Button, Flex, Heading, HStack, IconButton, Stack, Text, useTheme} from "@chakra-ui/react";
import React, {useEffect, useRef, useState} from "react";
import {IconMenuDeep, IconSun, IconX} from "@tabler/icons-react";
import {Link, navigate} from "gatsby";
import {
    AnimatePresence,
    motion,
    useAnimation,
    useInView,
    useScroll,
    useTransform,
    useViewportScroll
} from "framer-motion";

const Logo = () => {
    return (
        <Box cursor={"pointer"}
             as={Link}
             to={"/"}
             width={"40px"}
             height={"40px"}
             display={"flex"}
             justifyContent={"center"}
             _hover={{boxShadow: "lg"}}
             alignItems={"center"}
             background={"brand.green"} borderTopLeftRadius={"xl"} borderBottomRightRadius={"xl"}>
            <Text fontSize={"3xl"} fontWeight={"bold"} color={"brand.orange"}>G</Text>
        </Box>
    )
}

const MotionButton = motion(Button);
const sections = ["Home", "About", "Skills", "Projects", "Experience"];

const MotionFlex = motion(Flex);

export function Header() {
    const theme = useTheme();
    const [show, setShow] = React.useState(false);
    const [hasBoxShadow, setHasBoxShadow] = React.useState(false);
    const ref = useRef(null);
    const toggleMenu = () => setShow(!show);

    const inView = useInView(ref, {once: true})
    const {scrollY} = useScroll();

    const controls = useAnimation();
    const delta = React.useRef(0);
    const lastScrollY = React.useRef(0);
    scrollY.onChange((val) => {
        if(lastScrollY.current >= 10 && !hasBoxShadow){
            setHasBoxShadow(true)
        }
        if(lastScrollY.current < 10 && hasBoxShadow){
            setHasBoxShadow(false);
        }
        const diff = Math.abs(val - lastScrollY.current);
        if (val >= lastScrollY.current) {
            delta.current = delta.current >= 10 ? 10 : delta.current + diff;
        } else {
            delta.current = delta.current <= -10 ? -10 : delta.current - diff;
        }

        if (delta.current >= 10 && val > 200) {
            controls.start("hidden");
        } else if (delta.current <= -10 || val < 200) {
            controls.start("visible");
        }
        lastScrollY.current = val;
    });


    function getSlideDownProps(index: number) {
        return {
            initial: "hidden",
            animate: inView ? "visible" : "hidden",
            variants: {
                hidden: {opacity: 0, y: -50}, // Start below their final position
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {duration: 0.5, delay: index * 0.05},
                },
            },
        };
    }

    return (
        <MotionFlex
            ref={ref}
            as={"header"}
            align="center"
            justifyContent={"center"}
            bg={"brand.background.beige"}
            position="fixed"
            w="full"
            initial="visible"
            animate={controls}
            variants={{
                visible: {top: "0px"},
                hidden: {top: "-100px"}
            }}
            shadow={hasBoxShadow ? "md" : "none"}
            zIndex={1800}
        >
            <Flex
                maxW={"7xl"}
                justify={"space-between"}
                alignItems={"center"}
                w="100%"
                paddingX={4}
                paddingY={6}
            >
                <Logo/>
                <Box
                    cursor={"pointer"}
                    display={{base: "block", md: "none"}}
                    onClick={toggleMenu}
                >
                    {show ? <IconX color={"#FA9403"} size={32}/> : <IconMenuDeep color={"#FA9403"} size={32}/>}
                </Box>
                <Box
                    display={{base: show ? "flex" : "none", md: "block"}}
                    flexBasis={{base: "100%", md: "auto"}}
                >
                    <Flex
                        align="center"
                        justify={[
                            "center",
                            "space-between",
                            "flex-end",
                            "flex-end",
                        ]}
                        gap={8}
                        direction={["column", "row", "row", "row"]}
                        pt={[4, 4, 0, 0]}
                    >
                        {sections.map((section, index) => (
                                <MotionButton
                                    {...getSlideDownProps(index)}
                                    onClick={() => {
                                        console.log("Section: ", section);
                                        if (section === "Home") {
                                            navigate("/");
                                            return;
                                        }
                                        navigate("/#section-" + section.toLowerCase());
                                        console.log("Section: ", section);
                                        const sectionId = `section-${section.toLowerCase()}`;
                                        console.log("Section ID: ", sectionId);
                                        const element = document.getElementById(sectionId);
                                        console.log("Element: ", element);
                                        if (element != null) {
                                            console.log("Scrolling...");
                                            element.scrollIntoView({behavior: "smooth"});
                                        }
                                    }}
                                    variant={"link"}
                                    color={theme.colors.gray["400"]}>{section}</MotionButton>
                            )
                        )}
                        <Button>Resume</Button>
                    </Flex>
                </Box>
            </Flex>
        </MotionFlex>
    );
}


export default Header;
