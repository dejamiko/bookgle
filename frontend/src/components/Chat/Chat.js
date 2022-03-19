import React from 'react';
import WebSocketInstance from '../../websocket';
import Hoc from './hoc/hoc';
import axiosInstance from '../../axios'

class Chat extends React.Component {

    state = {
        message: '',
        chatID: ''
    }

    currentUser = null;

    initialiseChat() {
        this.setState({chatID: this.props.chatID})
        this.currentUser = localStorage.username
        WebSocketInstance.addCallbacks(this.setMessages.bind(this), this.addMessage.bind(this))

        if (this.state.chatID != undefined) {
            this.waitForSocketConnection(() => {
                WebSocketInstance.fetchMessages(
                    this.currentUser,
                    this.state.chatID
                );
            });
            console.log("initialise Chat: " + this.state.chatID)
            WebSocketInstance.connect(this.state.chatID);
        }
    }

    constructor(props) {
        super(props);
    }

    waitForSocketConnection(callback) {
        const component = this;
        setTimeout(
            function () {
                if (WebSocketInstance.state() === 1) {
                    console.log("Connection is made");
                    callback();
                    return;
                } else {
                    console.log("wait for connection...");
                    component.waitForSocketConnection(callback);
                }
            }, 100);
    }

    addMessage(message) {
        if (!(JSON.stringify(message) === JSON.stringify(this.state.messages[this.state.messages.length - 1]))) { //fix duplicate messages when sending, horrible implementation
            this.setState({messages: [...this.state.messages, message]});
        }
    }

    setMessages(messages) {
        this.setState({messages: messages.reverse()});
    }

    messageChangeHandler = (event) => {
        this.setState({message: event.target.value});
    }

    sendMessageHandler = (e) => {

        e.preventDefault();
        const messageObject = {
            from: this.currentUser, //broken
            content: this.state.message,
            chatId: this.props.chatID,
        };
        WebSocketInstance.newChatMessage(messageObject);
        this.setState({message: ''});
    }

    leaveChatHandler = (e) => {
        console.log("BYEE")
        axiosInstance
            .delete(`chat/leave/${this.props.chatID}/`)
            .then((res) => {
                console.log(res)
            })
            .catch(error => console.error(error));
    }

    renderTimestamp = timestamp => {
        let message_date_object = new Date(timestamp);
        let now_date_object = new Date();
        let message_date_string = message_date_object.getDate() + "." 
            + message_date_object.getMonth() + "." + message_date_object.getFullYear();
        let now_date_string = now_date_object.getDate() + "." 
            + now_date_object.getMonth() + "." + now_date_object.getFullYear();
        const isSameDay = message_date_string == now_date_string;
        let message_time = '';
        if(isSameDay){
            message_time += new Date(timestamp).getHours() + ":" + new Date(timestamp).getMinutes();
        } else {
            message_time = message_date_string
        }
        return message_time
    }

    renderMessages = (messages) => {
        console.log("renderMessages")
        console.log(messages)
        return messages.map((message, i, arr) => (
            <li
                key={message.id}
                style={{marginBottom: arr.length - 1 === i ? '300px' : '15px'}}
                className={message.author === this.currentUser ? 'sent' : 'replies'}>
                <img src="http://emilcarlsson.se/assets/mikeross.png"/>
                <p>
                    <small>
                        {message.author}
                    </small>
                    <br/>
                    {message.content}
                    <br/>
                    <small>
                        {this.renderTimestamp(message.timestamp)}
                    </small>
                </p>
            </li>
        ));
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({behavior: "smooth"});
    }

    componentDidMount() {
        this.initialiseChat();
        this.scrollToBottom();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.chatID !== this.state.chatID) {
            WebSocketInstance.disconnect();
            this.waitForSocketConnection(() => {
                WebSocketInstance.fetchMessages(
                    this.currentUser,
                    this.state.chatID
                );
            });
            WebSocketInstance.connect(this.state.chatID);
        }
        this.scrollToBottom();
    }

    static getDerivedStateFromProps(newProps, prevState) {
        console.log(newProps.chatID);

        if (newProps.chatID !== prevState.chatID) {
            return {chatID: newProps.chatID};
        } else {
            return null
        }
    }

    render() {
        const messages = this.state.messages;
        const invalidChatID = this.state.chatID == undefined;
        return (
            <Hoc>
                <div>
                    <button onClick={this.leaveChatHandler} id="chat-message-submit" className="submit">
                        Leave
                    </button>
                </div>
                <div className="messages">
                    {invalidChatID
                        ? <h3>Select a chat! or refactor this to select a chat?</h3>
                        : <div/>
                    }
                    <ul id="chat-log">
                        {
                            messages &&
                            this.renderMessages(messages)
                        }
                        <div style={{float: "left", clear: "both"}}
                             ref={(el) => {
                                 this.messagesEnd = el;
                             }}>
                        </div>
                    </ul>
                </div>
                <div className="message-input">
                    <form onSubmit={this.sendMessageHandler}>
                        <div className="wrap">
                            <input
                                onChange={this.messageChangeHandler}
                                value={this.state.message}
                                required
                                id="chat-message-input"
                                type="text"
                                placeholder="Write your message..."/>
                            <i className="fa fa-paperclip attachment" aria-hidden="true"></i>
                            <button id="chat-message-submit" className="submit">
                                <i className="fa fa-paper-plane" aria-hidden="true"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </Hoc>
        );
    };
}

export default Chat