import Navbar from 'react-bootstrap/Navbar'
import DB from './DB';
import React, { Fragment, useState, useEffect } from 'react';
import './Main.css'
import moment from 'moment';
import { Redirect } from 'react-router';
import { Circle, CircleCondition, Overlay } from './Components'
import ProgressBar from 'react-bootstrap/ProgressBar'

var db = new DB()

function Main() {
	const [redirect, setRedirect] = useState();
	const [redirectProps, setRedirectProps] = useState();
	const [tennantOverlay, setTennantOverlay] = useState(false);
	const [selectedTennant, setSelectedTennant] = useState();

	useEffect(() => {
		db.refreshCache()
	}, [])

	const generateRenewalsList = () => {
		let array = []
		if (db.data)
			db.persons().map((person, i) => (
				db.getNextRenewal(person).isBetween(moment().subtract(1, "M"), moment().add(7, "M"), "M") ?
					array.push({
						i: i,
						name: person.profile.name,
						date: db.getNextRenewal(person).format("Do MMMM, YYYY")
					})
					: null
			))
		return array
	}

	const getNextPayment = (person) => {
		let month = moment().diff(moment(person.startdate).startOf('month'),'months')+1
		if(person.payment_history!==undefined) {
			return {
				i: month-1,
				month: moment().subtract(month - person.payment_history.length-1, "M").startOf('month'),
				amount: db.getExpectedRent(person,month)
			}
		}
		else 
			return {
				i: 0,
				month: moment(person.startdate),
				amount: db.getExpectedRent(person,1)
			}
	}

	const getTotalCollection = () => {
		var sumRent=0 ,sumExpectedRent=0
		db.persons().forEach((person) => {
			let month=getNextPayment(person)
			let paid = db.getPaidRent(person,month.i).housing||0
			sumRent+=paid
			sumExpectedRent+= paid===0 ? db.getExpectedRent(person,month.i+1).housing : paid
		});
		return {current:sumRent,total:sumExpectedRent,percent:(sumRent/sumExpectedRent)*100}
	}

	var totalCollection = getTotalCollection()

	if (redirect)
		return <Redirect push to={{
			pathname: redirect,
			state: redirectProps
		}}
		/>

	return (
		<div>
			<Navbar bg="primary" variant="dark" fixed="top">
				<Navbar.Brand className="mx-auto"><h3><b>Rent</b></h3></Navbar.Brand>
			</Navbar>
			<br /><br /><br /><br />
			<center>
				<h4><b className="fas">{"\uf662"}</b>&nbsp;&nbsp;{moment().format("MMMM")}</h4>
				<div className="container" >
					{
						db.data && db.getBuildings().reverse().map((building, b) => (
							<Fragment key={b}>
								{
									db.persons(building).map((person, i) => (
										<Fragment key={b + i}>
											<CircleCondition title={db.getNickname(person.profile)} condition={getNextPayment(person).month.isAfter(moment())} onClick={() => { setRedirectProps(person); setRedirect('/details'); }} color={['#07ab0a', 'darkgrey']} icon={['\uf00c', '\uf00d']} />
											<br style={i % 3 === 2 ? { display: 'block' } : { display: 'none' }} />
										</Fragment>
									))
								}
								{b !== db.getBuildings().length - 1 ? <hr style={{ marginTop: "-1%", marginBottom: "6%" }} /> : null}
							</Fragment>
						))
					}
				</div>
			</center>
			<br />
			<center>
				<h4><b className="fas">{"\uf4c0"}</b>&nbsp;&nbsp;Collected</h4>
			</center>
			<div className="container">
				<center>
					<br/>
					<h2><b className="fas" style={{ fontSize: 26 }}>{"\uf156"}</b>&nbsp;&nbsp;{totalCollection.current}</h2>
					<ProgressBar now={totalCollection.percent} style={{borderRadius:'25px', margin:'5% 0', width:'95%'}}/>
					<small style={{ display: 'inline-block', width: '40%', color:'darkgrey' }}>out of {totalCollection.total}</small>
				</center>
			<br/>
			</div>
			<br />
			<center>
				<h4><b className="fas">{"\uf1da"}</b>&nbsp;&nbsp;Upcoming Renewals</h4>
			</center>
			<div className="container">
				{
					db.data && generateRenewalsList().map((person, i) => (
						<Fragment key={i}>
							<div style={{ display: 'inline-flex', width: '100%', marginLeft: '2%', cursor: 'pointer' }}>
								<div style={{ display: 'inline-block', width: '20%', marginRight: '8%' }}>
									<Circle color="#5e09b8" icon={"\uf007"} />
								</div>
								<div style={{ display: 'inline-block', width: '80%', marginTop: '1.5%' }}>
									<b>{person.name}</b><br />
									{person.date}
								</div>
							</div>
							{i !== generateRenewalsList().length - 1 ? <hr style={{ marginTop: "-3%" }} /> : null}
						</Fragment>
					))
				}
			</div>
			<br />
			<center>
				<h4><b className="fas">{"\uf0c0"}</b>&nbsp;&nbsp;Tennants</h4>
			</center>
			<div className="container">
				{
					db.data && db.getBuildings().reverse().map((building, b) => (
						<Fragment key={b}>
							{
								db.getFloors(building).map((floor, f) => (
									<Fragment key={f}>
										<div className="floor-label-container">
											<center><b className="floor-label">{floor === 0 ? 'G' : floor}</b></center>
										</div>
										<div className="floor">
											{
												db.getDoors(building, floor).map((door, d) =>
													<div onClick={() => {setSelectedTennant({building,floor,door}); setTennantOverlay(true)}} style={{ width: `${100 / db.getDoors(building, floor).length}%`, backgroundColor: `hsl(${48 - (f + d) * 2}, ${(((f + d + 1) / db.getDoors(building, floor).length) * 80) + 15}%, ${(((f + d) / db.getDoors(building, floor).length) * 13) + 74}%)` }} className="door">
														<center><b className="door-label"><b className="fas">{"\uf52a"}</b>&nbsp;{door}</b><p className="door-subtitle">{db.getNickname(db.data[`${building}_${floor}_${door}`].profile)}</p></center>
													</div>
												)
											}
										</div>
										<br />
									</Fragment>
								))
							}
							{b !== db.getBuildings().length - 1 ? <hr /> : null}
						</Fragment>
					))
				}
			</div>
			<br /><br />
			{	selectedTennant && 
				<Overlay visible={tennantOverlay} bgClick={() => setTennantOverlay(!tennantOverlay)} height={30}>
					<h3><b>{db.data[`${selectedTennant.building}_${selectedTennant.floor}_${selectedTennant.door}`].profile.name}</b></h3>
						{`${selectedTennant.floor === 0 ? 'G' : selectedTennant.floor}0${selectedTennant.door}, #${selectedTennant.building}`}<br/>
						{'Since ' + moment(db.data[`${selectedTennant.building}_${selectedTennant.floor}_${selectedTennant.door}`].startdate).format("Do MMM, YYYY") }<br/>
					<button class="overlay-button-mx" style={{marginTop:'5%',backgroundColor:'#ED0034'}}>Vacate</button>&nbsp;&nbsp;
					<button class="overlay-button-mx" style={{marginTop:'5%',backgroundColor:'#00A4BC'}}>Replace</button>
				</Overlay>
			}
			
			<center>
				<h4><b className="fas">{"\uf543"}</b>&nbsp;&nbsp;Invoices</h4>
			</center>
			<div className="container">
			</div>
			<br /><br />
		</div>
	)
}

export default Main;
