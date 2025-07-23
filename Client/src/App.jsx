import { useContext } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AuthContext from '@/context/AuthContext';

import { ThemeProvider, createTheme } from '@mui/material';

import RouteFrontend from '@/routes/RouteFrontend';
import RouteUser from '@/routes/RouteUser';
import PageLoading from '@/views/auth/PageLoading';

import Topnav from '@/components/Topnav';
import Footer from '@/components/Footer';

function App() {
  const { status } = useContext(AuthContext);

  const muiTheme = createTheme({
    typography: {
      fontFamily: [ 'PttFont' ].join(','),
    },
    palette: {
      primary: { main: '#4DAAE9', contrastText: '#ffffff' },
      secondary: { main: '#1B1560', contrastText: '#ffffff' },
      info: { main: '#5a8dee', contrastText: '#ffffff' },
      success: { main: '#4ecc48', contrastText: '#ffffff' },
      warning: { main: '#ecb403', contrastText: '#ffffff' },
      error: { main: '#f5334f', contrastText: '#ffffff' },
      default: { main: '#eff1f2', contrastText: '#454f5b' },
    },
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <BrowserRouter>
        {status === 'unauthenticated'? (<>
          <RouteFrontend />
        </>): status === 'authenticated'? (<>
          <Topnav />
          <RouteUser />
          <Footer />
        </>): (
          <PageLoading />
        )}
      </BrowserRouter>
    </ThemeProvider>
  );
}
export default App;