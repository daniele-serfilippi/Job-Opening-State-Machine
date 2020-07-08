import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const JobForm = props => {
    const [formData, updateFormData] = useState();
    const history = useHistory();

    const handleChange = event => {
        updateFormData({
            ...formData,
            [event.target.name]: event.target.value.trim()
        });
    };

    const handleSubmit = async event => {
        event.preventDefault();
        const result = await axios.post(
            'http://localhost:8000/api/jobs',
            formData,
            { headers: { 'userType': props.userType } }
        );
        history.push("/");
    }

    const handleJobList = () => {
        history.push("/");
    }

    return (
        <>
            <div className="card">
                <div className="card-header">Job</div>
                <div className="card-body" style={{maxHeight: 300, overflowY: 'auto'}}>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Title</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter title"
                                name="title"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Job description</label>
                            <textarea
                                className="form-control"
                                placeholder="Enter Job description"
                                name="body"
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>

            <button className="btn btn-secondary mt-4" onClick={handleJobList}>Job List</button>
        </>
    )
}

export default JobForm;
