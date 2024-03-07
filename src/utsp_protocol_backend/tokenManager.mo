import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Buffer "mo:base/Buffer";

actor{
    public type Result<S, E> = {
        #Ok : S;
        #Err : E;
    };
    public type ApiError = {
        #Unauthorized;
        #InvalidTokenId;
        #ZeroAddress;
        #Other;
    };
    public type OwnerResult = Result<Principal, ApiError>;
    
    /** Function To Get The Status of A Token's Canister */
    public shared func getStatus( tokenCanister: Text): async Text{
        let tokenActor = actor(tokenCanister) : actor{
            totalSupplyDip721: query () -> async Nat64;
            nameDip721       : query () -> async Text;
            symbolDip721     : query () -> async Text;
        };
        let tokenSupply = await tokenActor.totalSupplyDip721();
        let tokenName   = await tokenActor.nameDip721();
        let tokenSymbol = await tokenActor.symbolDip721();
        return Nat64.toText(tokenSupply)#","#tokenName#","#tokenSymbol;
    };

    /** Function To Get The Token IDs Holded By A User */
    public shared func getHoldedTokens (p: Principal, tokenCanister: Text): async [Nat64]{
        let tokenActor = actor(tokenCanister) : actor{
            getTokenIdsForUserDip721: query (Principal) -> async [Nat64];
        }; 
        let tokens = await tokenActor.getTokenIdsForUserDip721(p);
        return tokens;  
    };

    /** Function To Get The Owners of a Token */
    public shared func getTokenOwners (tokenCanister: Text): async [Text]{
        let tokenActor = actor(tokenCanister) : actor{
            totalSupplyDip721       : query () -> async Nat64;
            ownerOfDip721           : query (Nat64) -> async OwnerResult;
        };
        
        try{
            let tokenSupply = await tokenActor.totalSupplyDip721();
            let holders = Buffer.Buffer<Text>(Nat64.toNat(tokenSupply));
            for(i in Iter.range(0,Nat64.toNat(tokenSupply) - 1)){
                let holder = await tokenActor.ownerOfDip721(Nat64.fromNat(i));
                switch(holder){
                    case(#Ok(ownerPrincipal)){
                        holders.add(Principal.toText(ownerPrincipal));
                    };
                    case(#Err(ownerErr)){
                        holders.add("Error Finding Owner");
                    }
                };
            };
            return Buffer.toArray(holders);  
        }
        catch(e){
            return [];
        };
    };
};