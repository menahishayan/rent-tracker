import Firebase from 'firebase/app';
import 'firebase/database';
import config from './config';
import moment from 'moment';
import React from 'react';

class DB extends React.Component {
   constructor(props) {
      super(props)
      // eslint-disable-next-line no-unused-vars
      var data;
      if (!Firebase.apps.length) {
         Firebase.initializeApp(config);
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
      let ref = Firebase.database().ref(path);
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
            let ref = Firebase.database().ref('/');
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
         let ref = Firebase.database().ref('/' + id);
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
         Firebase.database().ref(id + item).update(data, (error) => {
            return new Promise((resolve, reject) => {
               if (error) reject(error);
               resolve(this.refreshCache(id))
            })
         })
      }
   }

   getRent = (identifier, returnStatusOnly, getAllItems, month) => {
      if (!identifier) return false

      var person, id
      if (identifier.index)
         id = Object.keys(this.data)[identifier.index]
      else if (identifier.id)
         id = identifier.id
      else return false
      if (!this.data) this.get()
      person = this.data[id]
      let expectedRent = []

      for (let s = moment(person.startdate); s.isSameOrBefore(moment().add(1,"M")); s.add(1, "M").startOf('month')) {
         if(s.isAfter(moment())) break;
         let year = Math.floor(expectedRent.length / 11)
         let expectedSubTotal = {
            housing: person.base_rent * Math.pow(1.05, year),
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
         expectedRent.push(expectedSubTotal)
      }

      let paidRent = [{housing:0,others:0}]
      if(person.payment_history)
         paidRent = [...person.payment_history]
      let dueTotal = { housing: 0, others: 0 }

      console.log([person.profile.name,person.payment_history,expectedRent.length]);

      while(paidRent.length !== expectedRent.length)
         paidRent.push({housing:0,others:0})

      let returnValue
      paidRent.forEach((p, i) => {
         let due_i = {
            housing: expectedRent[i].housing - p.housing,
            others: expectedRent[i].others - p.others
         }
         dueTotal.housing += due_i.housing
         dueTotal.others += due_i.others
         // if(i > 23 ){
         // console.log(expectedRent[i].housing);
         // console.log(due_i.housing);}
         if (i === month) {
            console.log([i,due_i.housing]);
            if (returnStatusOnly) {
               if (getAllItems)
                  returnValue = (due_i.housing === 0 && due_i.others === 0) ? true : false
               else
                  returnValue = (due_i.housing === 0) ? true : false
            }
            else
               returnValue =  (getAllItems) ? due_i : due_i.housing
         }
      });

      if(!month) {
         if (returnStatusOnly) {
            if (getAllItems)
               return (dueTotal.housing === 0 && dueTotal.others === 0) ? true : false
            else
               return (dueTotal.housing === 0) ? true : false
         }
         else
            return (getAllItems) ? dueTotal : dueTotal.housing
      } else return returnValue 
   }

   getLess = (identifier, month) => {
      if (!identifier) return false
      var person, id
      if (identifier.index)
         id = Object.keys(this.data)[identifier.index]
      else if (identifier.id)
         id = identifier.id
      else return false
      if (!this.data) this.get()
      person = this.data[id]

      var sum = 0, dueForMonth = 0
      if (person.less)
         person.less.forEach((item, i) => {
            if (person.less.month === month)
               dueForMonth = item.amount
            sum += item.amount
         });
      if (month) return dueForMonth
      return sum
   }

   addUser = (id, data) => {
      if (Object.keys(this.data).find(id))
         return false
      else {
         Firebase.database().ref('/' + id).set(data, (error) => {
            return new Promise((resolve, reject) => {
               if (error) reject(error);
               resolve(this.refreshCache(id))
            })
         })
      }
   }

   getNickname = (profile) => {
      return profile.nickname ? profile.nickname : profile.name.split(' ')[0]
   }

   deleteUser = (id, data) => {
      if (!Object.keys(this.data).find(id))
         return true
      else {
         Firebase.database().ref(id).remove().catch((e) => {
            console.log(e);
            return false
         });
      }
   }

   addPay = (index, payment) => {
      var id = Object.keys(this.data)[index]
      var person = this.data[id]
      let paidRent = person.payment_history || []
      paidRent.push(payment)
      return this.updateUser(id, "payment_history", paidRent)
   }

   getNextRenewal = (index) => {
      var id = Object.keys(this.data)[index]
      var person = this.data[id]

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
