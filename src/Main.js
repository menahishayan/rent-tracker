import DB from './DB';
import React, { Fragment, useState, useEffect } from 'react';
import './Main.css'
import moment from 'moment';
import { Redirect } from 'react-router';
import { Circle, CircleCondition, Overlay, SlidingOverlay, Header } from './Components'
import ProgressBar from 'react-bootstrap/ProgressBar'
import { useForm } from 'react-hook-form'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { Adjustment } from './Invoice'

var db = new DB()

function Main(props) {
	const [redirect, setRedirect] = useState();
	const [redirectProps, setRedirectProps] = useState();
	const [tennantOverlay, setTennantOverlay] = useState(false);
	const [selectedTennant, setSelectedTennant] = useState();
	const [ebOverlay, setEBOverlay] = useState(false);
	const { register, getValues, handleSubmit } = useForm();
	const [editOtherAmount, setEditOtherAmount] = useState(0);
	const [vacateOverlay, setVacateOverlay] = useState(false);

	const [invoiceProps, setInvoiceProps] = useState();
	const [settleDownloadOverlay, setSettleDownloadOverlay] = useState(false);

	useEffect(() => {
		db.refreshCache()
	}, [])

	const generateRenewalsList = () => {
		let array = []
		if (db.data)
			db.persons().map((person, i) => (
				db.getNextRenewal(person).date.isBetween(moment().subtract(1, "M"), moment().add(7, "M"), "M") ?
					array.push({
						i: i,
						name: person.profile.name,
						date: db.getNextRenewal(person).date.format("Do MMMM, YYYY"),
						increase:db.getNextRenewal(person).increase
					})
					: null
			))
		return array
	}

	const getNextPayment = (person) => {
		let month = moment().diff(moment(person.startdate).startOf('month'), 'months') + 1
		if (person.payment_history !== undefined) {
			return {
				i: month - 1,
				month: moment().subtract(month - person.payment_history.length - 1, "M").startOf('month'),
				amount: db.getExpectedRent(person, month)
			}
		}
		else
			return {
				i: 0,
				month: moment(person.startdate),
				amount: db.getExpectedRent(person, 1)
			}
	}

	const getTotalCollection = () => {
		var sumRent = 0, sumExpectedRent = 0
		db.persons().forEach((person) => {
			let month = getNextPayment(person)
			let paid = db.getPaidRent(person, month.i).housing || 0
			sumRent += paid
			sumExpectedRent += paid === 0 ? db.getExpectedRent(person, month.i + 1).housing : paid
		});
		return { current: sumRent, total: sumExpectedRent, percent: (sumRent / sumExpectedRent) * 100 }
	}

	var totalCollection = getTotalCollection()

	const resetEBOverlay = () => {
		setEBOverlay(false)
		setEditOtherAmount(0)
	}

	if (redirect) return <Redirect push to={{ pathname: redirect, state: redirectProps }} />
	return (
		<div>
			<Header />
			<center>
				<h4><b className="fas">{"\uf662"}</b>&nbsp;&nbsp;{moment().format("MMMM")}</h4>
				<div className="container" >
					{
						db.data && db.getBuildings().reverse().map((building, b) => (
							<Fragment key={b}>
								{
									db.persons(building).filter(p => !p.isEmpty).map((person, i) => (
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
					<br />
					<h2><b className="fas" style={{ fontSize: 26 }}>{"\uf156"}</b>&nbsp;&nbsp;{totalCollection.current}</h2>
					<ProgressBar now={totalCollection.percent} style={{ borderRadius: '25px', margin: '5% 0', width: '95%' }} />
					<small style={{ display: 'inline-block', width: '40%', color: 'darkgrey' }}>out of {totalCollection.total}</small>
				</center>
				<br />
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
													!db.data[`${building}_${floor}_${door}`].isEmpty ?
													<div key={d} onClick={() => { setSelectedTennant({ building, floor, door }); setTennantOverlay(true) }} style={{ width: `${100 / db.getDoors(building, floor).length}%`, backgroundColor: `hsl(${48 - (f + d) * 2}, ${(((f + d + 1) / db.getDoors(building, floor).length) * 80) + 15}%, ${(((f + d) / db.getDoors(building, floor).length) * 13) + 74}%)` }} className="door">
														<center><b className="door-label"><b className="fas">{"\uf52a"}</b></b><p className="door-subtitle">{db.getNickname(db.data[`${building}_${floor}_${door}`].profile)}</p></center>
													</div> :
													<div key={d} onClick={() => { setRedirectProps(`${building}_${floor}_${door}`);setRedirect('/add-person'); }} style={{ width: `${100 / db.getDoors(building, floor).length}%`, backgroundColor: 'lightgrey' }} className="door">
														<center><b className="door-label" style={{color:'#777'}}><b className="fas">{"\uf52a"}</b></b><p className="door-subtitle" style={{color:'#777'}}>Empty</p></center>
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
			{selectedTennant &&
				<Overlay visible={tennantOverlay} bgClick={() => setTennantOverlay(!tennantOverlay)} height={25}>
					<h3><b>{db.data[`${selectedTennant.building}_${selectedTennant.floor}_${selectedTennant.door}`].profile.name}</b></h3>
					{`${selectedTennant.floor === 0 ? 'G' : selectedTennant.floor}0${selectedTennant.door}, #${selectedTennant.building}`}<br />
					{'Since ' + moment(db.data[`${selectedTennant.building}_${selectedTennant.floor}_${selectedTennant.door}`].startdate).format("Do MMM, YYYY")}<br />
					<button className="overlay-button-mx" style={{ marginTop: '5%', backgroundColor: '#ED0034' }} onClick={() => setVacateOverlay(true)}>Vacate</button>
				</Overlay>
			}

			<center>
				<h4><b className="fas">{"\uf543"}</b>&nbsp;&nbsp;Invoices</h4>
			</center>
			<div className="container">
				<center>
					<button className="overlay-button-mx" style={{ marginTop: '5%', backgroundColor: '#006CFF' }} onClick={() => setEBOverlay(true)}>Create New</button>
					<br /><br />
				</center>
			</div>
			<SlidingOverlay visible={ebOverlay} bgClick={() => resetEBOverlay()} height={48}>
				<b className="fas" style={{ fontSize: 22, float: 'right' }} onClick={() => resetEBOverlay()}>{"\uf00d"}</b>
				<br />
				<form onSubmit={handleSubmit((d) => {setRedirectProps(d); setRedirect('/generate-invoice')})}>
				<center>
					<div style={{ display: 'inline-block', width: '420%', transition: '.2s ease', marginLeft: `${-2 - (editOtherAmount * 104)}%`, position: 'relative', zIndex: 10 }}>
						<div style={{ display: 'inline-block', width: '20%' }}>
							<h3><b>Electricity</b></h3>
							<p style={{ marginTop: '-2%' }}>Stairs & Pump</p>
							<br />
							<b className="fas" style={{ fontSize: 30, display: 'inline-block' }}>{"\uf156"}</b>
							<input name="eb" style={{ display: 'inline-block' }} type='number' pattern="[0-9]*" defaultValue={850} ref={register} className="editable-label-input" />
						</div>
						<div style={{ display: 'inline-block', marginLeft: '5%', width: '20%' }}>
							<h3 style={{marginBottom:'-1%'}}><b>Other Charges</b></h3>
							<input name="other1-title" style={{ display: 'inline-block', fontSize:16, fontWeight:'normal' }} defaultValue="Other Expense 1" ref={register} className="editable-label-input" />
							<br /><br/><br/>
							<b className="fas" style={{ fontSize: 30, display: 'inline-block' }}>{"\uf156"}</b>
							<input name="other1-amount" style={{ display: 'inline-block' }} type='number' pattern="[0-9]*" defaultValue={0} ref={register} className="editable-label-input" />
						</div>
						<div style={{ display: 'inline-block', marginLeft: '5%', width: '20%' }}>
							<h3 style={{marginBottom:'-1%'}}><b>Other Charges</b></h3>
							<input name="other2-title" style={{ display: 'inline-block', fontSize:16, fontWeight:'normal' }} defaultValue="Other Expense 2" ref={register} className="editable-label-input" />
							<br /><br/><br/>
							<b className="fas" style={{ fontSize: 30, display: 'inline-block' }}>{"\uf156"}</b>
							<input name="other2-amount" style={{ display: 'inline-block' }} type='number' pattern="[0-9]*" defaultValue={0} ref={register} className="editable-label-input" />
						</div>
						<div style={{ display: 'inline-block', marginLeft: '5%', width: '20%' }}>
							<h3 style={{marginBottom:'-1%'}}><b>Other Charges</b></h3>
							<input name="other3-title" style={{ display: 'inline-block', fontSize:16, fontWeight:'normal' }} defaultValue="Other Expense 3" ref={register} className="editable-label-input" />
							<br /><br/><br/>
							<b className="fas" style={{ fontSize: 30, display: 'inline-block' }}>{"\uf156"}</b>
							<input name="other3-amount" style={{ display: 'inline-block' }} type='number' pattern="[0-9]*" defaultValue={0} ref={register} className="editable-label-input" />
						</div>
					</div>
				</center>
				<b className="fas" onClick={() => setEditOtherAmount(editOtherAmount === 3 ? 0 : editOtherAmount + 1)} style={{ fontSize: 22, float: 'right', marginRight: '5%', marginTop: '-15%', position: 'relative', zIndex: 15 }}>{"\uf1b2"}</b>
				<br />
				<center>
					<button className="overlay-button" style={{ marginTop: '5%', color: '#006CFF' }} type="submit">Next</button>
				</center>
				</form>
			</SlidingOverlay>
			{
				// Vacate Overlay
			}
			<Overlay visible={vacateOverlay} bgClick={() => setVacateOverlay(!vacateOverlay)} height={25}>
				<h3><b>Vacating Date</b></h3>
				<input name="vacate-date" className="editable-label-input" type="date" style={{backgroundColor:'white',color:'black',fontSize:16}} defaultValue={moment().endOf('month').format("YYYY-MM-DD")} ref={register}/>
				{ !settleDownloadOverlay ?
				<button className="overlay-button-mx" style={{ marginTop: '5%', backgroundColor: '#00A4BC' }} onClick={() => { setInvoiceProps({person:db.data[`${selectedTennant.building}_${selectedTennant.floor}_${selectedTennant.door}`],end:getValues('vacate-date'), type: 'settlement', less: db.getLess(db.data[`${selectedTennant.building}_${selectedTennant.floor}_${selectedTennant.door}`]), lessTotal: db.getLess(db.data[`${selectedTennant.building}_${selectedTennant.floor}_${selectedTennant.door}`],true)}); setSettleDownloadOverlay(true)}}>Settle</button>
				: <PDFDownloadLink document={<Adjustment {...invoiceProps} />} fileName={`${db.data[`${selectedTennant.building}_${selectedTennant.floor}_${selectedTennant.door}`].profile.name} Settlement.pdf`} style={{textDecoration: 'none',color:'black'}}>
                        {({ blob, url, loading, error }) => (loading ? <Fragment></Fragment> :
							<button className="overlay-button-mx" style={{ marginTop: '5%', backgroundColor: '#00A4BC' }}>Settlement</button>
                        )}
				</PDFDownloadLink>
				}
				<button className="overlay-button-mx" style={{ marginTop: '5%', backgroundColor: '#ED0034' }} onClick={() => {db.updateUser(`${selectedTennant.building}_${selectedTennant.floor}_${selectedTennant.door}`,'',{isEmpty:true}); db.refreshCache(); setRedirect('/')}}>Vacate</button>
			</Overlay>
			<br /><br />
		</div>
	)
}

export default Main;
