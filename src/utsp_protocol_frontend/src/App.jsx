import { useState } from 'react';
import { useAuth } from './useAuth';
import Login from './Login';
import Logout from './Logout';
import Voting from './Voting';

function App() {
  const [greeting, setGreeting] = useState('');
  const [principal, setPrincipal] = useState('');

  const {isAuthenticated, login, logout, votingManager, tokenManager} = useAuth();
  //How to update useAuth() again once a button is clicked?
  
  function handleSubmit(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    votingManager.greet(name).then((greeting) => {
      setGreeting(greeting);
    });
    return false;
  }

  async function whoAmI(event){
    event.preventDefault();
    const whoAmIButton = document.getElementById("whoAmI");
    whoAmIButton.setAttribute("disabled", true);
    const whoAmIResponse = await votingManager.whoAmI();
    whoAmIButton.removeAttribute("disabled");
    setPrincipal(whoAmIResponse.toString());
    return false;
  }

  return (
    <main>
      <img src="/logo2.svg" alt="DFINITY logo" />
      <br />
      <section>Is Authenticated: {isAuthenticated? "Yes" : "No"}</section>
      {isAuthenticated ? <Logout logout = {logout} /> : <Login login = {login}/>}
      <br />
      <form>
        <button id="whoAmI" onClick={whoAmI}>Who Am I</button>
      </form>
      <section id="principal">Principal ID: {principal}</section>
      <br/>
      <br/>
      <Voting/>
    </main>
  );
}

export default App;
