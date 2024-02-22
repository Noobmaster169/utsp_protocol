function VotingOptions({options}){
    
    function getOptions(votingOptions){
        if(votingOptions.length ===0){
            return <h2>No Option Available Yet</h2>
        }
        let optionBlocks = [];
        for(let i=0; i<votingOptions.length; i++){
            optionBlocks.push(
                <p>#{i}: {votingOptions[i].title}, image: {votingOptions[i].image}</p>
            )
        }
        return optionBlocks;
    }
    
    return(
        <div>
            <p>Voting Options:</p>
            {getOptions(options)}
        </div>
    )
}

export default VotingOptions;