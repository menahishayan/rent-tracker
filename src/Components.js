import React, { Fragment } from 'react';
import './Main.css'
import './Components.css'

export const CircleCondition = props => (
	<div className='circle-container' style={props.style} onClick={props.onClick}>
		<div className={props.small ? "circle-sm" :"circle"} style={props.condition ? { backgroundColor: props.color[0] } : { backgroundColor: props.color[1] }}>
			<center><b className="fas">{props.condition ? props.icon[0] : props.icon[1]}</b></center>
		</div>
		{props.title ? <p style={props.titleStyle || {}}>{props.title}</p> : null}
	</div>
)

export const Circle = props => (
	<div className='circle-container' style={props.style} onClick={props.onClick}>
		<div className={props.small ? "circle-sm" :"circle"} style={{ backgroundColor: props.invert ? 'white': props.color || 'darkgrey' }}>
			<center><b className="fas" style={{ color: !props.invert ? 'white': props.color}}>{props.icon}</b></center>
		</div>
		<br/>
		{props.title ? <p style={props.titleStyle || {}}>{props.title}</p> : null}
	</div>
)

export const VerticalTimeline = props => (
	<div style={{overflow:"scroll",height:'100%'}}>
		<div className="vertical-timeline" content={'\uf067'} style={{height:`${17*props.content.length}%`}}>
		{
			props.content.map((item, i) => (
				<div key={i} className="vertical-timeline-container">
					<div className="content">
						<h5>{item.title}</h5>
						<div style={{marginBottom:'5%'}}>{item.subtitle}</div>
					</div>
				</div>
			))
		}
		</div>
	</div>
)

export const HorizontalTimeline = props => (
	<div className="horizontal-timeline" >
		{
			props.content.map((item, i) => (
				<div key={i} className="horizontal-timeline-container" onClick={item.onClick} style={{cursor: item.onClick ? 'pointer' : 'default'}}>
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
	<div style={{overflow:"scroll",height:'100%'}}>
		<div className="vertical-timeline" content={'\uf067'} style={{height:`${17*props.content.length}%`}}>
		{
			props.content.map((item, i) => (
				<div key={i} className="vertical-timeline-container">
					<div className="content" style={{color:'white',width:'130%'}}>
						<h5>{item.title}</h5>
						<div style={{marginBottom:'5%'}}>{item.subtitle}</div>
						<CircleCondition small
							color={props.color}
							icon={props.icon}
							style={{position: 'absolute', top:-78, zIndex:1,marginLeft:'88%'}}
							condition={props.conditionArray[i-1] || false} />
					</div>
				</div>
			))
		}
		</div>
	</div>
)

export const HeadCountBox = props => (
	<Fragment>
		<div className="headCountContainer" style={props.style} onClick={props.bgClick}>{props.children}</div>
	</Fragment>
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
			<div className="overlay-container" style={{display: (props.visible===true? 'block' : 'none'), height: `${props.height}%`, top: `${(100-props.height)/2}%` }}>
				{props.children}
			</div>
		</center>
	</Fragment>
)
