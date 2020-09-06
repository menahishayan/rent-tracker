import Firebase from 'firebase/app';
import 'firebase/database';
import config from './config';
import moment from 'moment';
import React from 'react';

class DB extends React.Component {
   constructor(props) {
      super(props)
      var data;
      if (!Firebase.apps.length) {
         Firebase.initializeApp(config);
         this.get()
      }
   }

   refreshCache = (id,item) => {
       let path = '/'
       if(this.data) {
           if(id) path+=id
           if(item) path += '/' + item
       }
       let ref = Firebase.database().ref(path);
       ref.on('value', async(snapshot) => {
           if(this.data && id) {
               if(item) this.data[id][item] = await snapshot.val()
               else this.data[id] = await snapshot.val()
           } else this.data = await snapshot.val()
          localStorage.setItem('rent-db', JSON.stringify(this.data));
          return new Promise((resolve, reject) => {
              setTimeout(()=> {
                  if(this.data) resolve(this.data)
              },200)
          })
       })
   }

   get = () => {
      if(!this.data) {
         let cache = localStorage.getItem('rent-db');
         if(cache)
            this.data = JSON.parse(cache)
         else {
             let ref = Firebase.database().ref('/');
			 ref.on('value', async(snapshot) => {
                this.data = await snapshot.val()
                localStorage.setItem('rent-db', JSON.stringify(this.data));
	            return new Promise((resolve, reject) => {
                    setTimeout(()=> {
                        if(this.data) resolve(this.data)
                    },200)
                })
	         })
         }
     }
   }

   getUser = (id) => {
      if(!id) return this.get()
      else {
         if(!this.data) this.get()
         let ref = Firebase.database().ref('/'+id);
			ref.on('value', async(snapshot) => {
                this.data[id] = await snapshot.val()
                localStorage.setItem('rent-db', JSON.stringify(this.data));
	            return new Promise((resolve, reject) => {
                    setTimeout(()=> {
                        if(this.data[id]) resolve(this.data[id])
                    },200)
                })
			})
      }
   }

	persons = () => {
		if(!this.data) this.get()
		let array = []

		for (id in Object.keys(this.data)) array.push(this.data[id])

		return array
	}

	profiles = () => {
		if(!this.data) this.get()
		let array = []

		for (id in Object.keys(this.data)) array.push(this.data[id].profile)

		return array
	}

   updateUser = (id,item,data) => {
      if(id && data){
         Firebase.database().ref(id+item).update(data, (error) => {
            return new Promise((resolve, reject) => {
                if (error) reject(error);
                resolve(this.refreshCache(id))
            })
		})
      }
   }

   getRent = (id,month,returnStatusOnly,getAllItems) => {
      if(!id) return false

      var person=this.state.DB[id]
      let expectedRent = []

      for( let s = moment(person.startdate, "YYYY-MM-DD"); s.isSameOrBefore(moment()); s.add(1,"M")) {
         let year = Math.floor(expectedRent.length/11)
         let expectedSubTotal = {
            housing: person.base_rent*Math.pow(1.05,year),
            others: 0
         }
         if(person.invoices)
            person.invoices.forEach((invoice) => {
               if(moment(invoice.date,"YYYY-MM-DD").month()===s.month())
                  invoice.particulars.forEach(item => {
                     expectedSubTotal.others+=item.amount
                  });
            });
         let lessForMonth = person.less.find((l) => {return l.month === s.month()+1})
         if( lessForMonth )
        	   expectedSubTotal.housing -= lessForMonth.amount
         expectedRent.push(expectedSubTotal)
      }

      let paidRent = person.payment_history || [0]
      let dueTotal={ housing:0, others:0 }

      paidRent.forEach((p, i) => {
         let due_i = {
            housing:p.housing - expectedRent[i].housing,
            others:p.others - expectedRent[i].others
         }
         dueTotal.housing += due_i.housing
         dueTotal.others += due_i.others
         if(i === month)
            if(returnStatusOnly) {
               if(getAllItems)
                  return (due_i.housing===0 && due_i.others===0) ? true : false
               else
                  return (due_i.housing===0) ? true : false
            }
            else
               return (getAllItems) ? due_i : due_i.housing
         else return false
      });

      if(returnStatusOnly) {
         if(getAllItems)
            return (dueTotal.housing===0 && dueTotal.others===0) ? true : false
         else
            return (dueTotal.housing===0) ? true : false
      }
      else
         return (getAllItems) ? dueTotal : dueTotal.housing
   }

   getLess = (id,month) => {
      var less, sum=0, dueForMonth = 0
      less=this.state.DB[id].less
      if (less)
         less.forEach((item, i) => {
            if(less.month===month)
               dueForMonth=item.amount
            sum+=item.Amount
         });
      if(month) return dueForMonth
      return sum
   }

   addUser = (id,data) => {
      if(Object.keys(this.state.DB).find(id))
         return false
      else {
             Firebase.database().ref(id).set(data, (error) => {
                 return new Promise((resolve, reject) => {
                     if (error) reject(error);
                     resolve(this.refreshCache(id))
                 })
            })
      }
   }

   deleteUser = (id,data) => {
      if(!Object.keys(this.state.DB).find(id))
         return true
      else {
         Firebase.database().ref(id).remove().catch((e) => {
            console.log(e);
            return false
         });
      }
   }

   addPay = (id,payment) => {
      var person=this.state.DB[id]
      let paidRent = person.payment_history || []
      paidRent.push(payment)
      return this.updateUser(id,"payment_history",paidRent)
   }
}

export default DB;
