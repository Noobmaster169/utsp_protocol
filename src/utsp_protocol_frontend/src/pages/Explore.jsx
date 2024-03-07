import { useEffect, useState } from 'react';
import '../styles/explore.css';
import Cat from '../assets/Cat.jpg';
import Voting from '../assets/voting.png';
import Add from '../assets/add.png';
import { votingManager } from '../../../declarations/votingManager';
import { useNavigate } from 'react-router-dom';

export default function Explore(){

    const navigate = useNavigate();
    const [votes, setVotes] = useState([]);

    useEffect(() => {
        async function getVotes(){
            try{
                const data = await votingManager.getVotingTitles();
                setVotes(data);
            }catch(e){
                console.log(e);
            }
        }

        getVotes();
    }, []);

    console.log(votes);
    
    const handleVotePage = (VoteID) => {
        navigate('/voting', {state: {VoteID}});
    };

    const createNewVote = () => {
        navigate('/create', {state:""});
    };

    const votesList = votes.map((vote) => 
        <div class="voting-container" onClick={() => handleVotePage(vote.id)}>
            {vote.image==''?
            <img src={Voting}/>
            :
            <img src={vote.image}/>
            }
            <div class="voting-title">{vote.title}</div>
        </div>
    )
    const addVoting = <div class="voting-container" onClick={createNewVote}>
                        <img src={Add}/>
                        <div class="voting-title">Create New Voting</div>
                    </div>

    return(
        <div>
            <div class="w-100 d-flex justify-content-center mt-5">
                <div class="explore-page-title-container d-inline-block">
                    <div class="explore-page-title color-white">
                        Explore Votings
                    </div>
                </div>
            </div>
            <div class="explore-content-container d-flex flex-wrap">
                {votesList}
                {addVoting}
            </div>
        </div>
    )
}