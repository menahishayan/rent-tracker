import Navbar from 'react-bootstrap/Navbar'
import DB from './DB';
import React, { useState, useEffect } from 'react';

var db = new DB()

function Main(){
   console.log(db.data["6_1_1"]);
   return(
      <div>
         <Navbar bg="primary" variant="dark">
         	<Navbar.Brand className = "mx-auto"><b>Rent</b></Navbar.Brand>
         </Navbar>
      </div>
   )
}

export default Main;
