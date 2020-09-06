import Navbar from 'react-bootstrap/Navbar'
import DB from './DB';
import React, { useState, useEffect } from 'react';
import './Main.css'

var db = new DB()

function Main(){
   db.refreshCache()
   return(
      <div>
         <Navbar bg="primary" variant="dark">
         	<Navbar.Brand className = "mx-auto"><b>Rent</b></Navbar.Brand>
         </Navbar>
         <center>
         <div class="container" >
            {
               Object.keys(db.data).map((id,i) => (
                  <div style={{display:'inline'}}>
                     <div className='circle-container'>
                        <div className="circle"></div><br/>
                        <p className='name'>{db.data[id].profile.nickname?db.data[id].profile.nickname:db.data[id].profile.name.split(' ')[0]}</p>
                     </div>
                     <br style={i%3===2?{display:'block'}:{display:'none'}}/>
                  </div>
               ))
            }
         </div>
         </center>
      </div>
   )
}

export default Main;
