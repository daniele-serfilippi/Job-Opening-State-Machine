import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';

import JobList from './Job/JobList/JobList';
import JobForm from './Job/JobForm/JobForm';
import JobDetail from './Job/JobDetail/JobDetail';

const Root = props => {
    const [userType, setUserType] = useState('client');

    return (
        <BrowserRouter>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-10 mt-5">

                        <div className="text-center m-3">
                            <div className="btn-group" role="group" aria-label="Basic example">
                                <button
                                    type="button"
                                    className={`btn btn-secondary ${userType === 'client' ? "active" : ""}`}
                                    onClick={() => setUserType('client')}
                                >Client mode</button>
                                <button
                                    type="button"
                                    className={`btn btn-secondary ${userType === 'provider' ? "active" : ""}`}
                                    onClick={() => setUserType('provider')}
                                >Provider mode</button>
                            </div>
                        </div>

                        <Switch>
                            <Route exact path='/' render={() => (<JobList userType={userType} />)} />
                            <Route path='/job/create' render={() => (<JobForm userType={userType} />)} />
                            <Route path='/job/:id' render={() => (<JobDetail {...props} userType={userType} />)} />
                        </Switch>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default Root;

if (document.getElementById('app')) {
    ReactDOM.render(<Root />, document.getElementById('app'));
}
