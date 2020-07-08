import React, { useState, useEffect } from "react";
import axios from "axios";
import { withRouter } from 'react-router-dom';
import { useHistory } from "react-router-dom";

const JobDetail = props => {
    const [job, setJob] = useState([]);
    const { match: { params } } = props;
    const history = useHistory();
    const userType = props.userType;

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get(
                `http://localhost:8000/api/jobs/${params.id}`,
                { headers: { 'userType': userType } }
            );
            setJob(result.data);
        };
        fetchData();
    }, [userType, params.id]);

    const handleJobPostTransition = async transition => {
        const result = await axios.post(
            `http://localhost:8000/api/jobs/${params.id}/stateTransition`,
            {transition},
            { headers: { 'userType': userType } }
        );
        history.push("/");
    }

    const handleJobList = () => {
        history.push("/");
    }

    const renderActionButtons = state => {
        switch (state) {
            case 'DRAFT':
                return (
                    userType === 'client' &&
                    <>
                        <button
                            className="btn btn-danger"
                            onClick={() => handleJobPostTransition('cancel')}
                        >Cancel Job</button>
                        <button
                            className="btn btn-primary"
                            onClick={() => handleJobPostTransition('post')}
                        >Post Job</button>
                    </>
                );
            case 'POSTED':
                return (
                    userType === 'client' &&
                        <button
                            className="btn btn-danger"
                            onClick={() => handleJobPostTransition('retract')}
                        >Retract Job</button>
                    ||
                    userType === 'provider' &&
                        <button
                            className="btn btn-primary"
                            onClick={() => handleJobPostTransition('accept_request')}
                        >Accept Job Request</button>
                );
            case 'PENDING_PROPOSAL':
                return (
                    userType === 'provider' &&
                        <button
                            className="btn btn-primary"
                            onClick={() => handleJobPostTransition('propose')}
                        >Propose Job</button>
                );
            case 'PROPOSED':
                return (
                    userType === 'client' &&
                    <>
                        <button
                            className="btn btn-danger"
                            onClick={() => handleJobPostTransition('reject')}
                        >Reject Job</button>
                        <button
                            className="btn btn-primary"
                            onClick={() => handleJobPostTransition('accept')}
                        >Accept Job</button>
                    </>
                );
        }
    }

    return (
        <>
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <span>Job Detail</span>
                    <span className='badge badge-primary badge-pill'>
                        {job.state}
                    </span>
                </div>
                <div className="card-body" style={{maxHeight: 600, overflowY: 'auto'}}>
                    <h2>{job.title}</h2>
                    <p>{job.body}</p>
                </div>
                <div className="card-body d-flex justify-content-between align-items-center">
                    {renderActionButtons(job.state)}
                </div>
            </div>

            <button className="btn btn-secondary mt-4" onClick={handleJobList}>Job List</button>
        </>
    )
}

export default withRouter(JobDetail);
