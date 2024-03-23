import React, {Touch, useEffect, useRef, useState} from "react";
import {Flex, Stack, Image as ChakraImage, Box, Text} from "@chakra-ui/react";
import {graphql} from "gatsby";
import {RichText} from "./RichText";
import {Section} from "./Section";
import {IconChevronLeft, IconChevronRight} from "@tabler/icons-react";
import {AnimatePresence, motion, Point, useInView, wrap} from "framer-motion";
import {useLocation} from "@reach/router";


const MotionBox = motion(Box);
const swipeConfidenceThreshold = 10000; // Adjust the swipe sensitivity
const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
};

const isTouchDevice = () => {
    if (typeof window === 'undefined') return false;
    if (typeof navigator === 'undefined') return false;
    return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore
        navigator.msMaxTouchPoints > 0
    );
};

type HoverPosition = "left" | "right" | "outside"

const NavigationPane = ({isLeft, isHovering, paginate}: {
    isLeft: boolean;
    isHovering: boolean;
    paginate: (n: number) => void;
}) => {
    const borderRadiusProps = isLeft ? {
        borderTopLeftRadius: "lg",
        borderBottomLeftRadius: "lg"
    } : {
        borderTopRightRadius: "lg",
        borderBottomRightRadius: "lg"
    }
    return (
        <MotionBox
            position={"absolute"}
            justifyContent={"center"}
            bottom={0}
            left={isLeft ? 0 : "80%"}
            right={isLeft ? "80%" : 0}
            top={0}
            paddingX={4}
            {...borderRadiusProps}
            display={"flex"}
            // display={isHovering ? "flex" : "none"}
            initial={{opacity: 0}} // Start with the box being transparent
            animate={{opacity: isHovering ? 1 : 0}} // Animate to fully visible or transparent
            exit={{opacity: 0}} // Ensure fade-out on exit
            transition={{
                opacity: {
                    duration: 0.25,
                    delay: isHovering ? 0 : 0.25 // Delay fade out to allow it to be seen
                }
            }}
            alignItems={"center"}
            bg={"whiteAlpha.300"}
            zIndex={100}
            cursor={"pointer"}
            color={"white"}
            _hover={{bg: "whiteAlpha.500", color: "brand.tangerineOrange.900"}}
            style={{
                transition: "background-color 0.3s ease, color 0.3s ease"
            }}
            onClick={() => paginate(isLeft ? -1 : 1)}
        >
            {isLeft ? <IconChevronLeft/> : <IconChevronRight/>}
        </MotionBox>
    )
}
const ImagesComponent = ({images}: { images: Queries.AboutMeComponentFragment["images"] }) => {
    if (images == null) {
        return <></>
    }

    const {hash} = useLocation();
    const containerRef = useRef<HTMLDivElement>(null);
    const [touchDevice, setTouchDevice] = useState(false);
    const [cursorPosition, setCursorPosition] = useState<HoverPosition>('outside'); // 'left', 'right', or 'outside'
    const [containerHeight, setContainerHeight] = useState('auto');
    const [[page, direction], setPage] = useState([0, 0]);
    const imageIndex = wrap(0, images.length, page);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            console.log("Resize Observer: ", entries);
            for (let entry of entries) {
                const {width} = entry.contentRect;
                const img = new Image();
                img.src = images[imageIndex]?.file?.url ?? "";

                img.onload = () => {
                    // Calculate the aspect ratio of the image
                    const aspectRatio = img.naturalHeight / img.naturalWidth;
                    // Set the container height based on the current width and the image's aspect ratio
                    setContainerHeight(`${width * aspectRatio}px`);
                    console.log("Changed Container Height: ", width, aspectRatio);
                };
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, [images[imageIndex]?.file?.url]);

    useEffect(() => {
        setTouchDevice(isTouchDevice());
    }, []);

    // Preload images
    useEffect(() => {
        images.forEach(image => {
            const img = new Image();
            img.src = image?.file?.url ?? "";
        });
    }, [images]);

    useEffect(() => {
        if (hash.startsWith("#image")) {
            const imageNames = images.map((elem) => elem?.title?.toLowerCase());
            const targetImageIndex = imageNames.indexOf(hash.split("-")[1]);
            if (targetImageIndex !== -1) {
                goToImageIndex(targetImageIndex)
                window.history.pushState(null, "", "/");
            }
        }
    }, [hash])

    const paginate = (newDirection: number) => {
        // Ensure the page number is always within the correct range
        setPage(prev => {
            const nextPage = (prev[0] + newDirection + images.length) % images.length;
            return [nextPage, newDirection];
        });
    };

    const goToImageIndex = (index: number) => {
        // Ensure the index is within bounds before updating
        const safeIndex = Math.max(0, Math.min(index, images.length - 1));
        setPage([safeIndex, safeIndex > imageIndex ? 1 : -1]);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (containerRef.current == null) {
                return;
            }
            const {left, width} = containerRef.current.getBoundingClientRect();
            const cursorRelativeX = e.clientX - left;

            // Determine if the cursor is on the left or right half of the div
            if (cursorRelativeX < ((width / 2)) - (width * 0.1)) {
                if (cursorPosition !== "left") {
                    setCursorPosition('left');
                }
            }
            if (cursorRelativeX > ((width / 2) + (width * 0.1))) {
                if (cursorPosition !== "right") {
                    setCursorPosition("right")
                }
            }
            if (cursorPosition !== "outside") {
                setCursorPosition("outside");
            }
        };

        const div = containerRef.current;
        div?.addEventListener('mousemove', handleMouseMove);

        return () => {
            div?.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);


    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        }),
    };

    const onMouseEnter = () => {
        setIsHovering(true)
    }

    const onMouseExit = () => {
        setIsHovering(false);
        setCursorPosition('outside');
    }

    function getSlideProps() {
        if (touchDevice) {
            return {
                initial: "enter",
                animate: "center",
                exit: "exit",
                transition: {
                    x: {type: "spring", stiffness: 500, damping: 30},
                    opacity: {duration: 0.1},
                },
                drag: "x" as "x",
                dragConstraints: {left: 0, right: 0},
                dragElastic: 1,
                onDragEnd: (_: any, {offset, velocity}: {offset: Point; velocity: Point}) => {
                    const swipe = swipePower(offset.x, velocity.x);
                    if (swipe < -swipeConfidenceThreshold) {
                        paginate(1); // Swipe left to right (next)
                    } else if (swipe > swipeConfidenceThreshold) {
                        paginate(-1); // Swipe right to left (previous)
                    }
                }
            }
        }
        return {}
    }

    return (
        <>
            <Box ref={containerRef}
                 onMouseEnter={onMouseEnter}
                 onMouseLeave={onMouseExit}
                 position="relative"
                 width="100%"
                 maxWidth="400px"
                // height={"533px"}
                 height={containerHeight}
                 overflow="hidden">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={page} // The key is the current page index
                        custom={direction}
                        variants={variants}
                        {...getSlideProps()}
                        // initial="enter"
                        // animate="center"
                        // exit="exit"
                        // transition={{
                        //     x: {type: "spring", stiffness: 500, damping: 30},
                        //     opacity: {duration: 0.1}
                        // }}
                        // drag="x"
                        // dragConstraints={{ left: 0, right: 0 }}
                        // dragElastic={1}
                        // onDragEnd={(e, {offset, velocity}) => {
                        //     const swipe = swipePower(offset.x, velocity.x);
                        //     if (swipe < -swipeConfidenceThreshold) {
                        //         paginate(1); // Swipe left to right (next)
                        //     } else if (swipe > swipeConfidenceThreshold) {
                        //         paginate(-1); // Swipe right to left (previous)
                        //     }
                        // }}
                    >
                        {/*<ChakraImage*/}
                        {/*    src={images[imageIndex]?.file?.url || ''}*/}
                        {/*    alt={images[imageIndex]?.title || 'Image'}*/}
                        {/*    fit="contain"*/}
                        {/*    width="100%"*/}
                        {/*    height="100%"*/}
                        {/*    loading="eager"*/}
                        {/*    borderRadius={"lg"}*/}
                        {/*/>*/}
                        {images.map((image) => (
                            <ChakraImage
                                src={image?.file?.url || ''}
                                alt={image?.title ?? "Image"}
                                display={imageIndex === images.indexOf(image) ? "block" : "none"}
                                loading="eager"
                                fit="contain"
                                width="100%"
                                height="100%"
                                borderRadius={"lg"}
                            />
                        ))}

                    </motion.div>
                </AnimatePresence>
                {!touchDevice && (
                    <>
                        <NavigationPane isLeft={true} isHovering={isHovering && cursorPosition === "left"}
                                        paginate={paginate}/>
                        <NavigationPane isLeft={false} isHovering={isHovering && cursorPosition === "right"}
                                        paginate={paginate}/>
                    </>
                )}
            </Box>
            <Text textAlign={"center"} fontSize={12} fontWeight={600}
                  color={"gray.600"}>{images[imageIndex]?.description}</Text>
        </>
    );
}

const MotionStack = motion(Stack)

export const AboutMe = (props: Queries.AboutMeComponentFragment) => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, {
        once: true,
        margin: "0px 0px -150px 0px"
    });
    return (
        <Section bg={"brand.background.beige"} title={"1. About Me"} anchor={"about"}>
            <MotionStack
                ref={ref}
                flexDirection={{base: "column-reverse", lg: "row"}}
                initial={{opacity: 0}} // Start hidden
                animate={{opacity: inView ? 1 : 0}} // Fade in when in view
                transition={{duration: 0.75, ease: "easeInOut", delay: 1}}>
                <Stack flex={2} maxW={"2xl"}>
                    <RichText raw={props.content?.raw ?? ""}/>
                </Stack>
                <Flex flex={1} flexDirection={"column"} paddingX={8} paddingY={2} justifyContent={"flex-start"}
                      alignItems={"center"}>
                    <ImagesComponent images={props.images}/>
                </Flex>
            </MotionStack>
        </Section>
    )
}

export const query = graphql`
    fragment AboutMeComponent on ContentfulAboutMe {
        id
        title
        content {
            raw
        }
        images {
            description
            id
            title
            filename
            file {
                url
            }
        }
    }
`;
