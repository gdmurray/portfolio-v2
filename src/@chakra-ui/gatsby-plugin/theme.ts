import {extendTheme} from "@chakra-ui/react"

const brandColors = {
    orange: "#FDA121",
    green: "#34321D",
    black: "#262324",
}
const theme = extendTheme({
    config: {
        initialColorMode: "dark",
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
