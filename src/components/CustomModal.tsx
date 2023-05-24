import {
  Button,
  Center,
  FormControl,
  IModalProps,
  Input,
  Modal,
} from "native-base";
import { useState } from "react";

interface ModalProps extends IModalProps {
  opened: boolean;
}

const CustomModal = ({ opened, children, ...rest }: ModalProps) => {
  return (
    <Center>
      <Modal isOpen={opened} {...rest}>
        <Modal.Content maxWidth="400px" bg={"white"}>
          <Modal.Body p={8}>{children}</Modal.Body>
        </Modal.Content>
      </Modal>
    </Center>
  );
};
export default CustomModal;
