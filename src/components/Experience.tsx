import React from "react";
import {graphql} from "gatsby";
import {Box, DarkMode, Heading, HStack, Stack, Text, useColorModeValue, useTheme, VStack} from "@chakra-ui/react";
import {Section} from "./Section";
import {IconChevronRight} from "@tabler/icons-react";


export const ExperienceItem = ({experience, color}: {
    // @ts-ignore
    experience: Queries.ExperienceComponentFragment["experiences"][number],
    color: string
}) => {
    const theme = useTheme();
    const experiences = experience.description.description.split("\n");
    const dotExperiences = experience.description.description.split("●");
    return (
        <VStack alignItems={"flex-start"} mb={6}>
            <Heading color={"white"} size={"md"}>{experience.title} @ <Text as={"span"}
                                                                            color={color}>{experience.name}</Text></Heading>
            <Heading size={"sm"} as={"h5"} color={"gray.300"}></Heading>
            <VStack alignItems={"flex-start"}>
                {experiences.map((e: any) => {
                        if (e === "") {
                            return <></>
                        }
                        const expReplace = e.replace("●", "").replace("o\t", "").replace("\t", "");
                        return (
                            <HStack alignItems={"flex-start"}>
                                <Box w={"32px"} h={"32px"}>
                                    <IconChevronRight width={32} height={32} size={28} color={theme.colors.brand.orange}/>
                                </Box>
                                <Text pt={1} color={"gray.100"}>
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
    const colors = ["brand.skyBlue.900", "brand.roseRed.900", "brand.aquaBlue.900", "brand.neonGreen.900"]
    return (
        <Section bg={"brand.background.green"} title={"4. Experience"} anchor={"experience"}>
            <Stack maxW={"5xl"}>
                {props.experiences?.map((experience, index) => {
                    return (
                        <ExperienceItem experience={experience} color={colors[index % colors.length]}/>
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
