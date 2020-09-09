import React ,{ Fragment, useEffect }from 'react';
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

	const { register } = useForm({
   		defaultValues: {
			Name: "bill",
   		}
 	});

	return(
		<Fragment>
		<br />
		<center>
			<h3><b className="fas">{"\uf234"}</b><b>&nbsp;&nbsp;Add User</b></h3>
		</center>
		<br />
		<Form style={{marginLeft:'5%',marginRight:'5%'}}>
			<Form.Group ref={register} style={{borderBottom: "2px solid #1055e0"}}>
				<Form.Control type="text" placeholder="Name" />
			</Form.Group><br/>
			<Form.Group ref={register} style={{borderBottom: "2px solid #1055e0"}}>
				<Form.Control type="text" placeholder="ID" />
			</Form.Group><br/>
			<Form.Group ref={register} style={{borderBottom: "2px solid #1055e0"}}>
				<Form.Control type="text" placeholder="StartDate" />
			</Form.Group><br/>
			<Form.Group ref={register} style={{borderBottom: "2px solid #1055e0"}}>
				<Form.Control type="text" placeholder="Advance" />
			</Form.Group><br/>
		</Form>
		</Fragment>
	)
}

export default AddPerson;
