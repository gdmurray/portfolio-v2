import React, { useRef } from "react";
import { graphql } from "gatsby";
import {
    Box,
    Heading,
    HStack,
    Stack,
    Text,
    useTheme,
    VStack,
} from "@chakra-ui/react";
import { Section } from "./Section";
import { IconChevronRight } from "@tabler/icons-react";
import dayjs from "dayjs";
import { motion, useInView } from "framer-motion";

const MotionHStack = motion(HStack);
export const ExperienceItem = ({
    experience,
    color,
}: {
    experience: NonNullable<
        Queries.ExperienceComponentFragment["experiences"]
    >[number];
    color: string;
}) => {
    const theme = useTheme();
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, {
        once: true,
        margin: "0px 0px -100px 0px",
    });
    const experiences = experience?.description?.description?.split("\n");

    const listVariants = {
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.2, // Each item will animate with a slight delay
            },
        }),
        hidden: { opacity: 0, x: -50 }, // Items start off-screen to the left
    };
    if (experience == null) return <></>;
    // const dotExperiences = experience.description.description.split("●");
    return (
        <VStack
            ref={ref}
            alignItems={"flex-start"}
            mb={6}
            id={experience.anchor ?? ""}
        >
            <Heading color={"white"} size={"md"}>
                {experience?.title} @{" "}
                <Text as={"span"} color={color}>
                    {experience.name}
                </Text>
            </Heading>
            <Heading size={"sm"} as={"h5"} color={"gray.300"}>
                {dayjs(experience.dateFrom).format("MMM YYYY")} -{" "}
                {experience.dateTo != null
                    ? dayjs(experience.dateTo).format("MMM YYYY")
                    : "Current"}
            </Heading>
            <VStack alignItems={"flex-start"}>
                {experiences?.map((e: any, index: number) => {
                    if (e === "") return null;
                    const expReplace = e
                        .replace("●", "")
                        .replace("o\t", "")
                        .replace("\t", "");
                    return (
                        <MotionHStack
                            key={`${experience.name}-line-${index}`}
                            alignItems={"flex-start"}
                            custom={index}
                            variants={listVariants}
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                        >
                            <Box w={"32px"} h={"32px"}>
                                <IconChevronRight
                                    width={32}
                                    height={32}
                                    size={28}
                                    color={
                                        theme.colors.brand.tangerineOrange[900]
                                    }
                                />
                            </Box>
                            <Text pt={1} color={"gray.100"}>
                                {expReplace}
                            </Text>
                        </MotionHStack>
                    );
                })}
            </VStack>
        </VStack>
    );
};
export const Experience = (props: Queries.ExperienceComponentFragment) => {
    const colors = [
        "brand.skyBlue.900",
        "brand.roseRed.900",
        "brand.aquaBlue.900",
        "brand.neonGreen.900",
    ];
    return (
        <Section
            bg={"brand.background.green"}
            title={"4. Experience"}
            anchor={"experience"}
            isLast={true}
        >
            <Stack maxW={"5xl"}>
                {props.experiences?.map((experience, index) => {
                    return (
                        <ExperienceItem
                            key={`${experience?.name}`}
                            experience={experience}
                            color={colors[index % colors.length]}
                        />
                    );
                })}
            </Stack>
        </Section>
    );
};

export const query = graphql`
    fragment ExperienceComponent on ContentfulWorkExperience {
        contentful_id
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
            anchor
        }
    }
`;
