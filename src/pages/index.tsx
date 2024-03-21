import * as React from "react"
import {graphql, type HeadFC, type PageProps} from "gatsby"
import Header from "../components/Header";
import {Box, Flex, HStack, Stack} from "@chakra-ui/react";
import {Hero} from "../components/Hero";
import {AboutMe} from "../components/AboutMe";
import {Skills} from "../components/Skills";
import {Projects} from "../components/Projects";
import {Experience} from "../components/Experience";
import { RockWall } from "../components/RockWall";
import {useRef} from "react";

const pageStyle = {
    // backgroundColor: "#3E3A22",
    // color: "white",
    fontFamily: "Poppins, Roboto, -apple-system, sans-serif, serif",
    minHeight: "100vh",
    height: "auto",
    width: "100vw"
}

const sectionMap = {
    ContentfulAboutMe: AboutMe,
    ContentfulSkills: Skills,
    ContentfulProjectsSection: Projects,
    ContentfulWorkExperience: Experience,


}
const IndexPage: React.FC<PageProps> = ({data}) => {
    console.log("DATA: ", data);
    const parentRef = useRef(null);
    const {contentfulPage} = data as {contentfulPage: Queries.ContentfulPage};
    console.log(contentfulPage.sections);
    return (
        <Box as={"main"} style={pageStyle} backgroundColor={"brand.green"}>
            <Header/>
            <HStack height={"auto"}>
                {/*<RockWall parentRef={parentRef}/>*/}
                <Stack gap={12} ref={parentRef} flex={1} alignItems={"center"}>
                    <Hero />
                    {contentfulPage.sections?.map((elem) => {
                        const {
                            id,
                            __typename: typeName,
                            ...componentProps
                        } = elem as any;
                        if(elem == null) return <></>
                        const Component = sectionMap[typeName as keyof typeof sectionMap];
                        return <Component key={elem.id} {...componentProps} />
                    })}
                </Stack>
            </HStack>
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
        }
    }
`
