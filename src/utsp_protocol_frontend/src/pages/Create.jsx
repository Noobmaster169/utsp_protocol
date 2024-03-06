import { useEffect } from 'react';
import '../styles/create.css';
import { useState } from 'react';
import { votingManager } from '../../../declarations/votingManager';

export default function Create(){

    const [displayActive,setDisplayActive] = useState(false);
    const [optionActive,setOptionActive] = useState(false);
    const [statusActive,setStatusActive] = useState(false);
    const [tokenActive,setTokenActive] = useState(false);
    const [optCnt,setOptCnt] = useState(1);
    const [optionList,setOptionList] = useState([]);

    
    async function updateDisplay(formData){
        try{
            const voteID = 123;
            const voteTitle = formData.get('title');
            const voteDesc = formData.get('desc');
            const voteImg = formData.get('img');
            console.log(voteID,voteTitle,voteDesc,voteImg.name);
            const messageCreate = await votingManager.createVoting(voteID);
            // const messageUpdate = await votingManager.updateVoteData(voteID,voteTitle,voteDesc,voteImg);
            console.log(messageCreate);
        }catch(e){
            console.log(e);
        }
    }

    async function updateOption(formData){
        try{
            const voteID = 123;
            const optNames = [];
            const optImgs = [];
            for(let i=1;i<=optCnt;i++){
                if(formData.get('optName'+i)){
                    optNames.push(formData.get('optName'+i));
                    optImgs.push(formData.get('optImg'+i));
                }
            }
            const message = await votingManager.updateOptionData(voteID,optNames,optImgs);
            console.log(message);
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

    const add_option = () => {
        let option_parent_container = document.querySelector('#option-parent-container');
        let option_content = document.querySelector('#option-content-form');
        setOptCnt(optCnt+1);
        setOptionList(optionList.concat(<DelButton/>));
        option_content.style.maxHeight = (option_content.scrollHeight+274) + "px";
    }
    
    return (
        <div>
            <div class="setting-vote-content-container">
                <div class="vote-setting-page-title">
                    <span>Voting Settings</span>
                </div>
                <div class="setting-container">
                    <div id="display-form" class="setting-form">
                        <div id="display-form-header" class="header-form" onClick={() => displayActive ? reduce_form('display') : extend_form('display')}>
                            <span><i class="fa-solid fa-chevron-down"></i></span>
                            Display
                        </div>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            updateDisplay(new FormData(e.target));
                        }}>
                            <div class="form-content" id="display-content-form">
                                <div class="form-input-container display-first-input">
                                    <label for="display-title-input">Title</label>
                                    <input id="display-title-input" name='title' type="text"/>
                                </div>
                                <div class="form-input-container">
                                    <label for="display-desc-input">Description</label>
                                    <textarea id="display-desc-input" name='desc'>Lorem ipsum dolor sit amet. </textarea>
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
                                        <button class="btn btn-primary" type='submit'>Save</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div id="option-form" class="setting-form">
                        <div id="option-form-header" class="header-form" onClick={() => optionActive ? reduce_form('option') : extend_form('option')}>
                            <span><i class="fa-solid fa-chevron-down"></i></span>
                            Options
                        </div>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            updateOption(new FormData(e.target));
                        }}>
                            <div id="option-content-form" class="form-content">
                                <div id="option-parent-container">
                                    {optionList}
                                </div>
                                <button type='button' class="btn btn-primary" onClick={() => add_option()}>Add Option</button>
                                <div class="form-input-container">
                                    <div class="flex-end">
                                        <button class="blue-button" type='submit'>Save</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div id="status-form" class="setting-form">
                        <div id="status-form-header" class="header-form" onClick={() => statusActive ? reduce_form('status') : extend_form('status')}>
                            <span><i class="fa-solid fa-chevron-down"></i></span>
                            Status
                        </div>
                    </div>
                    <div id="token-form" class="setting-form">
                        <div id="token-form-header" class="header-form" onClick={() => tokenActive ? reduce_form('token') : extend_form('token')}>
                            <span><i class="fa-solid fa-chevron-down"></i></span>
                            Token
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}