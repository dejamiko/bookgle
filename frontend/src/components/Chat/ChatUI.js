import React from 'react'
import { useParams } from 'react-router-dom'
import { Container, Row, Col } from 'reactstrap'
import Nav from '../Nav/Nav'
import Chat2 from './Chat2'
import { ChatContainer, EmptyChatContainer, EmptyChatText, SidePanelContainer, TitleBar } from './ChatElements'
import Sidepanel2 from './Sidepanel2'

function ChatUI() {

    let params = useParams();

  return (
    <html style={{ height: '100%' }}>
    <Container fluid style={{ height:"46vw" }}>
        <Row style={{ marginBottom: "3rem" }}>
            <Nav />
        </Row>
        <Row style={{ height:"37vw" }}>
            <Col xs={1} />
            <Col xs={3}>
                <Container fluid style={{ backgroundColor:"#fff", height:"100%", overflow:"hidden", padding:"0", borderRadius:"10px" }}>
                    <Container style={{ display: "flex", height:"3rem", backgroundColor:"#653FFD", width:"100%", fontFamily:"Source Sans Pro", fontSize:"15px", alignItems:"center", color:"#fff", justifyContent:"flex-start" }}>
                        Conversations
                    </Container>
                    <Sidepanel2 />
                </Container>
            </Col>
            <Col xs={7}>
                <Container fluid style={{ backgroundColor:"#fff", height:"37vw", borderRadius:"10px", padding:"0px" }}>
                    <Chat2 chatID={params.chatID} />
                </Container>
            </Col>
            <Col xs={1} />
        </Row>
    </Container>
    </html>
  )
}

export default ChatUI