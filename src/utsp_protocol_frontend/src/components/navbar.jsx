import { Link } from 'react-router-dom';
import '../styles/navbar.css';

export default function Navbar({login, isAuthenticated, logout}){

    async function startLogin(event){
        const loginButton = document.getElementById("loginButton");
        loginButton.setAttribute("disabled", true);
        await login();
        loginButton.removeAttribute("disabled");
    }

    async function startLogout(event){
        const logoutButton = document.getElementById("logoutButton");
        logoutButton.setAttribute("disabled", true);
        await logout();
        logoutButton.removeAttribute("disabled");
    }

    return (
        
            <header>
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                    <div class="container-fluid">
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav d-flex navigation-bar">
                            <div class="navigation-left">
                                <li class="nav-item">
                                    <Link className='nav-link' to='/'>Home</Link>
                                </li>
                                <li class="nav-item">
                                    <Link className='nav-link' to='/explore'>Explore</Link>
                                </li>
                                <li class="nav-item">
                                    <Link className='nav-link' to='/create'>Create</Link>
                                </li>
                            </div>
                            

                                {isAuthenticated ?
                                <div className='navigation-right'>
                                    <li class="nav-item">
                                        <a class="nav-link" id='logoutButton' onClick={startLogout}>Log Out</a>
                                    </li>
                                </div>
                                :
                                <div className='navigation-right'>
                                    <li class="nav-item">
                                        <a class="nav-link" id='loginButton' onClick={startLogin}>Login</a>
                                    </li>
                                </div>
                                }

                            
                        </ul>
                        </div>
                    </div>
                </nav>
            </header>
        
    );
}