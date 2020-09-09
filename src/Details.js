import Navbar from 'react-bootstrap/Navbar'
import React, { Fragment, useState } from 'react';
import DB from './DB';
import moment from 'moment';
import { useForm } from 'react-hook-form'
import { Circle, HorizontalTimeline,VerticalTimelineConditional,VerticalTimeline, HorizontalTimelineConditional,SlidingOverlay, Overlay } from './Components'

var db = new DB()

function Details(props) {
	const [showAddPayOverlay,setShowAddPayOverlay] = useState(false);
	const [showHistoryOverlay,setShowHistoryOverlay] = useState(false);
	const [showAdvanceOverlay,setShowAdvanceOverlay] = useState(false);
	const [editOtherAmount,setEditOtherAmount] = useState(false);
	const [showMonthPicker,setShowMonthPicker] = useState(false);
	const [availableMonths,setAvailableMonths] = useState([]);
	const { register, getValues, setValue } = useForm();

	const person = props.location.state
	const idParts = db.parseId(person.id)

	const getNextPayment = () => {
		// let month = moment().diff(moment(person.startdate).startOf('month'),'months')+1
		if(person.payment_history!==undefined) {
			// return {
			// 	i: month-1,
			// 	month: moment().subtract(month - person.payment_history.length-1, "M").startOf('month'),
			// 	amount: db.getExpectedRent({id:person.id},month)
			// }
			return {
				i: person.payment_history.length-1,
				month: moment(person.startdate).add(person.payment_history.length-1,"M").startOf('month'),
				amount: db.getExpectedRent({id:person.id},person.payment_history.length-1)
			}
		}
		else return moment(person.startdate)
	}

	const resetAddPayOverlay = () => {
		setShowAddPayOverlay(false)
		setEditOtherAmount(false)
	}

	var nextPayment = getNextPayment()
	const [selectedMonth,setSelectedMonth] = useState(nextPayment);


	const getAvailableMonths = () => {
		setAvailableMonths(db.getExpectedRent({id:person.id}))
		setShowMonthPicker(!showMonthPicker)
	}

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
					<h3>{person.profile.name}</h3>
					{`${idParts.floor === 0 ? 'G' : idParts.floor}0${idParts.door}, #${idParts.building}`}<br/>
				</div>
			</div>
			<div className='container'>
				<div style={{ display: 'inline-flex', width: '100%' }}>
					<b className="fas" style={{ display: 'inline-block', width: '10%', margin: '-1% 1% 2% 3%', fontSize: '40px', color:'#f03050' }}>{"\uf073"}</b>
					<div style={{marginLeft:'5%'}}><small style={{ display: 'inline-block', width: '40%', color:'darkgrey' }}>Since</small>
				<h4 style={{marginTop:'-1%'}}><b>{moment(person.startdate).format("Do MMMM, YYYY")}</b></h4></div>
				</div>
			</div>
			<br />

			<center>
				<h4><b className="fas">{"\uf1da"}</b>&nbsp;&nbsp;Rent History</h4>
			</center>
			<div className="container" onClick={() => setShowHistoryOverlay(true)}>
			{ person.payment_history!==undefined?
				<HorizontalTimelineConditional
					content={
						db.getExpectedRent({id:person.id}).map((e, i) => {
							return {
								title: moment(person.startdate).add(i, "M").format("MMM"),
								subtitle: (db.getRent({id:person.id},true,false,i+1)) ? e.housing : 0
							}
						}).slice(-3)
					}
					conditionArray={
						db.getExpectedRent({id:person.id}).map((e, i) => {
							return person.payment_history[i]||0
						}).slice(-3)
					}
					color={['#07ab0a', 'darkgrey']}
					icon={['\uf00c', '\uf00d']}
				/>:null
			}
			</div>

			<SlidingOverlay visible={showHistoryOverlay} height={90} bgClick={() =>setShowHistoryOverlay(false)} >
				<b className="fas" style={{fontSize: 20,float:'right'}} onClick={() => setShowHistoryOverlay(showHistoryOverlay ? false : true)}>{"\uf00d"}</b>
				<br/>
			{ person.payment_history!==undefined?
				<VerticalTimelineConditional
					content={
						db.getExpectedRent({id:person.id}).map((e, i) => {
							return {
								title: moment(person.startdate).add(i, "M").format("MMM YYYY"),
								subtitle: (db.getRent({id:person.id},true,false,i+1)) ? e.housing : 0
							}
						})
					}
					conditionArray={
						db.getExpectedRent({id:person.id}).map((e, i) => {
							return person.payment_history[i]||0
							
						})
					}
					color={['#07ab0a', 'darkgrey']}
					icon={['\uf00c', '\uf00d']}
				/>:null
			}
			</SlidingOverlay>
			<br />

			<center>
				<h4><b className="fas">{"\uf3d1"}</b>&nbsp;&nbsp;Returnable Advance</h4>
			</center>
			<div className="container">
				<br/>
				<center>
					<h2><b className="fas" style={{ fontSize: 26 }}>{"\uf156"}</b><b>&nbsp;{person.advance-db.getLess({ id: person.id })}</b></h2>
				</center>
				<br/>
				{
				db.getLess({ id: person.id })!==0?
					<div style={{ color: 'darkgrey', fontSize: 14 }}>
						{
							person.less.map((item, i) => (
								<Fragment>
									<b className="fas" style={{marginRight:'3%'}}>{"\uf06a"}</b>{item.reason}<br/>
								</Fragment>
							)).slice(-2)
						}
						<button type="button" className="btn btn-link" style={{marginLeft:'80%',marginTop:'-8%'}} onClick={() => setShowAdvanceOverlay(true)}>More..</button>
					</div>:null
				}
			</div>
			<br />
			{
				// Less Advance Overlay
			}
			<SlidingOverlay visible={showAdvanceOverlay} height={90} bgClick={() =>setShowAdvanceOverlay(false)} >
				<b className="fas" style={{fontSize: 20,float:'right'}} onClick={() => setShowAdvanceOverlay(showAdvanceOverlay ? false : true)}>{"\uf00d"}</b>
				<br/>
			{ person.payment_history!==undefined && db.getLess({ id: person.id })!==0?
				<VerticalTimeline
					content={ person.less.map((item) => { return {title:item.reason, subtitle:item.amount}}) }
				/>:null
			}
			</SlidingOverlay>
			<br />
			{
				// Renewals Container
			}
			{person.renewals &&
				<Fragment>
					<center>
						<h4><b className="fas">{"\uf251"}</b>&nbsp;&nbsp;Renewals</h4>
					</center>
					<div className="container">
						<HorizontalTimeline content={person.renewals.map((r) => { return { title: moment(r).format("MMM"), subtitle: moment(r).format("YYYY") } })} />
					</div>
				</Fragment>
			}
			<br /><br />
			{
				// Add Pay Floating Button
			}
			<Circle color="#006CFF" icon={"\uf067"} style={{ position: 'fixed', bottom: '1%', right: '2%' }} onClick={() => setShowAddPayOverlay(true)}/>
			{
				// Add Pay Overlay
			}
			<SlidingOverlay visible={showAddPayOverlay} bgClick={() => resetAddPayOverlay()} height={48}>
				<b className="fas" style={{ fontSize: 22,float:'right'}} onClick={() => resetAddPayOverlay()}>{"\uf00d"}</b>
				<br/>
				<center>
					<h3 style={{marginLeft:'5%'}}>
						<b>
							{!editOtherAmount ?
								<span onClick={() => getAvailableMonths()}>{`Rent ${selectedMonth.month.format("MMMM")}`}</span>
								: "Utilities"
							}
						</b>
					</h3>
					<br/><br/>
					<div style={{display:'inline-block', width:'200%', transition:'.2s ease', marginLeft: !editOtherAmount ? '8%' : '-110%', position:'relative', zIndex:10}}>
						<div style={{display:'inline-block', width:'40%'}}>
							<b className="fas" style={{ fontSize: 30,display:'inline-block' }}>{"\uf156"}</b>
							<input name="housing-payment" style={{display:'inline-block'}} type='number' pattern="[0-9]*" defaultValue={selectedMonth.amount.housing} ref={register} className="editable-label-input"/>
						</div>
						<div style={{display:'inline-block', marginLeft:'15%', width:'40%'}}>
							<b className="fas" style={{ fontSize: 30,display:'inline-block' }}>{"\uf156"}</b>
							<input name="other-payment" style={{display:'inline-block'}} type='number' pattern="[0-9]*" defaultValue={selectedMonth.amount.others} ref={register} className="editable-label-input"/>
						</div>
					</div>
				</center>
				<b className="fas" onClick={() => setEditOtherAmount(!editOtherAmount)} style={{ fontSize: 22, float:'right', marginRight:'5%', marginTop:'-15%', position:'relative', zIndex:15}}>{"\uf1b2"}</b>
				<br/><br/>
				<center><button className="overlay-button" onClick={() => console.log(selectedMonth.i,getValues(["housing-payment", "other-payment"]))} style={{color:'#006CFF'}}>Save</button></center>
			</SlidingOverlay>
			{
				// Date Picker Bootstrap Overlay
			}
			<Overlay visible={showMonthPicker} bgClick={() => setShowMonthPicker(!showMonthPicker)} height={40}>
				<div style={{display:'inline-block', width: '100%', overflow:'scroll'}}>
				{	availableMonths.length > 0 &&
					availableMonths.map((a,ai) => (
						<Fragment key={ai}>
							{ moment(person.startdate).add(ai,"M").startOf('month').isSame(selectedMonth.month,'month') ?
								<button className="overlay-button-mx" key={ai} style={{margin:'2% 1%'}}
									onClick={() => {
										setSelectedMonth({i: ai,month: moment(person.startdate).add(ai,"M").startOf('month'), amount:a});
										setValue("housing-payment", selectedMonth.amount.housing);
										setValue("other-payment", selectedMonth.amount.others);
										setShowMonthPicker(false);
									}}>
									{moment(person.startdate).add(ai,"M").format("MMM YY")}
								</button>
								:
								<span className="overlay-button-mx-light" key={ai}
									onClick={() => {
										setSelectedMonth({i: ai,month: moment(person.startdate).add(ai,"M").startOf('month'), amount:a});
										setValue("housing-payment", selectedMonth.amount.housing);
										setValue("other-payment", selectedMonth.amount.others);
										setShowMonthPicker(false);
									}}>
										{moment(person.startdate).add(ai,"M").format("MMM YY")}
								</span>
							}
							{ ai%3===2 ? <br/> : null }
						</Fragment>
					))
				}
				</div>
			</Overlay>
		</div>
	);
}

export default Details;
