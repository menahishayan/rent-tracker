import React ,{ Fragment, useEffect ,useState}from 'react';
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import { useForm } from "react-hook-form";
import Form from 'react-bootstrap/Form';
import {Overlay} from './Components';
import { Redirect } from 'react-router';
import InputGroup from 'react-bootstrap/InputGroup'
import DB from './DB';

var db = new DB()

function AddPerson(props){
	const { register, handleSubmit } = useForm()
	const [addpersonOverlay, setaddpersonOverlay] = useState(false);
	const [redirect, setRedirect] = useState();
	const [checkForm, setcheckForm] = useState(true);

	const checkFormValue = (d) => {
			Object.keys(d).forEach(i => {
					if(d[i]===undefined) setcheckForm(false)
					else setcheckForm(true)
				})
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
		console.log(checkForm);
		if (checkForm)	{
			db.addUser(d.id,data)
			setaddpersonOverlay(true)
		}else setaddpersonOverlay(false)
		setTimeout(() => setRedirect('/'), 1500)
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
		<Form style={{marginLeft:'5%',marginRight:'5%'}} onSubmit={() => (handleSubmit (d => testSubmitHandler(d)), (checkForm? setaddpersonOverlay(true): setaddpersonOverlay(false)), setTimeout(() => setRedirect('/'), 1500))} >
			<Form.Group >
				<div style={{display:'inline-flex',width:'100%'}}>
					<div style={{display:'inline-block',marginRight:'5%',fontSize:28}} className="fas">{"\uf2bd"}</div>
					<Form.Control type="text" placeholder="Name" ref={register} name='name' style={{borderBottom: "2px solid darkgrey",borderTop:'none',borderLeft:'none',borderRight:'none'}}/>
				</div>
			</Form.Group><br/>
			<Form.Group>
			<div style={{display:'inline-flex',width:'100%'}}>
				<div style={{display:'inline-block',marginRight:'6%',fontSize:28}} className="fas">{"\uf073"}</div>
				<Form.Control type="date" placeholder="startdate" ref={register} name='startdate' style={{borderBottom: "2px solid darkgrey",borderTop:'none',borderLeft:'none',borderRight:'none'}}/>
			</div>
			</Form.Group><br/>
			<Form.Group>
			<div style={{display:'inline-flex',width:'100%'}}>
				<div style={{display:'inline-block',marginRight:'3%',fontSize:28}} className="fas">{"\uf3d1"}</div>
				<Form.Control type="number" placeholder="Advance" ref={register} name='advance' style={{borderBottom: "2px solid darkgrey",borderTop:'none',borderLeft:'none',borderRight:'none'}}/>
			</div>
			</Form.Group><br/>
			<Form.Group>
			<div style={{display:'inline-flex',width:'100%'}}>
				<div style={{display:'inline-block',marginRight:'8%',fontSize:28}} className="fas">{"\uf156"}</div>
				<Form.Control type="number" placeholder="Base Rent" ref={register} name='base_rent' style={{borderBottom: "2px solid darkgrey",borderTop:'none',borderLeft:'none',borderRight:'none'}}/>
			</div>
			</Form.Group><br/>
			<Form.Group>
			<div style={{display:'inline-flex',width:'100%'}}>
				<div style={{display:'inline-block',marginRight:'5%',fontSize:28}} className="fas">{"\uf879"}</div>
				<Form.Control type="number" placeholder="Mobile" ref={register} name='mobile' style={{borderBottom: "2px solid darkgrey",borderTop:'none',borderLeft:'none',borderRight:'none'}}/>
			</div>
			</Form.Group><br/>
			<Form.Group>
			<div style={{display:'inline-flex',width:'100%'}}>
				<div style={{display:'inline-block',marginRight:'7%',fontSize:28}} className="fas">{"\uf043"}</div>
				<Form.Control type="number" placeholder="Water" ref={register} name='water' style={{borderBottom: "2px solid darkgrey",borderTop:'none',borderLeft:'none',borderRight:'none'}}/>
			</div>
			</Form.Group><br/>

			<Form.Group>
			<div style={{display:'inline-flex',width:'100%'}}>
			<label>
			  <InputGroup className="mb-3">
			    <InputGroup.Prepend>
			      <InputGroup.Checkbox aria-label="Checkbox for following text input" />
			    </InputGroup.Prepend>
				<Button  variant="light" style={{display:'inline-flex',width:'15%',fontSize:38,paddingLeft: '2%',border:'1px solid black'}} ><div className="fas">{"\uf007"}</div></Button>
				&nbsp;&nbsp;
				<InputGroup.Prepend>
				  <InputGroup.Checkbox aria-label="Checkbox for following text input" />
				</InputGroup.Prepend>
				<Button variant="light" style={{display:'inline-flex',width:'19%',fontSize:38,paddingLeft: '2%',border:'1px solid black'}} ><div className="fas">{"\uf500"}</div></Button>
				&nbsp;&nbsp;
				<InputGroup.Prepend>
				  <InputGroup.Checkbox aria-label="Checkbox for following text input" />
				</InputGroup.Prepend>
				<Button variant="light" style={{display:'inline-flex',width:'20%',fontSize:38,paddingLeft: '2%',border:'1px solid black'}} ><div className="fas">{"\uf0c0"}</div></Button>
			  </InputGroup>
			 </label>
			</div>
			</Form.Group>
			{
<<<<<<< HEAD
							//
							// <Form.Group>
							// <div style={{display:'inline-flex',width:'100%'}}>&nbsp;&nbsp;
							// 	<Button  variant="light" style={{display:'inline-flex',width:'30%',fontSize:38,paddingLeft: '10%',border:'1px solid black'}} ><div className="fas">{"\uf007"}</div></Button>&nbsp;&nbsp;
							// 	<Button variant="light" style={{display:'inline-flex',width:'30%',fontSize:38,paddingLeft: '8%',border:'1px solid black'}} ><div className="fas">{"\uf500"}</div></Button>&nbsp;&nbsp;
							// 	<Button variant="light" style={{display:'inline-flex',width:'30%',fontSize:38,paddingLeft: '8%',border:'1px solid black'}} ><div className="fas">{"\uf0c0"}</div></Button>&nbsp;&nbsp;
							// </div>
							// </Form.Group><br/>

			// <Form.Group  >
=======
			// <Form.Group>
>>>>>>> de537f13143adff996e2b28388221d3ea534a676
			// <div style={{display:'inline-flex',width:'100%'}}>
			// 	<div style={{display:'inline-block',marginRight:'3%',fontSize:28}} className="fas">{"\uf500"}</div>
			// 	<Form.Control type="number" placeholder="Head Count" ref={register} name='head_count' style={{borderBottom: "2px solid darkgrey",borderTop:'none',borderLeft:'none',borderRight:'none'}}/>
			// </div>
			// </Form.Group><br/>
			}
			  <center> <Button variant="primary" type="submit" size="lg" block><b>Submit</b></Button></center>
		</Form>
		<Overlay  style={{transition:'1s ease'}}visible={addpersonOverlay} bgClick={() => setaddpersonOverlay(!addpersonOverlay)} height={25}>
			<center><div className="fas" style={{color:'#07ab0a',fontSize:90,marginTop:'5%'}}>{"\uf00c"}</div></center>
		</Overlay>
		</Fragment>
	)
}

export default AddPerson;
