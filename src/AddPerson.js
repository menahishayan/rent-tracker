import React ,{ Fragment, useEffect }from 'react';
import Button from 'react-bootstrap/Button'
import { useForm } from "react-hook-form";
import Form from 'react-bootstrap/Form';
import DB from './DB';

var db = new DB()

function AddPerson(){
	// const [name, setname] = useForm();
	// const [id, setid] = useForm();
	// const [mobile, setmobile] = useForm();
	// const [startDate, setstartDate] = useForm();
	// const [advance, setadvance] = useForm();
	// const [rent, setrent] = useForm();
	// const [headCount, setheadCount] = useForm();

	const { register, handleSubmit } = useForm()

	const testSubmitHandler = (d) => {
		var data={
				name:d.name,
				startDate:d.startDate,
				advance:d.advance,
				rent:d.rent,
				headCount:d.headCount,
				mobile:d.mobile}
		db.addUser(d.id,data)
	}

	return(
		<Fragment>
		<br/>
		<center>
			<h3><b className="fas">{"\uf234"}</b><b>&nbsp;&nbsp;Add User</b></h3>
		</center>
		<br />
		<Form style={{marginLeft:'5%',marginRight:'5%'}} onSubmit={handleSubmit (d => testSubmitHandler(d))}>
			<Form.Group  style={{borderBottom: "2px solid #1055e0"}}>
				<Form.Control type="text" placeholder="Name" ref={register} name='name'/>
			</Form.Group><br/>
			<Form.Group  style={{borderBottom: "2px solid #1055e0"}}>
				<Form.Control type="text" placeholder="ID" ref={register} name='id'/>
			</Form.Group><br/>
			<Form.Group  style={{borderBottom: "2px solid #1055e0"}}>
				<Form.Control type="date" placeholder="StartDate" ref={register} name='startDate'/>
			</Form.Group><br/>
			<Form.Group  style={{borderBottom: "2px solid #1055e0"}}>
				<Form.Control type="number" placeholder="Advance" ref={register} name='advance'/>
			</Form.Group><br/>
			<Form.Group  style={{borderBottom: "2px solid #1055e0"}}>
				<Form.Control type="number" placeholder="Rent" ref={register} name='rent'/>
			</Form.Group><br/>
			<Form.Group  style={{borderBottom: "2px solid #1055e0"}}>
				<Form.Control type="number" placeholder="HeadCount" ref={register} name='headCount'/>
			</Form.Group><br/>
			<Form.Group  style={{borderBottom: "2px solid #1055e0"}}>
				<Form.Control type="number" placeholder="Mobile" ref={register} name='mobile'/>
			</Form.Group><br/>
			  <center><Button variant="primary" type="submit">submit</Button></center>
		</Form>
		</Fragment>
	)
}

export default AddPerson;
