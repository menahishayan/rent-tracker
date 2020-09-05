import Navbar from 'react-bootstrap/Navbar'
import React from 'react';
import DB from './DB';

function Main (){
   return(
      <div>
         <Navbar bg="primary" variant="dark">
         <Navbar.Brand className = "mx-auto"><b>Rent</b></Navbar.Brand>
         </Navbar>
      </div>
   )
}

export default Main;
