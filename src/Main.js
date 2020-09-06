import Navbar from 'react-bootstrap/Navbar'
import DB from './DB';
import React, { useState, useEffect } from 'react';
import './Main.css'
import moment from 'moment';

var db = new DB()

function Main(){
   db.refreshCache()

   	// const rentColor = (person) => {
   	// 	db.getRent()?{color:'#07ab0a'}:{color:'#d10000'}
   	// }

   return(
      <div>
         <Navbar bg="primary" variant="dark">
         	<Navbar.Brand className = "mx-auto"><h3><b>Rent</b></h3></Navbar.Brand>
         </Navbar>
         <center><br/>
         <h4><b>Rent - {moment().format("MMMM")}</b></h4>
         <div class="container" >
            {
               db.profiles("86").map((profile,i) => (
                  <div style={{display:'inline'}}>
                     <div className='circle-container'>
                        <div className="circle" style={db.getRent(i,true)?{backgroundColor:'#07ab0a'}:{backgroundColor:'#d10000'}}></div><br/>
                        <p className='name'>{profile.nickname?profile.nickname:profile.name.split(' ')[0]}</p>
                     </div>
                     <br style={i%3===2?{display:'block'}:{display:'none'}}/>
                  </div>
               ))
            }
            <hr style={{backgroundColor:"darkgrey"}}/>
            {
                db.profiles("6").map((profile,i) => (
                  	<div style={{display:'inline'}}>
                    <div className='circle-container'>
                        <div className="circle" style={db.getRent(i,true)?{backgroundColor:'#07ab0a'}:{backgroundColor:'#d10000'}}></div><br/>
						<p className='name'>{profile.nickname?profile.nickname:profile.name.split(' ')[0]}</p>
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
