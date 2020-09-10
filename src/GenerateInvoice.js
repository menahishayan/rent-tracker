import Navbar from 'react-bootstrap/Navbar'
import React, { Fragment, useState } from 'react';
import DB from './DB';
import moment from 'moment';
import { useForm } from 'react-hook-form'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import { Circle, CircleCondition } from './Components';

var db = new DB()

function GenerateInvoice(props) {
    const { register, handleSubmit } = useForm();

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
            icon: '\uf0e7',
            isShared: true
        },
        {
            title: 'Water +/-',
            value: 0,
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
                fieldname: `other${o}`,
                isShared: true,
                isHeadSplit: true
            })
    })

    const [ HS1, setHS1 ] = useState(formContent[0].isHeadSplit);
    const [ HS2, setHS2 ] = useState(formContent[1].isHeadSplit);
    const [ HS3, setHS3 ] = useState(formContent[2].isHeadSplit);
    const [ HS4, setHS4 ] = useState(formContent[3] ? formContent[3].isHeadSplit : false);
    const [ HS5, setHS5 ] = useState(formContent[4] ? formContent[4].isHeadSplit : false);
    const [ HS6, setHS6 ] = useState(formContent[5] ? formContent[5].isHeadSplit : false);

    const getDefaultValue = (item) => {
        let value = 0
        if (item.isPPB) {
            db.persons().forEach(person => {
                if(person[item.valueTemplate])
                item.perPersonValue.push({
                    id: person.id,
                    value: item.isHeadSplit ? person[item.valueTemplate] * (person.profile.head_count || 0) : person[item.valueTemplate]
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
                                <br />
                                <small style={{ display: 'inline-block', width: '40%', color: 'darkgrey' }}>{item.isHeadSplit ? "per head" : (item.isShared ? "per house" : "")}</small>
                                <br /><br />
                                { item.isPPB && 
                                    <div style={{ display: 'inline-block', width: '80%' }}>
                                        {item.isPPB &&
                                            item.perPersonValue.map((v) => (
                                                <Circle small color="#5e09b8" icon={"\uf007"} title={v.value || "0"} titleStyle={{color:'darkgrey'}} style={{margin:'0 4%'}} />
                                            ))
                                        }
                                    </div>
                                }
                            </center>
                            <CircleCondition small condition={HS1} onClick={() => setHS1(!HS1) } color={['#006CFF','darkgrey']} icon={['\uf0c0','\uf0c0']} />
                            <br />
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
