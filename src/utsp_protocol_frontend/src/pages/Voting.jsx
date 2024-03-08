import React from 'react';
import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useState } from 'react';
import '../styles/voting.css';
import votingImg from '../assets/voting.png';
import cat from '../assets/Cat.jpg';
import siren from '../assets/siren.png';
import { useNavigate } from 'react-router-dom';

export default function Voting({isAuthenticated, votingManager, tokenManager}){
    
    const navigate = useNavigate();
    const { state } = useLocation();
    const location = useLocation();
    
    const { VoteID } = state || {};
    let ID = parseInt(VoteID);
    console.log("Logging Vote ID:", ID);

    const [voteData, setVoteData] = useState({
        canister: null,
        title: null,
        desc: null,
        image: null,
        creator: null,
        statusObj: null,
        voteStatus: null,
        options: null,
    });
    const [tokenStatus, setTokenStatus] = useState({
        tokenSupply: null,
        tokenName: null,
    })

    const [votingStatus, setVotingStatus] = useState();
    const [logs, setLogs] = useState([]);
    const [tokenHolders,setTokenHolders] = useState([]);
    const [isOwner, setIsOwner] = useState(false);
    const [result, setResult] = useState([]);
    const [resultMessage, setResultMessage] = useState('');
    const [selectedOption, setSelectedOption] = useState('');

    function openSettings(){
        navigate('/settings', {state: {VoteID}})
    } 
    
    function changeOption(option){
        setSelectedOption(option);
    }
    
    async function selectVote(){
        const voteButton = document.getElementById("voteButton");
        voteButton.setAttribute("disabled", true);
        
        console.log("Selecting Vote", selectedOption);
        console.log(selectedOption);
        if(selectedOption===''){
            alert("No Option Selected");
            voteButton.removeAttribute("disabled")
            return false;
        };
        try{              
            const message = await votingManager.addVote(ID, selectedOption);
            if(message != "SUCCESS"){
                alert(message);
            }
            console.log(message);
        }catch(e){
            alert(e);
            console.log(e);
        }
        voteButton.removeAttribute("disabled")
    }
    
    useEffect(() => {
        async function getTokenStatus(canister){
            if(!canister){return false};
            try{
                const status = await tokenManager.getStatus(canister).catch(()=>{
                    alert("Error Connecting to canister")
                })
                console.log("Token Status: ", status)
                if(status){
                    const token_data = status.split(",");
                    setTokenStatus({
                        tokenSupply: token_data[0],
                        tokenName: `${token_data[1]} ($${token_data[2]})`,
                    })
                }
            }catch(e){
                console.log(e);
            }
        }
        async function getVoteData(ID){
            try {
                const result = await  votingManager.getVoting(ID);
                const data = result[0];
                const modifiedData = {
                    canister: (data.tokenCanister.length === 0) ? "":data.tokenCanister,
                    title: data.title,
                    desc: data.desc,
                    image: data.image,
                    creator: data.creator.toString(),
                    statusObj: data.status,
                    voteStatus: Object.keys(data.status)[0].toString(),
                    options: data.optionData,
                };

                const isOwner = await votingManager.isOwner(ID);
                setIsOwner(isOwner);
                setVoteData(modifiedData);
                if(modifiedData.canister){
                    getTokenStatus(modifiedData.canister[0]);   
                }
            } catch (error){
                console.error("Error getting data:", error);
                alert("Invalid Voting");
                navigate('/explore', {state: {VoteID}})
            }
        }
        async function getVotingStatus(ID){
            try{
                const result = await votingManager.getVotingStatus(ID);
                setVotingStatus(result);
            }catch(e){
                console.log(e);
            }
        }
        getVotingStatus(ID);
        getVoteData(ID);
    }, [ID]);

    const votingOptions = 
    voteData.options ? 
    voteData.options.map((option, index) => 
        <div class="voting-option-container">
            <input type="radio" name="pilihan" id={"pilihan-"+(index+1)} onChange={() =>{changeOption(index)}} />
            <label for={"pilihan-"+(index+1)}>
                <div class="option-label-div">
                    <img src={cat} class="mt-2 vote-photo"/>
                    <div class="vote-name">
                        {option.title}
                    </div>
                </div>
            </label>
        </div>
    ) : (<h2>No Options</h2>);

    useEffect(() => {
        async function getLogs(ID){
            try{
                const data = await votingManager.getLogs(ID);
                data.forEach((element, index) => {
                    let splitted = element.split(',');
                    let utcInteger = parseInt(parseInt(splitted[1]) / 1000000);
                    const date = new Date(utcInteger);

                    const year = date.getFullYear();
                    const month = date.getMonth() + 1; // Months are zero-indexed, so add 1
                    const day = date.getDate();
                    const hours = date.getHours();
                    const minutes = date.getMinutes();
                    const seconds = date.getSeconds();

                    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                    data[index] = splitted[0] + ' ' + formattedDate;
                });
                setLogs(data);
            }catch(e){
                console.log(e);
            }
        }

        getLogs(ID);
    }, [ID]);

    useEffect(()=>{
        async function getHolders(canister){
            if(!canister){return false};
            try{
                const holders = await tokenManager.getTokenOwners(canister[0])
                console.log(holders);
                setTokenHolders(holders);
            }catch(e){

            }
        }
        getHolders(voteData.canister);
    });

    const logList = logs.map((log) => 
        <tr>
            <td>{log}</td>
        </tr>
    );

    useEffect(() => {
        async function getTokenHolders(ID){
            try{
                const data = await tokenManager.getTokenOwners(ID);
                setTokenHolders(data);
            }catch(e){
                console.log(e);
            }
        }

        getTokenHolders(ID);
    }, [ID]);

    let tokenList = tokenHolders.map((token, index) =>
        <tr>
            <th scope='row'>{index}</th>
            <td>{token}</td>
        </tr>
    )

    useEffect(()=>{
        async function getVoteResult(ID){
            try{
                const resultDisplays = [];
                const results = await votingManager.getResult(ID)
                console.log("Canister Result:", results);
                console.log(results);
                if(results.length === 0){
                    voteData.options.forEach((option, index) => {
                        resultDisplays.push(
                            <div class="result-container">
                                <img src={cat} class="mt-2 vote-photo"/>
                                <div class="vote-name">
                                    {option.title}
                                </div>
                                <div class="result-percent">??</div>
                            </div>
                        )
                    })
                }else{
                    const result_scores = results.split(",").slice(1);
                    console.log("Splitted:", result_scores);
                    const total_scores = result_scores.reduce((acc, currentValue) => acc + parseInt(currentValue), 0);
                    console.log("Total:", total_scores);
                    const result_percents = result_scores.map((score)=> parseInt(parseInt(score)/total_scores*100))
                    console.log("Percents:", result_percents)
                    
                    let highest = {
                        name: null,
                        percent: 0,
                    };
                    voteData.options.forEach((option, index) => {
                        resultDisplays.push(
                            <div class="result-container">
                                <img src={cat} class="mt-2 vote-photo"/>
                                <div class="vote-name">
                                    {option.title}
                                </div>
                                <div class="result-percent">{result_percents[index]}%</div>
                            </div>
                        );
                        if(result_percents[index] > highest.percent){
                            highest = {
                                name: option.title,
                                percent: result_percents[index],
                            };
                        };
                    });  
                    setResultMessage(`Voting Has Ended. ${highest.name} got ${highest.percent}% of the votes`)
                }
                setResult(resultDisplays);
            }catch(e){
                console.log(e);
            }
        }
        getVoteResult(ID);
    })
    console.log(voteData);

    return (
        <div>
            <div class="page-container">
                <div class="title-desc-div mb-4">
                    <div class="page-title">
                        {voteData.title}
                    </div>
                    <div class="title-image">
                        <img src={votingImg}/>
                    </div>
                    <div class="title-desc mb-2">
                        {voteData.desc}
                    </div>
                    <div class="d-flex flex-row justify-content-center title-addtional-info">
                        <div class="d-flex flex-column">
                            <div>Token Canister</div>
                            <div>Token Name</div>
                            <div>Token Supply</div>
                        </div>
                        <div class="d-flex flex-column mx-1">
                            <div>:</div>
                            <div>:</div>
                            <div>:</div>
                        </div>
                        <div class="d-flex flex-column">
                            <div>{voteData.canister ? voteData.canister : "Not Found"}</div>
                            <div>{tokenStatus.tokenName ? tokenStatus.tokenName : "Not Found"}</div>
                            <div>{tokenStatus.tokenSupply? tokenStatus.tokenSupply : "Not Found"}</div>
                        </div>
                    </div>
                    <div class="status">
                        <div class="siren-parent-div mt-1">
                            <img width="20" height="20" src={siren} class="siren-icon" alt="siren"/>
                            <div class="siren-notif-block">
                                Token Contract Security Hasn't Been Verified
                            </div>
                        </div>
                        <div class="status-text mx-1">Status: {votingStatus}</div>
                    </div>
                </div>

                {isOwner ? <button onClick={openSettings}>Voting Settings</button>: ""}
                <div class="option-bar mt-2 mb-2">
                    <ul class="nav nav-tabs justify-content-center" id="myTab" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active tab-pane-button" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Voting</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link tab-pane-button" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Activity Log</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link tab-pane-button" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact-tab-pane" type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">Token Holders</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link tab-pane-button" id="results-tab" data-bs-toggle="tab" data-bs-target="#results-tab-pane" type="button" role="tab" aria-controls="results-tab-pane" aria-selected="false">Results</button>
                        </li>
                    </ul>
                    
                    <div class="tab-content" id="myTabContent">
                        <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
                            
                            {voteData.options? 
                                (votingOptions.length !== 0? 
                                    <div>
                                    <div class="vote-container">
                                        {votingOptions} 
                                    </div>
                                    <div class="vote-button-container">
                                        <button class="btn btn-success mt-3" id="voteButton" onClick={selectVote}>Vote</button>
                                    </div>
                                    </div>:
                                <p class="notification-text">No Voting Option Detected</p>): 
                                <p class="notification-text">Loading Voting Options</p>
                            }
                        </div>

                        <div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
                            <table class="table table-hover table-dark">
                                <thead>
                                    <tr>
                                        <th>Activity Log</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logList}
                                </tbody>
                            </table>    
                        </div>
                        
                        <div class="tab-pane fade" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab" tabindex="0">
                            {tokenList.length == 0 ? 
                                <p class="notification-text">Token Holder Not Detected</p>:
                                <table class="table table-hover table-dark">
                                    <thead>
                                        <tr>
                                            <th scope="col">Token ID</th>
                                            <th scope="col">Holder</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tokenList}
                                    </tbody>
                                </table>
                            }
                        </div>
                        
                        <div class="tab-pane fade" id="results-tab-pane" role="tabpanel" aria-labelledby="results-tab" tabindex="0">
                            <div class="result-container-parent">
                                {result}
                            </div>
                            <div class="notification-text">
                                {resultMessage?resultMessage: "Result Not Available Yet."}
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
}