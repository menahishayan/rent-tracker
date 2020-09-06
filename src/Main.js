import Navbar from 'react-bootstrap/Navbar'
import DB from './DB';
import React, { Fragment, useEffect } from 'react';
import './Main.css'
import moment from 'moment';

var db = new DB()

const CircleCondition = props => (
	<div className='circle-container' style={props.style} onClick={props.onClick}>
		<div className="circle" style={props.condition ? {backgroundColor: props.color[0]} : {backgroundColor: props.color[1]}}>
			<center><b className="fas">{props.condition ? props.icon[0] : props.icon[1]}</b></center>
		</div>
		{props.title ? <p style={{marginTop:8}}>{props.title}</p> : null}
	</div>
)

const Circle = props => (
	<div className='circle-container' style={props.style} onClick={props.onClick}>
		<div className="circle" style={{backgroundColor: props.color || 'darkgrey'}}>
			<center><b className="fas">{props.icon}</b></center>
		</div>
		<br/>
		{props.title ? <p className='name'>{props.title}</p> : null}
	</div>
)

function Main(){
	useEffect(() => {
		db.refreshCache()
	},[])

	const generateRenewalsList = () => {
		let array = []
		if(db.data)
		db.persons().map((person,i) => (
			db.getNextRenewal(i).isBetween(moment().subtract(1,"M"),moment().add(7,"M"),"M") ?
				array.push({
					i: i,
					name: person.profile.name,
					date: db.getNextRenewal(i).format("Do MMMM, YYYY")
				})
			 : null
		))
		return array
	}
   return(
      <div>
         <Navbar bg="primary" variant="dark" fixed="top">
         	<Navbar.Brand className = "mx-auto"><h3><b>Rent</b></h3></Navbar.Brand>
         </Navbar>
		 <br/><br/><br/><br/>
         <center>
         <h4><b><i className="fa fa-check"></i></b>&nbsp;&nbsp;{moment().format("MMMM")}</h4>
         <div className="container" >
            {
               db.data && db.getBuildings().map((building,b) => (
				   <Fragment>
				   {
					   db.profiles(building).map((profile,i) => (
		                  <Fragment key={b*i} style={{display:'inline'}}>
						  	<CircleCondition title={db.getNickname(profile)} condition={db.getRent(i,true)} color={['#07ab0a','darkgrey']} icon={['\uf00c','\uf00d']} />
		                  	<br style={i%3===2?{display:'block'}:{display:'none'}}/>
		                  </Fragment>
		               ))
				   }
				   { b!==db.getBuildings().length-1 ? <hr style={{marginTop:"-1%",marginBottom:"6%"}}/> : null }
				   </Fragment>
			   ))
            }
         </div>
		 </center>
		 <br/>
		 <center>
		 	<h4><b><i className="fa fa-history"></i></b>&nbsp;&nbsp;Upcoming Renewals</h4>
		 </center>
         <div className="container">
		 {
			db.data && generateRenewalsList().map((person,i) => (
				<Fragment key={i}>
					<div style={{display:'inline-flex',width:'100%', marginLeft:'2%',cursor: 'pointer'}}>
						<div style={{display:'inline-block',width:'20%', marginRight:'8%'}}>
							<Circle color="#5e09b8" icon={"\uf007"} />
						</div>
						<div style={{display:'inline-block',width:'80%', marginTop:'1.5%'}}>
							<b>{person.name}</b><br/>
							{person.date}
						</div>
					</div>
					{ i!==generateRenewalsList().length-1 ? <hr style={{marginTop:"-3%"}}/> : null }
				</Fragment>
			))
		 }
		 </div>
		 <br/>
		 <center>
		 	<h4><b><i className="fa fa-users"></i></b>&nbsp;&nbsp;Tennants</h4>
		 </center>
         <div className="container">
		 {
			db.data && db.getBuildings().reverse().map((building,b) => (
				<Fragment>
				{
					db.getFloors(building).map((floor,f) => (
						<Fragment key={f}>
							<div className="floor-label-container">
								<center><b className="floor-label">{floor == 0 ? 'G' : floor}</b></center>
							</div>
							<div className="floor">
							{
								db.getDoors(building,floor).map((door,d) =>
									<div style={{width:`${100/db.getDoors(building,floor).length}%`, backgroundColor:`hsl(${48-(f+d)*2}, ${(((f+d+1)/db.getDoors(building,floor).length)*80)+15}%, ${(((f+d)/db.getDoors(building,floor).length)*13)+74}%)`}} className="door">
										<center><b className="door-label"><b className="fa fa-f52b"></b>{door}</b><p className="door-subtitle">{db.getNickname(db.data[`${building}_${floor}_${door}`].profile)}</p></center>
									</div>
								)
							}
							</div>
							<br/>
						</Fragment>
					))
				}
				{ b!==db.getBuildings().length-1 ? <hr/> : null }
				</Fragment>
			))
		 }
		 </div>
		 <br/><br/>
      </div>
   )
}

export default Main;
