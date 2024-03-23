import * as React from "react"
import {graphql, type HeadFC, type PageProps} from "gatsby"
import Header from "../components/Header";
import {Box, Flex, HStack, Stack, useColorMode} from "@chakra-ui/react";
import {Hero} from "../components/Hero";
import {AboutMe} from "../components/AboutMe";
import {Skills} from "../components/Skills";
import {Projects} from "../components/Projects";
import {Experience} from "../components/Experience";
import {RockWall} from "../components/RockWall";
import {useEffect, useRef} from "react";
import {Footer} from "../components/Footer";

const pageStyle = {
    // backgroundColor: "#3E3A22",
    // color: "white",
    fontFamily: "Poppins, Roboto, -apple-system, sans-serif, serif",
    minHeight: "100vh",
    height: "auto",
    width: "100%"
}

const sectionMap = {
    ContentfulAboutMe: AboutMe,
    ContentfulSkills: Skills,
    ContentfulProjectsSection: Projects,
    ContentfulWorkExperience: Experience,
}

const useCheckAndChangeColorMode = () => {
    const {colorMode, setColorMode} = useColorMode();

    useEffect(() => {
        // Check local storage for the 'chakra-ui-color-mode' key
        const storedColorMode = localStorage.getItem('chakra-ui-color-mode');

        // If the stored color mode is 'dark', change it to 'light'
        if (storedColorMode === 'dark') {
            setColorMode('light');
        }
    }, [colorMode, setColorMode]);
};

const IndexPage: React.FC<PageProps> = ({data}) => {
    const parentRef = useRef(null);
    const {contentfulPage} = data as { contentfulPage: Queries.ContentfulPage };
    useCheckAndChangeColorMode();
    return (
        <Box as={"main"} style={pageStyle} background={"brand.background.beige"}>
            <Header/>
            <Stack
                marginTop={"88px"}
                background={"brand.background.beige"}
                paddingTop={"120px"}
                p={0}
                gap={0}
                ref={parentRef}
                flex={1}
                alignItems={"center"}
                overscrollBehaviorX={"none"}
                overflowX={"hidden"}
                // paddingX={16}
            >
                <Hero/>
                {contentfulPage.sections?.map((elem) => {
                    const {
                        contentful_id,
                        __typename: typeName,
                        ...componentProps
                    } = elem as any;
                    if (elem == null) return <></>
                    const Component = sectionMap[typeName as keyof typeof sectionMap];
                    return <Component key={contentful_id} {...componentProps} />
                })}
                <Footer links={contentfulPage.footerLinks}/>
            </Stack>
        </Box>
    )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>

export const query = graphql`
    query {
        contentfulPage(name: {eq: "Portfolio"}){
            id
            sections {
                __typename
                ...AboutMeComponent
                ...SkillsComponent
                ...ProjectsComponent
                ...ExperienceComponent
            }
            footerLinks {
                ...FooterLinkComponent
            }
        }
    }
`
