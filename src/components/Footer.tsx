import React, { useCallback, useEffect, useState } from "react";
import {
    Box,
    Flex,
    HStack,
    IconButton,
    Stack,
    Text,
    VStack,
    Link,
    Spinner,
} from "@chakra-ui/react";
import { graphql } from "gatsby";
import { LazyIcon } from "./LazyIcon";
import { IconMail } from "@tabler/icons-react";
import { motion, useAnimation } from "framer-motion";
const MailButton = () => {
    const [loading, setLoading] = useState<boolean>(false);

    async function fetchEmail() {
        return await window
            .fetch(`/api/get-mailto-link`, {
                method: `GET`,
                headers: {
                    "content-type": "application/json",
                },
            })
            .then(async (res) => {
                const json = await res.json();
                if (json.status === "Error") {
                    console.error("Error: ", json.message);
                    throw new Error(json.message); // Throw an error if there's an API error
                }
                return json;
            })
            .catch((error) => {
                console.error("Fetch Email Error: ", error);
                return null; // Return null or a default value in case of error
            });
    }

    const handleFetchEmail = async () => {
        setLoading(true);
        const response = await fetchEmail();
        setLoading(false);

        // Check if the response is valid and contains an email
        if (response && response.email) {
            // Construct and open the mailto link
            window.location.href = `mailto:${response.email}`;
        } else {
            console.error("Invalid email response");
        }
    };

    return (
        <Flex>
            <IconButton
                _hover={{ color: "brand.tangerineOrange.600" }}
                onClick={handleFetchEmail}
                variant={"link"}
                fontSize={24}
                aria-label={"mail"}
                color={"brand.tangerineOrange.900"}
                icon={
                    loading ? (
                        <Spinner color={"brand.tangerineOrange.900"} />
                    ) : (
                        <IconMail />
                    )
                }
            />
        </Flex>
    );
};

const MotionVStack = motion(VStack);

const footerElementVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, delay: 2 } },
};
export const Footer = ({
    links,
}: {
    links: Queries.FooterLinkComponentFragment[];
}) => {
    const controls = useAnimation();

    useEffect(() => {
        controls.start("visible");
    }, []);

    const Icons = useCallback(() => {
        return (
            <>
                {links.map((elem) => (
                    <Flex key={elem.title}>
                        <IconButton
                            _hover={{ color: "brand.tangerineOrange.600" }}
                            aria-label={elem.title ?? ""}
                            as={Link}
                            href={elem.link ?? ""}
                            color={"brand.tangerineOrange.900"}
                            fontSize={24}
                            isExternal={true}
                            variant={"link"}
                            icon={<LazyIcon iconName={elem.icon ?? ""} />}
                        />
                    </Flex>
                ))}
            </>
        );
    }, [links]);

    return (
        <Flex
            w={"100vw"}
            paddingX={16}
            paddingY={16}
            background={"brand.background.green"}
            justifyContent={"center"}
            marginTop={"-1px"}
            marginBottom={"0px"}
        >
            <MotionVStack
                display={{ base: "none", md: "flex" }}
                position={"fixed"}
                bottom={0}
                left={"5px"}
                initial={"hidden"}
                variants={footerElementVariants}
                animate={controls}
                alignItems={"flex-end"}
                gap={4}
            >
                <Icons />
                <Box
                    height={"100px"}
                    width={"50%"}
                    borderLeft={"2px solid"}
                    borderLeftColor={"brand.tangerineOrange.900"}
                />
            </MotionVStack>
            <MotionVStack
                display={{ base: "none", md: "flex" }}
                position={"fixed"}
                bottom={0}
                right={"5px"}
                alignItems={"flex-end"}
                gap={4}
                initial={"hidden"}
                variants={footerElementVariants}
                animate={controls}
            >
                <MailButton />
                <Box
                    height={"100px"}
                    width={"50%"}
                    borderLeft={"2px solid"}
                    borderLeftColor={"brand.tangerineOrange.900"}
                />
            </MotionVStack>
            <Stack gap={5}>
                <HStack
                    display={{ base: "flex", md: "none" }}
                    gap={5}
                    justifyContent={"center"}
                    alignItems={"center"}
                >
                    <Icons />
                    <MailButton />
                </HStack>
                <Stack textAlign={"center"}>
                    <Text color={"brand.tangerineOrange.700"}>
                        Designed and Built <br /> by Greg Murray
                    </Text>
                    <Text color={"brand.tangerineOrange.700"} fontSize={12}>
                        {new Date().getFullYear()}
                    </Text>
                </Stack>
            </Stack>
        </Flex>
    );
};

export const query = graphql`
    fragment FooterLinkComponent on ContentfulFooterLink {
        title
        icon
        link
    }
`;
