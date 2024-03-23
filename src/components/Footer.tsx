import React, {useEffect, useRef, useState} from "react";
import {Badge, Box, Flex, HStack, IconButton, Stack, Text, useTheme, VStack, Link, Spinner} from "@chakra-ui/react";
import {graphql} from "gatsby";
import {LazyIcon} from "./LazyIcon";
import {IconMail} from "@tabler/icons-react";
import {motion} from "framer-motion";


const RopeDivider = ({id}: { id: string }) => {
    const theme = useTheme();
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (ref.current == null) return;

        const canvas = ref.current;
        canvas.width = 40; // Set canvas width
        canvas.height = 200; // Set canvas height
        const context = canvas.getContext('2d');

        const drawWavyLine = (ctx: CanvasRenderingContext2D) => {
            const amplitude = 5; // Adjusted for the narrower width
            const wavelength = 50; // Shorter wavelength for the vertical orientation
            const widthOffset = canvas.width / 2; // Horizontal position of the line's midpoint

            // Starting point of the line
            ctx.moveTo(widthOffset, 0);

            // Draw the wavy line across the canvas height
            for (let y = 0; y < canvas.height; y += wavelength) {
                // Calculate the control point for the quadratic curve
                const cpY = y + wavelength / 2; // Control point y-coordinate (midpoint of the wavelength)
                const cpX = widthOffset + (y % (wavelength * 2) === 0 ? amplitude : -amplitude); // Control point x-coordinate, alternating wave width

                // End point of the quadratic curve
                const endY = y + wavelength;
                const endX = widthOffset;

                // Draw the quadratic curve
                ctx.quadraticCurveTo(cpX, cpY, endX, endY);
            }

            // Stroke settings
            ctx.strokeStyle = theme.colors.brand.tangerineOrange[900]; // Line color
            ctx.lineWidth = 2; // Line width
            ctx.stroke(); // Draw the line
        };

        if (context === null) {
            return;
        }
        drawWavyLine(context);
    }, []);

    return (
        <canvas ref={ref} id={id} width="40" height="200" style={{display: 'block', width: '40px', height: '200px'}}/>
    );
};

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
            .catch(error => {
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
                _hover={{color: "brand.tangerineOrange.600"}}
                onClick={handleFetchEmail} variant={"link"} fontSize={24} aria-label={"mail"}
                color={"brand.tangerineOrange.900"}
                icon={loading ? <Spinner color={"brand.tangerineOrange.900"}/> : <IconMail/>}
            />
        </Flex>
    )
}

const MotionVStack = motion(VStack);
export const Footer = ({links}: { links: Queries.FooterLinkComponentFragment[] }) => {
    return (
        <Flex w={"99vw"} paddingX={16} paddingY={16} background={"brand.background.green"} justifyContent={"center"}>
            <Box position={"fixed"} w={"100%"} bottom={0} left={0} display={{base: "none", md: "block"}}>
                <HStack justifyContent={"space-between"} alignItems={"flex-end"} paddingX={2}>
                    <MotionVStack
                        initial={"hidden"}
                        variants={{
                            hidden: {opacity: 0},
                            visible: {opacity: 1, transition: {duration: 0.5, delay: 1}}
                        }}
                        animate={"visible"}
                        alignItems={"flex-end"} gap={4}>
                        {links.map((elem) => (
                            <Flex key={elem.title}>
                                <IconButton
                                    _hover={{color: "brand.tangerineOrange.600"}}
                                    aria-label={elem.title ?? ""}
                                    as={Link}
                                    href={elem.link ?? ""}
                                    color={"brand.tangerineOrange.900"}

                                    fontSize={24}
                                    isExternal={true}
                                    variant={"link"}
                                    icon={<LazyIcon iconName={elem.icon ?? ""}/>}
                                />
                            </Flex>
                        ))}
                        <Box height={"100px"} width={"50%"} borderLeft={"2px solid"}
                             borderLeftColor={"brand.tangerineOrange.900"}/>
                    </MotionVStack>
                    <MotionVStack alignItems={"flex-end"} gap={4} initial={"hidden"}
                                  variants={{
                                      hidden: {opacity: 0},
                                      visible: {opacity: 1, transition: {duration: 0.5, delay: 1}}
                                  }}
                                  animate={"visible"}>
                        <MailButton/>
                        <Box height={"100px"} width={"50%"} borderLeft={"2px solid"}
                             borderLeftColor={"brand.tangerineOrange.900"}/>
                    </MotionVStack>
                </HStack>
            </Box>
            <Stack gap={5}>
                <HStack display={{base: "flex", md: "none"}} gap={5} alignItems={"center"}>
                    {links.map((elem) => (
                        <Flex key={elem.title}>
                            <IconButton
                                _hover={{color: "brand.tangerineOrange.600"}}
                                aria-label={elem.title ?? ""}
                                as={Link}
                                href={elem.link ?? ""}
                                color={"brand.tangerineOrange.900"}

                                fontSize={24}
                                isExternal={true}
                                variant={"link"}
                                icon={<LazyIcon iconName={elem.icon ?? ""}/>}
                            />
                        </Flex>
                    ))}
                    <MailButton/>
                </HStack>
                <Stack textAlign={"center"}>
                    <Text color={"brand.tangerineOrange.700"}>Designed by Greg Murray</Text>
                    <Text color={"brand.tangerineOrange.700"} fontSize={12}>{new Date().getFullYear()}</Text>
                </Stack>
            </Stack>
        </Flex>
    )
}

export const query = graphql`
    fragment FooterLinkComponent on ContentfulFooterLink {
        title
        icon
        link
    }
`
