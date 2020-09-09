import React from 'react';
import Main from './Main';
import Details from './Details';
import GenerateInvoice from './GenerateInvoice';
import AddPerson from './AddPerson';
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
   return (
      <Router>
         <div className="App">
            <Route exact path="/" component={Main} />
            <Route path="/details" render={(props) => <Details {...props} />} />
            <Route path="/add-person" render={(props) => <AddPerson {...props} />} />
            <Route path="/generate-invoice" render={(props) => <GenerateInvoice {...props} />} />
         </div>
      </Router>
   );
}

export default App;
