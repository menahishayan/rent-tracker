'use strict';

const fs = require('fs');

fs.readFile('db_v1.json', (err, data) => {
    if (err) throw err;
    var db1 = JSON.parse(data);
	var db2 = {}

	var ids = Object.keys(db1)

	ids.forEach(id => {
		let v1 = db1[id]
		db2[id] = {
			profile: {
				acc_id: v1.acc_id,
				id_proof: v1.id_proof,
				mr_code: v1.mr_code,
				mobile: v1.mobile,
				name: v1.name,
				rr_no: v1.rr_no,
				head_count: parseInt(v1.head_count),
			},
			advance: v1.advance,
			base_rent: parseInt(v1.base_rent),
			startdate: v1.startdate,
			payment_history: [],
			renewals: [],
			less: [],
			invoices: []
		}

		if(v1.payment_history)
		v1.payment_history.forEach(pay1 => {
			db2[id].payment_history.push({
				housing: pay1.amount,
				others: pay1.others || 0
			})
		});

		if(v1.renewal)
		v1.renewal.forEach(ren1 => {
			let dateParts = ren1.date.split('/')
			let newDate = new Date(`20${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`)
			db2[id].renewals.push(newDate.toISOString().split('T')[0])
		});

		if(v1.Waiver)
		v1.Waiver.forEach(w1 => {
			let dateParts = w1.date.split('/')
			let newDate = new Date(`20${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`)

			db2[id].less.push({
				amount: w1.amount,
				month: parseInt(w1.date.split('/')[0]),
				reason: (w1.reason == 'Reduce Advance') ? `Rent - ${newDate.toLocaleString('default', { month: 'long' })} ${newDate.getYear()}`: w1.reason
			})
		});
	})

	fs.writeFile('db_v2.json', JSON.stringify(db2), (err) => {
	    if (err) throw err;
	});
});
