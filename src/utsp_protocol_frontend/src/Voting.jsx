import { useState } from 'react';
import { useAuth } from './useAuth';
import VotingTitle from './VotingTitle';
import VotingOptions from './VotingOptions';
import VotingLogs from './VotingLogs';

function Voting(){
    const [ID, setID] = useState(0);
    const [voteDisplay, setVoteDisplay] = useState(null);

    const {votingManager, tokenManager} = useAuth();
    
    async function changeID(event){
        const id = parseInt(event.target.value);
        setID(id);
    }
    
    async function search(event){
        event.preventDefault();
        const voting = await votingManager.getVoting(ID);
        
        console.log(JSON.stringify(voting))
        console.log(JSON.stringify(voting[0]))
        if(voting.length == 0){
            alert("Voting Not Found");
            return false;
        }
        let votingCanister = (voting[0].tokenCanister.length === 0) ? "Not Defined":voting[0].tokenCanister;
        let votingTitle    = voting[0].title;
        let votingDesc     = voting[0].desc;
        let votingImage    = voting[0].image;
        let votingCreator  = voting[0].creator.toString();
        let votingStatusObj= voting[0].status;
        let votingStatus   = Object.keys(votingStatusObj)[0].toString();
        let votingOptions  = voting[0].optionData;
        let tokenSupply    = "Token Not Defined";
        let tokenName      = "Token Not Defined";

        if(voting[0].tokenCanister.length != 0){
            const tokenData = await tokenManager.getStatus(votingCanister)
            .then(()=>{
                const splittedData = tokenData.split(",");
                tokenSupply = splittedData[0];
                tokenName   = `${splittedData[1]} (${splittedData[2]})`
            })
            .catch((e)=>{
                tokenSupply = "Canister Error";
                tokenName   = "Canister Error";
            })
        }

        setVoteDisplay(
            <div>
                <VotingTitle 
                    canister = {votingCanister}
                    title    = {votingTitle}
                    desc     = {votingDesc}
                    image    = {votingImage}
                    creator  = {votingCreator}
                    status   = {votingStatus}
                    tokenSupply = {tokenSupply}
                    tokenName = {tokenName}
                />
                <VotingOptions 
                    options = {votingOptions}
                />
                <VotingLogs
                    ID = {ID}
                />
            </div>
        )
        console.log("Query Process Finished");
        return false;
    }
        
    return(
        <div>
            <form onSubmit={search}>
                <input placeholder="ID" onChange={changeID}></input>
                <input type="submit" className="button" value="Search Voting"/>
            </form>
            <label>Result:</label>
            {voteDisplay}
        </div>
    )
}

export default Voting;