import React from 'react';
import Main from './Main';
// import Edit from './Edit';
 import Details from './Details';
//import AddUser from './AddUser';
// import AddPay from './AddPay';
import DB from './DB';
import {BrowserRouter as Router, Route}from'react-router-dom';

function App() {
    let db = new DB()
   return (
      <Router>
      <div className="App">
      <Route exact path="/" component={Main}/>
	   <Route path="/Details" render={(props) => <Details {...props} />} />
      {// <Route path="/AddUser" component={AddUser}/>
      // <Route path="/Edit" render={(props) => <Edit {...props} />} />
      // <Route path="/AddPayment" render={(props) => <AddPay {...props} />} />
      }
      </div>
      </Router>
   );
}

export default App;
