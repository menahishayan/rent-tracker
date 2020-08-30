import React from 'react';

class DB extends React.Component {
   constructor(props) {
      super(props)
      this.state = {
         data:undefined,
         getStatus:false,
      };

      if (!Firebase.apps.length) {
         Firebase.initializeApp(config);
         this.getData()
      }
   }
   getData = () => {
      if(!this.state.data) {
         let ref = Firebase.database().ref('/');
         ref.on('value', snapshot => {
            this.setState({ data: snapshot.val()});
            this.setState({ getStatus: true});
            return true
         }).catch((e) => {
            console.log(e);
            this.setState({ getStatus: false});
            return false
         })
      } else {
         this.setState({ getStatus: true});
         return true
      }

   }

   getUserData = (id) => {
      if(id.length<1) this.getData()
      else if(this.state.getStatus){
         let ref = Firebase.database().ref('/'+id);
         ref.on('value', snapshot => {
            let data=this.state.data
            data[id]=snapshot.val()
            this.setState({ data: data});
            this.setState({ getStatus: true});
            return true
         }).catch((e) => {
            console.log(e);
            this.setState({ getStatus: false});
            return false

         })
      }
   }
   setUserData = (id,item,data) => {
      if(id.length>0 && item.length>0 && data.length>0){
         let success = false;
         Firebase.database().ref(id+item).update(data, (error) => {
            if (error) console.error(error);
            else {
               if(!this.getUserData(id)) return false
               else return true
            }
         }).catch((e) => {
            console.log(e);
            return false
         });
      }
   }

   checkRent = (id,month,status) => {
      var person=this.state.DB[id]

      this.getWavier(id)
   }

   getWaiver = (id,month) => {
      var waivers, sum=0, monthVal = 0
      waivers=this.state.DB[id]["Waiver"]
      if (waivers)
         waivers.forEach((item, i) => {
            if(moment(item.Date,"YYYY-MM-DD").month()=== month)
               monthVal = item.Amount
            sum+=item.Amount
         });
      if(month) return monthVal
      return sum
   }

   getDeduction = () => {
      
   }
}
