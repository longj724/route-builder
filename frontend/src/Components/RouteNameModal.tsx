// External Dependencies
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

// Relative Dependencies

// Types
type RouteNameModalProps = {
  isOpen: boolean;
  onClose: () => void;
  routeName: string;
  setRouteName: React.Dispatch<React.SetStateAction<string>>;
  saveRoute: () => Promise<void>;
};

function RouteNameModal(props: RouteNameModalProps) {
  const { isOpen, onClose, routeName, setRouteName, saveRoute } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading>Enter Route Name</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form
            id="save-route"
            onSubmit={(event) => {
              event.preventDefault();
              saveRoute();
            }}
          >
            <FormControl>
              <FormLabel>Route Name</FormLabel>
              <Input
                type="text"
                onChange={(e) => setRouteName(e.target.value)}
              />
            </FormControl>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button type="submit" form="save-route" disabled={routeName === ''}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default RouteNameModal;
