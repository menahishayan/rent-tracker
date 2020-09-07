import Navbar from 'react-bootstrap/Navbar'
import React,{Fragment} from 'react';
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
				<div style={{display:'inline-flex',width:'100%'}}>
					<b className="fas"  style={{display:'inline-block',width:'10%',marginLeft:'2%',fontSize:'25px',marginTop:'-3%'}}>{"\uf073"}</b>
					<h5 style={{display:'inline-block',width:'50%'}}>From</h5>
				</div>
				<h4 style={{marginTop:'1%'}}><b>{moment(props.location.state.startdate).format("Do MMMM, YYYY")}</b></h4>
			</div>
			<br/>

			<center>
   		 		<h4><b className="fas">{"\uf015"}</b>&nbsp;&nbsp;Rent History</h4>
   		 	</center>
			<div className="container">
   		 	<VerticalTimeline content={props.location.state.payment_history.slice(-3).map((p,i) => {return {title:moment(props.location.state.startdate).add(props.location.state.payment_history.length+(i-3),"M").format("MMM YYYY"),subtitle:p.housing}})}/>
	   		 </div>
	   		 <br/>

			 <center>
    		 		<h4><b className="fas">{"\uf06a"}</b>&nbsp;&nbsp;Due</h4>
    		 </center>
 			<div className="container">
				{console.log(props.location.state.id)}
				{db.getRent({id:props.location.state.id},false,false,0)}
 	   		 </div>
 	   		 <br/>

			 { props.location.state.renewals &&
			<Fragment>
			 <center>
    		 		<h4><b className="fas">{"\uf70e"}</b>&nbsp;&nbsp;Renewals</h4>
    		 </center>
	   		 <div className="container">
	   		  <HorizontalTimeline content={props.location.state.renewals.map((r) => {return {title:moment(r).format("MMM"),subtitle:moment(r).format("YYYY")}})}/>
	   		 </div>
			 </Fragment>
		 	}
	   		 <br/><br/>
			</div>
	);
}

export default Details;
