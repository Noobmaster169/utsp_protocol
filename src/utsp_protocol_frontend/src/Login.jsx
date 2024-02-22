function Login({login}){
    
    async function startLogin(event){
        const loginButton = document.getElementById("loginButton");
        loginButton.setAttribute("disabled", true);
        await login();
        loginButton.removeAttribute("disabled");
      }
      
    return(
        <div>
            <button id="loginButton" onClick={startLogin}>Login!</button>
        </div>
    )
};

export default Login;