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
            //const voteImg = formData.get('img');
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

    const delete_option = (optionID) => {
        let option_container = document.querySelector(`#option-container-${optionID}`);
        let option_content = document.querySelector('#option-content-form');
        option_container.style.animationPlayState = 'running';
        option_container.addEventListener('animationend', () => {
            option_container.remove();
        })
        option_content.style.maxHeight = (option_content.scrollHeight-274) + "px";
    }

    const DelButton = () => {
        return(
            <div class="option-container" id={"option-container-"+optCnt}>
                <div class="option-container-header">
                    <div class="option-title">Option {optCnt}</div>
                    <button type='button' class="red-button" onClick={() => delete_option(optCnt)}>Delete Option</button>
                </div>
                <div class="form-input-container">
                    <div class="form-input-container">
                        <label for={"option-name-input-"+optCnt}>Name</label>
                        <input id={"option-name-input-"+optCnt} type="text" name={'optName'+optCnt}/>
                    </div>
                    <div class="form-input-container">
                        <label for={"option-image-input-"+optCnt}>Image</label>
                        <input type="file" id={"option-image-input-"+optCnt} class="image-input" onchange="preview_image({optCnt})" name={'optImg'+optCnt}/>
                    </div>
                    <div class="form-input-container option-image-preview-container" id={"option-image-preview-container-"+optCnt}>
                        <div class="image-preview-label">Image Preview</div>
                        <div id={"option-image-preview-"+optCnt} class="image-preview-container"></div>
                    </div>
                </div>
            </div>
        );
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
                            Display
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
                                    <label for="display-image-input">Image</label>
                                    <input type="file" name='img' class="image-input" id="display-image-input"/>
                                </div>
                                <div class="form-input-container" id="image-preview-container">
                                    <div class="image-preview-label">Image Preview</div>
                                    <div id="display-image-preview"></div>
                                </div>
                                <div class="form-input-container">
                                    <div class="flex-end">
                                        <button class="btn btn-primary" id="createButton" type='submit'>Save</button>
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