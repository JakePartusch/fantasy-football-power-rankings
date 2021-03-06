/** @jsx jsx */
import { jsx } from '@emotion/core';
import Home from './pages/home/Home';
import RankingsSimulator from './pages/standings/StandingsSimulator';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';
import { ThemeProvider, StylesProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core';
import ReactGA from 'react-ga';
import Navbar from './common/Navbar';
import Footer from './common/Footer';
import FullPageLoader from './common/FullPageLoader';
import { useAuth0 } from './react-auth0-spa';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import ScrollToTop from './common/ScrollToTop';
ReactGA.initialize('UA-109019699-1');

const theme = createMuiTheme({
  typography: {
    h1: {
      fontSize: '3rem'
    },
    h2: {
      fontSize: '2.5rem'
    }
  }
});

const App = () => {
  const { loading, getIdTokenClaims } = useAuth0();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getTokens = async () => {
      const tokens = await getIdTokenClaims();
      if (tokens) {
        const response = await Axios.get('/api/user', {
          headers: { Authorization: `Bearer ${tokens.__raw}` }
        });
        setUser(response.data);
      }
    };
    if (!loading && getIdTokenClaims) {
      getTokens();
    }
  }, [loading, getIdTokenClaims]);

  if (loading) {
    return <FullPageLoader />;
  }
  return (
    <ThemeProvider theme={theme}>
      <StylesProvider injectFirst>
        <div className="App">
          <Router>
            <ScrollToTop />
            <div
              css={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '100vh'
              }}
            >
              <Navbar />
              <main>
                <Switch>
                  <Route exact path="/" render={() => <Home user={user} setUser={setUser} />} />
                  <Route path="/standings" component={RankingsSimulator} />
                  <Redirect to="/" />
                </Switch>
              </main>
              <Footer />
            </div>
          </Router>
        </div>
      </StylesProvider>
    </ThemeProvider>
  );
};

export default App;
