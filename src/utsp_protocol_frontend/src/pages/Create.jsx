import { useEffect } from 'react';
import '../styles/create.css';
import { useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';


export default function Create({votingManager}){

    const navigate = useNavigate();
    const [displayActive,setDisplayActive] = useState(false);
    const [optionActive,setOptionActive] = useState(false);
    const [statusActive,setStatusActive] = useState(false);
    const [tokenActive,setTokenActive] = useState(false);
    const [optCnt,setOptCnt] = useState(1);
    const [optionList,setOptionList] = useState([]);
    
    useEffect(()=>{
        extend_form('display');
    }, [])
    
    function generateRandomID(){
        return parseInt(Math.floor(Math.random() * Math.pow(2, 32)));
    };
    
    async function createVoting(formData){
        try{
            const createButton = document.getElementById("createButton");
            createButton.setAttribute("disabled", true);
            
            const voteID = parseInt(generateRandomID());
            const voteTitle = formData.get('title').toUpperCase();
            const voteDesc = formData.get('desc');
            const voteImg = "";

            const message = await votingManager.createVoting(voteID);
            if (message != "SUCCESS"){
                alert(message);
                createButton.removeAttribute("disabled");
                return false;
            }
            const messageUpdate = await votingManager.updateVoteData(voteID,voteTitle,voteDesc,voteImg);
            if (messageUpdate != "SUCCESS"){
                alert(messageUpdate);
                createButton.removeAttribute("disabled");
                return false;
            }
            createButton.removeAttribute("disabled");
            console.log("Navigating to", voteID);

            const VoteID = voteID;
            navigate('/voting', {state: {VoteID}});   
        }catch(e){
            console.log(e);
        }
    }

    const extend_form = (section) => {
        let parent_element = document.querySelector(`#${section}-form`);
        let content_element = document.querySelector(`#${section}-content-form`);
        parent_element.classList.toggle('extend');
        content_element.style.maxHeight = content_element.scrollHeight + "px";
        switch (section) {
            case 'display':
                setDisplayActive(current => !current);
                break;
            
            case 'option':
                setOptionActive(current => !current);
                break;

            case 'status':
                setStatusActive(current => !current);
                break;

            case 'token':
                setTokenActive(current => !current);
                break;
        
            default:
                break;
        }
    }

    const reduce_form = (section) => {
        let content_element = document.querySelector(`#${section}-content-form`);
        let parent_element = document.querySelector(`#${section}-form`);
        parent_element.classList.toggle('extend');
        content_element.style.maxHeight = 0;
        switch (section) {
            case 'display':
                setDisplayActive(current => !current);
                break;
            
            case 'option':
                setOptionActive(current => !current);
                break;

            case 'status':
                setStatusActive(current => !current);
                break;

            case 'token':
                setTokenActive(current => !current);
                break;
        
            default:
                break;
        }
    }
    
    return (
        <div>
            <div class="setting-vote-content-container">
                <div class="vote-setting-page-title">
                    <span>Create Voting</span>
                </div>
                <div class="setting-container">
                    <div id="display-form" class="setting-form">
                        <div id="display-form-header" class="header-form" onClick={() => displayActive ? reduce_form('display') : extend_form('display')}>
                            <span><i class="fa-solid fa-chevron-down"></i></span>
                            Voting Display
                        </div>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            createVoting(new FormData(e.target));
                        }}>
                            <div class="form-content" id="display-content-form">
                                <div class="form-input-container display-first-input">
                                    <label for="display-title-input">Title</label>
                                    <input id="display-title-input" name='title' type="text"/>
                                </div>
                                <div class="form-input-container">
                                    <label for="display-desc-input">Description</label>
                                    <textarea id="display-desc-input" name='desc'></textarea>
                                </div>
                                <div class="form-input-container">
                                    <div class="flex-end">
                                        <button class="btn btn-primary" id="createButton" type='submit'>Create</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}