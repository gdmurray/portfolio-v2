import {
    Box,
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    Text, useDisclosure,
    useTheme,
    VStack,
    Link as ChakraLink,
} from "@chakra-ui/react";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {IconExternalLink, IconMenuDeep, IconX} from "@tabler/icons-react";
import {useLocation} from '@reach/router';
import {Link, navigate} from "gatsby";
import {
    AnimatePresence,
    motion,
    useAnimation,
    useInView, useMotionValueEvent,
    useScroll,
} from "framer-motion";
import {throttle} from "lodash";

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

function findIndexInRange(numbers: number[], target: number) {
    if (numbers.length === 0) return 0;

    // Handle case where target is less than the first element
    if (target < numbers[0]) {
        return 0;
    }

    // Handle case where target is greater than the last element
    if (target >= numbers[numbers.length - 1]) {
        return numbers.length - 1;
    }

    // Loop through the list of numbers
    for (let i = 0; i < numbers.length - 1; i++) {
        // Check if the target number falls between the current and the next element
        if (target >= numbers[i] && target < numbers[i + 1]) {
            return i; // Return the next index if condition is met
        }
    }


    return 0;
}

const MotionModalBody = motion(ModalBody);

export function Header() {
    const resumeLink = process.env.GATSBY_RESUME_URL;
    const theme = useTheme();
    const {hash} = useLocation();
    const [hasBoxShadow, setHasBoxShadow] = React.useState(false);
    const ref = useRef(null);
    const [activeSection, setActiveSection] = useState("Home")
    const [sectionLocations, setSectionLocations] = useState<number[]>([]);
    const {isOpen, onOpen, onClose, onToggle} = useDisclosure();

    const inView = useInView(ref, {once: true})
    const {scrollY} = useScroll();

    const controls = useAnimation();
    const delta = React.useRef(0);
    const lastScrollY = React.useRef(0);


    useEffect(() => {
        // Function to fetch divs and update state
        const fetchSectionDivs = () => {
            const sections: HTMLDivElement[] = Array.from(document.querySelectorAll('[id^="section-"]'));
            if (sections != null) {
                setSectionLocations(sections.map(section => section.offsetTop - 50));
            }
        };

        // Call once to initialize
        fetchSectionDivs();

        // Set up resize event listener
        window.addEventListener('resize', fetchSectionDivs);

        // Clean up event listener on component unmount
        return () => window.removeEventListener('resize', fetchSectionDivs);
    }, []);

    const throttledSetActiveSection = useCallback(throttle((scrollY: number) => {
        // console.log("Throttled ScrollY: ", scrollY);
        const index = findIndexInRange(sectionLocations, scrollY);
        const section = sections[index];
        // console.log("Sections: ", sectionLocations, " Index: ", index, " Section: ", section);
        if (section !== activeSection) {
            // console.log("Setting Active Section: ", section);
            setActiveSection(section);
        }
    }, 250), [sectionLocations, activeSection]);

    // const throttledHandleSectionHash = useCallback(throttle((scrollY) => {
    // }, 250), [sectionLocations, activeSection])

    // useEffect(() => {
    //     console.log("Active Section Changed: ", activeSection, hash);
    //     // window.history.pushState(null, null, "#section-" + activeSection.toLowerCase());
    //     window.history.pushState(null, null, "/");
    // }, [activeSection, hash])

    useMotionValueEvent(scrollY, "change", (val) => {
        console.log("ScrollY: ", val);
        if (lastScrollY.current >= 15 && !hasBoxShadow) {
            setHasBoxShadow(true)
        }
        if (lastScrollY.current < 15 && hasBoxShadow) {
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

        // Call the throttled function with current scroll position
        throttledSetActiveSection(val);
    })

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

    const showBoxShadow = hasBoxShadow && !isOpen;

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
            shadow={showBoxShadow ? "md" : "none"}
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
                    onClick={onToggle}
                >
                    {isOpen ? <IconX color={theme.colors.brand.tangerineOrange[900]} size={32}/> :
                        <IconMenuDeep color={theme.colors.brand.tangerineOrange[900]} size={32}/>}
                </Box>
                <Modal
                    isOpen={isOpen}
                    onClose={onClose}
                    closeOnOverlayClick={true}
                    closeOnEsc={true}
                    styleConfig={{
                        modal: {
                            position: "fixed",
                            top: 0,
                            maxWidth: "100vw",
                            width: "100%",
                            zIndex: 1400,
                        },
                    }}
                    preserveScrollBarGap={true}
                    blockScrollOnMount={false}
                    motionPreset={"slideInTop"}
                >
                    <ModalContent
                        as={"div"}
                        containerProps={{marginTop: 88}}
                        zIndex={1500}
                        dropShadow={"xl"}
                    >
                        <ModalOverlay onClick={onClose}/>
                        <AnimatePresence>
                            {isOpen && (
                                <MotionModalBody
                                    p={4}
                                    bg={"brand.background.beige"}
                                    shadow={"xl"}
                                    dropShadow={"lg"}
                                    zIndex={1500}
                                    initial={{y: -100, opacity: 1}}
                                    animate={{y: 0, opacity: 1}}
                                    exit={{y: -100, opacity: 1}}
                                    transition={{duration: 0.25}}
                                >
                                    <VStack gap={1} alignItems={"flex-start"} paddingX={2}>
                                        {sections.map((section, index) => (
                                                <Button
                                                    size={"lg"}
                                                    onClick={() => {
                                                        setActiveSection(section);
                                                        if (section === "Home") {
                                                            onClose();
                                                            navigate("/");
                                                            return;
                                                        }
                                                        navigate("/#section-" + section.toLowerCase());
                                                        const sectionId = `section-${section.toLowerCase()}`;
                                                        const element = document.getElementById(sectionId);
                                                        if (element != null) {
                                                            setTimeout(() => {
                                                                element.scrollIntoView({behavior: "smooth"});
                                                            }, 10); // Adding a slight delay
                                                            onClose();
                                                        }
                                                    }}
                                                    data-active={section === activeSection ? true : undefined}
                                                    _active={{
                                                        color: "brand.tangerineOrange.900",
                                                        fontWeight: 600,
                                                    }}
                                                    justifyContent={"left"}
                                                    _hover={{fontWeight: 600, background: "brand.tangerineOrange.100"}}
                                                    fontWeight={500}
                                                    variant={"ghost"}
                                                    w={"full"}
                                                    color={"brand.subaruGreen.900"}>{section}</Button>
                                            )
                                        )}
                                        <Button
                                            size={"lg"}
                                            variant={"ghost"}
                                            color={"brand.tangerineOrange.900"}
                                            as={ChakraLink}
                                            isExternal={true}
                                            href={resumeLink}
                                            w={"full"}
                                            justifyContent={"left"}
                                            rightIcon={<IconExternalLink/>}
                                            _hover={{fontWeight: 600, background: "brand.tangerineOrange.100"}}
                                        >
                                            Resume
                                        </Button>
                                    </VStack>
                                </MotionModalBody>
                            )}
                        </AnimatePresence>
                    </ModalContent>
                </Modal>
                <Box
                    display={{base: "none", md: "block"}}
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
                                        setActiveSection(section);
                                        if (section === "Home") {
                                            navigate("/");
                                            return;
                                        }
                                        navigate("/#section-" + section.toLowerCase());
                                        const sectionId = `section-${section.toLowerCase()}`;
                                        const element = document.getElementById(sectionId);
                                        if (element != null) {
                                            setTimeout(() => {
                                                element.scrollIntoView({behavior: "smooth"});
                                            }, 10); // Adding a slight delay
                                        }
                                    }}
                                    data-active={section === activeSection ? true : undefined}
                                    _active={{
                                        color: "brand.tangerineOrange.900",
                                        fontWeight: 600,
                                        textDecoration: "underline"
                                    }}
                                    textUnderlineOffset={"5px"}
                                    _hover={{fontWeight: 600}}
                                    fontWeight={500}
                                    variant={"link"}
                                    color={"brand.subaruGreen.900"}>{section}</MotionButton>
                            )
                        )}
                        <Button
                            as={ChakraLink}
                            isExternal={true}
                            variant={"solid"}
                            href={resumeLink}
                            color={"brand.tangerineOrange.900"}
                            background={"brand.tangerineOrange.100"}
                            _hover={{fontWeight: 600, background: "brand.tangerineOrange.200"}}
                        >
                            Resume
                        </Button>
                    </Flex>
                </Box>
            </Flex>
        </MotionFlex>
    );
}


export default Header;
