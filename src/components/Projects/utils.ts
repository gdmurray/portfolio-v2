export function calculateTextWidth(text: string, font: string) {
    if (typeof document !== "undefined") {
        // Create a canvas element
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (context == null) {
            return;
        }
        // Set the font to the context to match the desired style
        context.font = font;

        // Measure the text width using the measureText method
        const metrics = context.measureText(text);

        // Return the width
        return metrics.width;
    }
    return text.length * 0.6;
}

export function calculateBadgeWidth({
    textSize,
    fontFamily,
    padding,
    gap,
    textContent,
}: {
    textSize: number;
    fontFamily: string;
    padding: number;
    gap: number;
    textContent: string;
}) {
    // Construct the font string similar to CSS font property
    const font = `${textSize}px ${fontFamily}`;

    // Calculate the text width
    const textWidth: number = calculateTextWidth(textContent, font) ?? 75;

    // Calculate total padding (left + right)
    const totalPadding = padding * 2;

    // Calculate the total badge width
    return textWidth + totalPadding + gap;
}

export function sortObjectByArrayLengthAndKey(obj: {
    [key: string]: string[];
}) {
    // Convert the object into an array of [key, value] pairs
    const entries = Object.entries(obj);

    // Sort the entries
    entries.sort((a, b) => {
        // a and b are entries of the form [key, value], where value is a string array
        const lengthDifference = b[1].length - a[1].length; // Descending by array length
        if (lengthDifference !== 0) {
            // If the lengths are different, decide based on the length
            return lengthDifference;
        } else {
            // If the lengths are the same, sort alphabetically by key
            return a[0].localeCompare(b[0]);
        }
    });

    // Map the sorted array of entries to an array of keys
    return entries.map((entry) => entry[0]);
}
