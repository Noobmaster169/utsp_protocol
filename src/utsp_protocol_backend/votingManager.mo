import Result "mo:base/Result";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Int "mo:base/Int";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Bool "mo:base/Bool";
import Hash "mo:base/Hash";
import TrieMap "mo:base/TrieMap";
import Buffer "mo:base/Buffer";
import Time "mo:base/Time";
import tokenManager "canister:tokenManager";

/*
To Do:
- Add Activity Logs (create, start, end) #DONE#
- Change addVote to interact with tokenManager canister
*/

actor{
    type Result<A,B> = Result.Result<A,B>;
    type HashMap<K,V> = HashMap.HashMap<K,V>;
    type TrieMap<R,S> = TrieMap.TrieMap<R,S>;
    type Status = {
        #Preparation;
        #Open;
        #Ended;
    };
    type Voting = {
        tokenCanister: ?Text;
        title  : Text;
        desc   : Text;
        image  : Text;
        creator: Text;
        status : Status;
        optionData: [Option];
    };
    type Option = {
        title: Text;
        image: Text;
    };
    type VotingDisplay = {
        id: Nat;
        title: Text;
        image: Text;
    };
    
    let votings   : TrieMap<Nat, Voting>    = TrieMap.TrieMap<Nat, Voting>(Nat.equal, Hash.hash);
    let votingLogs: TrieMap<Nat, [Text]>    = TrieMap.TrieMap<Nat, [Text]>(Nat.equal, Hash.hash); 
    let options   : TrieMap<Nat, TrieMap<Nat, Nat>> = TrieMap.TrieMap<Nat, TrieMap<Nat, Nat>>(Nat.equal, Hash.hash);
    let results   : TrieMap<Nat, Text> = TrieMap.TrieMap<Nat, Text>(Nat.equal, Hash.hash);
    let MINIMUM_OPTIONS:Nat = 2;
    
    /////////////////////
    //PRIVATE FUNCTIONS//
    /////////////////////
    /** Function To Add A New Activity Log */
    private func addLog(id:Nat, log:Text): async Bool{
        let checkVoting = votings.get(id);
        switch(checkVoting){
            case (null){return false;};
            case (?voting){
                let checkLogs = votingLogs.get(id);
                switch(checkLogs){
                    case(null){
                        votingLogs.put(id, [log]);
                    };
                    case(?previousLog){
                        let newLog = Buffer.fromArray<Text>(previousLog);
                        newLog.add(log);
                        votingLogs.put(id, Buffer.toArray(newLog));
                    };
                };
                return true;
            };
        };
    };   

    /** Function To Update The Voting Results After Being Ended */
    private func addResults(id: Nat): async Bool {
        let checkVoting = votings.get(id);
        switch(checkVoting){
            case(null){return false;};
            case(?voting){
                switch(voting.status){
                    case(#Preparation){return false;}; 
                    case(#Open)       {return false;};
                    case(#Ended)      {
                        let optionScores = options.get(id);
                        switch(optionScores){
                            case(null){ results.put(id, "")};
                            case(?scores){
                                let scoresTrie: TrieMap<Nat, Nat> = TrieMap.TrieMap<Nat, Nat>(Nat.equal, Hash.hash);
                                for((tokenID, option) in scores.entries()){
                                    let previousScore = scoresTrie.get(option);
                                    var currentScore  = 0;
                                    switch(previousScore){
                                        case(null)    {currentScore :=0};
                                        case(?isScore){currentScore :=isScore}
                                    };
                                    scoresTrie.put(option, currentScore+1);
                                };
                                var result:Text = "";
                                for(option in scoresTrie.keys()){
                                    switch(scoresTrie.get(option)){
                                        case(null){
                                            result := result#Nat.toText(0);
                                        };
                                        case(?score){
                                            result := result#Nat.toText(score);
                                        };
                                    };
                                };
                                results.put(id, result);
                            };
                        };
                        return true;
                    };
                };
            };
        };
    };
    
    ////////////////
    //UPDATE CALLS//
    ////////////////
    /** Function To Create A New Voting */
    public shared({caller}) func createVoting(id: Nat): async Text {
        if(Principal.isAnonymous(caller)){
            return "Internet Identity Not Detected";
        };
        let checkVoting = votings.get(id);
        switch(checkVoting){
            case (?votingExist){return "Voting Has Existed!";};
            case (null){};
        };
        let newVoting: Voting = {
            tokenCanister = null;
            title         = "Voting #"#Nat.toText(id);
            desc          = "Choose Your Vote!";
            image         = "";
            creator       = Principal.toText(caller);
            status        = #Preparation;
            optionData    = [];
        };
        let newTrie: TrieMap<Nat, Nat> = TrieMap.TrieMap<Nat, Nat>(Nat.equal, Hash.hash);
        options.put(id, newTrie);
        results.put(id, "Not Available Yet");
        votings.put(id, newVoting);
        let logStatus = await addLog(id, "Owner Created the Voting at," # Int.toText(Time.now()));
        return "SUCCESS";
    };
    
    /** Function For Voters To Add Their Selected Vote */
    public shared({caller}) func addVote(id:Nat, option: Nat): async Text{
        if(Principal.isAnonymous(caller)){
            return "Internet Identity Not Detected";
        };
        let currentVoting = votings.get(id);
        var currentStatus: Status = #Preparation;
        switch(currentVoting){
            case(null){return "Voting Doesn't Exist";};
            case(?voting){
                switch(voting.status){
                    case(#Open){};
                    case(#Preparation){
                        return "Voting Hasn't Started Yet!";
                    };
                    case(#Ended){
                        return "Voting Has Ended";
                    };
                };
                if(option >= voting.optionData.size()){
                    return "Invalid Option";
                };
                let tokenCanister = voting.tokenCanister;
                switch(tokenCanister){
                    case(null){return "Token Canister Not Detected";};
                    case(?canister){
                        let voteTrie = options.get(id);
                        switch(voteTrie){
                            case(null){return "ERROR";};
                            case(?trie){
                                let holdedTokens = await tokenManager.getHoldedTokens(caller, canister);
                                if(holdedTokens.size() == 0){
                                    return "No Token Holdings Detected";
                                };
                                for(tokenID in holdedTokens.vals()){
                                    let logStatus = await addLog(id, Principal.toText(caller)#" made a vote using Token #" # Nat64.toText(tokenID) # " at," # Int.toText(Time.now())); 
                                    trie.put(Nat64.toNat(tokenID), option);
                                };
                                return "SUCCESS";
                            };
                        };

                    };
                };
            };
        };
    };
    
    /** Function For Voting Creator To Add The Token Canister ID */
    public shared({caller}) func updateCanisterId(id:Nat, canisterId: Text): async Text{
        let currentVoting = votings.get(id);
        switch(currentVoting){
            case(null){return "Voting Doesn't Exist!";};
            case(?voting){
                if(Principal.fromText(voting.creator) != caller){
                    return "Method Only Allowed for Voting Creator";
                };
                if(voting.status != #Preparation){
                    return "Voting Data Can't Be Changed Anymore";
                };
                let newVoting: Voting = {
                    tokenCanister = ?canisterId;
                    title        = voting.title;
                    desc         = voting.desc;
                    image        = voting.image;
                    creator      = voting.creator;
                    status       = voting.status;
                    optionData   = voting.optionData;
                };
                votings.put(id, newVoting);
                return "SUCCESS";
            };
        };
    };

    /** Function For Voting Creator To Update The Voting Options */
    public shared({caller}) func updateOptionData(id: Nat, titles:[Text], images:[Text]): async Text{
        let currentVoting = votings.get(id);
        switch(currentVoting){
            case(null){return "Voting Doesn't Exist!";};
            case(?voting){
                if(Principal.fromText(voting.creator) != caller){
                    return "Method Only Allowed for Voting Creator";
                };
                if(voting.status != #Preparation){
                    return "Voting Data Can't Be Changed Anymore";
                };
                if(Array.size(titles) != Array.size(images)){
                  return "Number of Option Titles and Images Must Be Equal";
                };
                let titleBuffer = Buffer.fromArray<Text>(titles);
                let imagesBuffer= Buffer.fromArray<Text>(images);

                var optionIndex = 0;
                let newOption   = Buffer.Buffer<Option>(titles.size()); 
                while(titles.size() > optionIndex){
                    let optionData: Option = {
                        title = titleBuffer.remove(0);
                        image = imagesBuffer.remove(0);
                    };
                    newOption.add(optionData);
                    optionIndex +=1; 
                };
                let newVoting : Voting = {
                    tokenCanister = voting.tokenCanister;
                    title         = voting.title;
                    desc          = voting.desc;
                    image         = voting.image;
                    creator       = voting.creator;
                    status        = voting.status;
                    optionData    = Buffer.toArray(newOption);
                };
                votings.put(id, newVoting);
            };
        };
        return "SUCCESS";
    };

    /** Function For Voting Creator To Update The Voting Display Data */
    public shared({caller}) func updateVoteData(id: Nat, title: Text, desc: Text, image: Text): async Text{
        let currentVoting = votings.get(id);
        switch(currentVoting){
            case(null){return "Voting Doesn't Exist!";};
            case(?voting){
                if(Principal.fromText(voting.creator) != caller){
                    return "Method Only Allowed for Voting Creator";
                };
                if(voting.status != #Preparation){
                    return "Voting Data Can't Be Changed Anymore";
                };
                let newVoting: Voting = {
                    tokenCanister = voting.tokenCanister;
                    title;
                    desc;
                    image;
                    creator    = voting.creator;
                    status     = voting.status;
                    optionData = voting.optionData;
                };
                votings.put(id, newVoting);
            };
        };
        return "SUCCESS";
    };

    /** Function For Voting Creator To Start The Voting Process */
    public shared({caller}) func startVote(id: Nat): async Text{  
        //Check Voting's Validity
        let currentVoting = votings.get(id);
        switch(currentVoting){
            case(null){return "Voting Doesn't Exist";};
            case(?voting){
                if(Principal.fromText(voting.creator) != caller){
                    return "Method Only Allowed for Voting Creator";
                };
                if(voting.tokenCanister == null){
                    return "Token Canister Hasn't Been Set";
                };
                if(voting.optionData.size() < MINIMUM_OPTIONS){
                    return "Need A Minimum of 2 Valid Options to Start";
                };
                //Change Status
                let currentStatus = voting.status;
                switch(currentStatus){
                    case(#Preparation){
                        let newVoting : Voting = {
                            tokenCanister = voting.tokenCanister;
                            title         = voting.title;
                            desc          = voting.desc;
                            image         = voting.image;
                            creator       = voting.creator;
                            status        = #Open;
                            optionData    = voting.optionData;
                        };
                        votings.put(id, newVoting);
                        let logStatus = await addLog(id, "Owner Started the Voting at," # Int.toText(Time.now()));
                        return "SUCCESS";
                    };
                    case(#Open) {return "Voting Has Already Started";};
                    case(#Ended){return "Voting Has Already Ended"};
                };
            };
        };
    };
    
    /** Function For Voting Creator To End The Voting Process */
    public shared({caller}) func endVote(id: Nat): async Text{
        //Check Voting's Validity
        let currentVoting = votings.get(id);
        switch(currentVoting){
            case(null){return "Voting Doesn't Exist";};
            case(?voting){
                if(Principal.fromText(voting.creator) != caller){
                    return "Method Only Allowed for Voting Creator";
                };
                //Change Status
                let currentStatus = voting.status;
                switch(currentStatus){
                    case(#Open){
                        let resultStatus = await addResults(id);
                        if(not resultStatus){
                            return "ERR";
                        };
                        let newVoting : Voting = {
                            tokenCanister = voting.tokenCanister;
                            title         = voting.title;
                            desc          = voting.desc;
                            image         = voting.image;
                            creator       = voting.creator;
                            status        = #Ended;
                            optionData    = voting.optionData;
                        };
                        votings.put(id, newVoting);
                        let logStatus = await addLog(id, "Owner Stopped the Voting at," # Int.toText(Time.now()));
                        return "SUCCESS";
                    };
                    case(#Preparation) {return "Voting Hasn't Started";};
                    case(#Ended){return "Voting Has Already Ended"};
                };
            };
        };
    };


    ///////////////
    //QUERY CALLS//
    ///////////////
    /** Function To Get The Activity Logs of A Voting */
    public shared query func getLogs(id: Nat): async [Text]{
        let logs = votingLogs.get(id);
        switch(logs){
            case(null) {return []};
            case(?logs){return logs;};
        };
    };
    
    /** Function To Get The Final Result of A Voting */
    public shared query func getResult(id:Nat): async Text{
        let result = results.get(id);
        switch(result){
            case(null){
                return "Voting Doesn't Exist";
            };
            case(?scores){
                return scores;
            };
        };
    };
    
    /** Function To Display The Titles of All Existing Votings */
    public shared query func getVotingTitles(): async [VotingDisplay] {
        let votingDisplays = Buffer.Buffer<VotingDisplay>(10);
        for((id, voting) in votings.entries()){
            let newDisplay : VotingDisplay = {
                id;
                title= voting.title;
                image= voting.image;
            };
            votingDisplays.add(newDisplay);
        };
        return Buffer.toArray(votingDisplays);
    };
    
    /** Function To Get The Data of A Voting */
    public shared query func getVoting(id: Nat): async ?Voting{
        let currentVoting = votings.get(id);
        switch(currentVoting){
            case(null){return null;};
            case(?voting){
              return ?voting
            };
        };
    };
    
    /** Function To Get The Token Canister of A Voting */
    public shared query func getCanisterId(id: Nat): async Text{
        let currentVoting = votings.get(id);
        switch(currentVoting){
            case(null){return "Voting Doesn't Exist!";};
            case(?voting){
                switch(voting.tokenCanister){
                    case(null){return "Canister Is Not Defined!";};
                    case(?canister){return canister;};
                }
            };
        };
    };

    /** Function To Get The Status of a Voting */
    public shared query func getVotingStatus(id:Nat): async Text{
        let currentVoting = votings.get(id);
        switch(currentVoting){
            case(null){return "Voting Doesn't Exist";};
            case(?voting){
                switch(voting.status){
                    case(#Preparation){return "NOT STARTED";};
                    case(#Open)       {return "OPEN";       };
                    case(#Ended)      {return "ENDED";      };
                };
            };
        };
    };

    /** Function To Get The Owner/Creator of A Voting */
    public shared query func getOwner(id:Nat): async Text{
        let currentVoting = votings.get(id);
        switch(currentVoting){
            case(null){return "";};
            case(?voting){
                return voting.creator;
            };
        };
    };

    /** Function To Check If An ID is a Valid Voting */
    public shared query func isVoting(id: Nat): async Bool{
        let checkVoting = votings.get(id);
        switch(checkVoting){
            case (?votingExist){return true;};
            case (null)        {return false;};
        };
    };

    /** Function To Check If User Owns A Voting */
    public shared({caller}) func isOwner(id:Nat): async Bool{
        let checkVoting = votings.get(id);
        switch(checkVoting){
            case (null)        {return false;};
            case (?voting){
                return voting.creator == Principal.toText(caller);
            };
        };
    };
};
