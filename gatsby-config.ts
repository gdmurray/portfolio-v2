import type {GatsbyConfig} from "gatsby";

const config: GatsbyConfig = {
    siteMetadata: {
        title: `Greg Murray Portfolio`,
        siteUrl: `https://www.gregmurray.dev`
    },
    // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
    // If you use VSCode you can also use the GraphQL plugin
    // Learn more at: https://gatsby.dev/graphql-typegen
    graphqlTypegen: true,
    plugins: [{
        resolve: 'gatsby-source-contentful',
        options: {
            "accessToken": process.env.CONTENTFUL_ACCESS_TOKEN,
            "spaceId": process.env.CONTENTFUL_SPACE_ID,
        }
    }, {
        resolve: "gatsby-plugin-google-gtag",
        options: {
            trackingIds: [process.env.GTAG_TRACKING_ID]
        }
    }, "gatsby-plugin-image", "gatsby-plugin-sharp", "gatsby-transformer-sharp", "gatsby-plugin-postcss", {
        resolve: 'gatsby-plugin-manifest',
        options: {
            icon: "src/images/favicon.svg",
            start_url: "/",
            name: "Greg Murray Portfolio",
            short_name: "GM",
            // icons: [
            //     {
            //         src: `src/images/favicon@96.png`,
            //         sizes: `96x96`,
            //         type: `image/png`,
            //     },
            //     {
            //         src: `src/images/favicon@180.png`,
            //         sizes: `180x180`,
            //         type: `image/png`,
            //     },
            // ], // Add or remove icon sizes as desired
        }
    }, {
        resolve: '@chakra-ui/gatsby-plugin',
        options: {
            /**
             * @property {boolean} [resetCSS=true]
             * if false, this plugin will not use `<CSSReset />
             */
            resetCSS: true,
            /**
             * @property {number} [portalZIndex=undefined]
             * The z-index to apply to all portal nodes. This is useful
             * if your app uses a lot z-index to position elements.
             */
            portalZIndex: undefined,
        },
    }, "gatsby-plugin-mdx", {
        resolve: 'gatsby-source-filesystem',
        options: {
            "name": "images",
            "path": "./src/images/"
        },
        __key: "images"
    }, {
        resolve: 'gatsby-source-filesystem',
        options: {
            "name": "pages",
            "path": "./src/pages/"
        },
        __key: "pages"
    }]
};

export default config;
