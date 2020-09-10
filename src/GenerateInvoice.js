import Navbar from 'react-bootstrap/Navbar'
import React, { Fragment, useState } from 'react';
import DB from './DB';
import moment from 'moment';
import { useForm } from 'react-hook-form'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import { CircleCondition } from './Components';

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

    const getHouses = () => {
        let houses = 1
        db.persons().forEach(person => {
            houses += !person.profile.isEmpty ? 1 : 0
        })
        return houses
    }

    var heads = getHeads()
    var houses = getHouses()
    var items = props.location.state

    var formContent = [
        {
            title: 'Stairs & Pump',
            value: parseInt(items.eb),
            fieldname: 'eb',
            icon: '\uf543',
            isShared: true
        },
        {
            title: 'Water +/-',
            valueTemplate: 'water',
            fieldname: 'water',
            icon: '\ue005',
            isPPB: true,
            isHeadSplit: true,
            perPersonValue: []
        },
        {
            title: 'Garbage',
            value: 60,
            fieldname: 'garbage',
            icon: '\uf1f8',
        }
    ]

    Array.from(['1', '2', '3']).forEach(o => {
        if (items[`other${o}-amount`] !== "0")
            formContent.push({
                title: items[`other${o}-title`],
                value: parseInt(items[`other${o}-amount`]),
                icon: '\uf1b2',
                fieldname: `other${o}`
            })
    })

    const getDefaultValue = (item) => {
        let value = 0
        if (item.isPPB) {
            db.persons().forEach(person => {
                item.perPersonValue.push({
                    id: person.id,
                    value: item.isHeadSplit ? person[item.valueTemplate] * person.profile.head_count : person[item.valueTemplate]
                })
            })
        }
        else if (item.isShared) {
            if (item.isHeadSplit)
                value = item.value / heads
            else value = item.value / houses
        }
        else value = item.value || 0
        return Math.round(value, 0)
    }

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
                // Containers
            }
            {
                formContent.map((item, i) => (
                    <Fragment key={i}>
                        <center>
                            <h4><b className="fas">{item.icon}</b>&nbsp;&nbsp;{item.title}</h4>
                        </center>
                        <div className='container'>
                            <center>
                                <input name={item.fieldname} style={{ display: 'inline-block', color: 'black', backgroundColor: 'white' }} type='number' pattern="[0-9]*" defaultValue={getDefaultValue(item)} ref={register} className="editable-label-input" />
                            </center>
                        </div>
                        <br />
                    </Fragment>
                ))
            }
            <br /><br />
        </div>
    )
}

export default GenerateInvoice;
