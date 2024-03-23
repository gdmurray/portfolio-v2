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
import {Box, chakra, Heading, Link, ListIcon, ListItem, OrderedList, Text, UnorderedList} from "@chakra-ui/react";
import React from "react";
import {navigate} from "gatsby";
import {IconChevronRight} from "@tabler/icons-react";

const AnimatedLink = chakra(Link, {
    baseStyle: {
        position: "relative",
        overflow: "hidden",
        fontWeight: 600,
        _after: {
            content: '""',
            position: 'absolute',
            width: '0',
            height: '1px',
            bottom: '0',
            left: '0',
            bg: 'currentColor', // Or any color you want the underline to be
            transition: 'width 0.3s ease',
        },
        _hover: {
            textDecoration: "none",
            _after: {
                width: '100%',
            },
        },
    }
});

export function onLinkClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const {href} = event.currentTarget;

    // console.log("Got: ", href);
    if (href.includes("#")) {
        // console.log("In the next line");
        const hrefTarget = href.split("#")[1];
        // console.log("hrefTarget: ", hrefTarget);
        if (hrefTarget.startsWith("image")) {
            // console.log("Navigating to image path");
            navigate("#" + hrefTarget);
            return;
        }
        if (typeof document !== "undefined") {
            const element = document.getElementById(hrefTarget);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({behavior: "smooth"});
                }, 10); // Adding a slight delay
            }
            return;
        }
    }
}


const defaultNodeRenderers: RenderNode = {
    [BLOCKS.PARAGRAPH]: (node, children) => {
        if (
            typeof children === "string" ||
            ((children as React.ReactNode[]).length === 1 &&
                (children as React.ReactNode[])[0] === "")
        ) {
            return <Text mb={4}>&nbsp;</Text>;
        }
        if (children == null) return <></>;
        // @ts-ignore
        if (typeof children[0] === "object") {
            if (
                // @ts-ignore
                children[0].props.children === "\n" ||
                // @ts-ignore
                children[0].props.children.trim() === ""
            ) {
                return <br/>;
            }
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
    [BLOCKS.UL_LIST]: (node, children) => {
        // console.log("Children: ", children);
        return (
            <UnorderedList
                display={"flex"}
                flexWrap={"wrap"}
                columnGap={"40px"}
                lineHeight={"12px"}
                mb={4}
            >
                {children}
                {/*{(children! as React.ReactNode[]).map((elem) => (*/}
                {/*    <ListItem>*/}
                {/*        <ListIcon as={IconChevronRight} color={"brand.tangerineOrange.900"}/>*/}
                {/*        {elem}*/}
                {/*    </ListItem>*/}
                {/*))*/}
                {/*}*/}
            </UnorderedList>
        )
    },
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
            <AnimatedLink href={uri} color="brand.tangerineOrange.900" onClick={onLinkClick}>
                {(node.content[0] as ContentfulText).value}
            </AnimatedLink>
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
