import {
    Card,
    CardBody,
    Heading,
    HStack,
    IconButton,
    Image,
    Stack,
    Text,
    useTheme,
    Tooltip,
    CardFooter, Flex
} from "@chakra-ui/react";
import React, {useEffect, useRef, useState} from "react";
import {graphql} from "gatsby";
import {LazyIcon} from "./LazyIcon";
import {IconSquareFilled} from "@tabler/icons-react";
import {Section} from "./Section";
import {AnimatePresence, motion} from "framer-motion";


const MotionCard = motion(Card);
const ProjectCard = (project: Queries.ProjectsComponentFragment["projects"][number]) => {
    const theme = useTheme();
    // State to control when to start the animation
    const [isVisible, setIsVisible] = useState(false);
    const parentRef = useRef(null);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Update our state when observer callback fires
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            {
                root: null, // relative to the viewport
                threshold: 1, // percentage of the observed element that is visible
            }
        );

        if (parentRef.current) {
            observer.observe(parentRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    const onMouseMove = (e) => {
        if (!ref.current) return;

        const {left, top, width, height} = ref.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        // Adjust these values to change the sensitivity and range of the effect
        const maxDistance = 300;
        const intensity = 0.005;

        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
        if (distance < maxDistance) {
            // Apply a transformation based on the mouse position
            const scale = 1 + intensity * ((maxDistance - distance) / maxDistance);

            // Set the transform properties
            ref.current.style.transform = `translate(${deltaX * intensity}px, ${deltaY * intensity}px) scale(${scale})`;
        } else {
            // Reset transformations if the mouse is too far
            ref.current.style.transform = 'translate(0px, 0px) scale(1)';
        }
    };

    const resetTransform = () => {
        if (ref.current) {
            ref.current.style.transform = 'translate(0px, 0px) scale(1)';
        }
    };

    return (
        <div ref={parentRef}>
            <MotionCard
                ref={ref}
                onMouseMove={onMouseMove}
                onMouseLeave={resetTransform}
                p={4} backgroundColor={theme.colors.brand.black}
                borderRadius={"lg"}
                maxW={"4xl"} direction={"column"}
                // initial={"hidden"}
                // animate={isVisible ? "visible" : "hidden"}
                // variants={{
                //     visible: {opacity: 1, x: 0},
                //     hidden: {opacity: 0, x: -100},
                // }}
                // transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
                <Stack direction={{base: "column", md: "row"}} alignItems={"center"}>
                    <Image p={4} height={"200px"} src={project?.image?.file?.url ?? ""}
                           alt={project?.description?.description ?? "project-image"}/>
                    <CardBody>
                        <Stack>
                            <HStack justify={"space-between"}>
                                <Text fontSize={18} fontWeight={600}
                                      color={theme.colors.brand.orange}>{project?.name}</Text>
                                <HStack>
                                    {project?.links?.map((link) => {
                                        if (link == null) return <></>
                                        const iconButton = (
                                            <IconButton
                                                icon={<LazyIcon iconName={link.icon ?? "IconBrandGithub"}/>}
                                                aria-label={link.name ?? "link"} as={"a"}
                                                href={link.link ?? ""}
                                                target={link.opensInNewTab ? "_blank" : "_self"}/>)
                                        if (link.tooltip != null) {
                                            return (<Tooltip placement={"top"}
                                                             label={link.tooltip}>{iconButton}</Tooltip>)
                                        }
                                        return (
                                            <>{iconButton}</>
                                        )
                                    })}
                                </HStack>
                            </HStack>
                            <Text fontSize={12}>{project?.description?.description}</Text>
                        </Stack>
                    </CardBody>
                </Stack>
                <Flex wrap={"wrap"} columnGap={4} rowGap={1} justifyContent={"center"}>
                    {project?.skills?.map((skill) => {
                        if (skill == null) return <></>
                        if (skill.name == null) return <></>
                        return (
                            <HStack>
                                <IconSquareFilled size={12}
                                                  color={theme.colors.brand.orange}/>
                                <Text> {skill.name}</Text>
                            </HStack>
                        )
                    })}
                </Flex>
            </MotionCard>
        </div>
    )
}
export const Projects = (props: Queries.ProjectsComponentFragment) => {
    const theme = useTheme();
    return (
        <Section title={"3. Projects"} anchor={"projects"}>
            <Stack gap={8} alignItems={"center"}>
                {props.projects?.map((project) => {
                    console.log("Project: ", project);
                    return <ProjectCard key={project?.name ?? ""} {...project} />
                })}
            </Stack>
        </Section>
    )
}

export const query = graphql`
    fragment ProjectsComponent on ContentfulProjectsSection {
        title
        description
        projects {
            name
            description {
                description
            }
            image {
                file {
                    url
                }
            }
            skills {
                name
            }
            links {
                link
                name
                tooltip
                opensInNewTab
                icon
            }
        }
    }
`
