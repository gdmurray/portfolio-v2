import React, { useState } from "react";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    useDisclosure,
    Image,
    IconButton,
    Box,
} from "@chakra-ui/react";
import { IconX } from "@tabler/icons-react";

export const ExpandableImage = ({
    src,
    alt,
    ...imageProps
}: {
    src: string;
    alt: string;
    [key: string]: any;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [modalImgSrc, setModalImgSrc] = useState("");

    const handleImageClick = (src: string) => {
        setModalImgSrc(src);
        onOpen();
    };

    return (
        <>
            <Image
                src={src}
                alt={alt}
                cursor="pointer"
                _hover={{ shadow: "lg" }}
                {...imageProps}
                onClick={() => handleImageClick(src)}
            />

            <Modal
                motionPreset={"scale"}
                isOpen={isOpen}
                onClose={onClose}
                size="3xl"
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalBody padding={0}>
                        <Box position={"absolute"} right={"5px"} top={"5px"}>
                            <IconButton
                                size={"sm"}
                                aria-label={"close"}
                                icon={<IconX />}
                                onClick={onClose}
                                isRound={true}
                                fontSize={12}
                                variant={"outline"}
                                borderColor={"brand.tangerineOrange.900"}
                                color={"brand.tangerineOrange.900"}
                                _hover={{
                                    background: "brand.tangerineOrange.100",
                                }}
                                transition={"background-color 0.3s ease"}
                            />
                        </Box>
                        <Image
                            src={modalImgSrc}
                            alt={alt}
                            maxWidth="100%"
                            maxHeight="100vh"
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};
