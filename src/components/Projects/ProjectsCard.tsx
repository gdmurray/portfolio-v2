import {
    Badge,
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    Flex,
    HStack,
    IconButton,
    Stack,
    Text,
    useTheme,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    IconArrowsDiagonal,
    IconArrowsDiagonalMinimize2,
} from "@tabler/icons-react";
import { LazyIcon } from "../LazyIcon";
import { motion, useAnimation, useInView } from "framer-motion";
import { calculateBadgeWidth } from "./utils";
import { ExpandableImage } from "./ExpandableImage";

const ProjectCardFrontContent = ({
    project,
    onFlip,
}: {
    project: NonNullable<Queries.ProjectsComponentFragment["projects"]>[number];
    onFlip: () => void;
}) => {
    const theme = useTheme();
    const skillsRef = useRef<HTMLDivElement>(null);

    const [visibleSkills, setVisibleSkills] = useState(project?.skills ?? []);
    const [overflowCount, setOverflowCount] = useState(0);
    const [showAll, setShowAll] = useState(false);

    const skillWidths = useMemo(() => {
        if (project?.skills == null) {
            return {};
        }
        const gap = 5;
        const padding = 8; // Padding inside the badge
        const textSize = 12; // Text size in pixels
        const fontFamily = "Poppins, Roboto, -apple-system, sans-serif, serif"; // Font family

        return project.skills.reduce<{ [key: string]: number }>(
            (acc: any, skill: any) => {
                acc[skill.name] = calculateBadgeWidth({
                    textSize,
                    fontFamily,
                    padding,
                    gap,
                    textContent: skill.name,
                });
                return acc;
            },
            {},
        );
    }, [project?.skills]);

    useEffect(() => {
        const calculateVisibility = () => {
            if (project?.skills == null) return;
            const containerWidth = (skillsRef.current?.offsetWidth ?? 0) - 20;
            let totalWidth = 0;
            let visibleCount = 0;

            for (const skill of project.skills) {
                totalWidth += skillWidths[skill!.name!];
                if (totalWidth > containerWidth && !showAll) {
                    break;
                }
                visibleCount++;
            }
            setVisibleSkills(project.skills.slice(0, visibleCount));
            setOverflowCount(project.skills.length - visibleCount);
        };
        calculateVisibility();
        window.addEventListener("resize", calculateVisibility);

        return () => window.removeEventListener("resize", calculateVisibility);
    }, [project?.skills, showAll, skillWidths]);

    if (project == null) return <></>;
    return (
        <div>
            <CardBody p={2}>
                <Box position={"absolute"} right={"15px"}>
                    <IconButton
                        onClick={onFlip}
                        size={"xs"}
                        aria-label={"description"}
                        icon={<IconArrowsDiagonal size={16} />}
                        variant={"outline"}
                    />
                </Box>
                <Flex w={"100%"} justifyContent={"center"} height={"150px"}>
                    <ExpandableImage
                        src={project?.image?.file?.url ?? ""}
                        alt={
                            project?.description?.description ?? "project-image"
                        }
                        p={0}
                        width={"275px"}
                    />
                </Flex>
                <Stack paddingX={4} paddingTop={4} paddingBottom={2}>
                    <Text fontWeight={600}>{project?.name}</Text>
                    <Text fontSize={12} height={"90px"}>
                        {project.shortDescription}
                    </Text>
                    <Flex wrap={"wrap"} gap={"5px"} ref={skillsRef}>
                        <>
                            {visibleSkills.map((skill: any) => (
                                <Badge
                                    key={`${project.id}-${skill.name}`}
                                    borderRadius={"lg"}
                                    paddingX={2}
                                    paddingY={0.5}
                                    textTransform={"none"}
                                >
                                    {skill.name}
                                </Badge>
                            ))}
                            {overflowCount > 0 && (
                                <Badge
                                    cursor={"pointer"}
                                    _hover={{
                                        background: theme.colors.gray["200"],
                                    }}
                                    onClick={() => {
                                        setShowAll(true);
                                    }}
                                    borderRadius={"lg"}
                                    paddingX={1}
                                    paddingY={0.5}
                                    textTransform={"none"}
                                >
                                    +{overflowCount}
                                </Badge>
                            )}
                            {showAll && (
                                <Badge
                                    cursor={"pointer"}
                                    _hover={{
                                        background: theme.colors.gray["200"],
                                    }}
                                    onClick={() => {
                                        setShowAll(false);
                                    }}
                                    borderRadius={"lg"}
                                    paddingX={2}
                                    paddingY={0.5}
                                    textTransform={"none"}
                                >
                                    -
                                </Badge>
                            )}
                        </>
                    </Flex>
                </Stack>
            </CardBody>
            <CardFooter paddingX={4} paddingY={1}>
                <HStack justifyContent={"space-between"} w={"full"}>
                    {project?.links?.map((link: any, index: number) => {
                        if (link == null) return null;
                        return (
                            <Button
                                key={`${project.name}-button-${link.name}`}
                                background={index === 0 ? "black" : "gray.200"}
                                _hover={{
                                    background:
                                        index === 0 ? "gray.800" : "gray.100",
                                }}
                                color={index === 0 ? "white" : "black"}
                                variant={"solid"}
                                flex={1}
                                leftIcon={
                                    <LazyIcon
                                        iconName={
                                            link.icon ?? "IconBrandGithub"
                                        }
                                    />
                                }
                                aria-label={link.name ?? "link"}
                                as={"a"}
                                target={link.opensInNewTab ? "_blank" : "_self"}
                                href={link.link ?? ""}
                            >
                                {link.tooltip}
                            </Button>
                        );
                    })}
                </HStack>
            </CardFooter>
        </div>
    );
};

