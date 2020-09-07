import Navbar from 'react-bootstrap/Navbar'
import React, { Fragment, useState } from 'react';
import DB from './DB';
import moment from 'moment';
import { Circle, HorizontalTimeline, HorizontalTimelineConditional,Overlay } from './Components'

var db = new DB()

function Details(props) {
	const [showOverlay,setShowOverlay] = useState(false);
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
					<b className="fas" style={{ display: 'inline-block', width: '10%', marginLeft: '2%', fontSize: '25px', marginTop: '-3%' }}>{"\uf073"}</b>
					<h5 style={{ display: 'inline-block', width: '50%' }}>From</h5>
				</div>
				<h4 style={{ marginTop: '1%' }}><b>{moment(props.location.state.startdate).format("Do MMMM, YYYY")}</b></h4>
			</div>
			<br />

			<center>
				<h4><b className="fas">{"\uf015"}</b>&nbsp;&nbsp;Rent History</h4>
			</center>
			<div className="container">
				<HorizontalTimelineConditional 
					content={
						props.location.state.payment_history.slice(-3).map((p, i) => { 
							return { 
								title: moment(props.location.state.startdate).add(props.location.state.payment_history.length + (i - 3), "M").format("MMM"), 
								subtitle: p.housing 
							}
						})
					} 
					condition={{subtitle:3000}} 
					color={['#07ab0a', 'darkgrey']} 
					icon={['\uf00c', '\uf00d']}
				/>
			</div>
			<br />

			<center>
				<h4><b className="fas">{"\uf071"}</b>&nbsp;&nbsp;Returnable Advance</h4>
			</center>
			<div className="container">
				<center>
					<h2><b className="fas" style={{ fontSize: 26 }}>{"\uf156"}</b><b>&nbsp;{props.location.state.advance-db.getLess({ id: props.location.state.id })}</b></h2>
				</center>
				{db.getRent({ id: props.location.state.id }, false, false, 0)!=='0'}
				<div style={{ color: 'darkgrey', fontSize: 14 }}>
					<b className="fas">{"\uf06a"}</b><br />
				</div>
			</div>
			<br />

			{props.location.state.renewals &&
				<Fragment>
					<center>
						<h4><b className="fas">{"\uf70e"}</b>&nbsp;&nbsp;Renewals</h4>
					</center>
					<div className="container">
						<HorizontalTimeline content={props.location.state.renewals.map((r) => { return { title: moment(r).format("MMM"), subtitle: moment(r).format("YYYY") } })} />
					</div>
				</Fragment>
			}
			<br /><br />
			<Circle color="#006CFF" icon={"\uf067"} style={{ position: 'fixed', bottom: '1%', right: '2%' }} onClick={() => setShowOverlay(true)}/>
			{ showOverlay && <Overlay/> }
		</div>
	);
}

export default Details;
