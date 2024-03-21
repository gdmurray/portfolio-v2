import React from "react";
import {Heading, Stack, useTheme} from "@chakra-ui/react";
import {graphql} from "gatsby";
import {RichText} from "./RichText";
import {Section} from "./Section";

export const AboutMe = (props: Queries.AboutMeComponentFragment) => {
    const theme = useTheme();
    return (
        <Section title={"1. About Me"} anchor={"about"}>
            <RichText raw={props.content?.raw ?? ""} />
        </Section>
    )
}

export const query = graphql`
    fragment AboutMeComponent on ContentfulAboutMe {
        id
        title
        content {
            raw
        }
    }
`;
