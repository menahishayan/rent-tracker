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
      console.log("refresh");
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

   getUser = (index) => {
      if (!index) return this.get()
      else {
         var id = Object.keys(this.data)[index]
         if (!this.data) this.get()
         let ref = firebase.database().ref('/' + id);
         ref.on('value', async (snapshot) => {
            this.data[id] = await snapshot.val()
            localStorage.setItem('rent-db', JSON.stringify(this.data));
            return new Promise((resolve, reject) => {
               setTimeout(() => {
                  if (this.data[id]) resolve(this.data[id])
               }, 200)
            })
         })
      }
   }

   getPersonFromIdentifier = (identifier) => {
      if (!identifier) return false
      var id
      if (identifier.index)
         id = Object.keys(this.data)[identifier.index]
      else if (identifier.id)
         id = identifier.id
      else return false
      if (!this.data) this.get()
      return this.data[id]
   }

   persons = (filter) => {
      if (!this.data) this.get()
      let array = []

      Object.keys(this.data).forEach((id, i) => {
         if (filter) {
            if (id.split("_")[0] === filter)
               array.push(this.data[id])
         } else array.push(this.data[id])
      });

      return array
   }

   profiles = (filter) => {
      if (!this.data) this.get()
      let array = []

      Object.keys(this.data).forEach((id, i) => {
         if (filter) {
            if (id.split("_")[0] === filter)
               array.push(this.data[id].profile)
         } else array.push(this.data[id].profile)
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
         if(Array.isArray(data))
            firebase.database().ref(id + '/' + item).set(data, (error) => {
               console.log(data);
               console.log(error);
               return new Promise((resolve, reject) => {
                  if (error) reject(error);
                  resolve(this.refreshCache(id))
               })
            })
         else 
            firebase.database().ref(id + '/' + item).update(data, (error) => {
               return new Promise((resolve, reject) => {
                  if (error) reject(error);
                  resolve(this.refreshCache(id))
               })
            })
      }
   }

   getExpectedRent = (person, month) => {
      let expectedRent = []

      for (let s = moment(person.startdate); s.isSameOrBefore(moment().add(1,"M")); s.add(1, "M").startOf('month')) {
         if(s.isAfter(moment())) break;
         let year = Math.floor(expectedRent.length / 11)
         let expectedSubTotal = {
            housing: Math.floor(person.base_rent * Math.pow(1.05, year)),
            others: 0
         }
         if (person.invoices)
            person.invoices.forEach((invoice) => {
               if (moment(invoice.date, "YYYY-MM-DD").month() === s.month())
                  invoice.particulars.forEach(item => {
                     expectedSubTotal.others += item.amount
                  });
            });
         let lessForMonth = 0
         // if (person.less) lessForMonth = person.less.find((l) => { return l.month === s.month() + 1 })
         if (lessForMonth)
            expectedSubTotal.housing -= lessForMonth.amount
         if(expectedRent.length+1 === month) return expectedSubTotal
         expectedRent.push(expectedSubTotal)
      }
      return expectedRent
   }

   getDues = (person, returnStatusOnly, getAllItems, month) => {
      let expectedRent = this.getExpectedRent(person)

      let paidRent = [{housing:0,others:0}]
      if(person.payment_history) paidRent = [...person.payment_history]

      let dueTotal = { housing: 0, others: 0 }
      // console.log([person.profile.name,person.payment_history,expectedRent.length]);

      while(paidRent.length !== expectedRent.length) paidRent.push({housing:0,others:0})

      let returnValue = {housing: 0,others:0}
      paidRent.forEach((p, i) => {
         let due_i = {
            housing: expectedRent[i].housing - p.housing,
            others: expectedRent[i].others - p.others
         }
         dueTotal.housing += due_i.housing
         dueTotal.others += due_i.others
         
         if (i === month) returnValue =  due_i
      });

      if(month) dueTotal = returnValue 
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

      let paidRent = [{housing:0,others:0}]
      if(person.payment_history) paidRent = [...person.payment_history]

      while(paidRent.length !== expectedRent.length) paidRent.push({housing:0,others:0})
      // console.log([person.profile.name,person.payment_history,expectedRent.length]);

      return month ? paidRent[month]||{housing: 0,others:0} : paidRent
   }

   getLess = (person,getSum) => {
      var sum = 0, less = []
		this.getExpectedRent(person).forEach((e,i) => {
         let dueForMonth = this.getDues(person,false,false,i+1)
         less.push({
            month:i+1,
            amount: dueForMonth,
            reason: `Rent - ${moment(person.startdate).add(i+1,"M").format("MMM YY")}`
         })
         sum+=dueForMonth
      })
      return getSum ? sum : less
   }

   addUser = (id, data) => {
      if (Object.keys(this.data).find(id))
         return false
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
      if(!profile) return 'undefined'
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
      if(month > paidRent.length)
         paidRent.push(payment)
      else paidRent[month-1] = payment
      return this.updateUser(person.id, "payment_history", paidRent)
   }

   getNextRenewal = (person) => {
      let r = person.renewals
      return moment((r !== undefined && r.length > 0) ? r[r.length - 1] : person.startdate, "YYYY-MM-DD", true).add(11, "M")
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
}

export default DB;
