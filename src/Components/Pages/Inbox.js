import React, { useEffect } from 'react';
import './Inbox'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Accordion, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { messageActions } from '../../Store';
import { useHistory } from 'react-router-dom';
import { Dot } from 'react-bootstrap-icons';
import useHttp from '../Hooks/use-http';
function removeSpecialChar(mail) {
  let newMail = "";
  for (let i = 0; i < mail.length; i++) {
    if (mail[i] !== "@" && mail[i] !== ".") {
      newMail += mail[i]
    }
  }
  return newMail;
}
function countUnreadMessages(arr) {
  let unreadeMessages = 0;
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i].isReaded) {
      unreadeMessages = unreadeMessages + 1;
    }
  }
  return unreadeMessages;
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

  const handleReadedMessage = async (msg) => {
    try {
      let responce = await fetch(
        `https://mail-748ee-default-rtdb.firebaseio.com/mail/${user}/${msg.name}.json`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ "isReaded": true })
        }
      )
      if (responce.ok) {
      } else {
        throw new Error("Failed to Read mail")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async (msg) => {
    try {
      let responce = await fetch(
        `https://mail-748ee-default-rtdb.firebaseio.com/mail/${user}/${msg.name}.json`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
      if (responce.ok) {
        console.log("deleted successfully")
      } else {
        throw new Error("Failed to delete mail")
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    async function fetchMessages() {
      try {
        let responce = await fetch(
          `https://mail-748ee-default-rtdb.firebaseio.com/mail/${(user)}.json`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        if (responce.ok) {
          let data = await responce.json();
          let newMessageArray = [];
          if (data == null) {
            newMessageArray = [];
            dispatch(messageActions.setMessages(newMessageArray));
            dispatch(messageActions.setUnreadMessages(countUnreadMessages(newMessageArray)));
          } else {
            const keys = Object.keys(data);
            keys.forEach((key) => {
              newMessageArray.unshift({ ...data[key], name: key })
            });
            console.log(newMessageArray);
            dispatch(messageActions.setMessages(newMessageArray));
            dispatch(messageActions.setUnreadMessages(countUnreadMessages(newMessageArray)));
          }
        } else {
          throw new Error("Failed to fetch mail")
        }
      } catch (error) {
        console.log(error)
      }
    }
    let fetching = setTimeout(() => {
      fetchMessages();
    }, 2000);
    return () => {
      clearTimeout(fetching);
    }
  }, [messages, user, dispatch])


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
      <div>
        <h1 className='text-center'>Inbox</h1>
        <span className='float-right h4'>Unread Messages:{countUnreadMessages(messages)}</span>
      </div>
      {messages.map((message) => {
        return <div key={message.name}>
          <div className="container">
            <div className="row">
              <div className="col-11">
                <Accordion defaultActiveKey="0" onClick={() => handleReadedMessage(message)}>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>
                      {!message.isReaded && <Dot width={30} height={30} color="blue" />}
                      From:{message.Sender}
                    </Accordion.Header>
                    <Accordion.Body>
                      <h5>Subject:{message.mailSubject}</h5>
                      <p>{message.mailContent}</p>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
              <div className="col-1">
                <Button variant="danger" onClick={() => handleDelete(message)}>
                  DELETE
                </Button>
              </div>
            </div>
          </div>
        </div>
      })
      }
    </div>
  )
}

export default Inbox;























