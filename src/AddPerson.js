import React ,{ Fragment, useEffect ,useState}from 'react';
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import { useForm } from "react-hook-form";
import Form from 'react-bootstrap/Form';
import DB from './DB';

var db = new DB()

function AddPerson(props){
	const [selectedTennant, setSelectedTennant] = useState();
	const { register, handleSubmit } = useForm()

	const testSubmitHandler = (d) => {
		var data={
			id:props.location.state,
			startdate:d.startdate,
			advance:parseInt(d.advance),
			base_rent:parseInt(d.base_rent),
			water:parseInt(d.base_rent),
			profile:
			{
				name:d.name,
				head_count:parseInt(d.head_count),
				mobile:d.mobile
				}
			}
		db.addUser(d.id,data)
	}

	return(
		<Fragment>
		<br/>
		<Navbar bg="primary" variant="dark" fixed="top">
			<Navbar.Brand className="mx-auto"><h3><b>Rent</b></h3></Navbar.Brand>
		</Navbar>
		<br /><br /><br />
		{
			// Title
		}
		<center>
			<h3><b className="fas">{"\uf234"}</b><b>&nbsp;&nbsp;Add User</b></h3>
		</center>
		<br />
		<Form style={{marginLeft:'5%',marginRight:'5%'}} onSubmit={handleSubmit (d => testSubmitHandler(d))}>
			<Form.Group  style={{borderBottom: "2px solid #1055e0"}}>
				<b className="fas">{"\uf234"}</b><Form.Control type="text" placeholder="Name" ref={register} name='name'/>
			</Form.Group><br/>
			<Form.Group  style={{borderBottom: "2px solid #1055e0"}}>
				<Form.Control type="date" placeholder="startdate" ref={register} name='startdate'/>
			</Form.Group><br/>
			<Form.Group  style={{borderBottom: "2px solid #1055e0"}}>
				<Form.Control type="number" placeholder="Advance" ref={register} name='advance'/>
			</Form.Group><br/>
			<Form.Group  style={{borderBottom: "2px solid #1055e0"}}>
				<Form.Control type="number" placeholder="Base Rent" ref={register} name='base_rent'/>
			</Form.Group><br/>
			<Form.Group  style={{borderBottom: "2px solid #1055e0"}}>
				<Form.Control type="number" placeholder="Head Count" ref={register} name='head_count'/>
			</Form.Group><br/>
			<Form.Group  style={{borderBottom: "2px solid #1055e0"}}>
				<Form.Control type="number" placeholder="Mobile" ref={register} name='mobile'/>
			</Form.Group><br/>
			<Form.Group  style={{borderBottom: "2px solid #1055e0"}}>
				<Form.Control type="number" placeholder="Water" ref={register} name='water'/>
			</Form.Group><br/>
			  <center><Button variant="primary" type="submit">submit</Button></center>
		</Form>
		</Fragment>
	)
}

export default AddPerson;
