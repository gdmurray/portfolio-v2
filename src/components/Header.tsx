import {Box, Button, Flex, Text, useTheme} from "@chakra-ui/react";
import React from "react";
import {IconMenuDeep, IconX} from "@tabler/icons-react";
import {navigate} from "gatsby";


const logoStyle = {
    fontSize: "48px",
    fontWeight: 700,
    // color: "#766E41",
    color: "#FA9403",
    // "-webkit-text-stroke": "1px #FA9403",

}

const sections = ["About", "Skills", "Projects", "Experience"];
const Header = () => {
    const theme = useTheme();
    const [show, setShow] = React.useState(false);
    const toggleMenu = () => setShow(!show);
    console.log("theme: ", theme);
    return (
        <Flex as={"header"}
              justify={"space-between"}
              alignItems={"center"}
              w="auto"
              mb={{sm: 4, md: 8}}
              p={theme.space["4"]}>
            <div style={logoStyle}>G</div>
            <Box
                cursor={"pointer"}
                display={{base: "block", md: "none"}}
                onClick={toggleMenu}
            >
                {show ? <IconX color={"#FA9403"} size={32}/> : <IconMenuDeep color={"#FA9403"} size={32}/>}
            </Box>
            <Box
                display={{base: show ? "flex" : "none", md: "block"}}
                flexBasis={{base: "100%", md: "auto"}}
            >
                <Flex
                    align="center"
                    justify={[
                        "center",
                        "space-between",
                        "flex-end",
                        "flex-end",
                    ]}
                    gap={4}
                    direction={["column", "row", "row", "row"]}
                    pt={[4, 4, 0, 0]}
                >
                    {sections.map((section) => (
                            <Button onClick={() => {
                                navigate("/#section-" + section.toLowerCase());
                                console.log("Section: ", section);
                                const sectionId = `section-${section.toLowerCase()}`;
                                console.log("Section ID: ", sectionId);
                                const element = document.getElementById(sectionId);
                                console.log("Element: ", element);
                                if (element != null) {
                                    console.log("Scrolling...");
                                    element.scrollIntoView({behavior: "smooth"});
                                }
                            }} variant={"ghost"} color={theme.colors.gray["400"]}>{section}</Button>
                        )
                    )}
                    <Button>Resume</Button>
                </Flex>
            </Box>
        </Flex>
    )
}

export default Header;
