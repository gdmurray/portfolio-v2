import { chakra, Link } from "@chakra-ui/react";

export const AnimatedLink = chakra(Link, {
    baseStyle: {
        position: "relative",
        overflow: "hidden",
        _after: {
            content: '""',
            position: "absolute",
            width: "0",
            height: "1px",
            bottom: "0",
            left: "0",
            bg: "currentColor", // Or any color you want the underline to be
            transition: "width 0.3s ease",
        },
        _hover: {
            textDecoration: "none",
            _after: {
                width: "100%",
            },
        },
    },
});
