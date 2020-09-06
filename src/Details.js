import Navbar from 'react-bootstrap/Navbar'
import React from 'react';
import DB from './DB';
import moment from 'moment';
import { Circle ,VerticalTimeline, HorizontalTimeline } from './Components'

var db = new DB()

function Details (props) {
	return(
		<div>
		<Navbar bg="primary" variant="dark" fixed="top">
		   <Navbar.Brand className = "mx-auto"><h3><b>Rent</b></h3></Navbar.Brand>
		</Navbar>
		<br/><br/><br/><br/>
			<div style={{display:'inline-flex',width:'100%', marginLeft:'2%',cursor: 'pointer'}}>
				<div style={{display:'inline-block',width:'20%', marginRight:'8%'}}>
					<Circle color="#5e09b8" icon={"\uf007"} style={{marginLeft:'50%'}}/>
				</div>
				<div style={{display:'inline-block',width:'80%', marginTop:'3%',marginLeft:'5%'}}>
					<h3>{props.location.state.profile.name}</h3>
				</div>
			</div>
			<div className='container'>
			<h3>{props.location.state.startdate}</h3>
			</div>
			<br/>
			<center><h4>Vertical Example</h4></center>
			<div className="container">
   		 	<VerticalTimeline content={props.location.state.payment_history.slice(-3).map((p,i) => {return {title:moment(i+1,"M").format("MMM YYYY"),subtitle:p.housing}})}/>
	   		 </div>
	   		 <br/>
			 <center><h4>Horizontal Example</h4></center>
	   		 <div className="container">
	   		 	<HorizontalTimeline content={props.location.state.payment_history.slice(-3).map((p,i) => {return {title:moment(i+1,"M").format("MMM"),subtitle:p.housing}})}/>
	   		 </div>
	   		 <br/><br/>
			</div>
	);
}

export default Details;
