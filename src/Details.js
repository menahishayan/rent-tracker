import React, { Fragment, useState, useEffect } from 'react';
import { Redirect, useHistory } from 'react-router';
import DB from './DB';
import moment from 'moment';
import { useForm } from 'react-hook-form'
import { Circle, Header, HorizontalTimeline,VerticalTimelineConditional,VerticalTimeline, HorizontalTimelineConditional,SlidingOverlay, Overlay } from './Components'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { Invoice, Adjustment } from './Invoice'
import Button from 'react-bootstrap/Button'
import './Details.css'

var db = new DB()

function Details(props) {
	const [redirect, setRedirect] = useState();
	const [redirectProps, setRedirectProps] = useState();
	const [showAddPayOverlay,setShowAddPayOverlay] = useState(false);
	const [showAddLessOverlay,setShowAddLessOverlay] = useState(false);
	const [showHistoryOverlay,setShowHistoryOverlay] = useState(false);
	const [showAdvanceOverlay,setShowAdvanceOverlay] = useState(false);
	const [editOtherAmount,setEditOtherAmount] = useState(false);
	const [showMonthPicker,setShowMonthPicker] = useState(false);
	const [adjustmentOverlay,setAdjustmentOverlay] = useState(false);
	const [availableMonths,setAvailableMonths] = useState([]);
	const { register, getValues, setValue } = useForm();
	const [invoiceProps, setInvoiceProps] = useState();
	const [invoiceOverlay, setInvoiceOverlay] = useState(false);
	const [less,setLess] = useState()

	const person = props.location.state
	const idParts = db.parseId(person.id)
	const phoneNumber = person.profile.mobile

	const getNextPayment = () => {
		if(person.payment_history!==undefined) {
			return {
				i: person.payment_history.length,
				month: moment(person.startdate).add(person.payment_history.length,"M").startOf('month'),
				amount: db.getExpectedRent(person,person.payment_history.length)
			}
		}
		else return {
			i: 0,
			month: moment(person.startdate),
			amount: db.getExpectedRent(person,1)
		}
	}

	const resetAddPayOverlay = () => {
		setShowAddPayOverlay(false)
		setEditOtherAmount(false)
	}

	const resetAddLessOverlay = () => {
		setShowAddLessOverlay(false)
	}

	var nextPayment = getNextPayment()
	const [selectedMonth,setSelectedMonth] = useState(nextPayment);

	const getAvailableMonths = () => {
		setAvailableMonths(db.getExpectedRent(person))
		setShowMonthPicker(!showMonthPicker)
	}

	const paidRent = db.getPaidRent(person)

//	const less = db.getLess(person), lessTotal =  db.getLess(person,true)

	const history = useHistory()

	useEffect(() => {
		if(!less)
			setLess({items:db.getLess(person),total:db.getLess(person,true)})

	});
	//if (redirect === 'refresh') return <Redirect push from="/" to={{ pathname: '/details', state: props.location.state }} />
	return (
		<div>
			<Header />
			{
				// Profile Header
			}
			<div style={{ display: 'inline-flex', width: '95%', marginLeft: '2%', cursor: 'pointer' }}>
				<div style={{ display: 'inline-block', width: '20%', marginRight: '8%' }}>
					<Circle color="#5e09b8" icon={"\uf007"} style={{ marginLeft: '50%' }} />
				</div>
				<div style={{ display: 'inline-block', width: '80%', marginTop: '1%', marginLeft: '5%' }}>
					<h3 style={{marginBottom:'-2%'}}>{person.profile.name}</h3>
					<small style={{ display: 'inline-block', width: '40%', color:'darkgrey' }}>{`${idParts.floor === 0 ? 'G' : idParts.floor}0${idParts.door}, #${idParts.building}`}</small><br/>
				</div>
			</div>
			{
				// Start Date Container
			}
			<div className='container'>
				<div style={{ display: 'inline-flex', width: '100%' }}>
					<b className="fas" style={{ display: 'inline-block', width: '10%', margin: '-1% 1% 2% 3%', fontSize: '40px', color:'#f03050' }}>{"\uf073"}</b>
					<div style={{marginLeft:'5%'}}><small style={{ display: 'inline-block', width: '40%', color:'darkgrey' }}>Since</small>
					<h4 style={{marginTop:'-1%'}}><b>{moment(person.startdate).format("Do MMMM, YYYY")}</b></h4></div>
				</div>
			</div>
			<br />
			{
				// Payment History Container
			}
			<center>
				<h4><b className="fas">{"\uf1da"}</b>&nbsp;&nbsp;Rent History</h4>
			</center>
			<div className="container" onClick={() => setShowHistoryOverlay(true)}>
			{ person.payment_history!==undefined ?
				<HorizontalTimelineConditional
					content={
						paidRent.map((p, i) => {
							return {
								title: moment(person.startdate).add(i, "M").format("MMM"),
								subtitle: p.housing
							}
						}).slice(-3)
					}
					conditionArray={ paidRent.map(p => p.housing!==0).slice(-3) }
					color={['#07ab0a', 'darkgrey']}
					icon={['\uf00c', '\uf00d']}
				/>:null
			}
			</div>
			<br/>
			{
				//phone overlay
			}
			<center>
				<h4><b className="fas">{"\uf2a0"}</b>&nbsp;&nbsp;Contact</h4>
			<div className="container">
					<a href={"https://api.whatsapp.com/send?phone=+91" + phoneNumber}>
						<Button className='contact' style={{backgroundColor:'#07ab0a'}}><b className="fas" style={{fontSize:26}}>{"\uf086"}</b></Button>&nbsp;&nbsp;
					</a>
  		  		<Button className='contact' style={{backgroundColor:'#5e09b8'}} onClick={ () =>  window.location.href = 'tel://' + phoneNumber}><b className="fas" style={{fontSize:26}}>{"\uf879"}</b></Button>
			</div>
			</center>

			{
				// Payment History Overlay
			}
			<SlidingOverlay visible={showHistoryOverlay} height={85} bgClick={() =>setShowHistoryOverlay(false)} >
				<b className="fas" style={{fontSize: 20,float:'right'}} onClick={() => setShowHistoryOverlay(showHistoryOverlay ? false : true)}>{"\uf00d"}</b>
				<br/>
				{ person.payment_history!==undefined?
					<VerticalTimelineConditional
						content={
							paidRent.map((p, i) => {
								return {
									title: moment(person.startdate).add(i, "M").format("MMM YY"),
									subtitle: <div><b className="fas">{"\uf015"}</b> {p.housing}&nbsp;&nbsp;&nbsp;&nbsp;<b className="fas">{"\uf1b2"}</b> {p.others}</div>
								}
							})
						}
						conditionArray={ paidRent.map(p => p.housing!==0) }
						color={['#07ab0a', 'darkgrey']}
						icon={['\uf00c', '\uf00d']}
					/>:null
				}
			</SlidingOverlay>
			<br />
			{
				// Less Advance Container
			}
			<center>
				<h4><b className="fas">{"\uf3d1"}</b>&nbsp;&nbsp;Returnable Advance</h4>
			</center>
			{less && <div className="container" >
				<br/>
				<center>
					<h2><b className="fas" style={{ fontSize: 26 }}>{"\uf156"}</b><b>&nbsp;{person.advance-(less.total)}</b></h2>
				</center>
				<br/>
					<div style={{ color: 'darkgrey', fontSize: 14 }}>
						{
							less.items.filter(l => l.amount!==0).map((item, i) => (
								<Fragment key={i}>
									<b className="fas" style={{marginRight:'3%'}}>{"\uf06a"}</b>{item.reason}<br/>
								</Fragment>
							)).slice(-2).reverse()
						}
						<div style={{display:'inline-flex',width:'120%'}}>
							<button className="btn btn-link" style={{display:'inline-block',margin:'-2% 0 0 -4%'}} onClick={() => setShowAdvanceOverlay(true)}><small>{less.items.filter(l => l.amount!==0).length} more..</small></button>
							<Circle small icon={"\uf067"} style={{display:'inline-block',marginLeft:'60%'}} onClick={() => setShowAddLessOverlay(true)}/>
						</div>
					</div>
			</div>
			}
			<br />
			{
				// Less Advance Overlay
			}
			{ less && <SlidingOverlay visible={showAdvanceOverlay} height={85} bgClick={() =>setShowAdvanceOverlay(false)} >
				<b className="fas" style={{fontSize: 20,float:'right'}} onClick={() => setShowAdvanceOverlay(showAdvanceOverlay ? false : true)}>{"\uf00d"}</b>
				<br/>
				<VerticalTimeline
					content={ less.items.filter(l => l.amount!==0).map((item) => {return {title:item.reason, subtitle:-item.amount}}) }
				/>
			</SlidingOverlay>
			}
			{
				// Add less Overlay
			}
			<SlidingOverlay visible={showAddLessOverlay} bgClick={() => setShowAddLessOverlay(false)} height={48}>
				<b className="fas" style={{ fontSize: 22, float: 'right' }}  onClick={() => setShowAddLessOverlay(false)}>{"\uf00d"}</b>
				<center>
				<h3>
					<b><span onClick={() => getAvailableMonths()}>{`${selectedMonth.month.format("MMMM")}`}</span></b>
				</h3>
				<br/>
				<div style={{ display: 'inline-block', width: '100%' }}>
					<h3 style={{marginBottom:'-1%'}}><b>Less Charges</b></h3>
					<input name="lessCharges" style={{ display: 'inline-block', fontSize:16, fontWeight:'normal' }} defaultValue="Other Expense " ref={register} className="editable-label-input" />
					<br/><br/><br/>
					<b className="fas" style={{ fontSize: 30, display: 'inline-block' }}>{"\uf156"}</b>
					<input name="lessCharges-amount" style={{ display: 'inline-block' }} type='number' pattern="[0-9]*" defaultValue={0} ref={register} className="editable-label-input" />
				</div>
				<button className="overlay-button" style={{ marginTop: '5%', color: '#006CFF' }} type="submit" onClick={() => {db.addLess(person,selectedMonth.i+1,{reason:getValues("lessCharges"), month:selectedMonth.i+1, amount:parseInt(getValues("lessCharges-amount"))}) ; setShowAddLessOverlay(false);history.go(-1)}}>Save</button>
				</center>
			</SlidingOverlay>

			{
				// Renewals Container
			}
			<center>
				<h4><b className="fas">{"\uf251"}</b>&nbsp;&nbsp;Renewals</h4>
			</center>
			<div className="container">
				<HorizontalTimeline content={[...person.renewals||[], db.getNextRenewal(person)].map((r) => { return { title: moment(r.date).format("MMM"), subtitle: moment(r.date).format("YYYY") } })} />
			<center>
			<button className="btn btn-link" onClick={() => setAdjustmentOverlay(true)}>Adjust Advance</button>
			</center>
			</div>
			<br />
			{
				// Invoices Container
			}
			<center>
				<h4><b className="fas">{"\uf543"}</b>&nbsp;&nbsp;Invoices</h4>
			</center>
			<div className="container">
			{ person.invoices!==undefined ?
				<HorizontalTimeline
					content={
						person.invoices.map((invoice, i) => {
							return {
								title: moment(invoice.billing_end,"YYYY-MM").format("MMM"),
								subtitle: invoice.sum,
								onClick: () => {setInvoiceProps({person: person, invoice: invoice}); setInvoiceOverlay(true)}
							}
						}).slice(-3)
					}
				/>:null
			}
			</div>
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
					<div style={{display:'inline-block', width:'210%', transition:'.2s ease', marginLeft: !editOtherAmount ? '4%' : '-115%', position:'relative', zIndex:10}}>
						<div style={{display:'inline-block', width:'45%'}}>
							<b className="fas" style={{ fontSize: 30,display:'inline-block' }}>{"\uf156"}</b>
							<input name="housing-payment" style={{display:'inline-block'}} type='number' pattern="[0-9]*" defaultValue={selectedMonth.amount.housing} ref={register} className="editable-label-input"/>
						</div>
						<div style={{display:'inline-block', marginLeft:'10%', width:'45%'}}>
							<b className="fas" style={{ fontSize: 30,display:'inline-block' }}>{"\uf156"}</b>
							<input name="other-payment" style={{display:'inline-block'}} type='number' pattern="[0-9]*" defaultValue={selectedMonth.amount.others} ref={register} className="editable-label-input"/>
						</div>
					</div>
				</center>
				<b className="fas" onClick={() => setEditOtherAmount(!editOtherAmount)} style={{ fontSize: 22, float:'right', marginRight:'5%', marginTop:'-15%', position:'relative', zIndex:15}}>{"\uf1b2"}</b>
				<br/><br/>
				<center><button className="overlay-button" onClick={() => {db.addPay(person,selectedMonth.i+1,{housing:parseInt(getValues("housing-payment")), others:parseInt(getValues("other-payment"))}); resetAddPayOverlay()}} style={{color:'#006CFF'}}>Save</button></center>
			</SlidingOverlay>
			{
				// Date Picker Overlay
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
			{
				// Adjustment Overlay
				//[person.startdate,...person.renewals].map((r,ri) => (
					//console.log(moment(r).format("MMM YY"))
					//console.log(ri === person.renewals.length ? moment().format("MMM YY") : moment(person.renewals[ri].date).format("MMM YY"))
			//	))
			}
			<Overlay visible={adjustmentOverlay} bgClick={() => setAdjustmentOverlay(!adjustmentOverlay)} height={25}>
				<div style={{display:'inline-block', width: '100%', overflow:'scroll'}}>
				{	less && person.renewals ?
					[{date:person.startdate},...person.renewals].map((r,ri) => (
						<Fragment key={ri}>
								<button className="overlay-button-mx-light" key={ri}
									onClick={() => {
											setInvoiceProps({person: person, type:'adjustment', less:less.items, lessTotal:less.total, start: moment(r.date).format("MMMM YYYY"), end: ri === person.renewals.length ? moment().format("MMMM YYYY") : moment(person.renewals[ri].date).format("MMMM YYYY")})
											setInvoiceOverlay(true)
									}}>
									{moment(r.date).format("MMM YY")} - {ri === person.renewals.length ? moment().format("MMM YY") : moment(person.renewals[ri].date).format("MMM YY")}
								</button>
							<br/>
						</Fragment>
					)) : <button className="overlay-button-mx-light" style={{margin:'2% 1%'}}
							onClick={() => {
								setInvoiceProps({person: person, type:'adjustment', less:less.items, lessTotal:less.total, start: moment(person.startdate).format("MMMM YYYY"), end: moment().format("MMMM YYYY")})
								setInvoiceOverlay(true)
							}}>
							{moment(person.startdate).format("MMM YY")} - {moment().format("MMM YY")}
						</button>
				}
				</div>

			</Overlay>
			{
				// Invoice Overlay
			}
			{ invoiceOverlay &&
				<Overlay visible={invoiceOverlay} bgClick={() => setInvoiceOverlay(!invoiceOverlay)} height={25}>
					<div style={{display:'inline-block', width: '100%', overflow:'scroll'}}>
					<h3><b>{invoiceProps.type === 'adjustment' ? 'Adjustment Invoice' : 'Utilities Invoice'}</b></h3>
					{invoiceProps.type === 'adjustment' ? `${invoiceProps.start} - ${invoiceProps.end}` : `${moment(invoiceProps.invoice.billing_start,"YYYY-MM").format("MMMM, YYYY")} - ${moment(invoiceProps.invoice.billing_end,"YYYY-MM").format("MMMM, YYYY")}`}
					<PDFDownloadLink document={invoiceProps.type === 'adjustment' ? <Adjustment {...invoiceProps} /> : <Invoice {...invoiceProps} />} fileName={`${person.profile.name} ${invoiceProps.type === 'adjustment' ? 'Adjustment ' : ''}${moment().format("YYYY-MM-DD")}.pdf`} style={{textDecoration: 'none',color:'black'}}>
							{({ blob, url, loading, error }) => (loading ? <Fragment></Fragment> :
								<button className="overlay-button-mx" style={{ marginTop: '5%', backgroundColor: '#00A4BC' }}>Download</button>
							)}
					</PDFDownloadLink>
					</div>
				</Overlay>
			}
		</div>
	);
}

export default Details;
