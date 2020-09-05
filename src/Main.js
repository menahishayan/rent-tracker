import Navbar from 'react-bootstrap/Navbar'
import DB from './DB';
import React, { useState, useEffect } from 'react';

function Main(){

   return(
      <div>
         <Navbar bg="primary" variant="dark">
         	<Navbar.Brand className = "mx-auto"><b>Rent</b></Navbar.Brand>
         </Navbar>
      </div>
   )
}

export default Main;
