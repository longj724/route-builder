// External Dependencies
import {
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Heading,
  Text,
} from '@chakra-ui/react';
import { User } from 'firebase/auth';

// Relative Dependencies
import { auth, signInWithGoogle } from '../Firebase';

// Types
type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

function Login(props: LoginModalProps) {
  const { isOpen, onClose, setUser } = props;

  const login = async () => {
    const signInSuccessful = await signInWithGoogle();
    if (signInSuccessful) {
      onClose();
      setUser(auth.currentUser);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading>Sign In With Google</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={5}>Signing in allows you to save routes</Text>
          <Flex justifyContent="center">
            <Button onClick={login}>Sign In</Button>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default Login;
