import {
    Box,
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    Text,
    useDisclosure,
    useTheme,
    VStack,
    // Link as ChakraLink,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { IconExternalLink, IconMenuDeep, IconX } from "@tabler/icons-react";
import { useLocation } from "@reach/router";
import { Link, navigate } from "gatsby";
import {
    AnimatePresence,
    motion,
    useAnimation,
    useInView,
    useMotionValueEvent,
    useScroll,
} from "framer-motion";
import { throttle } from "lodash";
import { OutboundLink } from "gatsby-plugin-google-gtag";

const Logo = () => {
    return (
        <Box
            cursor={"pointer"}
            as={Link}
            to={"/"}
            width={"40px"}
            height={"40px"}
            display={"flex"}
            justifyContent={"center"}
            _hover={{ boxShadow: "lg" }}
            alignItems={"center"}
            background={"brand.green"}
            borderTopLeftRadius={"xl"}
            borderBottomRightRadius={"xl"}
        >
            <Text fontSize={"3xl"} fontWeight={"bold"} color={"brand.orange"}>
                G
            </Text>
        </Box>
    );
};

const smoothScrollTo = (element: HTMLElement) => {
    if (typeof window === "undefined") {
        return element.scrollIntoView({ behavior: "smooth" });
    }
    const targetPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1000;
    let start: number | null = null;

    window.requestAnimationFrame(step);

    function step(timestamp: number) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        window.scrollTo(
            0,
            easeInOutQuad(progress, startPosition, distance, duration),
        );
        if (progress < duration) window.requestAnimationFrame(step);
    }

    function easeInOutQuad(t: number, b: number, c: number, d: number): number {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
    }
};

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

const HeaderButton = ({
    section,
    isModal,
    onClose,
    activeSection,
    setActiveSection,
    motionProps = {},
}: {
    section: string;
    isModal: boolean;
    motionProps?: any;
    onClose?: () => void;
    activeSection: string;
    setActiveSection: (section: string) => void;
}) => {
    function getButtonProps() {
        if (isModal) {
            return {
                size: "lg",
                variant: "ghost",
                w: "full",
                justifyContent: "left",
                ...motionProps,
            };
        }
        return {
            variant: "link",
            textUnderlineOffset: "5px",
        };
    }

    const onClickHandler = () => {
        setActiveSection(section);
        if (section === "Home") {
            onClose && onClose();
            navigate("/");
            return;
        }

        navigate("/#section-" + section.toLowerCase());
        const sectionId = `section-${section.toLowerCase()}`;
        const element = document.getElementById(sectionId);
        if (element != null) {
            smoothScrollTo(element);
            onClose && onClose();
        }
    };

    return (
        <MotionButton
            data-active={section === activeSection ? true : undefined}
            _active={{
                color: "brand.tangerineOrange.900",
                fontWeight: 600,
                textDecoration: isModal ? undefined : "underline",
            }}
            _hover={{
                fontWeight: 600,
                background: isModal ? "brand.tangerineOrange.100" : undefined,
            }}
            color={"brand.subaruGreen.900"}
            fontWeight={500}
            onClick={onClickHandler}
            {...getButtonProps()}
        >
            {section}
        </MotionButton>
    );
};

