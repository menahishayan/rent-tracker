import React from 'react';
import DB from './DB';

var db = new DB()

function Details (props) {
	return(
		<div>
			<div className='circle' style={{backgroundColor:'darkgrey'}}>
				<center><i className="fa fa-user"></i></center>
			</div>
			<h3><b>{props.location.state.profile.name}</b></h3>
			<div className='container'></div>
		</div>
	);
}

export default Details;
