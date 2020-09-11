import React from 'react';
import Main from './Main';
import Details from './Details';
import GenerateInvoice from './GenerateInvoice';
import InvoicesSummary from './InvoicesSummary';
import { Invoice, Adjustment} from './Invoice';
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
            <Route path="/invoice-summary" render={(props) => <InvoicesSummary {...props} />} />
            <Route path="/invoice" render={(props) => <Invoice {...props} />} />
            <Route path="/adjustment" render={(props) => <Adjustment {...props} />} />
         </div>
      </Router>
   );
}

export default App;
