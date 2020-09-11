import React ,{ Fragment, useEffect ,useState}from 'react';
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import { useForm } from "react-hook-form";
import Form from 'react-bootstrap/Form';
import {Overlay,HeadCountBox} from './Components';
import { Redirect } from 'react-router';
import DB from './DB';

var db = new DB()

function AddPerson(props){
	const [selectedTennant, setSelectedTennant] = useState();
	const { register, handleSubmit } = useForm()
	const [addpersonOverlay, setaddpersonOverlay] = useState(false);
	const [redirect, setRedirect] = useState();
	const [checkForm, setcheckForm] = useState(true);

	const checkFormValue = (d) => {
			Object.keys(d).forEach(i => {
					if(d[i]===undefined) setcheckForm(false)
				})
			console.log(checkForm);
	}

	const testSubmitHandler = (d) => {
		var data={
			id:props.location.state,
			startdate:d.startdate,
			advance:parseInt(d.advance),
			base_rent:parseInt(d.base_rent),
			water:parseInt(d.water),
			profile:
				{
				name:d.name,
				head_count:parseInt(d.head_count),
				mobile:d.mobile
				}
			}
		checkFormValue(data)
		if (checkForm)	db.addUser(d.id,data)
		else return false
	}

	if (redirect)
		return <Redirect push to={{
			pathname: redirect,
		}}
		/>

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
			<Form.Group >
				<div style={{display:'inline-flex',width:'100%'}}>
					<div style={{display:'inline-block',marginRight:'5%',fontSize:28}} className="fas">{"\uf2bd"}</div>
					<Form.Control type="text" placeholder="Name" ref={register} name='name' style={{borderBottom: "2px solid darkgrey",borderTop:'none',borderLeft:'none',borderRight:'none'}}/>
				</div>
			</Form.Group><br/>
			<Form.Group  >
			<div style={{display:'inline-flex',width:'100%'}}>
				<div style={{display:'inline-block',marginRight:'6%',fontSize:28}} className="fas">{"\uf073"}</div>
				<Form.Control type="date" placeholder="startdate" ref={register} name='startdate' style={{borderBottom: "2px solid darkgrey",borderTop:'none',borderLeft:'none',borderRight:'none'}}/>
			</div>
			</Form.Group><br/>
			<Form.Group  >
			<div style={{display:'inline-flex',width:'100%'}}>
				<div style={{display:'inline-block',marginRight:'3%',fontSize:28}} className="fas">{"\uf3d1"}</div>
				<Form.Control type="number" placeholder="Advance" ref={register} name='advance' style={{borderBottom: "2px solid darkgrey",borderTop:'none',borderLeft:'none',borderRight:'none'}}/>
			</div>
			</Form.Group><br/>
			<Form.Group  >
			<div style={{display:'inline-flex',width:'100%'}}>
				<div style={{display:'inline-block',marginRight:'8%',fontSize:28}} className="fas">{"\uf156"}</div>
				<Form.Control type="number" placeholder="Base Rent" ref={register} name='base_rent' style={{borderBottom: "2px solid darkgrey",borderTop:'none',borderLeft:'none',borderRight:'none'}}/>
			</div>
			</Form.Group><br/>
			<Form.Group  >
			<div style={{display:'inline-flex',width:'100%'}}>
				<div style={{display:'inline-block',marginRight:'5%',fontSize:28}} className="fas">{"\uf879"}</div>
				<Form.Control type="number" placeholder="Mobile" ref={register} name='mobile' style={{borderBottom: "2px solid darkgrey",borderTop:'none',borderLeft:'none',borderRight:'none'}}/>
			</div>
			</Form.Group><br/>
			<Form.Group  >
			<div style={{display:'inline-flex',width:'100%'}}>
				<div style={{display:'inline-block',marginRight:'7%',fontSize:28}} className="fas">{"\uf043"}</div>
				<Form.Control type="number" placeholder="Water" ref={register} name='water' style={{borderBottom: "2px solid darkgrey",borderTop:'none',borderLeft:'none',borderRight:'none'}}/>
			</div>
			</Form.Group><br/>
			<div style={{display:'inline-flex',width:'100%'}}>&nbsp;&nbsp;
				<HeadCountBox style={{display:'inline-flex',width:'30%',fontSize:38,paddingLeft: '10%'}} ><div className="fas">{"\uf007"}</div></HeadCountBox>&nbsp;&nbsp;
				<HeadCountBox style={{display:'inline-flex',width:'30%',fontSize:38,paddingLeft: '8%'}} ><div className="fas">{"\uf500"}</div></HeadCountBox>&nbsp;&nbsp;
				<HeadCountBox style={{display:'inline-flex',width:'30%',fontSize:38,paddingLeft: '8%'}} ><div className="fas">{"\uf0c0"}</div></HeadCountBox>&nbsp;&nbsp;
			</div><br/><br/><br/>
			{
			// <Form.Group  >
			// <div style={{display:'inline-flex',width:'100%'}}>
			// 	<div style={{display:'inline-block',marginRight:'3%',fontSize:28}} className="fas">{"\uf500"}</div>
			// 	<Form.Control type="number" placeholder="Head Count" ref={register} name='head_count' style={{borderBottom: "2px solid darkgrey",borderTop:'none',borderLeft:'none',borderRight:'none'}}/>
			// </div>
			// </Form.Group><br/>
			}
			  <center> <Button variant="primary" onClick={() => {setTimeout(() => setRedirect('/'), 1500); {checkForm? setaddpersonOverlay(true): setaddpersonOverlay(false)} }} type="submit" size="lg" block><b>Submit</b></Button></center>
		</Form>
		<Overlay  style={{transition:'1s ease'}}visible={addpersonOverlay} bgClick={() => setaddpersonOverlay(!addpersonOverlay)} height={25}>
			<center><div className="fas" style={{color:'#07ab0a',fontSize:90,marginTop:'5%'}}>{"\uf00c"}</div></center>
		</Overlay>
		</Fragment>
	)
}

export default AddPerson;
