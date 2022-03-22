import React, {useState, useEffect} from "react";
import axiosInstance from "../../axios";
import {Col, Container, Row} from "reactstrap";
import {HeadingText, ParaText} from "../CreateClub/CreateClubElements";
import useGetUser from "../../helpers";


export default function Meetings() {
    const user = useGetUser()
    const [meetings, updateMeetings] = useState([])

    useEffect(() => {
        getTheMeetings()
    }, [user]);

    const getTheMeetings = () => {
        axiosInstance
            .get(`meetings/${user.id}`, {})
            .then((res) => {
                updateMeetings(res.data)
            })
    }

    const downloadCalendar = (meeting_id) => {
        console.log(meeting_id)
        axiosInstance
            .get(`calendar/${meeting_id}`, {})
            .then((res) => {
                // This solution taken from https://stackoverflow.com/questions/44656610/download-a-string-as-txt-file-in-react
                const element = document.createElement("a");
                const file = new Blob([res.data], {type: 'text/plain'});
                element.href = URL.createObjectURL(file);
                element.download = "event.ics";
                document.body.appendChild(element); // Required for this to work in FireFox
                element.click();
            })
    }

    if (meetings.length > 0 && Array.isArray(meetings)) {
        return (
            <div id="ParentDiv">
                <Row>
                </Row>
                <Container fluid>
                    <Row style={{marginTop: "6rem"}}>
                        <Col/>
                        <Col>
                            <HeadingText>See your meetings</HeadingText>
                            <ParaText/>
                            <ul>
                                <h5>
                                    {meetings.map(
                                        (meeting) =>
                                            <li onClick={() => downloadCalendar(meeting['id'])}>
                                                {meeting['name']}
                                            </li>
                                    )}
                                </h5>
                            </ul>
                        </Col>
                        <Col/>
                    </Row>
                </Container>
            </div>
        );
    } else {
        return (
            <div id="ParentDiv">
                <Row>
                </Row>
                <Container fluid>
                    <Row style={{marginTop: "6rem"}}>
                        <Col/>
                        <Col>
                            <HeadingText>See your meetings</HeadingText>
                            <ParaText/>
                        </Col>
                        <Col/>
                    </Row>
                </Container>
            </div>
        )
    }
}