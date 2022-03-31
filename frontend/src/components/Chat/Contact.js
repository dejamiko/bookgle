// Messaging based on https://www.youtube.com/playlist?list=PLLRM7ROnmA9EnQmnfTgUzCfzbbnc-oEbZ
import React from 'react';
import {NavLink} from 'react-router-dom';
import { MessageProfile, MessagingDisplay, MessagingProfileHeading, MessagingProfilePara, SidePanelTextPreview } from './ChatElements';
import { Col } from 'reactstrap'

const Contact = (props) => (
    <NavLink to={`${props.chatURL}`} style={{color: '#fff'}}>
        <li className="contact">
            {/* <div className="wrap">
                <span className={`contact-status ${props.status}`}/>
                <img src={props.picURL} alt=""/>
                <div className="meta">
                    <p className="name">{props.name}</p>
                    <p className="preview">{props.lastMessage}</p>
                </div>
            </div> */}
            <div className='wrap'>
                <MessageProfile>
                    <Col xs={3}>
                        <img src={props.picURL} alt="Profile Picture" style={{ height:"5rem", width:"5rem", borderRadius:"100px" }} />
                    </Col>
                    <Col xs={9} style={{ marginLeft:"1rem" }}>
                        <MessagingDisplay>
                            <MessagingProfileHeading className='name'>{props.name}</MessagingProfileHeading>
                            {props.lastMessage && props.lastMessage.length > 25 ? <SidePanelTextPreview className='preview'>{props.lastMessage.slice(0,25)}...</SidePanelTextPreview> : <></>}
                            {props.lastMessage && props.lastMessage.length <= 25 ? <SidePanelTextPreview className='preview'>{props.lastMessage}</SidePanelTextPreview> : <></>}
                            <p>{props.lastUpdated}</p>
                        </MessagingDisplay>
                    </Col>
                </MessageProfile>
            </div>
        </li>
    </NavLink>
);

export default Contact;
