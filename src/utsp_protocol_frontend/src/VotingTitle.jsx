function VotingTitle({canister, title, desc, image, creator, status, tokenSupply, tokenName}){

    return (
        <div>
            <h3>{title}</h3>
            <p>{desc}</p>
            <p>imageLink: {image}</p>
            <br/>
            <section>Created By  : {creator}</section>
            <section>Canister ID : {canister}</section>
            <section>Token Name  : {tokenSupply}</section>
            <section>Token Supply: {tokenName}</section>
            <br/>
            <section>Status: {status}</section>
        </div>
    )
}

export default VotingTitle;