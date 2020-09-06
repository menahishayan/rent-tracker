import React from 'react';
import './Main.css'
import './Components.css'

export const CircleCondition = props => (
	<div className='circle-container' style={props.style} onClick={props.onClick}>
		<div className="circle" style={props.condition ? {backgroundColor: props.color[0]} : {backgroundColor: props.color[1]}}>
			<center><b className="fas">{props.condition ? props.icon[0] : props.icon[1]}</b></center>
		</div>
		{props.title ? <p style={{marginTop:8}}>{props.title}</p> : null}
	</div>
)

export const Circle = props => (
	<div className='circle-container' style={props.style} onClick={props.onClick}>
		<div className="circle" style={{backgroundColor: props.color || 'darkgrey'}}>
			<center><b className="fas">{props.icon}</b></center>
		</div>
		<br/>
		{props.title ? <p className='name'>{props.title}</p> : null}
	</div>
)

export const Timeline = props => (
	<div className='circle-container' style={props.style} onClick={props.onClick}>
		<div className="circle" style={{backgroundColor: props.color || 'darkgrey'}}>
			<center><b className="fas">{props.icon}</b></center>
		</div>
		<br/>
		{props.title ? <p className='name'>{props.title}</p> : null}
	</div>
)
