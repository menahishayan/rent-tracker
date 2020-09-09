import Navbar from 'react-bootstrap/Navbar'
import React, { Fragment, useState } from 'react';
import DB from './DB';
import moment from 'moment';
import { useForm } from 'react-hook-form'
import Form from 'react-bootstrap/Form';

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
            <center>
                <h3><b className="fas">{"\uf234"}</b><b>&nbsp;&nbsp;Add User</b></h3>
            </center>
            <br />
            <Form style={{marginLeft:'5%',marginRight:'5%'}}>
                <Form.Group ref={register} style={{borderBottom: "2px solid #1055e0"}}>
                    <Form.Control type="text" placeholder="Electricity" defaultValue={props.location.state} />
                </Form.Group><br/>
                <Form.Group ref={register} style={{borderBottom: "2px solid #1055e0"}}>
                    <Form.Control type="text" placeholder="Other" />
                </Form.Group><br/>
            </Form>
        </div>
    )
}

export default GenerateInvoice;
