import { useEffect, useRef } from "react";
import * as React from "react";
import debounce from "lodash/debounce";
import { Box, useBreakpointValue } from "@chakra-ui/react";

type Point = { x: number; y: number };
export const RockWall = ({
    parentRef,
}: {
    parentRef: React.MutableRefObject<HTMLElement | null>;
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [parentHeight, setParentHeight] = React.useState(0);
    const display = useBreakpointValue({ base: false, md: true });

    // useEffect(() => {
    //     const selector = "[id^=section-]";
    //     const elements = document.querySelectorAll(selector);
    // }, []);

    useEffect(() => {
        const target = parentRef.current;
        if (!target) return;

        const handleResize = debounce(() => {
            if (target.clientHeight !== parentHeight) {
                setParentHeight(target.clientHeight);
            }
        }, 500);

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(target);

        return () => resizeObserver.disconnect();
    }, []);

    const smoothLine = (points: Point[], smoothFactor: number): Point[] => {
        for (let i = smoothFactor; i < points.length - smoothFactor; i++) {
            let sumX = 0;
            for (let j = -smoothFactor; j <= smoothFactor; j++) {
                sumX += points[i + j].x;
            }
            points[i].x = sumX / (2 * smoothFactor + 1);
        }
        return points;
    };
    const drawRockTexture = (
        context: CanvasRenderingContext2D,
        width: number,
        height: number,
    ) => {
        const points = [];
        let x = width / 2;
        let y = height;
        const cliffTopStart = 50;
        // const margin = 20;
        const leftMargin = 30; // Left margin
        const rightMargin = width - 50; // Right margin

        // Variables to control the feature size and variability
        const maxJaggedness = 2; // Reduced max jaggedness
        const minJaggedness = 0.5; // Reduced min jaggedness for smoother transitions
        const variationFrequency = 750; // Increase this for less frequent but larger variations

        for (; y > cliffTopStart; y--) {
            let jaggedness =
                Math.random() * (maxJaggedness - minJaggedness) + minJaggedness;
            jaggedness *= Math.random() > 0.5 ? 1 : -1;
            if (Math.random() * 100 < variationFrequency) {
                x += jaggedness;
            } else {
                x += jaggedness * 0.3; // Smaller increment for a smoother line
            }

            // Constrain x to the canvas width
            x = Math.max(leftMargin, Math.min(x, rightMargin));

            points.push({ x, y });
        }

        // Create the inward cliff top
        const inwardCurve = 5; // The inward curve amount
        for (; y >= 0; y--) {
            x -= inwardCurve; // Move x to the left for the cliff top
            points.push({ x, y });
        }

        // Apply a smoothing pass over the line
        const smoothedPoints = smoothLine(points, 7); // Smooth factor can be adjusted

        // Draw the smoothed line
        context.beginPath();
        context.moveTo(width / 2, height);
        smoothedPoints.forEach((point) => context.lineTo(point.x, point.y));
        context.lineWidth = 1;
        context.strokeStyle = "#686868";
        context.stroke();

        return smoothedPoints;
    };

    const generateRockyTexture = (
        context: CanvasRenderingContext2D,
        width: number,
        height: number,
        cliffPoints: Map<number, number>,
    ) => {
        const greyPalette = [
            "#686868",
            "#707070",
            "#787878",
            "#808080",
            "#888888",
        ];
        const points = []; // Array to store random points (the centers of Worley cells)
        const numPoints = 100; // The number of points you want to scatter

        // Populate the array with random points
        for (let i = 0; i < numPoints; i++) {
            points.push({
                x: Math.random() * width,
                y: Math.random() * height,
            });
        }

        // For each pixel in the canvas...
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                // Find the closest point
                let closestDistanceSquared = Number.MAX_VALUE;
                let closestIndex = -1;

                for (let i = 0; i < numPoints; i++) {
                    const dx = x - points[i].x;
                    const dy = y - points[i].y;
                    const distanceSquared = dx * dx + dy * dy;

                    if (distanceSquared < closestDistanceSquared) {
                        closestDistanceSquared = distanceSquared;
                        closestIndex = i;
                    }
                }

                // console.log("x, y", x, y);
                // Use the index of the closest point to determine the color
                const colorIndex = closestIndex % greyPalette.length;
                context.fillStyle = greyPalette[colorIndex];
                const xPoint = Math.min(x, (cliffPoints.get(y) ?? x) - 1);
                context.fillRect(xPoint, y, 1, 1); // Fill in one pixel with the chosen color
            }
        }
    };

    useEffect(() => {
        if (display == null) return;
        const canvas = canvasRef.current;
        if (canvasRef.current == null) return;
        if (canvas === null) return;

        canvasRef.current.height = parentHeight;
        const context = canvas.getContext("2d");

        if (context == null) return;
        const { width, height } = canvas;

        // Clear the canvas
        context.clearRect(0, 0, width, height);

        // Draw the jagged texture
        const points = drawRockTexture(context, width, height);
        const pointsMap = points.reduce((acc, point) => {
            acc.set(point.y, point.x);
            return acc;
        }, new Map());
        generateRockyTexture(context, width, height, pointsMap);
        // console.log("Points: ", points);
        // fillCliffFace(context, points, width, height);
    }, [parentHeight, display]);

    return (
        <Box
            display={{ base: "none", md: "block" }}
            as={"canvas"}
            ref={canvasRef}
            width={200}
            height={parentHeight}
        />
    );
};
