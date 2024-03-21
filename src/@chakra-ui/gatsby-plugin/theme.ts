import {extendTheme} from "@chakra-ui/react"

const brandColors = {
    orange: "#FDA121",
    green: "#34321D",
    black: "#262324",
    background: {
        green: "#34321f",
        beige: "#f6f5ef"
    },
    subaruGreen: {
        900: "#34321D",
        800: "#413F24",
        700: "#625E37",
        600: "#837E49",
        500: "#A49D5B",
        400: "#B6B17C",
        300: "#C8C49D",
        200: "#DAD8BE",
        100: "#EDEBDE",
        50: "#F6F5EF",
    },
    tangerineOrange: {
        900: "#FA9403",
        800: "#FCA01C",
        700: "#FCAB36",
        600: "#FDB54F",
        500: "#FDBF68",
        400: "#FDCA81",
        300: "#FEDA9A",
        200: "#FEDFB3",
        100: "#FEEACD",
        50: "#FEF4E6",
    },
    skyBlue: {
      900: "#6CCFF6",
        800: "#87D8F8",
        700: "#9FE0F9",
    },
    aquaBlue: {
      900: "#44FFD2"
    },
    roseRed: {
      900: "#FF3E41"
    },
    oliveGreen: {
      900: "#C8D96F"
    },
    neonGreen: {
      900: "#DCED31"
    },
    orangeHighlight: "#FDBF68",
    greenHighlight: "#a49d5b",
    highlight: "#ec9837"
}
const theme = extendTheme({
    config: {
        initialColorMode: "light",
        useSystemColorMode: false,
    },
    fonts: {
        heading: "Poppins, sans-serif",
        body: "Poppins, sans-serif",
    },
    colors: {
        brand: brandColors,
    }
})

export default theme
