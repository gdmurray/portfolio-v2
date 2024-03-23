import React, { useEffect, useMemo, useRef, useState } from "react";
import { Section } from "../Section";
import { Badge, Flex } from "@chakra-ui/react";
import { graphql } from "gatsby";
import { calculateBadgeWidth, sortObjectByArrayLengthAndKey } from "./utils";
import { ProjectCard } from "./ProjectsCard";

const ProjectFilterSkillsBadge = ({
    skill,
    isActive,
    onClick,
    length,
}: {
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
            _active={{
                background: "brand.tangerineOrange.800",
                color: "white",
            }}
            _hover={{
                background: isActive
                    ? "brand.tangerineOrange.700"
                    : "brand.subaruGreen.700",
            }}
            data-active={isActive ? true : undefined}
            fontSize={12}
            paddingX={4}
            paddingY={2}
            borderRadius={"xl"}
        >
            {skill} {length != null ? `(${length})` : ""}
        </Badge>
    );
};
export const Projects = (props: Queries.ProjectsComponentFragment) => {
    const [activeSkill, setActiveSkill] = useState("All");
    const skillsRef = useRef<HTMLDivElement>(null);

    const skillsMap = useMemo(() => {
        return props.projects?.reduce<{ [key: string]: string[] }>(
            (acc, elem) => {
                if (elem?.skills == null) {
                    return acc;
                }
                for (const skill of elem.skills) {
                    if (
                        !skill ||
                        skill.name == null ||
                        skill.projectFilter === false
                    ) {
                        continue;
                    }
                    if (!(skill.name in acc)) {
                        acc[skill.name] = [elem.id];
                    } else {
                        acc[skill?.name].push(elem.id);
                    }
                }
                return acc;
            },
            {},
        );
    }, [props.projects]);

    const projectList = useMemo(() => {
        if (activeSkill !== "All") {
            return (
                props.projects?.filter((project) => {
                    return project?.skills?.some(
                        (skill) => skill?.name === activeSkill,
                    );
                }) ?? []
            );
        }
        return props.projects ?? [];
    }, [props.projects, activeSkill]);

    const skillsArray = useMemo(() => {
        return sortObjectByArrayLengthAndKey(skillsMap!);
    }, [skillsMap]);

    const skillWidths = useMemo(() => {
        const gap = 5;
        const padding = 16; // Padding inside the badge
        const textSize = 12; // Text size in pixels
        const fontFamily = "Poppins, Roboto, -apple-system, sans-serif, serif"; // Font family

        return skillsArray.reduce<{ [key: string]: number }>((acc, skill) => {
            acc[skill] = calculateBadgeWidth({
                textSize,
                fontFamily,
                padding,
                gap,
                textContent: skill,
            });
            return acc;
        }, {});
    }, [skillsArray]);

    const [visibleSkills, setVisibleSkills] = useState(skillsArray);
    const [overflowCount, setOverflowCount] = useState(0);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const calculateVisibility = () => {
            const containerWidth = (skillsRef.current?.offsetWidth ?? 0) * 1.5;
            let totalWidth = 0;
            let visibleCount = 0;

            for (const skill of skillsArray) {
                totalWidth += skillWidths[skill];
                if (totalWidth > containerWidth && !showAll) {
                    break;
                }
                visibleCount++;
            }
            setVisibleSkills(skillsArray.slice(0, visibleCount));
            setOverflowCount(skillsArray.length - visibleCount);
        };
        calculateVisibility();
        window.addEventListener("resize", calculateVisibility);

        return () => window.removeEventListener("resize", calculateVisibility);
    }, [skillsArray, showAll, skillWidths]);

    return (
        <Section
            bg={"brand.background.beige"}
            title={"3. Projects"}
            anchor={"projects"}
        >
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
                        skill={"-"}
                        onClick={() => setShowAll(false)}
                        length={undefined}
                        isActive={false}
                    />
                )}
            </Flex>
            <Flex
                wrap={"wrap"}
                marginTop={8}
                rowGap={"40px"}
                columnGap={"20px"}
                justifyContent={"center"}
            >
                {projectList.map((project) => {
                    return (
                        <ProjectCard
                            key={project?.name ?? ""}
                            project={
                                project as NonNullable<
                                    Queries.ProjectsComponentFragment["projects"]
                                >[number]
                            }
                        />
                    );
                })}
            </Flex>
        </Section>
    );
};

export const query = graphql`
    fragment ProjectsComponent on ContentfulProjectsSection {
        contentful_id
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
                projectFilter
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
`;
