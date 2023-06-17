import React, { useEffect } from 'react';
import './Inbox.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Accordion, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { messageActions } from '../../Store';
import { useHistory } from 'react-router-dom';

function removeSpecialChar(mail) {
  let newMail = "";
  for (let i = 0; i < mail.length; i++) {
    if (mail[i] !== "@" && mail[i] !== ".") {
      newMail += mail[i]
    }
  }
  return newMail;
}

function Inbox() {
  const user = removeSpecialChar(useSelector(state => state.authentication.user));
  const messages = useSelector(state => state.messages.messages);
  const dispatch = useDispatch();
  const history = useHistory();
  const handleCompose = (e) => {
    e.preventDefault();
    history.push("/composemail");
  }
  useEffect(() => {
    async function fetchMessages() {
      try {
        let responce = await fetch(
          `https://mailbox-c0f00-default-rtdb.firebaseio.com/mail/${user}.json`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        if (responce.ok) {
          let data = await responce.json();
          console.log(data);
          const keys = Object.keys(data);
          let newMessageArray = [];
          keys.forEach((key) => {
            newMessageArray.unshift(data[key])
          });
          console.log(newMessageArray);
          dispatch(messageActions.setMessages(newMessageArray));
        } else {
          throw new Error("Failed to fetch mail")
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchMessages();
  }, [user, messages])

  return (
    <div className='container'>

      <div className='my-2  mx-2 row'>
        <h1 className="fst-italic col-md-8" >
          Welcome to your mail box!!!
        </h1>
        <hr />
      </div>
      <div>
        <Button variant="primary" onClick={handleCompose}>
          Compose
        </Button>
      </div>
      <h1 className='text-center'>Inbox</h1>
      {messages.map((message) => {

        return (


        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="1">
            <Accordion.Header>From:{message.Sender}</Accordion.Header>
            <Accordion.Body>
              <h5>Subject:{message.mailSubject}</h5>
              <p>Message:{message.mailContent}</p>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        )
      })
      }
      
    </div>
  )
}

export default Inbox;








