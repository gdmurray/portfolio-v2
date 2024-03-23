import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    Flex,
    Stack,
    Image as ChakraImage,
    Box,
    Text,
    IconButton,
} from "@chakra-ui/react";
import { graphql } from "gatsby";
import { RichText } from "./RichText";
import { Section } from "./Section";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { AnimatePresence, motion, Point, useInView, wrap } from "framer-motion";
import { useLocation } from "@reach/router";

const MotionBox = motion(Box);
const swipeConfidenceThreshold = 10000; // Adjust the swipe sensitivity
const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
};

const isTouchDevice = () => {
    if (typeof window === "undefined") return false;
    if (typeof navigator === "undefined") return false;
    return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore
        navigator.msMaxTouchPoints > 0
    );
};

type HoverPosition = "left" | "right" | "outside";

const NavigationPane = ({
    isLeft,
    height,
    paginate,
}: {
    isLeft: boolean;
    height: string;
    paginate: (n: number) => void;
}) => {
    return (
        <MotionBox
            position="absolute"
            top={0}
            left={isLeft ? "-15px" : undefined}
            right={!isLeft ? "-15px" : undefined}
            display="flex"
            alignItems="center"
            justifyContent={isLeft ? "flex-start" : "flex-end"}
            cursor="pointer"
            height={height}
        >
            <IconButton
                size={"sm"}
                aria-label={isLeft ? "left" : "right"}
                icon={isLeft ? <IconChevronLeft /> : <IconChevronRight />}
                onClick={() => paginate(isLeft ? -1 : 1)}
                isRound={true}
                fontSize={18}
                variant={"outline"}
                borderColor={"brand.tangerineOrange.900"}
                color={"brand.tangerineOrange.900"}
                _hover={{ background: "brand.tangerineOrange.100" }}
                transition={"background-color 0.3s ease"}
            />
        </MotionBox>
    );
};
const ImagesComponent = ({
    images,
}: {
    images: Queries.AboutMeComponentFragment["images"];
}) => {
    const { hash } = useLocation();
    const [touchDevice, setTouchDevice] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [cursorPosition, setCursorPosition] =
        useState<HoverPosition>("outside"); // 'left', 'right', or 'outside'
    const [containerHeight, setContainerHeight] = useState("auto");
    const [[page, direction], setPage] = useState([0, 0]);
    const imageIndex = wrap(0, images!.length, page);
    // const [isHovering, setIsHovering] = useState(false);

    const activeImageUrl = useMemo(() => {
        if (images == null) {
            return null;
        }
        return images[imageIndex]?.file?.url;
    }, [images, imageIndex]);

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width } = entry.contentRect;
                const img = new Image();
                img.src = activeImageUrl ?? "";

                img.onload = () => {
                    // Calculate the aspect ratio of the image
                    const aspectRatio = img.naturalHeight / img.naturalWidth;
                    // Set the container height based on the current width and the image's aspect ratio
                    setContainerHeight(`${width * aspectRatio}px`);
                };
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, [activeImageUrl]);

    // Preload images
    useEffect(() => {
        images?.forEach((image) => {
            const img = new Image();
            img.src = image?.file?.url ?? "";
        });
    }, [images]);

    useEffect(() => {
        const handleResize = () => {
            setTouchDevice(isTouchDevice());
        };

        // Set up the event listener
        window.addEventListener("resize", handleResize);

        // Call the handler right away so state gets updated with initial window size
        handleResize();

        // Clean up the event listener on component unmount
        return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount and unmount

    useEffect(() => {
        if (hash.startsWith("#image")) {
            if (images == null) return;
            const imageNames = images.map((elem) => elem?.title?.toLowerCase());
            const targetImageIndex = imageNames.indexOf(hash.split("-")[1]);
            if (targetImageIndex !== -1) {
                goToImageIndex(targetImageIndex);
                window.history.pushState(null, "", "/");
            }
        }
    }, [hash]);

    const paginate = useCallback(
        (newDirection: number) => {
            // Ensure the page number is always within the correct range
            setPage((prev) => {
                if (images == null) return prev;
                const nextPage =
                    (prev[0] + newDirection + images.length) % images.length;
                return [nextPage, newDirection];
            });
        },
        [images],
    );

    const goToImageIndex = (index: number) => {
        if (images == null) return;
        // Ensure the index is within bounds before updating
        const safeIndex = Math.max(0, Math.min(index, images?.length - 1));
        setPage([safeIndex, safeIndex > imageIndex ? 1 : -1]);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (containerRef.current == null) {
                return;
            }
            const { left, width } =
                containerRef.current.getBoundingClientRect();
            const cursorRelativeX = e.clientX - left;

            // Determine if the cursor is on the left or right half of the div
            if (cursorRelativeX < width / 2 - width * 0.1) {
                if (cursorPosition !== "left") {
                    setCursorPosition("left");
                }
            }
            if (cursorRelativeX > width / 2 + width * 0.1) {
                if (cursorPosition !== "right") {
                    setCursorPosition("right");
                }
            }
            if (cursorPosition !== "outside") {
                setCursorPosition("outside");
            }
        };

        const div = containerRef.current;
        div?.addEventListener("mousemove", handleMouseMove);

        return () => {
            div?.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const variants = useMemo(() => {
        return {
            enter: (direction: number) => ({
                x: direction > 0 ? 500 : -500,
                opacity: 0,
            }),
            center: {
                zIndex: 1,
                x: 0,
                opacity: 1,
            },
            exit: (direction: number) => ({
                zIndex: 0,
                x: direction < 0 ? 500 : -500,
                opacity: 0,
            }),
        };
    }, []);

    const getSlideProps = useCallback(() => {
        if (touchDevice) {
            return {
                initial: "enter",
                animate: "center",
                exit: "exit",
                transition: {
                    x: { type: "spring", stiffness: 700, damping: 40 },
                    opacity: { duration: 0.05 },
                },
                drag: "x" as const,
                dragConstraints: { left: 0, right: 0 },
                dragElastic: 0.5,
                onDragEnd: (
                    _: any,
                    { offset, velocity }: { offset: Point; velocity: Point },
                ) => {
                    const swipe = swipePower(offset.x, velocity.x);
                    if (swipe < -swipeConfidenceThreshold) {
                        paginate(1); // Swipe left to right (next)
                    } else if (swipe > swipeConfidenceThreshold) {
                        paginate(-1); // Swipe right to left (previous)
                    }
                },
            };
        }
        return {};
    }, [touchDevice, paginate]);

    if (images == null) {
        return <></>;
    }
    return (
        <Flex
            flex={1}
            flexDirection={"column"}
            paddingX={8}
            paddingY={2}
            justifyContent={"flex-start"}
            alignItems={"center"}
            position={"relative"}
        >
            <NavigationPane
                isLeft={true}
                height={containerHeight}
                paginate={paginate}
            />
            <NavigationPane
                isLeft={false}
                height={containerHeight}
                paginate={paginate}
            />
            <Box
                ref={containerRef}
                id={"image"}
                position="relative"
                width="100%"
                maxWidth="400px"
                height={containerHeight}
                overflow={"hidden"}
            >
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={page} // The key is the current page index
                        custom={direction}
                        variants={variants}
                        {...getSlideProps()}
                    >
                        {images.map((image) => (
                            <ChakraImage
                                key={image?.title ?? ""}
                                src={image?.file?.url || ""}
                                alt={image?.title ?? "Image"}
                                display={
                                    imageIndex === images.indexOf(image)
                                        ? "block"
                                        : "none"
                                }
                                loading="eager"
                                fit="contain"
                                width="100%"
                                height="100%"
                                borderRadius={"lg"}
                            />
                        ))}
                    </motion.div>
                </AnimatePresence>
            </Box>
            <Text
                textAlign={"center"}
                fontSize={12}
                fontWeight={600}
                color={"gray.600"}
            >
                {images[imageIndex]?.description}
            </Text>
        </Flex>
    );
};

const MotionStack = motion(Stack);

export const AboutMe = (props: Queries.AboutMeComponentFragment) => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, {
        once: true,
        margin: "0px 0px -100px 0px",
    });
    return (
        <Section
            bg={"brand.background.beige"}
            title={"1. About Me"}
            anchor={"about"}
        >
            <MotionStack
                ref={ref}
                flexDirection={{ base: "column-reverse", lg: "row" }}
                initial={{ opacity: 0 }} // Start hidden
                animate={{ opacity: inView ? 1 : 0 }} // Fade in when in view
                transition={{ duration: 0.75, ease: "easeInOut", delay: 1 }}
            >
                <Stack flex={2} maxW={"2xl"} paddingRight={4}>
                    <RichText raw={props.content?.raw ?? ""} />
                </Stack>
                <ImagesComponent images={props.images} />
            </MotionStack>
        </Section>
    );
};

export const query = graphql`
    fragment AboutMeComponent on ContentfulAboutMe {
        contentful_id
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
