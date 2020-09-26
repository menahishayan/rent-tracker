import firebase from 'firebase/app';
import 'firebase/database';
import config from './config';
import moment from 'moment';
import React from 'react';

class DB extends React.Component {
   constructor(props) {
      super(props)
      // eslint-disable-next-line no-unused-vars
      var data;
      if (!firebase.apps.length) {
         firebase.initializeApp(config);
         this.get()
      }
   }

   refreshCache = (id, item) => {
      let path = '/'
      if (this.data) {
         if (id) path += id
         if (item) path += '/' + item
      }
      let ref = firebase.database().ref(path);
      ref.on('value', async (snapshot) => {
         if (this.data && id) {
            if (item) this.data[id][item] = await snapshot.val()
            else this.data[id] = await snapshot.val()
         } else this.data = await snapshot.val()
         localStorage.setItem('rent-db', JSON.stringify(this.data));
         return new Promise((resolve, reject) => {
            setTimeout(() => {
               if (this.data) resolve(this.data)
            }, 200)
         })
      })
   }

   get = () => {
      if (!this.data) {
         let cache = localStorage.getItem('rent-db');
         if (cache)
            this.data = JSON.parse(cache)
         else {
            let ref = firebase.database().ref('/');
            ref.on('value', async (snapshot) => {
               this.data = await snapshot.val()
               localStorage.setItem('rent-db', JSON.stringify(this.data));
               return new Promise((resolve, reject) => {
                  setTimeout(() => {
                     if (this.data) resolve(this.data)
                  }, 200)
               })
            })
         }
      }
   }

   persons = (building) => {
    if (!this.data) this.get()
    let array = []
	if (this.data)
	(
	    Object.keys(this.data).forEach(id => {
        if (building) {
            if (id.split("_")[0] === building)
               if (!this.data[id].isEmpty) array.push(this.data[id])
        } else if (!this.data[id].isEmpty) array.push(this.data[id])
      	})
  	)

      return array
   }

   profiles = (building) => {
      if (!this.data) this.get()
      let array = []

      Object.keys(this.data).forEach(id => {
         if (building) {
            if (id.split("_")[0] === building)
               if (!this.data[id].isEmpty) array.push(this.data[id].profile)
         } else if (!this.data[id].isEmpty) array.push(this.data[id].profile)
      });

      return array
   }

   parseId = (id) => {
      if (!this.data) this.get()

      var idParts = id.split("_")

      if (id) {
         if (idParts.length)
            return {
               building: idParts[0],
               floor: parseInt(idParts[1]),
               door: parseInt(idParts[2])
            }
         else return
      }
   }

   updateUser = (id, item, data) => {
      if (id && data) {
         if (Array.isArray(data))
            firebase.database().ref(id + '/' + item).set(data, (error) => {
               return new Promise((resolve, reject) => {
                  if (error) reject(error);
                  resolve(this.refreshCache(id))
               })
            })
         else
            firebase.database().ref(id + '/' + item).once('value').then(snapshot => {
               if (snapshot.val())
                  firebase.database().ref(id + '/' + item).update(data, (error) => {
                     return new Promise((resolve, reject) => {
                        if (error) reject(error);
                        resolve(this.refreshCache(id))
                     })
                  })
               else
                  firebase.database().ref(id + '/' + item).set(data, (error) => {
                     return new Promise((resolve, reject) => {
                        if (error) reject(error);
                        resolve(this.refreshCache(id))
                     })
                  })
            })
      }
   }

   getExpectedRent = (person, month) => {
      let expectedRent = []
	  let increaserentby=0
      for (let s = moment(person.startdate); s.isSameOrBefore(moment().add(1, "M")); s.add(1, "M").startOf('month')) {
        if (s.isAfter(moment())) break;
		if (person.renewals)
		 	increaserentby = person.renewals.slice(-1)[0].increase
		else increaserentby=0
        let year = Math.floor(expectedRent.length / 11)
        let expectedSubTotal = {
            housing: Math.floor(person.base_rent * Math.pow(1+(increaserentby/100), year)),
            others: 0
        }
        if (person.invoices) expectedSubTotal.others += this.getInvoiceSum(person, s.month() - 1)
        let lessForMonth = 0
        // if (person.less) lessForMonth = person.less.find((l) => { return l.month === s.month() + 1 })
        if (lessForMonth)
            expectedSubTotal.housing -= lessForMonth.amount
        if (expectedRent.length + 1 === month) return expectedSubTotal
        expectedRent.push(expectedSubTotal)
      }
      return expectedRent
   }

   getDues = (person, returnStatusOnly, getAllItems, month) => {
      let expectedRent = this.getExpectedRent(person)

      let paidRent = [{ housing: 0, others: 0 }]
      if (person.payment_history) paidRent = [...person.payment_history]

      let dueTotal = { housing: 0, others: 0 }
      // console.log([person.profile.name,person.payment_history,expectedRent.length]);

      while (paidRent.length !== expectedRent.length) paidRent.push({ housing: 0, others: 0 })

      let returnValue = { housing: 0, others: 0 }
      paidRent.forEach((p, i) => {
         let due_i = {
            housing: expectedRent[i].housing - p.housing,
            others: expectedRent[i].others - p.others
         }
         dueTotal.housing += due_i.housing
         dueTotal.others += due_i.others

         if (i === month) returnValue = due_i
      });

      if (month) dueTotal = returnValue
      if (returnStatusOnly) {
         if (getAllItems)
            return (dueTotal.housing === 0 && dueTotal.others === 0) ? true : false
         else
            return (dueTotal.housing === 0) ? true : false
      }
      else
         return (getAllItems) ? dueTotal : dueTotal.housing
   }

