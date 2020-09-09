import Navbar from 'react-bootstrap/Navbar'
import React, { Fragment, useState } from 'react';
import DB from './DB';
import moment from 'moment';
import { useForm } from 'react-hook-form'

var db = new DB()

function GenerateInvoice(props) {
	const { register, setValue, getValues } = useForm();

    return (
        <div>
            <Navbar bg="primary" variant="dark" fixed="top">
				<Navbar.Brand className="mx-auto"><h3><b>Invoice</b></h3></Navbar.Brand>
			</Navbar>
			<br /><br /><br /><br />
			{
				// Title
			}

        </div>
    )
}

export default GenerateInvoice;
