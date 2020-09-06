import React from 'react';
import DB from './DB';

var db = new DB()

function Details (props) {
	return(
		<div>

		   <div class='circle' style={{background:"#5e09b8"}}><b className="fas">{"\uf007"}</b></div>
		   <h4 style={{}}>{props.location.state.profile.name}</h4>

			<div className='container'></div>
		</div>
	);
}

export default Details;
