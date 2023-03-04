// External Dependencies
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';

// Relative Dependencies
import Main from './Pages/Main';
import RouteProvider from './Context/RouteProvider';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider resetCSS>
        <RouteProvider>
          <Main />
        </RouteProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
};

export default App;
