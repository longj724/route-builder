// External Dependencies
import { ChakraProvider } from '@chakra-ui/react';

// Relative Dependencies
import Main from './Pages/Main';
import RouteProvider from './Context/RouteProvider';

const App = () => {
  return (
    <ChakraProvider resetCSS>
      <RouteProvider>
        <Main />
      </RouteProvider>
    </ChakraProvider>
  );
};

export default App;