const ProjectCardBackContent = ({
    project,
    onFlip,
}: {
    project: NonNullable<Queries.ProjectsComponentFragment["projects"]>[number];
    onFlip: () => void;
}) => {
    if (project == null) return <></>;
    return (
        <CardBody p={2}>
            <Box position={"absolute"} right={"15px"}>
                <IconButton
                    onClick={onFlip}
                    size={"xs"}
                    aria-label={"description"}
                    icon={<IconArrowsDiagonalMinimize2 size={16} />}
                    variant={"outline"}
                />
            </Box>
            <Stack paddingX={4} paddingTop={4} paddingBottom={2}>
                <Text fontWeight={600}>Description</Text>
                <Text fontSize={14}>{project.description?.description}</Text>
            </Stack>
        </CardBody>
    );
};

const MotionCard = motion(Card);
export const ProjectCard = ({
    project,
}: {
    project: NonNullable<Queries.ProjectsComponentFragment["projects"]>[number];
}) => {
    // State to control when to start the animation
    const ref = useRef(null);
    // const frontCardRef = useRef(null);
    const [cardHeight, setCardHeight] = useState(0);
    const controls = useAnimation();
    const [isFlipped, setIsFlipped] = useState(false);

    const inView = useInView(ref, {
        once: true,
        margin: "0px 0px 100px 0px",
    });

    useEffect(() => {
        // Ensure the ref is current before proceeding
        if (ref.current) {
            // Initialize the ResizeObserver
            const resizeObserver = new ResizeObserver((entries) => {
                // Loop through the entries (observed elements)
                for (const entry of entries) {
                    // Update state with new height
                    const computedHeight = entry.contentRect.height + 16;
                    if (isFlipped && computedHeight > cardHeight) {
                        setCardHeight(computedHeight);
                        return;
                    }
                    if (!isFlipped) {
                        setCardHeight(computedHeight);
                        return;
                    }
                }
            });

            // Start observing the ref
            resizeObserver.observe(ref.current);

            // Clean up observer on component unmount
            return () => {
                resizeObserver.disconnect();
            };
        }
    }, [isFlipped]); // Empty dependency array ensures the effect only runs once on mount

    // States are going to be: "hidden", "front", "back"
    const projectCardProps = {
        initial: "hidden",
        animate: controls,
        variants: {
            hidden: { opacity: 0, y: 75 }, // Start below their final position
            front: {
                opacity: 1,
                y: 0,
                rotateY: 0,
                transition: { duration: 0.5 },
            },
            back: {
                rotateY: 180,
                transition: { flip: { duration: 1 } },
            },
        },
    };

    useEffect(() => {
        if (inView) {
            controls.start("front");
        }
    }, [inView]);

    useEffect(() => {}, []);

    const onFlip = () => {
        if (isFlipped) {
            controls.start("front");
            setIsFlipped(false);
        } else {
            controls.start("back");
            setIsFlipped(true);
        }
    };

    return (
        <Box
            position={"relative"}
            style={{ perspective: "1000px" }}
            height={`${cardHeight}px`}
        >
            <MotionCard
                ref={ref}
                p={1}
                paddingY={2}
                w={"385px"}
                borderRadius={"lg"}
                _hover={{ boxShadow: "lg" }}
                {...projectCardProps}
                style={{ transformStyle: "preserve-3d" }}
                exit={"back"}
            >
                {!isFlipped && (
                    <Box style={{ backfaceVisibility: "hidden" }}>
                        <ProjectCardFrontContent
                            project={project}
                            onFlip={onFlip}
                        />
                    </Box>
                )}
                {isFlipped && (
                    <Box
                        style={{
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                        }}
                    >
                        <ProjectCardBackContent
                            project={project}
                            onFlip={onFlip}
                        />
                    </Box>
                )}
            </MotionCard>
        </Box>
    );
};
