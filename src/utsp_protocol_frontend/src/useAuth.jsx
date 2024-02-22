import { createActor as createVotingActor, votingManager as votingCanister } from '../../declarations/votingManager';
import { createActor as createTokenActor,  tokenManager  as tokenCanister  } from '../../declarations/tokenManager';
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";
import { useState } from 'react';


export const useAuth= () => {
    //Important Data?
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [identity, setIdentity] = useState(null);
    const [authClient, setAuthClient] = useState(null);
    const [votingManager, setVotingManager] = useState(votingCanister);
    const [tokenManager,  setTokenManager ] = useState(tokenCanister)
    
    async function login(){
        console.log("Logging In")
        let authClient = await AuthClient.create();
        await new Promise((resolve) => {
            authClient.login({
                identityProvider:
                    "https://identity.ic0.app",    //Use IC Network as default, not Local Host
                    /*process.env.DFX_NETWORK === "ic"
                        ? "https://identity.ic0.app"
                        : `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943`,*/
                onSuccess: resolve,
            });
        });
        updateClient(authClient);
    };

    async function logout(){
        await authClient?.logout();
        await updateClient(authClient);
    }

    async function updateClient(client){
        const isAuthenticated = await client.isAuthenticated();
        console.log("Authentication:", isAuthenticated);
        const identity        = await client.getIdentity();
        const agent           = new HttpAgent({ identity });
        const votingManager = createVotingActor(process.env.CANISTER_ID_VOTINGMANAGER, { //Change to CANISTER_ID_<FILE_BACKEND>
            agent,
        });
        const tokenManager = createTokenActor(process.env.CANISTER_ID_TOKENMANAGER, { //Change to CANISTER_ID_<FILE_BACKEND>
            agent,
        });
        setIsAuthenticated(isAuthenticated);
        setIdentity(identity);
        setAuthClient(client);
        setVotingManager(votingManager);
        setTokenManager(tokenManager);
    };

    return {
        isAuthenticated, //(Bool)User Has Login or Not
        login,           //Function for Logging In
        logout,          //Function for Logging Out
        authClient,      //Auth Client (probably won't be used when exported)
        identity,        //Internet Identity of the User  (se jg blm tau display kek bemana)
        votingManager,   //Voting Manager Backend
        tokenManager,    //Token  Manager Backend
    };
};

/* 
How to Use
import { useAuth } from "./useAuth";
{ isAuthenticated, login, logout, ..., backendActor} = useAuth();
{ isAuthenticated} = useAuth();

Login:
{login} = useAuth();
<button ........... onClick={login}>Log In</button>

Logout:
{logout} = useAuth();
<button ........... onClick={logout}>Log Out</button>

Check User Has Login Or Not:
{isAuthenticated} = useAuth();
const example = "User Login Status `${isAuthenticated}`"
*/