import {
    Badge,
    Button,
    Card,
    CardBody,
    CardFooter,
    Flex,
    HStack,
    IconButton,
    Image,
    SimpleGrid,
    Stack,
    Text,
    Tooltip,
    useTheme
} from "@chakra-ui/react";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {graphql} from "gatsby";
import {LazyIcon} from "./LazyIcon";
import {IconBrandGithub, IconExternalLink, IconSquareFilled} from "@tabler/icons-react";
import {Section} from "./Section";
import {motion, useInView} from "framer-motion";


function calculateTextWidth(text: string, font: string) {
    // Create a canvas element
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (context == null) {
        return;
    }
    // Set the font to the context to match the desired style
    context.font = font;

    // Measure the text width using the measureText method
    const metrics = context.measureText(text);

    // Return the width
    return metrics.width;
}

function calculateBadgeWidth({textSize, fontFamily, padding, gap, textContent}: {
    textSize: number;
    fontFamily: string;
    padding: number;
    gap: number;
    textContent: string;
}) {
    // Construct the font string similar to CSS font property
    const font = `${textSize}px ${fontFamily}`;

    // Calculate the text width
    const textWidth: number = calculateTextWidth(textContent, font) ?? 75;

    // Calculate total padding (left + right)
    const totalPadding = padding * 2;

    // Calculate the total badge width
    return textWidth + totalPadding + gap;
}

const MotionCard = motion(Card);
const ProjectCard = (project: Queries.ProjectsComponentFragment["projects"][number]) => {
    const theme = useTheme();
    // State to control when to start the animation
    const [isVisible, setIsVisible] = useState(false);
    const skillsRef = useRef<HTMLDivElement>(null);
    const ref = useRef(null)
    const inView = useInView(ref, {
        once: true,
        margin: "0px 0px -150px 0px"
    });

    const slideUpProps = {
        initial: "hidden",
        animate: inView ? "visible" : "hidden",
        variants: {
            hidden: {opacity: 0, y: 75}, // Start below their final position
            visible: {
                opacity: 1,
                y: 0,
                transition: {duration: 0.5},
            },
        },
    };

    const [visibleSkills, setVisibleSkills] = useState(project.skills);
    const [overflowCount, setOverflowCount] = useState(0);
    const [showAll, setShowAll] = useState(false);

    const skillWidths = useMemo(() => {
        const gap = 5;
        const padding = 8; // Padding inside the badge
        const textSize = 12; // Text size in pixels
        const fontFamily = "Poppins, Roboto, -apple-system, sans-serif, serif"; // Font family

        return project.skills.reduce<{ [key: string]: number }>((acc: any, skill: any) => {
            acc[skill.name] = calculateBadgeWidth({textSize, fontFamily, padding, gap, textContent: skill.name})
            return acc;
        }, {})

    }, [project.skills])

    useEffect(() => {
        const calculateVisibility = () => {
            console.log("Calculating visibility");
            const containerWidth = (skillsRef.current?.offsetWidth ?? 0) - 20;
            let totalWidth = 0;
            let visibleCount = 0;

            console.log("Container Width: ", containerWidth);
            for (let skill of project.skills) {
                totalWidth += skillWidths[skill.name];
                console.log("total Width: ", totalWidth);
                if (totalWidth > containerWidth && !showAll) {
                    break;
                }
                visibleCount++;
            }
            setVisibleSkills(project.skills.slice(0, visibleCount));
            setOverflowCount(project.skills.length - visibleCount);
        }
        calculateVisibility();
        window.addEventListener('resize', calculateVisibility);

        return () => window.removeEventListener('resize', calculateVisibility);
    }, [project.skills, showAll, skillWidths]);


    return (
        <MotionCard
            ref={ref}
            p={1}
            paddingY={2}
            w={"385px"}
            borderRadius={"lg"}
            _hover={{boxShadow: "lg"}}
            {...slideUpProps}>
            {/*<CardHeader>*/}
            {/*    <IconDots/>*/}
            {/*</CardHeader>*/}
            <CardBody p={2}>
                <Flex w={"100%"} justifyContent={"center"} height={"150px"}>
                    <Image p={0} width={"275px"} src={project?.image?.file?.url ?? ""}
                           alt={project?.description?.description ?? "project-image"}/>
                </Flex>
                <Stack paddingX={4} paddingTop={4} paddingBottom={2}>
                    <Text fontWeight={600}>{project?.name}</Text>
                    <Text fontSize={12} height={"90px"}>{project.shortDescription}</Text>
                    <Flex wrap={"wrap"} gap={"5px"} ref={skillsRef}>
                        <>
                            {visibleSkills.map((skill: any) => (
                                <Badge key={`${project.id}-${skill.name}`} borderRadius={"lg"} paddingX={2}
                                       paddingY={0.5}
                                       textTransform={"none"}>{skill.name}</Badge>))}
                            {overflowCount > 0 && (
                                <Badge cursor={"pointer"} _hover={{background: theme.colors.gray["200"]}}
                                       onClick={() => {
                                           setShowAll(true)
                                       }} borderRadius={"lg"} paddingX={1} paddingY={0.5}
                                       textTransform={"none"}>+{overflowCount}</Badge>)}
                            {showAll && (
                                <Badge cursor={"pointer"} _hover={{background: theme.colors.gray["200"]}}
                                       onClick={() => {
                                           setShowAll(false)
                                       }} borderRadius={"lg"} paddingX={2} paddingY={0.5}
                                       textTransform={"none"}>-</Badge>)}
                        </>
                        {/*{project.skills.map((skill) => (*/}
                        {/*    <Badge borderRadius={"lg"} paddingX={2} paddingY={0.5} textTransform={"none"}>{skill.name}</Badge>*/}
                        {/*))}*/}
                    </Flex>
                </Stack>
            </CardBody>
            <CardFooter paddingX={4} paddingY={1}>
                <HStack justifyContent={"space-between"} w={"full"}>
                    {project?.links?.map((link: any, index: number) => {
                        if (link == null) return <></>
                        return (
                            <Button
                                background={index === 0 ? "black" : "gray.200"}
                                _hover={{background: index === 0 ? "gray.800" : "gray.100"}}
                                color={index === 0 ? "white" : "black"}
                                variant={"solid"}
                                flex={1}
                                leftIcon={<LazyIcon iconName={link.icon ?? "IconBrandGithub"}/>}
                                aria-label={link.name ?? "link"}
                                as={"a"}
                                target={link.opensInNewTab ? "_blank" : "_self"}
                                href={link.link ?? ""}
                            >
                                {link.tooltip}
                            </Button>
                        )
                    })}
                </HStack>
            </CardFooter>
        </MotionCard>
    )
}

