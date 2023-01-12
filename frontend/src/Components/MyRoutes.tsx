// External Dependencies
import {
  Card,
  CardBody,
  Image,
  Stack,
  Heading,
  ButtonGroup,
  CardFooter,
  Divider,
  Button,
} from '@chakra-ui/react';

// Relative Dependencies

function MyRoutes() {
  return (
    <Card maxW="sm">
      <CardBody>
        <Image
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          alt="Green double couch with wooden legs"
          borderRadius="lg"
        />
        <Stack mt="6" spacing="3">
          <Heading size="md">Route Title</Heading>
          <Heading size="sm">Distance:</Heading>
          <Heading size="sm">
            Elevation Gain: 50 ft, Elevation Loss: 50ft
          </Heading>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <ButtonGroup spacing="2">
          <Button variant="solid" colorScheme="blue">
            View
          </Button>
          <Button variant="ghost" colorScheme="blue">
            Delete
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}

export default MyRoutes;
