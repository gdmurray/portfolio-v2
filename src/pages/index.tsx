import * as React from "react";
import { graphql, type HeadFC, type PageProps } from "gatsby";
import Header from "../components/Header";
import { Box, Stack, useColorMode } from "@chakra-ui/react";
import { Hero } from "../components/Hero";
import { AboutMe } from "../components/AboutMe";
import { Skills } from "../components/Skills";
import { Projects } from "../components/Projects/Projects";
import { Experience } from "../components/Experience";
import { useEffect, useMemo, useRef } from "react";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEOComponent";

const pageStyle = {
    // backgroundColor: "#3E3A22",
    // color: "white",
    fontFamily: "Poppins, Roboto, -apple-system, sans-serif, serif",
    minHeight: "100vh",
    height: "auto",
    width: "100%",
};

const sectionMap = {
    ContentfulAboutMe: AboutMe,
    ContentfulSkills: Skills,
    ContentfulProjectsSection: Projects,
    ContentfulWorkExperience: Experience,
};

const useCheckAndChangeColorMode = () => {
    const { colorMode, setColorMode } = useColorMode();

    useEffect(() => {
        // Check local storage for the 'chakra-ui-color-mode' key
        const storedColorMode = localStorage.getItem("chakra-ui-color-mode");

        // If the stored color mode is 'dark', change it to 'light'
        if (storedColorMode === "dark") {
            setColorMode("light");
        }
    }, [colorMode, setColorMode]);
};

const IndexPage: React.FC<PageProps> = ({ data }) => {
    const parentRef = useRef(null);
    const { contentfulPage } = data as {
        contentfulPage: Queries.ContentfulPage;
    };
    useCheckAndChangeColorMode();
    const links: Queries.FooterLinkComponentFragment[] = useMemo(() => {
        if (contentfulPage.footerLinks != null) {
            return contentfulPage.footerLinks as unknown as Queries.FooterLinkComponentFragment[];
        }
        return [];
    }, [contentfulPage.footerLinks]);

    const FooterComponent = useMemo(() => {
        return <Footer links={links} />;
    }, [links]);

    return (
        <Box
            as={"main"}
            style={pageStyle}
            background={"brand.background.beige"}
        >
            <Header />
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
            >
                <Hero />
                {contentfulPage.sections?.map((elem) => {
                    const {
                        contentful_id: contentfulId,
                        __typename: typeName,
                        ...componentProps
                    } = elem as any;
                    if (elem == null) return <></>;
                    const Component =
                        sectionMap[typeName as keyof typeof sectionMap];
                    return <Component key={contentfulId} {...componentProps} />;
                })}
                {FooterComponent}
            </Stack>
        </Box>
    );
};

export default IndexPage;

export const Head: HeadFC = () => {
    return (
        <SEO
            title={"Greg Murray Portfolio"}
            description={"Full Stack Software Engineer"}
            image={`${process.env.GATSBY_SITE_URL}/icons/icon-512x512.png`}
        />
    );
};

export const query = graphql`
    query {
        contentfulPage(name: { eq: "Portfolio" }) {
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
`;
