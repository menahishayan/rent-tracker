import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import moment from 'moment';
import DB from './DB';

var db = new DB()


var a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
var b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];

const inWords = (num) => {
    if ((num = num.toString()).length > 9) return 'overflow';
    let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (Number(n[3]) !== 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (Number(n[4]) !== 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (Number(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only. ' : '';
    return str;
}

const styles = StyleSheet.create({
    page: { padding: '5%' },
    small: { color: 'darkgrey', fontSize: 10 },
    id: { position: 'absolute', top: '3%', right: '4%' },
    h1: { fontSize: 30, fontWeight: 'bold' },
    table: { display: "table", width: "auto", borderStyle: "solid", borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 },
    tr: { margin: "auto", flexDirection: "row" },
    tcol: { width: "20%", borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 },
    tcell: { margin: "auto", marginTop: 5, fontSize: 10 },
    total: { fontSize:14, fontWeight: 'bold', textAlign:'right'},
    footer: { textAlign:'center', fontSize:8 },
    sign: { fontSize:10, width:'100%',flexDirection: 'row' }
});

export function Invoice(props) {
    if(!props.invoice || !props.person) return null
    let invoice = props.invoice
    let person = props.person
    let idParts = db.parseId(person.id)
    let address = idParts.building === "86" ? "BTM 4th Stage, 2nd Block,\nVijaya Bank Layout" : "Vinayaka Nagar,\nNyanapanhalli"

    let proDataMultiplier = invoice.prodata.isProdata ? invoice.prodata.days/invoice.prodata.maxDays : 1
    let sum = Math.round(invoice.sum*proDataMultiplier,0)

    const getQty = (item) => {
        let qty = 1
        if(item.isPerHead) qty *= invoice.head_count
        if(item.isPerMonth) qty *= invoice.months
        return qty
    }

    return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <Text style={[styles.small, styles.id]}>{invoice.id}</Text>
                    <Text style={styles.h1}>{invoice.type.charAt(0).toUpperCase() + invoice.type.slice(1)} Invoice{'\n'}</Text>
                    <Text style={styles.small}>{moment(invoice.date).format("Do MMMM, YYYY")}</Text>
                    <View style={styles.small}>
                        <Text>{`\n\n${person.profile.name}\n${idParts.floor === 0 ? 'G' : idParts.floor}0${idParts.door}, #${idParts.building},\n${address}, Bengaluru - 560076\n\n\n`}</Text>
                        <Text>{`Billing Period: ${moment(invoice.billing_start,"YYYY-MM").format("MMMM, YYYY")} to ${moment(invoice.billing_end,"YYYY-MM").format("MMMM, YYYY")}\nNo of. heads: ${invoice.head_count}\n\n\n`}</Text>
                    </View>
                    <View style={styles.table}>
                        <View style={styles.tr}>
                            <View style={[styles.tcol,{width:'5%'}]}>
                                <Text style={styles.tcell}>Sl.</Text>
                            </View>
                            <View style={[styles.tcol,{width:'70%'}]}>
                                <Text style={[styles.tcell,{justifyContent:'flex-start'}]}>Particulars</Text>
                            </View>
                            <View style={[styles.tcol,{width:'10%'}]}>
                                <Text style={styles.tcell}>Unit Price (INR)</Text>
                            </View>
                            <View style={[styles.tcol,{width:'5%'}]}>
                                <Text style={styles.tcell}>Qty</Text>
                            </View>
                            <View style={[styles.tcol,{width:'10%'}]}>
                                <Text style={styles.tcell}>Net Price (INR)</Text>
                            </View>
                        </View>
                        {
                            invoice.particulars.map((item, i) =>
                                <View style={styles.tr} key={i}>
                                    <View style={[styles.tcol,{width:'5%'}]}>
                                        <Text style={styles.tcell}>{i+1}</Text>
                                    </View>
                                    <View style={[styles.tcol,{width:'70%',justifyContent:'flex-start'}]}>
                                        <Text style={styles.tcell}>
                                            {item.item} {item.isPerMonth? ` ( x ${invoice.months} months)` : ''} {item.isPerHead ? ` ( x ${invoice.head_count} heads)` : ''}
                                            {invoice.prodata.isProdata ? `\n(Calculated as per prodata basis for ${invoice.prodata.days} days: price*(${invoice.prodata.days}/${invoice.prodata.maxDays}))` : ''}
                                        </Text>
                                    </View>
                                    <View style={[styles.tcol,{width:'10%'}]}>
                                        <Text style={styles.tcell}>{item.amount}/-</Text>
                                    </View>
                                    <View style={[styles.tcol,{width:'5%'}]}>
                                        <Text style={styles.tcell}>{getQty(item)}</Text>
                                    </View>
                                    <View style={[styles.tcol,{width:'10%'}]}>
                                        <Text style={styles.tcell}>{Math.round(item.amount*getQty(item)*proDataMultiplier,0)}/-</Text>
                                    </View>
                                </View>
                            )
                        }
                    </View>
                    <Text style={styles.total}>{'\n\n'}Net Payable: INR. {sum}/-</Text>
                    <Text style={[styles.total,{fontSize:10,position:'relative',top:'-1%'}]}>{'\n'}In Words: Rupees {inWords(sum)}</Text>
                    <View>
                    <Text style={[styles.small,styles.footer]}>{'\n\n\n\n\n\n'}This is a computer generated invoice and does not require signature while being shared electronically.</Text>
                    </View>
                </Page>
            </Document>
    )
}

export function Adjustment(props) {
    if(!props.person) return null

    let person = props.person

    let start = props.start
    let end = props.end

    let type = props.type

    let less = props.less
    let lessTotal = props.lessTotal
    let sum = person.advance - lessTotal
    let rent = db.getExpectedRent(person,person.payment_history.length).housing

    let idParts = db.parseId(person.id)
    let address = idParts.building === "86" ? "BTM 4th Stage, 2nd Block,\nVijaya Bank Layout" : "Vinayaka Nagar,\nNyanapanhalli"

    const finalRent = () => {
        return Math.round(rent * moment(end).date()/moment(end).daysInMonth(),0)
    }

    if(type === 'settlement') {
        less.forEach(l => {
            if(l.reason.includes(moment().format("MMM YY")))
                sum += rent
        })
        sum -= finalRent() + rent
    }

    return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <Text style={styles.h1}>{type.charAt(0).toUpperCase() + type.slice(1)} Invoice{'\n'}</Text>
                    <Text style={styles.small}>{moment().format("Do MMMM, YYYY")}</Text>
                    <View style={styles.small}>
                        <Text>{`\n\n${person.profile.name}\n${idParts.floor === 0 ? 'G' : idParts.floor}0${idParts.door}, #${idParts.building},\n${address}, Bengaluru - 560076\n\n\n`}</Text>
                        <Text>{`${type.charAt(0).toUpperCase() + type.slice(1)} Period: ${type === 'adjustment' ? start : moment(person.startdate).format("Do MMMM, YYYY")} to ${type === 'adjustment' ? end : moment(end).format("Do MMMM, YYYY")}\n\n\n`}</Text>
                    </View>
                    <View style={styles.table}>
                        <View style={styles.tr}>
                            <View style={[styles.tcol,{width:'5%'}]}>
                                <Text style={styles.tcell}>Sl.</Text>
                            </View>
                            <View style={[styles.tcol,{width:'65%'}]}>
                                <Text style={[styles.tcell,{justifyContent:'flex-start'}]}>Particulars</Text>
                            </View>
                            <View style={[styles.tcol,{width:'15%'}]}>
                                <Text style={styles.tcell}>Credit (INR)</Text>
                            </View>
                            <View style={[styles.tcol,{width:'15%'}]}>
                                <Text style={styles.tcell}>Debit (INR)</Text>
                            </View>
                        </View>
                        <View style={styles.tr}>
                            <View style={[styles.tcol,{width:'5%'}]}>
                                <Text style={styles.tcell}>1</Text>
                            </View>
                            <View style={[styles.tcol,{width:'65%',justifyContent:'flex-start'}]}>
                                <Text style={styles.tcell}>Security Deposit</Text>
                            </View>
                            <View style={[styles.tcol,{width:'15%'}]}>
                                <Text style={styles.tcell}>{person.advance}/-</Text>
                            </View>
                            <View style={[styles.tcol,{width:'15%'}]}>
                                <Text style={styles.tcell}></Text>
                            </View>
                        </View>
                        {
                            less.filter(l => l.amount!==0 && !l.reason.includes(moment().format("MMM YY"))).map((item, i) =>
                                <View style={styles.tr} key={i}>
                                    <View style={[styles.tcol,{width:'5%'}]}>
                                        <Text style={styles.tcell}>{i+2}</Text>
                                    </View>
                                    <View style={[styles.tcol,{width:'65%',justifyContent:'flex-start'}]}>
                                        <Text style={styles.tcell}>Less: {item.reason}</Text>
                                    </View>
                                    <View style={[styles.tcol,{width:'15%'}]}>
                                        <Text style={styles.tcell}></Text>
                                    </View>
                                    <View style={[styles.tcol,{width:'15%'}]}>
                                        <Text style={styles.tcell}>{item.amount}/-</Text>
                                    </View>
                                </View>
                            )
                        }
                        {
                            type === 'settlement' &&
                                <View style={styles.tr}>
                                    <View style={[styles.tcol,{width:'5%'}]}>
                                        <Text style={styles.tcell}>{less.filter(l => l.amount!==0).length+2}</Text>
                                    </View>
                                    <View style={[styles.tcol,{width:'65%',justifyContent:'flex-start'}]}>
                                        <Text style={styles.tcell}>Less: Rent for {moment(end).format('MMM YYYY')}{'\n'}(Calculated as per prodata basis for {moment(end).date()} days: x {moment(end).date()}/{moment(end).daysInMonth()})</Text>
                                    </View>
                                    <View style={[styles.tcol,{width:'15%'}]}>
                                        <Text style={styles.tcell}></Text>
                                    </View>
                                    <View style={[styles.tcol,{width:'15%'}]}>
                                        <Text style={styles.tcell}>{finalRent()}/-</Text>
                                    </View>
                                </View>
                        }
                        {
                            type === 'settlement' &&
                                <View style={styles.tr}>
                                    <View style={[styles.tcol,{width:'5%'}]}>
                                        <Text style={styles.tcell}>{less.filter(l => l.amount!==0).length+3}</Text>
                                    </View>
                                    <View style={[styles.tcol,{width:'65%',justifyContent:'flex-start'}]}>
                                        <Text style={styles.tcell}>Less: Painting (One month rent)</Text>
                                    </View>
                                    <View style={[styles.tcol,{width:'15%'}]}>
                                        <Text style={styles.tcell}></Text>
                                    </View>
                                    <View style={[styles.tcol,{width:'15%'}]}>
                                        <Text style={styles.tcell}>{rent}/-</Text>
                                    </View>
                                </View>
                        }
                    </View>
                    <Text style={styles.total}>{'\n\n'}Net {sum >= 0 ? 'Receivable' : 'Payable'}: INR. {sum >= 0 ? sum : -sum}/-</Text>
                    <Text style={[styles.total,{fontSize:10,position:'relative',top:'-1%'}]}>{'\n'}In Words: Rupees {inWords(sum >= 0 ? sum : -sum)}</Text>
                    {
                        type === 'settlement' &&
                        <View><Text>{'\n\n\n'}</Text>
                        <View style={[styles.sign]}>
                            <Text style={{width:'50%', flexGrow: 1, textAlign:'left', paddingLeft:'5%'}}>R. Maqsood</Text>
                            <Text style={{width:'50%', flexGrow: 1, textAlign:'right', float:'right', paddingRight:'8%'}}>{person.profile.name}</Text>
                        </View>
                        </View>
                    }
                    
                    <View>
                    {type !== 'settlement' && <Text style={[styles.small,styles.footer]}>{'\n\n\n\n\n\n'}This is a computer generated invoice and does not require signature while being shared electronically.</Text>}
                    </View>
                </Page>
            </Document>
    )
}

// export default Invoice