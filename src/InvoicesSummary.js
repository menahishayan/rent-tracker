import React, { Fragment, useState} from 'react';
import moment from 'moment';
import { Header } from './Components';
import { Redirect } from 'react-router';
import { PDFDownloadLink } from '@react-pdf/renderer'
import { Invoice } from './Invoice'

function InvoicesSummary(props) {
    const [redirect, setRedirect] = useState();
	const [redirectProps, setRedirectProps] = useState();

    let invoices = props.location.state || []

    if (redirect) return <Redirect from={props.location.pathname} exact to={{ pathname: redirect, state: redirectProps }} />
    return (
        <div>
            <Header />
            {
                // Title
            }
            <center>
                <h3><b className="fas">{"\uf543"}</b><b>&nbsp;&nbsp;Summary</b></h3>
                <small style={{ display: 'inline-block', color: 'darkgrey' }}>{`${moment(invoices[0].invoice.billing_start,"YYYY-MM").format("MMMM, YYYY")} to ${moment(invoices[0].invoice.billing_end,"YYYY-MM").format("MMMM, YYYY")}`}</small>
            </center>
            <br />
            {
                // Containers
            }
            {
                invoices.map((item,i) =>
                    <PDFDownloadLink document={<Invoice {...item} />} fileName={`${item.person.profile.name} ${moment().format("YYYY-MM-DD")}.pdf`} key={i} style={{textDecoration: 'none',color:'black'}}>
                        {({ blob, url, loading, error }) => (loading ? <Fragment></Fragment> : 
                            <div className='container' style={{cursor:'pointer'}} onClick={() => {setRedirectProps(item); setRedirect('/invoice')}}>
                                <div style={{ display: 'inline-flex', width: '100%' }}>
                                    <b className="fas" style={{ display: 'inline-block', width: '10%', margin: '-1% 1% 2% 3%', fontSize: '40px', color:'#0e8587', textDecoration: 'none' }}>{"\uf570"}</b>
                                    <div style={{ marginLeft: '5%' }}><small style={{ display: 'inline-block', textDecoration: 'none', color:'darkgrey' }}>{item.person.profile.name}</small>
                                        <h4 style={{ marginTop: '-1%', textDecoration: 'none', color:'black' }}><b className="fas" style={{ fontSize: 20, textDecoration: 'none', color:'black' }}>{"\uf156"}</b>&nbsp;<b>{item.invoice.sum}</b></h4></div>
                                </div>
                            </div>
                        )}
                    </PDFDownloadLink>
                )
            }
            <br/><br />
            <center>
            <button className="overlay-button" style={{backgroundColor:'#006CFF', color:'white', width:'90%'}} onClick={() => setRedirect('/')}>Done</button>
            </center>
            <br /><br />
        </div>
    )
}

export default InvoicesSummary;