export function Header() {
    const resumeLink = process.env.GATSBY_RESUME_URL;
    const theme = useTheme();
    const { hash } = useLocation();
    const [hasBoxShadow, setHasBoxShadow] = React.useState(false);
    const ref = useRef(null);
    const [activeSection, setActiveSection] = useState("Home");
    const [sectionLocations, setSectionLocations] = useState<number[]>([]);
    const { isOpen, onClose, onToggle } = useDisclosure();

    const inView = useInView(ref, { once: true });
    const { scrollY } = useScroll();

    const controls = useAnimation();
    const delta = React.useRef(0);
    const lastScrollY = React.useRef(0);

    useEffect(() => {
        // Function to fetch divs and update state
        const fetchSectionDivs = () => {
            const sections: HTMLDivElement[] = Array.from(
                document.querySelectorAll('[id^="section-"]'),
            );
            if (sections != null) {
                setSectionLocations(
                    sections.map((section) => section.offsetTop - 50),
                );
            }
        };

        // Call once to initialize
        fetchSectionDivs();

        // Set up resize event listener
        window.addEventListener("resize", fetchSectionDivs);

        // Clean up event listener on component unmount
        return () => window.removeEventListener("resize", fetchSectionDivs);
    }, []);

    const throttledSetActiveSection = useCallback(
        throttle((scrollY: number) => {
            const index = findIndexInRange(sectionLocations, scrollY);
            const section = sections[index];
            if (section !== activeSection) {
                setActiveSection(section);
                if (hash !== `#section-${activeSection.toLowerCase()}`) {
                    window.history.pushState(null, "", "/");
                }
            }
        }, 250),
        [sectionLocations, activeSection],
    );

    useMotionValueEvent(scrollY, "change", (val) => {
        if (lastScrollY.current >= 15 && !hasBoxShadow) {
            setHasBoxShadow(true);
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

        if (delta.current >= 10 && val > 200 && !isOpen) {
            controls.start("hidden");
        } else if (delta.current <= -10 || val < 200) {
            controls.start("visible");
        }
        lastScrollY.current = val;

        // Call the throttled function with current scroll position
        throttledSetActiveSection(val);
    });

    function getSlideDownProps(index: number) {
        return {
            initial: "hidden",
            animate: inView ? "visible" : "hidden",
            variants: {
                hidden: { opacity: 0, y: -50 }, // Start below their final position
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, delay: index * 0.05 },
                },
            },
        };
    }

    // function onResumeClick() {
    //     console.log("Handling Resume click");
    //     if (typeof window !== "undefined" && window.gtag) {
    //         console.log("window.gtag is not undefined");
    //         window.gtag("event", "click", {
    //             event_category: "Resume",
    //             event_label: "Resume Opened",
    //             event_action: "open",
    //             value: 1,
    //         });
    //     }
    // }

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
                visible: { top: "0px" },
                hidden: { top: "-100px" },
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
                <Logo />
                <Box
                    cursor={"pointer"}
                    display={{ base: "block", md: "none" }}
                    onClick={onToggle}
                >
                    {isOpen ? (
                        <IconX
                            color={theme.colors.brand.tangerineOrange[900]}
                            size={32}
                        />
                    ) : (
                        <IconMenuDeep
                            color={theme.colors.brand.tangerineOrange[900]}
                            size={32}
                        />
                    )}
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
                        containerProps={{ marginTop: 88 }}
                        zIndex={1500}
                        dropShadow={"xl"}
                    >
                        <ModalOverlay onClick={onClose} />
                        <AnimatePresence>
                            {isOpen && (
                                <MotionModalBody
                                    p={4}
                                    bg={"brand.background.beige"}
                                    shadow={"xl"}
                                    dropShadow={"lg"}
                                    zIndex={1500}
                                    initial={{ y: -100, opacity: 1 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -100, opacity: 1 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <VStack
                                        gap={1}
                                        alignItems={"flex-start"}
                                        paddingX={2}
                                    >
                                        {sections.map((section) => (
                                            <HeaderButton
                                                key={`header-modal-button-${section}`}
                                                section={section}
                                                isModal={true}
                                                activeSection={activeSection}
                                                setActiveSection={
                                                    setActiveSection
                                                }
                                                onClose={onClose}
                                            />
                                        ))}
                                        <Button
                                            size={"lg"}
                                            variant={"ghost"}
                                            color={"brand.tangerineOrange.900"}
                                            as={OutboundLink}
                                            href={resumeLink}
                                            target={"_blank"}
                                            w={"full"}
                                            justifyContent={"left"}
                                            // onClick={onResumeClick}
                                            rightIcon={<IconExternalLink />}
                                            _hover={{
                                                fontWeight: 600,
                                                background:
                                                    "brand.tangerineOrange.100",
                                            }}
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
                    display={{ base: "none", md: "block" }}
                    flexBasis={{ base: "100%", md: "auto" }}
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
                            <HeaderButton
                                key={`header-button-${section}`}
                                section={section}
                                isModal={false}
                                activeSection={activeSection}
                                setActiveSection={setActiveSection}
                                motionProps={getSlideDownProps(index)}
                            />
                        ))}
                        <Button
                            as={OutboundLink}
                            variant={"solid"}
                            target={"_blank"}
                            // onClick={onResumeClick}
                            href={resumeLink}
                            color={"brand.tangerineOrange.900"}
                            background={"brand.tangerineOrange.100"}
                            _hover={{
                                fontWeight: 600,
                                background: "brand.tangerineOrange.200",
                            }}
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