   getPaidRent = (person, month) => {
      let expectedRent = this.getExpectedRent(person)

      let paidRent = [{ housing: 0, others: 0 }]
      if (person.payment_history) paidRent = [...person.payment_history]

      while (paidRent.length !== expectedRent.length) paidRent.push({ housing: 0, others: 0 })

      return month ? paidRent[month] || { housing: 0, others: 0 } : paidRent
   }

   getLess = (person, getSum) => {
      var sum = 0
	  let less = person.less || []
	  person.less.forEach((l, i) => {
	  	sum+=l.amount
	  });

      this.getExpectedRent(person).forEach((e, i) => {
         let dueForMonth = this.getDues(person, false, true, i + 1)
         less.push({
            month: i + 1,
            amount: dueForMonth.housing + dueForMonth.others,
            reason: `Rent ${dueForMonth.others > 0 ? '& Utilities ' : ''} - ${moment(person.startdate).add(i + 1, "M").format("MMM YY")}`
         })
         sum += dueForMonth.housing + dueForMonth.others
      })
      return getSum ? sum : less
   }

   addUser = (id, data) => {
      if (!this.data) this.get()
      if (!this.data[id]) return false
      else {
         firebase.database().ref('/' + id).set(data, (error) => {
            return new Promise((resolve, reject) => {
               if (error) reject(error);
               resolve(this.refreshCache(id))
            })
         })
      }
   }

   getNickname = (profile) => {
      if (!profile) return 'undefined'
      return profile.nickname ? profile.nickname : profile.name.split(' ')[0]
   }

   deleteUser = (id, data) => {
      if (!Object.keys(this.data).find(id))
         return true
      else {
         firebase.database().ref(id).remove().catch((e) => {
            console.log(e);
            return false
         });
      }
   }

   addPay = (person, month, payment) => {
      let paidRent = person.payment_history || []
      if (month > paidRent.length)
         paidRent.push(payment)
      else paidRent[month - 1] = payment
      return this.updateUser(person.id, "payment_history", paidRent)
   }

   addLess = (person, month, item) => {
         let less = person.less || []
         if (month > less.length)
            less.push(item)
         else less[month - 1] = item
         this.updateUser(person.id, "less", less)
      }

   getNextRenewal = (person) => {
      let r = person.renewals
	  let date,increase
	  return (r !== undefined && r.length > 0) ? { date: moment(r.slice(-1)[0].date).add(11, "M") ,increase: r.slice(-1)[0].increase} : {  date : moment(person.startdate, "YYYY-MM-DD", true).add(11, "M"), increase : 0 }
	  //return (date===true)?{(r !== undefined && r.length > 0) ?  moment(r[r.length - 1]).add(11, "M") :  moment(person.startdate, "YYYY-MM-DD", true).add(11, "M")}:{(r !== undefined && r.length > 0) ? r.slice(-1)[0].incre:0}
  }

   getBuildings = () => {
      if (!this.data) this.get()
      let array = []
      Object.keys(this.data).forEach((id, i) => {
         array.push(this.parseId(id).building)
      });
      return [...new Set(array)]
   }

   getFloors = (building) => {
      if (!this.data) this.get()
      let array = []
      Object.keys(this.data).forEach((id, i) => {
         if (this.parseId(id).building === building)
            array.push(this.parseId(id).floor)
      });
      return [...new Set(array)].reverse()
   }

   getDoors = (building, floor) => {
      if (!this.data) this.get()
      let array = []
      Object.keys(this.data).forEach((id, i) => {
         if (this.parseId(id).building === building && this.parseId(id).floor === parseInt(floor))
            array.push(this.parseId(id).door)
      });
      return [...new Set(array)]
   }

   generateInvoiceId = (person) => {
      let idParts = this.parseId(person.id)
      let id = `I-${idParts.building.padStart(2, '0')}${idParts.floor}${idParts.door}-${person.profile.mobile.slice(-4)}-${moment().format("YYYYMMDD")}-`

      if (person.invoices) {
         let invoices = person.invoices.filter(i => i.date === moment().format("YYYY-MM-DD"))
         let index = 0, indexString = ''
         do {
            indexString = (++index).toString().padStart(2, '0')
            // eslint-disable-next-line no-loop-func
         } while (invoices.find(i => i.id === id + indexString))
         return id + indexString
      }

      return id + '01'
   }

   addInvoice = (person, invoice) => {
      let invoices = person.invoices || []
      invoices.push(invoice)
      return this.updateUser(person.id, "invoices", invoices)
   }

   getInvoiceSum = (person, month) => {
      let invoices = person.invoices || []
      let sum = 0

      invoices.forEach(invoice => {
         if (month) {
            if (month === moment(invoice.billing_end, "YYYY-MM").month() + 1)
               sum += invoice.sum || 0
         }
         else sum += invoice.sum || 0
      })
      return sum
   }
}

export default DB;
