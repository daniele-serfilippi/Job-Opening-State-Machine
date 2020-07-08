import React, { useState, useEffect } from "react";
import axios from "axios";
import {Link} from "react-router-dom";

const JobList = props => {
    const [jobs, setJobs] = useState([]);
    const userType = props.userType;

    useEffect(() => {
        setJobs([]);
        const fetchData = async () => {
            const result = await axios.get(
                'http://localhost:8000/api/jobs',
                { headers: { 'userType': userType } }
            );
            setJobs(result.data);
        };
        fetchData();
    }, [userType]);

    return (
        <div className="card">
            <div className="card-header">Jobs list</div>
            <div className="card-body" style={{maxHeight: 600, overflowY: 'auto'}}>
                {userType === 'client' &&
                    <div className="nav mb-3">
                        <Link to="/job/create" className="btn btn-primary ">New Job</Link>
                    </div>
                }
                <ul className="list-group">
                    {jobs.map(job => (
                        <li className="list-group-item d-flex justify-content-between align-items-center" key={job.id}>
                            <Link to={'/job/' + job.id}>{job.title}</Link>
                            <span className='badge badge-primary badge-pill'>
                                {job.state}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default JobList;
