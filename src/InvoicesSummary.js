import Navbar from 'react-bootstrap/Navbar'
import React, { Fragment, useState, useEffect } from 'react';
import DB from './DB';
import moment from 'moment';

var db = new DB()

function InvoicesSummary(props) {
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
                <small style={{ display: 'inline-block', width: '40%', color:'darkgrey' }}>{moment().format("MMMM YYYY")}</small>
            </center>
            <br />
            {
                // Containers
            }
            <br /><br />
        </div>
    )
}

export default InvoicesSummary;
