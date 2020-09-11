import Navbar from 'react-bootstrap/Navbar'
import React, { useState} from 'react';
import moment from 'moment';
import { Redirect } from 'react-router';

function InvoicesSummary(props) {
    const [redirect, setRedirect] = useState();
	const [redirectProps, setRedirectProps] = useState();

    let invoices = props.location.state || []

    if (redirect) return <Redirect push to={{ pathname: redirect, state: redirectProps }} />
    return (
        <div>
            <Navbar bg="primary" variant="dark" fixed="top">
                <Navbar.Brand className="mx-auto"><h3><b>Rent</b></h3></Navbar.Brand>
            </Navbar>
            <br /><br /><br /><br />
            {
                // Title
            }
            <center>
                <h3><b className="fas">{"\uf543"}</b><b>&nbsp;&nbsp;Summary</b></h3>
                <small style={{ display: 'inline-block', width: '40%', color: 'darkgrey' }}>{moment().format("MMMM YYYY")}</small>
            </center>
            <br />
            {
                // Containers
            }
            {
                invoices.map((item,i) =>
                    <div className='container' key={i} style={{cursor:'pointer'}} onClick={() => {setRedirectProps(item); setRedirect('/invoice')}}>
                        <div style={{ display: 'inline-flex', width: '100%' }}>
                            <b className="fas" style={{ display: 'inline-block', width: '10%', margin: '-1% 1% 2% 3%', fontSize: '40px', color:'#0e8587' }}>{"\uf570"}</b>
                            <div style={{ marginLeft: '5%' }}><small style={{ display: 'inline-block' }}>{item.person.profile.name}</small>
                                <h4 style={{ marginTop: '-1%' }}><b className="fas" style={{ fontSize: 20 }}>{"\uf156"}</b>&nbsp;<b>{item.sum}</b></h4></div>
                        </div>
                    </div>
                )
            }
            <br /><br />
        </div>
    )
}

export default InvoicesSummary;