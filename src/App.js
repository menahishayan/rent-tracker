import React from 'react';
import Main from './Main';
// import Edit from './Edit';
import Details from './Details';
import GenerateInvoice from './GenerateInvoice';
//import AddUser from './AddUser';
import addUser from './addUser';
// import AddPay from './AddPay';
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
   return (
      <Router>
         <div className="App">
            <Route exact path="/" component={Main} />
            <Route path="/details" render={(props) => <Details {...props} />} />
            {// <Route path="/AddUser" component={AddUser}/>
               // <Route path="/Edit" render={(props) => <Edit {...props} />} />
             <Route path="/addUser" component={addUser}/>
              { // <Route path="/Edit" render={(props) => <Edit {...props} />} />
               // <Route path="/AddPayment" render={(props) => <AddPay {...props} />} />
            }
            <Route path="/generate-invoice" render={(props) => <GenerateInvoice {...props} />} />
         </div>
      </Router>
   );
}

export default App;
