import Navbar from 'react-bootstrap/Navbar'
import React, { Fragment, useState } from 'react';
import DB from './DB';
import moment from 'moment';
import { useForm } from 'react-hook-form'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'

var db = new DB()

function GenerateInvoice(props) {
    const { register, setValue, getValues } = useForm();

    const getHeads = () => {
        let heads = 4
        db.persons().forEach(person => {
            heads += person.profile.head_count || 0
        })
        return heads
    }

    console.log(getHeads());

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
                <h3><b className="fas">{"\uf543"}</b><b>&nbsp;&nbsp;New Invoice</b></h3>
            </center>
            <br />
            {
				// EB Container
			}
            <center>
				<h4><b className="fas">{"\uf0e7"}</b>&nbsp;&nbsp;Stairs & Pump</h4>
			</center>
            <div className='container'>
            <center>

				<input name="eb" style={{display:'inline-block', color:'black', backgroundColor:'white'}} type='number' pattern="[0-9]*" defaultValue={850} ref={register} className="editable-label-input"/>
                </center>
			
            </div>
			<br />
            {
				// Water Container
			}
            <center>
				<h4><b className="fas">{"\ue005"}</b>&nbsp;&nbsp;Water</h4>
			</center>
            <div className='container'>
			</div>
			<br />
            {
				// EB Container
			}
            <center>
				<h4><b className="fas">{"\uf1f8"}</b>&nbsp;&nbsp;Garbage</h4>
			</center>
            <div className='container'>
			</div>
			<br />
        </div>
    )
}

export default GenerateInvoice;
