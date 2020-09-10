import Navbar from 'react-bootstrap/Navbar'
import React, { Fragment, useState,useEffect } from 'react';
import DB from './DB';
import moment from 'moment';
import { useForm } from 'react-hook-form'
import { Circle, CircleCondition } from './Components';

var db = new DB()

function GenerateInvoice(props) {
    const { register, getValues, setValue, handleSubmit } = useForm();

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
            title: 'Garbage +/-',
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

    const [HS1, setHS1] = useState(formContent[0].isHeadSplit), [HS2, setHS2] = useState(formContent[1].isHeadSplit), [HS3, setHS3] = useState(formContent[2].isHeadSplit);
    const [HS4, setHS4] = useState(formContent[3] ? formContent[3].isHeadSplit : false), [HS5, setHS5] = useState(formContent[4] ? formContent[4].isHeadSplit : false), [HS6, setHS6] = useState(formContent[5] ? formContent[5].isHeadSplit : false);
    const HSStateArray = [{ HS: HS1, setHS: setHS1 }, { HS: HS2, setHS: setHS2 }, { HS: HS3, setHS: setHS3 }, { HS: HS4, setHS: setHS4 }, { HS: HS5, setHS: setHS5 }, { HS: HS6, setHS: setHS6 }]

    // const [PPV1, setPPV1] = useState(), [PPV2, setPPV2] = useState(), [PPV3, setPPV3] = useState();
    // const [PPV4, setPPV4] = useState(), [PPV5, setPPV5] = useState(), [PPV6, setPPV6] = useState();
    // const PPVStateArray = [{ PPV: PPV1, setPPV: setPPV1 }, { PPV: PPV2, setPPV: setPPV2 }, { PPV: PPV3, setPPV: setPPV3 }, { PPV: PPV4, setPPV: setPPV4 }, { PPV: PPV5, setPPV: setPPV5 }, { PPV: PPV6, setPPV: setPPV6 }]

    const [PPV, setPPV] = useState([{id: 0,value:0},{id: 0,value:0},{id: 0,value:0},{id: 0,value:0},{id: 0,value:0},{id: 0,value:0}]);

    const getDefaultValue = (item, i) => {
        let value = 0
        if (item.isPPB) {
            db.persons().forEach(person => {
                if (person[item.valueTemplate])
                    item.perPersonValue.push({
                        id: person.id,
                        value: HSStateArray[i].HS ? person[item.valueTemplate] * (person.profile.head_count || 0) : person[item.valueTemplate]
                    })
            })
        }
        else if (item.isShared) {
            if (HSStateArray[i].HS)
                value = item.value / heads
            else value = item.value / houses
        }
        else value = item.value || 0
        return Math.round(value, 0)
    }

    useEffect(() => {
        formContent.forEach((item,i) => {
            if (item.isPPB) {
                db.persons().forEach(person => {
                    if (person[item.valueTemplate])
                        item.perPersonValue.push({
                            id: person.id,
                            value: HSStateArray[i].HS ? person[item.valueTemplate] * (person.profile.head_count || 0) : person[item.valueTemplate]
                        })
                })
                setPPV(item.perPersonValue)
            }
        })
        console.log(PPV);
    }, [])

    const step = (item,i,s) => {
        if(item.isPPB) {
            setPPV(PPV.map(v => {return {id:v.id,value:v.value+s}}))
            setValue(item.fieldname,parseInt(getValues(item.fieldname))+s)
            return
        } 
        else if(item.isHeadSplit) item.value += s*heads
        else if(item.isShared) item.value += s*houses
        else item.value += s
        setValue(item.fieldname,getDefaultValue(item,i))
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
                <small style={{ display: 'inline-block', width: '40%', color:'darkgrey' }}>{moment().format("MMMM YYYY")}</small>
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
                                <div style={{ display: 'inline-flex', width: '100%' }}>
                                    <center>
                                        { item.title.includes('+/-') && <Circle small icon={"\uf068"} style={{ margin: '0 5%', display: 'inline-block' }} onClick={() => step(item,i,-10)} />}
                                        <input name={item.fieldname} style={{ display: 'inline-block', color: 'black', backgroundColor: 'white' }} type='number' pattern="[0-9]*" value={getDefaultValue(item, i)} ref={register} className="editable-label-input" readOnly />
                                        { item.title.includes('+/-') && <Circle small icon={"\uf067"} style={{ margin: '0 5%', display: 'inline-block' }} onClick={() => step(item,i,10)} />}
                                    </center>
                                </div>
                                <small style={{ display: 'inline-block', width: '40%', color: 'darkgrey' }}>{HSStateArray[i].HS ? "per head" : (item.isShared ? "per house" : "")}</small>
                                <br /><br />
                                {item.isPPB &&
                                    <div style={{ display: 'inline-block', width: '80%' }}>
                                        {
                                            item.perPersonValue.map((v,vi) => (
                                                <Circle key={v.id} small color="#5e09b8" icon={"\uf007"} title={PPV[vi].value || "0"} titleStyle={{ color: 'darkgrey' }} style={{ margin: '0 4%' }} />
                                            ))
                                        }
                                    </div>
                                }
                            </center>
                            {item.isShared &&
                                <div style={{ display: 'inline-flex', width: '40%', margin: '0 2% 3% 0' }}>
                                    <div style={{ display: 'inline-block', width: '20%', marginRight: '8%' }}>
                                        <CircleCondition small condition={HSStateArray[i].HS} onClick={() => HSStateArray[i].setHS(!HSStateArray[i].HS)} color={['#006CFF', '#c20808']} icon={['\uf0c0', '\ue065']} />
                                    </div>
                                    <div style={{ display: 'inline-block', width: '80%', marginTop: '1%' }}>
                                        <small style={{ display: 'inline-block', color: 'darkgrey' }}>{HSStateArray[i].HS ? "Split Per Head" : "Per House"}</small><br />
                                    </div>
                                </div>
                            }
                        </div>
                        <br /><br />
                    </Fragment>
                ))
            }
            <center>
            <button className="overlay-button" style={{backgroundColor:'#006CFF', color:'white', width:'90%'}}>Create</button>
            </center>
            <br /><br />
        </div>
    )
}

export default GenerateInvoice;
