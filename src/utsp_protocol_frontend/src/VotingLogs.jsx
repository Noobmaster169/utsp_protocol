import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

function VotingLogs({ID}){
    const {votingManager} = useAuth();
    const [logs, setLogs] = useState(null);

    useEffect(() => {
        getActivityLogs(ID);
    }, [ID]);

    async function getActivityLogs(voteID){
        console.log("Requesting Logs from Backend");
        const activityLogs = await votingManager.getLogs(voteID);
        console.log("Receive Log Activites from Backend");
        console.log(JSON.stringify(activityLogs));
        if(activityLogs.length === 0){
            setLogs(<h2>No Activity Yet</h2>);
        }
        else{
            const logBlocks = activityLogs.map(log => {
                const logMessage = log.split(",");
                return <p>{logMessage[0]} Time: {logMessage[1]}</p>;
            });
            setLogs(logBlocks);
        }
        return false;
    }

    return(
        <div>
            <p>Voting Logs</p>
            {logs}
        </div>
    )
}

export default VotingLogs;