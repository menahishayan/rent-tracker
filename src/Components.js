import React, { Fragment } from 'react';
import './Main.css'
import './Components.css'

export const CircleCondition = props => (
	<div className='circle-container' style={props.style} onClick={props.onClick}>
		<div className={props.small ? "circle-sm" :"circle"} style={props.condition ? { backgroundColor: props.color[0] } : { backgroundColor: props.color[1] }}>
			<center><b className="fas">{props.condition ? props.icon[0] : props.icon[1]}</b></center>
		</div>
		{props.title ? <p style={{ marginTop: 8 }}>{props.title}</p> : null}
	</div>
)

export const Circle = props => (
	<div className='circle-container' style={props.style} onClick={props.onClick}>
		<div className={props.small ? "circle-sm" :"circle"} style={{ backgroundColor: props.color || 'darkgrey' }}>
			<center><b className="fas">{props.icon}</b></center>
		</div>
		<br/>
		{props.title ? <p className='name'>{props.title}</p> : null}
	</div>
)

export const VerticalTimeline = props => (
	<div className="vertical-timeline">
		{
			props.content.map((item, i) => (
				<div key={i} className="vertical-timeline-container">
					<div className="content">
						<h5>{item.title}</h5>
						<p>{item.subtitle}</p>
					</div>
				</div>
			))
		}
	</div>
)

export const HorizontalTimeline = props => (
	<div className="horizontal-timeline" >
		{
			props.content.map((item, i) => (
				<div key={i} className="horizontal-timeline-container">
					<div className="content">
						<h5>{item.title}</h5>
						<p>{item.subtitle}</p>
					</div>
				</div>
			))
		}
	</div>
)

export const HorizontalTimelineConditional = props => (
	<div className="horizontal-timeline" content={'\uf067'} >
		{
			props.content.map((item, i) => (
				<div key={i} className="horizontal-timeline-container">
					<div className="content" >
						<h5>{item.title}</h5>
						<p>{item.subtitle}</p>
						<CircleCondition small
							color={props.color}
							icon={props.icon}
							style={{position: 'relative', top:-70, zIndex:1}}
							condition={props.conditionArray[i]} />
					</div>
				</div>
			))
		}
	</div>
)
export const VerticalTimelineConditional = props => (
	<div className="vertical-timeline" content={'\uf067'} style={{overflow:"scroll",height:'100%'}}>
		{
			props.content.map((item, i) => (
				<div key={i} className="vertical-timeline-container">
					<div className="content" style={{color:'white',width:'130%'}}>
						<h5>{item.title}</h5>
						<p>{item.subtitle}</p>
						<CircleCondition small
							color={props.color}
							icon={props.icon}
							style={{position: 'absolute', top:-78, zIndex:1,marginLeft:'88%'}}
							condition={props.conditionArray[i]} />
					</div>
				</div>
			))
		}
	</div>
)

export const SlidingOverlay = props => (
	<Fragment>
		<div className="overlay" onClick={props.bgClick} style={{opacity:(props.visible===true? 1 : 0), display: (props.visible===true? 'block' : 'none')}}></div>
		<div className="sliding-overlay-container" style={{bottom:`${-props.height+(props.height*(props.visible===true? 1 : 0))}%`, height:`${props.height}%`}}>
			{props.children}
		</div>
	</Fragment>
)

export const Overlay = props => (
	<Fragment>
		<div className="overlay" onClick={props.bgClick} style={{opacity:(props.visible===true? 1 : 0), display: (props.visible===true? 'block' : 'none')}}></div>
		<center>
			<div className="overlay-container">
				{props.children}
			</div>
		</center>
	</Fragment>
)