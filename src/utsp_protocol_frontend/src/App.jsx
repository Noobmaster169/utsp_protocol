import { useAuth } from './useAuth';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import VotingPage from './pages/Voting';
import Navbar from './components/navbar';
import Explore from './pages/Explore';
import Create from './pages/Create';
import Settings from './pages/Settings';

function App() {

  const {isAuthenticated, login, logout, identity, votingManager, tokenManager} = useAuth();
  //How to update useAuth() again once a button is clicked?

  return (
    <main>

      <Navbar login = {login} isAuthenticated = {isAuthenticated} logout = {logout} />
      

      <Routes>
          <Route exact path='/' element={<Home/>}></Route>
          <Route path='/explore' element={<Explore/>}></Route>
          <Route path='/voting' element={
            <VotingPage 
              isAuthenticated={isAuthenticated}
              votingManager={votingManager}
              tokenManager={tokenManager}
            />}
          ></Route>
          <Route path='/create' element={<Create
            votingManager={votingManager}
          />}></Route>
          <Route path='/settings' element={<Settings
            votingManager={votingManager}
          />}></Route>
      </Routes>

      
    </main>
  );
}

export default App;
