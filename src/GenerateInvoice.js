import Navbar from 'react-bootstrap/Navbar'
import React, { Fragment, useState,useEffect } from 'react';
import DB from './DB';
import moment from 'moment';
import { Redirect } from 'react-router';
import { useForm } from 'react-hook-form'
import { Circle, CircleCondition, Overlay } from './Components';

var db = new DB()

function GenerateInvoice(props) {
    const { register, handleSubmit } = useForm();
    const [formContent,setFormContent] = useState();
    const [successOverlay,setSuccessOverlay] = useState(false);
	const [redirect, setRedirect] = useState();
	const [redirectProps, setRedirectProps] = useState();

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

    var heads = getHeads(), houses = getHouses(), items = props.location.state

    useEffect(() => {
        var initContent = [
            { title: 'Stairs & Pump', value: parseInt(items.eb), fieldname: 'eb', icon: '\uf0e7', isShared: true, isHeadSplit: false },
            { title: 'Water +/-', value: 0, valueTemplate: 'water', fieldname: 'water', icon: '\ue005', isPPB: true, isHeadSplit: true, perPersonValue: [] },
            { title: 'Garbage +/-', value: 60, fieldname: 'garbage', icon: '\uf1f8' }
        ];
        Array.from(['1', '2', '3']).forEach(o => {
            if (items[`other${o}-amount`] !== "0")
                initContent.push({ title: items[`other${o}-title`], value: parseInt(items[`other${o}-amount`]), icon: '\uf1b2', fieldname: `other${o}`, isShared: true, isHeadSplit: true })
        })

        initContent.forEach((item,i) => {
            if (item.isPPB) {
                db.persons().forEach(person => {
                    if (person[item.valueTemplate])
                        item.perPersonValue.push({
                            id: person.id,
                            value: item.isHeadSplit ? person[item.valueTemplate] * (person.profile.head_count || 0) : person[item.valueTemplate]
                        })
                })
            }
            else if (item.isShared) item.value /= item.isHeadSplit ? heads : houses
            item.value = Math.round(item.value, 0) || 0
        })
        setFormContent(initContent)
    },[items,heads,houses])

    const updateHS = (i) => {
        setFormContent(f => {
            let item = f[i]

            if(item.isHeadSplit !== undefined) item = { ...item, isHeadSplit: !item.isHeadSplit}
            else item = { ...item, isHeadSplit: true}
            
            if (item.isPPB || false) {
                db.persons().forEach(person => {
                    if (person[item.valueTemplate])
                        item = { ...item, perPersonValue: [...item.perPersonValue, {
                            id: person.id,
                            value: item.isHeadSplit ? person[item.valueTemplate] * (person.profile.head_count || 0) : person[item.valueTemplate]
                        }]}
                })
            }
            else if (item.isShared) {
                if (item.isHeadSplit)
                    item = { ...item, value: item.value * houses/heads}
                else item = { ...item, value: item.value * heads/houses}
            }
            else item = { ...item, value: 0}
            item = { ...item, value: Math.round(item.value,0)}
            return Array.from([...f.slice(0, i),item,...f.slice(i+1)])
        })
    }

    const step = (i,s) => {
        setFormContent(f => {
            let item = f[i]
            if(item.isPPB || false) {
                item = { ...item, value: item.value+s, perPersonValue: item.perPersonValue.map(v => {return {id:v.id,value:v.value+s}})}
                return Array.from([...f.slice(0, i),item,...f.slice(i+1)])
            } 
            else if (item.isShared) {
                if (item.isHeadSplit)
                    item = { ...item, value: item.value + s*heads}
                else item = { ...item, value: item.value + s*houses}
            }
            else item = { ...item, value: item.value+s}
            return Array.from([...f.slice(0, i),item,...f.slice(i+1)])
        })
    }

    const generate = (d) => {
        let generatedInvoices = []
        db.persons().forEach(person => {
            let sum = 0
            let personInvoice = {
                date:moment().format("YYYY-MM-DD"), 
                id: db.generateInvoiceId(person),
                head_count: person.profile.head_count || 1,
                particulars: []
            }
            formContent.forEach((f,i) => {
                let item = {item: f.title.replace(' +/-',''), isPerHead: f.isHeadSplit || false}
                if(f.isPPB) {
                    let ppvForPerson = f.perPersonValue.find(pv => pv.id === person.id) || {value:0}
                    item.amount = ppvForPerson.value
                } else item.amount = f.value
                item.amount = Math.round(item.amount,0)
                if(item.amount > 0) {
                    personInvoice.particulars.push(item)
                    sum += item.amount
                }
            })

            let days = moment().diff(moment(person.startdate), 'days')
            if(days<30) 
                personInvoice.particulars.forEach(item => {
                    item.amount *= days/moment(person.startdate).daysInMonth()
                    item.amount = Math.round(item.amount,0)
                })
            //prodata for vacate
            db.addInvoice(person, personInvoice)
            generatedInvoices.push({person: person, invoice: personInvoice, sum: sum})
        })
        setSuccessOverlay(true)
        setRedirectProps(generatedInvoices)
        setTimeout(() => setRedirect('invoice-summary'),500)

    }

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
                <h3><b className="fas">{"\uf543"}</b><b>&nbsp;&nbsp;New Invoice</b></h3>
                <small style={{ display: 'inline-block', width: '40%', color:'darkgrey' }}>{moment().format("MMMM YYYY")}</small>
            </center>
            <br />
            {
                // Containers
            }
            <form onSubmit={handleSubmit((d) => generate(d))}>
            {
                formContent && formContent.map((item, i) => (
                    <Fragment key={i}>
                        <center>
                            <h4><b className="fas">{item.icon}</b>&nbsp;&nbsp;{item.title}</h4>
                        </center>
                        <div className='container'>
                            <center>
                                <div style={{ display: 'inline-flex', width: '100%' }}>
                                    <center>
                                        { item.title.includes('+/-') && <Circle small icon={"\uf068"} style={{ margin: '0 5%', display: 'inline-block' }} onClick={() => step(i,-10)} />}
                                        <input name={item.fieldname} style={{ display: 'inline-block', color: 'black', backgroundColor: 'white' }} type='number' pattern="[0-9]*" value={item.value} ref={register} className="editable-label-input" readOnly />
                                        { item.title.includes('+/-') && <Circle small icon={"\uf067"} style={{ margin: '0 5%', display: 'inline-block' }} onClick={() => step(i,10)} />}
                                    </center>
                                </div>
                                <small style={{ display: 'inline-block', width: '40%', color: 'darkgrey' }}>{item.isHeadSplit ? "per head" : (item.isShared ? "per house" : "")}</small>
                                <br /><br />
                                {item.isPPB &&
                                    <div style={{ display: 'inline-block', width: '80%' }}>
                                        {
                                            item.perPersonValue.map((v,vi) => (
                                                <Circle key={v.id} small color="#5e09b8" icon={"\uf007"} title={v.value || "0"} titleStyle={{ color: 'darkgrey' }} style={{ margin: '0 4%' }} />
                                            ))
                                        }
                                    </div>
                                }
                            </center>
                            {item.isShared &&
                                <div style={{ display: 'inline-flex', width: '40%', margin: '0 2% 3% 0' }}>
                                    <div style={{ display: 'inline-block', width: '20%', marginRight: '8%' }}>
                                        <CircleCondition small condition={item.isHeadSplit} onClick={() => updateHS(i)} color={['#006CFF', '#c20808']} icon={['\uf0c0', '\ue065']} />
                                    </div>
                                    <div style={{ display: 'inline-block', width: '80%', marginTop: '1%' }}>
                                        <small style={{ display: 'inline-block', color: 'darkgrey' }}>{item.isHeadSplit ? "Split Per Head" : "Per House"}</small><br />
                                    </div>
                                </div>
                            }
                        </div>
                        <br /><br />
                    </Fragment>
                ))
            }
            <center>
            <button type="submit" className="overlay-button" style={{backgroundColor:'#006CFF', color:'white', width:'90%'}}>Create</button>
            </center>
            </form>
            <br /><br />
            <Overlay  style={{transition:'.3s ease'}} visible={successOverlay} height={25}>
                <center><div className="fas" style={{color:'#07ab0a',fontSize:90,marginTop:'5%'}}>{"\uf00c"}</div></center>
            </Overlay>
        </div>
    )
}

export default GenerateInvoice;
