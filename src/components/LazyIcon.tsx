import React from "react";
import loadable from "@loadable/component";


export const LazyIcon = ({
                             iconName,
                             props,
                         }: {
    iconName: string;
    props?: any;
}) => {
    try {
        // Dynamically import the icon based on the iconName prop
        const Icon = loadable(
            () => import(`@tabler/icons-react/dist/esm/icons/${iconName}.mjs`),
        );

        return <Icon {...props} />;
    } catch (err) {
        console.error("Error Importing Icon: ", iconName, err);
        return <></>;
    }
};