function sortObjectByArrayLengthAndKey(obj) {
    // Convert the object into an array of [key, value] pairs
    const entries = Object.entries(obj);

    // Sort the entries
    entries.sort((a, b) => {
        // a and b are entries of the form [key, value], where value is a string array
        const lengthDifference = b[1].length - a[1].length; // Descending by array length
        if (lengthDifference !== 0) {
            // If the lengths are different, decide based on the length
            return lengthDifference;
        } else {
            // If the lengths are the same, sort alphabetically by key
            return a[0].localeCompare(b[0]);
        }
    });

    // Map the sorted array of entries to an array of keys
    return entries.map(entry => entry[0]);
}

const ProjectFilterSkillsBadge = ({skill, isActive, onClick, length}: {
    skill: string;
    isActive: boolean;
    onClick: () => void;
    length?: number;
}) => {
    return (
        <Badge
            cursor={"pointer"}
            background={"brand.subaruGreen.800"}
            color={"white"}
            textTransform={"none"}
            onClick={onClick}
            _active={{background: "brand.tangerineOrange.800", color: "white"}}
            _hover={{background: isActive ? "brand.tangerineOrange.700" : "brand.subaruGreen.700"}}
            data-active={isActive ? true : undefined}
            fontSize={12}
            paddingX={4}
            paddingY={2}
            borderRadius={"xl"}>
            {skill} {length != null ? `(${length})` : ''}
        </Badge>
    )
}
export const Projects = (props: Queries.ProjectsComponentFragment) => {
    const [activeSkill, setActiveSkill] = useState("All")
    const theme = useTheme();
    const skillsRef = useRef<HTMLDivElement>(null);

    const skillsMap = useMemo(() => {
        return props.projects?.reduce<{ [key: string]: string[] }>((acc, elem) => {
            if (elem?.skills == null) {
                return acc;
            }
            for (const skill of elem.skills) {
                if (!skill || skill.name == null) {
                    continue;
                }
                if (!(skill.name in acc)) {
                    acc[skill.name] = [elem.id]
                } else {
                    acc[skill?.name].push(elem.id)
                }
            }
            return acc
        }, {})
    }, [props.projects])

    const projectList = useMemo(() => {
        if (activeSkill !== "All") {
            return props.projects?.filter((project) => {
                return project?.skills?.some((skill) => skill?.name === activeSkill)
            }) ?? [];
        }
        return props.projects ?? [];
    }, [props.projects, activeSkill])


    const skillsArray = useMemo(() => {
        return sortObjectByArrayLengthAndKey(skillsMap);
    }, [skillsMap])

    const skillWidths = useMemo(() => {
        const gap = 5;
        const padding = 16; // Padding inside the badge
        const textSize = 12; // Text size in pixels
        const fontFamily = "Poppins, Roboto, -apple-system, sans-serif, serif"; // Font family

        return skillsArray.reduce<{ [key: string]: number }>((acc, skill) => {
            acc[skill] = calculateBadgeWidth({textSize, fontFamily, padding, gap, textContent: skill})
            return acc;
        }, {})
    }, [skillsArray])

    const [visibleSkills, setVisibleSkills] = useState(skillsArray);
    const [overflowCount, setOverflowCount] = useState(0);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const calculateVisibility = () => {
            console.log("Calculating visibility");
            const containerWidth = (skillsRef.current?.offsetWidth ?? 0) * 1.5;
            let totalWidth = 0;
            let visibleCount = 0;

            console.log("Container Width: ", containerWidth);
            for (let skill of skillsArray) {
                totalWidth += skillWidths[skill];
                console.log("total Width: ", totalWidth);
                if (totalWidth > containerWidth && !showAll) {
                    break;
                }
                visibleCount++;
            }
            setVisibleSkills(skillsArray.slice(0, visibleCount));
            setOverflowCount(skillsArray.length - visibleCount);
        }
        calculateVisibility();
        window.addEventListener('resize', calculateVisibility);

        return () => window.removeEventListener('resize', calculateVisibility);
    }, [skillsArray, showAll, skillWidths]);

    console.log("SkillsMap: ", skillsMap);
    return (
        <Section bg={"brand.background.beige"} title={"3. Projects"} anchor={"projects"}>
            <Flex wrap={"wrap"} gap={"5px"} ref={skillsRef}>
                <ProjectFilterSkillsBadge
                    skill={"All"}
                    isActive={activeSkill === "All"}
                    onClick={() => setActiveSkill("All")}
                    length={props.projects?.length}
                />
                {visibleSkills.map((skill) => (
                    <ProjectFilterSkillsBadge
                        key={`project-${skill}`}
                        skill={skill}
                        isActive={activeSkill === skill}
                        onClick={() => setActiveSkill(skill)}
                        length={skillsMap![skill].length}
                    />
                ))}
                {overflowCount > 0 && (
                    <ProjectFilterSkillsBadge
                        skill={`+${overflowCount} More`}
                        onClick={() => setShowAll(true)}
                        length={undefined}
                        isActive={false}
                    />
                )}
                {showAll && (
                    <ProjectFilterSkillsBadge
                        skill={'-'}
                        onClick={() => setShowAll(false)}
                        length={undefined}
                        isActive={false}
                    />
                )}
            </Flex>
            <Flex wrap={"wrap"} marginTop={8} rowGap={"40px"}  columnGap={"20px"}>
                {projectList.map((project) => {
                    return <ProjectCard key={project?.name ?? ""} {...project} />
                })}
            </Flex>
        </Section>
    )
}

export const query = graphql`
    fragment ProjectsComponent on ContentfulProjectsSection {
        title
        description
        projects {
            id
            name
            shortDescription
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
