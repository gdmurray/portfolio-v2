import {
    BLOCKS,
    MARKS,
    INLINES,
    Text as ContentfulText,
} from "@contentful/rich-text-types";
import {
    RenderNode, documentToReactComponents,
    Options,
} from "@contentful/rich-text-react-renderer";
import {Box, Heading, Link, ListItem, OrderedList, Text, UnorderedList} from "@chakra-ui/react";
import React from "react";

const defaultNodeRenderers: RenderNode = {
    [BLOCKS.PARAGRAPH]: (node, children) => {
        if (
            typeof children !== "string" ||
            (children?.length === 1 && children[0] === "")
        ) {
            return <Text mb={4}>&nbsp;</Text>;
        }
        return <Text mb={4}>{children}</Text>;
    },
    [BLOCKS.HEADING_1]: (node, children) => (
        <Heading as="h1" size="xl" mb={4}>
            {children}
        </Heading>
    ),
    [BLOCKS.HEADING_2]: (node, children) => (
        <Heading as="h2" size="lg" mb={4}>
            {children}
        </Heading>
    ),
    [BLOCKS.HEADING_3]: (node, children) => (
        <Heading as="h3" size="md" mb={4}>
            {children}
        </Heading>
    ),
    [BLOCKS.HEADING_4]: (node, children) => (
        <Heading as="h4" size="sm" mb={4}>
            {children}
        </Heading>
    ),
    [BLOCKS.HEADING_5]: (node, children) => (
        <Heading as="h5" size="xs" mb={4}>
            {children}
        </Heading>
    ),
    [BLOCKS.HEADING_6]: (node, children) => (
        <Heading as="h6" mb={4}>
            {children}
        </Heading>
    ),
    [BLOCKS.UL_LIST]: (node, children) => (
        <UnorderedList mb={4}>{children}</UnorderedList>
    ),
    [BLOCKS.OL_LIST]: (node, children) => (
        <OrderedList mb={4}>{children}</OrderedList>
    ),
    [BLOCKS.LIST_ITEM]: (node, children) => <ListItem>{children}</ListItem>,
    [BLOCKS.QUOTE]: (node, children) => (
        <Box
            as="blockquote"
            borderLeft="4px solid"
            borderColor="gray.200"
            pl={4}
            mb={4}
        >
            {children}
        </Box>
    ),

    [INLINES.HYPERLINK]: (node) => {
        const {uri} = node.data;
        return (
            <Link href={uri} color="blue.500" isExternal>
                {(node.content[0] as ContentfulText).value}
            </Link>
        );
    },
};

export function RichText(text: { raw: string }) {
    const {raw} = text;
    const options: Options = {
        renderMark: {
            [MARKS.BOLD]: (text) => <Text as="b">{text}</Text>,
            [MARKS.ITALIC]: (text) => <Text as="i">{text}</Text>,
            [MARKS.UNDERLINE]: (text) => <Text as="u">{text}</Text>,
        },
        renderNode: {
            ...defaultNodeRenderers
        },
    };

    try {
        return documentToReactComponents(JSON.parse(raw as string), options);
    } catch (err) {
        console.error("Error Rendering Rich Text: ", err);
        return <></>;
    }
}
