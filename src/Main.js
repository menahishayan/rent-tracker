import Navbar from 'react-bootstrap/Navbar'
import DB from './DB';
import React, { Fragment, useState, useEffect } from 'react';
import './Main.css'
import moment from 'moment';
import { Redirect } from 'react-router';
import { Circle, CircleCondition } from './Components'
import Popover from 'react-bootstrap/Popover'
import PopoverContent from 'react-bootstrap/PopoverContent'
import PopoverTitle from 'react-bootstrap/PopoverTitle'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Button from 'react-bootstrap/Button'
var db = new DB()

function Main() {
	const [redirect, setRedirect] = useState();
	const [redirectProps, setRedirectProps] = useState();
	useEffect(() => {
		db.refreshCache()
	}, [])





	const generateRenewalsList = () => {
		let array = []
		if (db.data)
			db.persons().map((person, i) => (
				db.getNextRenewal(i).isBetween(moment().subtract(1, "M"), moment().add(7, "M"), "M") ?
					array.push({
						i: i,
						name: person.profile.name,
						date: db.getNextRenewal(i).format("Do MMMM, YYYY")
					})
					: null
			))
		return array
	}

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
											<CircleCondition title={db.getNickname(person.profile)} condition={db.getRent({ index: i }, true)} onClick={() => { setRedirectProps(person); setRedirect('/details'); }} color={['#07ab0a', 'darkgrey']} icon={['\uf00c', '\uf00d']} />
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
												<OverlayTrigger  trigger="click" key={d}
													overlay={
														<Popover id={`popover-positioned-top`}>
															<Popover.Title as="h3"><center><b>{db.data[`${building}_${floor}_${door}`].profile.name}</b></center></Popover.Title>
												  			<Popover.Content style={{fontSize:18}}>
																<center>
																	<small>
																		{`${floor === 0 ? 'G' : floor}0${door}, #${building}`}<br/>
																		{'Since ' + moment(db.data[`${building}_${floor}_${door}`].startdate).format("Do MMM, YYYY") }<br/>
																	</small>
																</center>
																<Button variant="danger" style={{marginTop:'2%'}}>Vacate</Button>&nbsp;&nbsp;
																<Button variant="info" style={{marginTop:'2%'}}>Replace</Button>
															</Popover.Content>
														</Popover>
													}
												>
													<div  style={{ width: `${100 / db.getDoors(building, floor).length}%`, backgroundColor: `hsl(${48 - (f + d) * 2}, ${(((f + d + 1) / db.getDoors(building, floor).length) * 80) + 15}%, ${(((f + d) / db.getDoors(building, floor).length) * 13) + 74}%)` }} className="door">
														<center><b className="door-label"><b className="fas">{"\uf52a"}</b>&nbsp;{door}</b><p className="door-subtitle">{db.getNickname(db.data[`${building}_${floor}_${door}`].profile)}</p></center>
													</div>
												</OverlayTrigger>
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
			<center>
				<h4><b className="fas">{"\uf1da"}</b>&nbsp;&nbsp;Invoice</h4>
			</center>
			<div className="container">
			</div>
		</div>
	)
}

export default Main;
