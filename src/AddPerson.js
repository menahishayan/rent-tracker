import React, { Fragment, useState } from 'react';
import { useForm } from "react-hook-form";
import Form from 'react-bootstrap/Form';
import { Overlay, Header } from './Components';
import { Redirect } from 'react-router';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import moment from 'moment';
import './Main.css'
import DB from './DB';

var db = new DB()

function AddPerson(props) {
	const { register, handleSubmit } = useForm()
	const [addpersonOverlay, setaddpersonOverlay] = useState(false);
	const [redirect, setRedirect] = useState();
	const [headCount, setHeadCount] = useState(1);

	const submitHandler = (d) => {
		var data = {
			id: props.location.state,
			startdate: d.startdate,
			advance: parseInt(d.advance),
			base_rent: parseInt(d.base_rent),
			water: parseInt(d.water),
			profile:
			{
				name: d.name,
				nickname: d.shortname,
				head_count: headCount,
				mobile: d.mobile
			},
			payment_history: [{ housing: parseInt(d.base_rent), others: 0 }],
			isEmpty: false
		}

		let isValid = true
		Object.keys(d).forEach(i => {
			if (d[i].length < 1) isValid = false
		})

		if (isValid) {
			db.addUser(data.id, data)
			setaddpersonOverlay(true)
			db.refreshCache()
			setTimeout(() => setRedirect('/'), 500)
		}
	}

	if (redirect) return <Redirect push to={{ pathname: redirect }} />
	return (
		<Fragment>
			<Header />
			<center>
				<h3><b className="fas">{"\uf234"}</b><b>&nbsp;&nbsp;New Tennant</b></h3>
			</center>
			<br />
			<Form style={{ padding: '5% 8%' }} onSubmit={handleSubmit(d => submitHandler(d))}>
			<center>
				<Form.Group>
					<div style={{ display: 'inline-flex', width: '100%' }}>
						<div className="input-icon fas" style={{fontSize:24}}>{"\uf2c2"}</div>
						<Form.Control type="text" placeholder="Name" ref={register} name='name' className="textfield" />
					</div>
				</Form.Group><br />
				<Form.Group>
					<div style={{ display: 'inline-flex', width: '100%' }}>
						<div className="input-icon fas" style={{fontSize:24}}>{"\uf2c1"}</div>
						<Form.Control type="text" placeholder="Short Name" ref={register} name='shortname' className="textfield" />
					</div>
				</Form.Group><br />
				<Form.Group>
					<div style={{ display: 'inline-flex', width: '47%' }}>
						<div className="input-icon fas" style={{fontSize:24}}>{"\uf073"}</div>
						<Form.Control type="date" placeholder="Start Date" ref={register} name='startdate' className="textfield" defaultValue={moment().startOf('month').format("YYYY-MM-DD")} />
					</div>&nbsp;&nbsp;&nbsp;&nbsp;
					<div style={{ display: 'inline-flex', width: '47%' }}>
						<div className="input-icon fas" style={{fontSize:24}}>{"\uf043"}</div>
						<Form.Control type="number" placeholder="Water" ref={register} name='water' className="textfield" />
					</div>
				</Form.Group><br />
				<Form.Group>
					<div style={{ display: 'inline-flex', width: '47%' }}>
						<div className="input-icon fas" style={{fontSize:24}}>{"\uf3d1"}</div>
						<Form.Control type="number" placeholder="Advance" ref={register} name='advance' className="textfield" />
					</div>&nbsp;&nbsp;&nbsp;&nbsp;
					<div style={{ display: 'inline-flex', width: '47%' }}>
						<div className="input-icon fas" style={{fontSize:24}}>{"\uf156"}</div>
						<Form.Control type="number" placeholder="Rent" ref={register} name='base_rent' className="textfield" />
					</div>
				</Form.Group><br />
				<Form.Group>
					<div style={{ display: 'inline-flex', width: '100%' }}>
						<div className="input-icon fas" style={{fontSize:24}}>{"\uf879"}</div>
						<Form.Control type="number" placeholder="Mobile" ref={register} name='mobile' className="textfield" />
					</div>
				</Form.Group><br />
				
					<ToggleButtonGroup type="radio" name="options" defaultValue={headCount}>
						<ToggleButton variant="light" name='head_count' onClick={() => setHeadCount(1)} value={1}><div className="fas" style={{ fontSize: 28 }}>{"\uf007"}</div></ToggleButton>
						<ToggleButton variant="light" name='head_count' onClick={() => setHeadCount(2)} value={2}><div className="fas" style={{ fontSize: 28 }}>{"\uf500"}</div></ToggleButton>
						<ToggleButton variant="light" name='head_count' onClick={() => setHeadCount(3)} value={3}><div className="fas" style={{ fontSize: 28 }}>{"\uf0c0"}</div></ToggleButton>
					</ToggleButtonGroup>
				<br /><br />
				<button className="overlay-button-mx" type="submit" style={{width:'100%'}}>Add Tennant</button> </center>
			</Form>
			<Overlay style={{ transition: '.3s ease' }} visible={addpersonOverlay} bgClick={() => setaddpersonOverlay(!addpersonOverlay)} height={25}>
				<center><div className="fas" style={{ color: '#07ab0a', fontSize: 90, marginTop: '5%' }}>{"\uf00c"}</div></center>
			</Overlay>
		</Fragment>
	)
}

export default AddPerson;
