import React, {useEffect, useRef, useState} from "react"
import {Heading, Stack, useTheme, Text, SimpleGrid, Flex, HStack, DarkMode} from "@chakra-ui/react";
import {graphql} from "gatsby";
import {IconSquareFilled} from "@tabler/icons-react";
import {Section} from "./Section";
import {AnimatePresence, motion} from "framer-motion";


// #DF2935

const MotionHStack = motion(HStack);

const SkillSectionComponent = (section: Queries.SkillsComponentFragment["sections"][number]) => {
    // State to control when to start the animation
    const [isVisible, setIsVisible] = useState(false);
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
                threshold: 0.1, // percentage of the observed element that is visible
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <Stack ref={ref}>
            <Heading as={"h3"} size={"md"} color={section.color ?? "black"}>{section.name}</Heading>
            <AnimatePresence>
                <Flex columnGap={4} flexWrap={"wrap"} maxW={"5xl"}>
                    {isVisible && section.skills?.map((skill: any, index: number) => {
                        if (skill == null) return <></>
                        if (skill.name == null) return <></>

                        return (
                            <MotionHStack key={`${skill.name}-${index}`}
                                          initial={{opacity: 0, y: 20}}
                                          animate={{opacity: 1, y: 0}}
                                          exit={{opacity: 0}}
                                          transition={{duration: 0.5, delay: index * 0.15}}>
                                <IconSquareFilled size={12}
                                                  color={section.color ?? "black"}/>
                                <DarkMode>
                                    <Text color={"whiteAlpha.900"}> {skill.name}</Text>
                                </DarkMode>
                            </MotionHStack>
                        )
                    })}
                </Flex>
            </AnimatePresence>
        </Stack>
    )
}
export const Skills = (props: Queries.SkillsComponentFragment) => {
    console.log("Skills Props: ", props);
    const theme = useTheme();
    return (
        <Section bg={"brand.background.green"} title={"2. Skills"} anchor={"skills"}>
            <DarkMode>
                <Stack gap={8}>
                    {props.sections?.map((section) => {
                        console.log("Section: ", section);
                        if (section == null) return <></>
                        return (
                            <SkillSectionComponent key={section.color} {...section} />
                        )
                    })}
                </Stack>
            </DarkMode>
        </Section>
    )
}


export const query = graphql`
    fragment SkillsComponent on ContentfulSkills {
        id
        title
        sections {
            name
            color
            skills {
                ...on ContentfulSkill {
                    name
                }
            }
        }
    }
`
