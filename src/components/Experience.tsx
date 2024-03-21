import React from "react";
import {graphql} from "gatsby";
import {Box, Heading, HStack, Stack, Text, useTheme, VStack} from "@chakra-ui/react";
import {Section} from "./Section";
import {IconChevronRight} from "@tabler/icons-react";


export const ExperienceItem = (experience: Queries.ExperienceComponentFragment["experiences"][number]) => {
    const theme = useTheme();
    console.log(experience.description.description);
    const experiences = experience.description.description.split("\n");
    const dotExperiences = experience.description.description.split("●");
    console.log(experiences)
    console.log(dotExperiences)
    return (
        <VStack alignItems={"flex-start"} mb={6}>
            <Heading size={"md"}>{experience.title} @ <span
                style={{color: "#DCED31"}}>{experience.name}</span></Heading>
            <Heading size={"sm"} as={"h5"} color={"gray.300"}></Heading>
            <VStack alignItems={"flex-start"}>
                {experiences.map((e) => {
                        if (e === "") {
                            return <></>
                        }
                        const expReplace = e.replace("●", "").replace("o\t", "").replace("\t", "");
                        return (
                            <HStack alignItems={"flex-start"}>
                                <Box w={"32px"} h={"32px"}>
                                    <IconChevronRight width={32} height={32} size={28} color={theme.colors.brand.orange}/>
                                </Box>
                                <Text pt={1}>
                                    {expReplace}
                                </Text>
                            </HStack>
                        )
                    }
                )}
            </VStack>
        </VStack>
    )
}
export const Experience = (props: Queries.ExperienceComponentFragment) => {
    const theme = useTheme();
    return (
        <Section title={"4. Experience"} anchor={"experience"}>
            <Stack maxW={"5xl"}>
                {props.experiences?.map((experience) => {
                    return (
                        <ExperienceItem {...experience} />
                    )
                })}
            </Stack>
        </Section>
    )
}

export const query = graphql`
    fragment ExperienceComponent on ContentfulWorkExperience {
        title
        description
        experiences {
            name
            title
            dateFrom
            dateTo
            description {
                description
            }

        }
    }
`;
