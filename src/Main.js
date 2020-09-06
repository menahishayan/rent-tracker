import Navbar from 'react-bootstrap/Navbar'
import DB from './DB';
import React, { Fragment, useState, useEffect } from 'react';
import './Main.css'
import moment from 'moment';

var db = new DB()

const CircleCondition = props => (
	<div className='circle-container' style={props.style}>
		<div className="circle" style={props.condition ? {backgroundColor: props.color[0]} : {backgroundColor: props.color[1]}}>
			{props.condition ? <i className={`fa fa-${props.icon[0]}`}></i> : <i className={`fa fa-${props.icon[1]}`}></i>}
		</div>
		{props.title ? <p style={{marginTop:8}}>{props.title}</p> : null}
	</div>
)

const Circle = props => (
	<div className='circle-container'>
		<div className="circle" style={{backgroundColor: props.color || 'darkgrey'}}>
			<i className={`fa fa-${props.icon}`}></i>
		</div>
		<br/>
		{props.title ? <p className='name'>{props.title}</p> : null}
	</div>
)

function Main(){
	useEffect(() => {
		db.refreshCache()
	},[])
   return(
      <div>
         <Navbar bg="primary" variant="dark">
         	<Navbar.Brand className = "mx-auto"><h3><b>Rent</b></h3></Navbar.Brand>
         </Navbar>
         <center><br/>
         <h4><b><i className="fa fa-check"></i></b>&nbsp;&nbsp;{moment().format("MMMM")}</h4>
         <div className="container" >
            {
               db.data && db.profiles("86").map((profile,i) => (
                  <Fragment key={i} style={{display:'inline'}}>
					  <CircleCondition
						  title={profile.nickname ? profile.nickname : profile.name.split(' ')[0]}
						  condition={db.getRent(i,true)}
						  color={['#07ab0a','darkgrey']}
						  icon={['check','times']}
					  />
                     <br style={i%3===2?{display:'block'}:{display:'none'}}/>
                  </Fragment>
               ))
            }
            <hr style={{backgroundColor:"darkgrey"}}/>
            {
                db.data && db.profiles("6").map((profile,i) => (
                  	<Fragment key={i} style={{display:'inline'}}>
                    	<CircleCondition
							title={profile.nickname ? profile.nickname : profile.name.split(' ')[0]}
							condition={db.getRent(i,true)}
							color={['#07ab0a','darkgrey']}
							icon={['check','times']}
						/>
                    <br style={i%3===2?{display:'block'}:{display:'none'}}/>
                  	</Fragment>
                ))
            }
         </div>
		 <br/>
		 <h4><b><i className="fa fa-history"></i></b>&nbsp;&nbsp;Upcoming Renewals</h4>
         <div className="container" >
		 {
			db.data && db.persons().map((person,i) => (
				db.getNextRenewal(i).isBetween(moment().subtract(1,"M"),moment().add(7,"M"),"M") ?
				<Fragment key={i}>
					<div style={{display:'inline-flex',width:'100%'}}>
						<div style={{display:'inline-block',width:'20%'}}>
							<Circle color="#006CFF" icon="user" />
						</div>
						<div style={{display:'inline-block',width:'80%'}}>
							<b>{person.profile.name}</b><br/>
							{db.getNextRenewal(i).format("Do MMMM, YYYY")}
						</div>
					</div>
					<hr style={{marginTop:"-3%"}}/>
				</Fragment> : null
			))
		 }
		 </div>
         </center>
		 <br/>
      </div>
   )
}

export default Main;
