import Navbar from 'react-bootstrap/Navbar'
import React, { Fragment, useState, useEffect } from 'react';
import DB from './DB';
import moment from 'moment';
import { useForm } from 'react-hook-form'
import { Circle, HorizontalTimeline,VerticalTimelineConditional,VerticalTimeline, HorizontalTimelineConditional,Overlay } from './Components'

var db = new DB()

function Details(props) {
	const [showAddPayOverlay,setShowAddPayOverlay] = useState(false);
	const [historyOverlay,sethistoryOverlay] = useState(false);
	const [advanceOverlay,setadvanceOverlay] = useState(false);
	const [editNewRentAmount,setEditNewRentAmount] = useState(false);
	const [editOtherAmount,setEditOtherAmount] = useState(false);
	const { register, handleSubmit } = useForm();

	const getNextPayment = () => {
		let person = props.location.state
		let month = moment().diff(moment(person.startdate).startOf('month'),'months')+1
		if(person.payment_history!==undefined) {
			return {
				month: moment().subtract(month - person.payment_history.length-1, "M"),
				amount: db.getExpectedRent({id:person.id},month)
			}
		}
		else return moment(person.startdate)
	}

	const resetAddPayOverlay = () => {
		setShowAddPayOverlay(false)
		setEditNewRentAmount(false)
		setEditOtherAmount(false)
	}

	var nextPayment = getNextPayment()

	return (
		<div>
			<Navbar bg="primary" variant="dark" fixed="top">
				<Navbar.Brand className="mx-auto"><h3><b>Rent</b></h3></Navbar.Brand>
			</Navbar>
			<br /><br /><br /><br />
			<div style={{ display: 'inline-flex', width: '100%', marginLeft: '2%', cursor: 'pointer' }}>
				<div style={{ display: 'inline-block', width: '20%', marginRight: '8%' }}>
					<Circle color="#5e09b8" icon={"\uf007"} style={{ marginLeft: '50%' }} />
				</div>
				<div style={{ display: 'inline-block', width: '80%', marginTop: '3%', marginLeft: '5%' }}>
					<h3>{props.location.state.profile.name}</h3>
				</div>
			</div>
			<div className='container'>
				<div style={{ display: 'inline-flex', width: '100%' }}>
					<b className="fas" style={{ display: 'inline-block', width: '10%', margin: '-1% 1% 2% 3%', fontSize: '40px', color:'#f03050' }}>{"\uf073"}</b>
					<div style={{marginLeft:'5%'}}><small style={{ display: 'inline-block', width: '40%', color:'darkgrey' }}>Since</small>
				<h4 style={{marginTop:'-1%'}}><b>{moment(props.location.state.startdate).format("Do MMMM, YYYY")}</b></h4></div>
				</div>
			</div>
			<br />

			<center>
				<h4><b className="fas">{"\uf1da"}</b>&nbsp;&nbsp;Rent History</h4>
			</center>
			<div className="container" onClick={() => sethistoryOverlay(true)}>
			{ props.location.state.payment_history!==undefined?
				<HorizontalTimelineConditional
					content={
						db.getExpectedRent({id:props.location.state.id}).map((e, i) => {
							return {
								title: moment(props.location.state.startdate).add(i, "M").format("MMM"),
								subtitle: (db.getRent({id:props.location.state.id},true,false,i+1)) ? e.housing : 0
							}
						}).slice(-3)
					}
					conditionArray={
						db.getExpectedRent({id:props.location.state.id}).map((e, i) => {
							return db.getRent({id:props.location.state.id},true,false,i+1)
						}).slice(-3)
					}
					color={['#07ab0a', 'darkgrey']}
					icon={['\uf00c', '\uf00d']}
				/>:null
			}
			</div>

			<Overlay visible={historyOverlay} height={90} bgClick={() =>sethistoryOverlay(false)} >
				<b className="fas" style={{color:'white', fontSize: 20,float:'right'}} onClick={() => sethistoryOverlay(historyOverlay ? false : true)}>{"\uf00d"}</b>
				<br/>
			{ props.location.state.payment_history!==undefined?
				<VerticalTimelineConditional
					content={
						db.getExpectedRent({id:props.location.state.id}).map((e, i) => {
							return {
								title: moment(props.location.state.startdate).add(i, "M").format("MMM YYYY"),
								subtitle: (db.getRent({id:props.location.state.id},true,false,i+1)) ? e.housing : 0
							}
						})
					}
					conditionArray={
						db.getExpectedRent({id:props.location.state.id}).map((e, i) => {
							return db.getRent({id:props.location.state.id},true,false,i+1)
						})
					}
					color={['#07ab0a', 'darkgrey']}
					icon={['\uf00c', '\uf00d']}
				/>:null
			}
			</Overlay>
			<br />

			<center>
				<h4><b className="fas">{"\uf3d1"}</b>&nbsp;&nbsp;Returnable Advance</h4>
			</center>
			<div className="container">
				<br/>
				<center>
					<h2><b className="fas" style={{ fontSize: 26 }}>{"\uf156"}</b><b>&nbsp;{props.location.state.advance-db.getLess({ id: props.location.state.id })}</b></h2>
				</center>
				<br/>
				{
				db.getLess({ id: props.location.state.id })!==0?
					<div style={{ color: 'darkgrey', fontSize: 14 }}>
						{
							props.location.state.less.map((item, i) => (
								<Fragment>
									<b className="fas" style={{marginRight:'3%'}}>{"\uf06a"}</b>{item.reason}<br/>
								</Fragment>
							)).slice(-2)
						}
						<button type="button" class="btn btn-link" style={{marginLeft:'80%',marginTop:'-8%'}} onClick={() => setadvanceOverlay(true)}>More..</button>
					</div>:null
				}
			</div>
			<br />

			<Overlay visible={advanceOverlay} height={90} bgClick={() =>setadvanceOverlay(false)} >
				<b className="fas" style={{color:'white', fontSize: 20,float:'right'}} onClick={() => setadvanceOverlay(advanceOverlay ? false : true)}>{"\uf00d"}</b>
				<br/>
			{ props.location.state.payment_history!==undefined && db.getLess({ id: props.location.state.id })!==0?
				<VerticalTimelineConditional
					content={
								props.location.state.less.map((item) => {
									return {title:item.reason,
											subtitle:item.amount}
								})
							}
					conditionArray={
						db.getExpectedRent({id:props.location.state.id}).map((e, i) => {
							return db.getRent({id:props.location.state.id},true,false,i+1)
						})
					}
					color={['#07ab0a', 'darkgrey']}
					icon={['\uf00c', '\uf00d']}
				/>:null
			}
			</Overlay>
			<br />
			{props.location.state.renewals &&
				<Fragment>
					<center>
						<h4><b className="fas">{"\uf251"}</b>&nbsp;&nbsp;Renewals</h4>
					</center>
					<div className="container">
						<HorizontalTimeline content={props.location.state.renewals.map((r) => { return { title: moment(r).format("MMM"), subtitle: moment(r).format("YYYY") } })} />
					</div>
				</Fragment>
			}
			<br /><br />
			<Circle color="#006CFF" icon={"\uf067"} style={{ position: 'fixed', bottom: '1%', right: '2%' }} onClick={() => setShowAddPayOverlay(true)}/>
			<Overlay visible={showAddPayOverlay} bgClick={() => resetAddPayOverlay()} height={48}>
				<b className="fas" style={{color:'white', fontSize: 22,float:'right'}} onClick={() => resetAddPayOverlay()}>{"\uf00d"}</b>
				<br/>
				<center>
					<h3 style={{marginLeft:'5%'}}><b>{!editOtherAmount ? `Rent ${nextPayment.month.format("MMMM")}` : "Utilities"} </b></h3>
					<br/><br/>
					<div style={{display:'inline-block', width:'200%', transition:'.2s ease', marginLeft: !editOtherAmount ? '8%' : '-110%', position:'relative', zIndex:10}}>
						<div style={{display:'inline-block', width:'40%'}}>
							<b className="fas" style={{ fontSize: 30,display:'inline-block', color:'white' }}>{"\uf156"}</b>
							<input style={{display:'inline-block'}} type='number' pattern="[0-9]*" defaultValue={nextPayment.amount.housing} ref={register} class="editable-label-input"/>
						</div>
						<div style={{display:'inline-block', marginLeft:'15%', width:'40%'}}>
							<b className="fas" style={{ fontSize: 30,display:'inline-block', color:'white' }}>{"\uf156"}</b>
							<input style={{display:'inline-block'}} type='number' pattern="[0-9]*" defaultValue={nextPayment.amount.others} ref={register} class="editable-label-input"/>
						</div>
					</div>
				</center>
				<b className="fas" onClick={() => setEditOtherAmount(!editOtherAmount)} style={{ color:'white',fontSize: 22, float:'right', marginRight:'5%', marginTop:'-15%', position:'relative', zIndex:15}}>{"\uf1b2"}</b>
				<br/><br/>
				<center><button className="overlay-button" onClick={() => console.log()}>Save</button></center>
			</Overlay>
		</div>
	);
}

export default Details;
