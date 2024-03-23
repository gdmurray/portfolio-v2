import React from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalBody, useDisclosure } from '@chakra-ui/react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

const MotionModalContent = motion(ModalContent);

export function ModalTest() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const modalVariants = {
        hidden: { y: 500, opacity: 0, scale: 1 },
        visible: { y: 0, opacity: 1, scale: 1, transition: { duration: 1 } },
        exit: { y: -500, opacity: 1, scale: 1, background: "black",  transition: { duration: 1 } }
    };

    const controls = useAnimation();

    const handleCloseModal = async () => {
        console.log("Exiting")
        await controls.start("exit");
        setTimeout(() => {
            console.log("Closing Modal now");
            onClose();
        }, 1000);
    };
    const handleOpenModal = async () => {
        await controls.start("visible");
        onOpen();
    }


    return (
        <div>
            <Button onClick={handleOpenModal}>Open Modal</Button>
            <Modal isOpen={isOpen} onClose={handleCloseModal} isCentered>
                <ModalOverlay />
                <AnimatePresence>
                    {isOpen && (
                        <MotionModalContent
                            variants={modalVariants}
                            initial="hidden"
                            animate={controls}
                            exit="exit"
                        >
                            <ModalBody p={4}>
                                This is a modal.
                                <Button mt={4} onClick={handleCloseModal}>Close</Button>
                            </ModalBody>
                        </MotionModalContent>
                    )}
                </AnimatePresence>
            </Modal>
        </div>
    );
}
