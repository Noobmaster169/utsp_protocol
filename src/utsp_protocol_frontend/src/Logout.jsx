function Logout({logout}){
    async function startLogout(event){
        const logoutButton = document.getElementById("logoutButton");
        logoutButton.setAttribute("disabled", true);
        await logout();
        logoutButton.removeAttribute("disabled");
    }

    return(
        <div>
            <button id="logoutButton" onClick={startLogout}>Log Out</button>
        </div>
    )
};

export default Logout;