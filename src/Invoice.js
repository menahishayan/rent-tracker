import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import moment from 'moment';
import DB from './DB';

var db = new DB()

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
    footer: { textAlign:'center', fontSize:8 }
});

function Invoice(props) {
    let invoice = props.location.state.invoice
    let person = props.location.state.person
    let idParts = db.parseId(person.id)
    let address = idParts.building === "86" ? "BTM 4th Stage, 2nd Block,\nVijaya Bank Layout" : "Vinayaka Nagar,\nNyanapanhalli"

    let proDataMultiplier = invoice.prodata.isProdata ? invoice.prodata.days/invoice.prodata.maxDays : 1
    let sum = Math.round(props.location.state.sum*proDataMultiplier,0)

    var a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
    var b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];

    function inWords (num) {
        if ((num = num.toString()).length > 9) return 'overflow';
        let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return; var str = '';
        str += (Number(n[3]) !== 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
        str += (Number(n[4]) !== 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
        str += (Number(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only. ' : '';
        return str;
    }

    return (
        <PDFViewer width="60%" height="700">
            <Document>
                <Page size="A4" style={styles.page}>
                    <Text style={[styles.small, styles.id]}>{invoice.id}</Text>
                    <Text style={styles.h1}>Utilities Invoice{'\n'}</Text>
                    <Text style={styles.small}>{moment(invoice.date).format("Do MMMM, YYYY")}</Text>
                    <View style={styles.small}>
                        <Text>{`\n\n${person.profile.name}\n${idParts.floor === 0 ? 'G' : idParts.floor}0${idParts.door}, #${idParts.building},\n${address}, Bengaluru - 560076\n\n\n`}</Text>
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
                                <View style={styles.tr}>
                                    <View style={[styles.tcol,{width:'5%'}]}>
                                        <Text style={styles.tcell}>{i+1}</Text>
                                    </View>
                                    <View style={[styles.tcol,{width:'70%',justifyContent:'flex-start'}]}>
                                        <Text style={styles.tcell}>{item.item} {invoice.prodata.isProdata ? `\n(Calculated as per prodata basis for ${invoice.prodata.days} days: price*(${invoice.prodata.days}/${invoice.prodata.maxDays}))` : ''}</Text>
                                    </View>
                                    <View style={[styles.tcol,{width:'10%'}]}>
                                        <Text style={styles.tcell}>{item.amount}/-</Text>
                                    </View>
                                    <View style={[styles.tcol,{width:'5%'}]}>
                                        <Text style={styles.tcell}>{item.isPerHead ? invoice.head_count : 1}</Text>
                                    </View>
                                    <View style={[styles.tcol,{width:'10%'}]}>
                                        <Text style={styles.tcell}>{Math.round((item.isPerHead ? invoice.head_count*item.amount : item.amount)*proDataMultiplier,0)}/-</Text>
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
        </PDFViewer>
    )
}

export default Invoice