import React, { useEffect } from 'react'
import { Accordion } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { messageActions } from '../../Store';

import { Button } from 'react-bootstrap';


function removeSpecialChar(mail) {
    let newMail = "";
    for (let i = 0; i < mail.length; i++) {
        if (mail[i] !== "@" && mail[i] !== ".") {
            newMail += mail[i]
        }
    }
    return newMail;
}

const Sent = () => {
    const user = removeSpecialChar(useSelector(state => state.authentication.user));
    const sentMessages=useSelector(state=>state.messages.sentMessages);
    const dispatch=useDispatch();

    useEffect(() => {
        async function fetchSentMessages() {
            try {
                let responce = await fetch(
                    `https://mail-748ee-default-rtdb.firebaseio.com/sentmail/${(user)}.json`,
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
                    const keys = Object.keys(data);
                    keys.forEach((key) => {
                        newMessageArray.unshift({ ...data[key], name: key })
                    });
                    console.log(newMessageArray);
                    dispatch(messageActions.setSentMessages(newMessageArray));
                } else {
                    throw new Error("Failed to fetch sent mails")
                }
            } catch (error) {
                console.log(error)
            }
        }
        let fetching = setTimeout(() => {
            fetchSentMessages();
        }, 1000);
        return () => {
            clearTimeout(fetching);
        }
    }, [dispatch,user])

    const handleDelete = async (message) => {
      try {
          const response = await fetch(
              `https://mail-748ee-default-rtdb.firebaseio.com/mail/${user}/${message.name}.json`,
              { method: 'DELETE' }
          );
          if (!response.ok) {
              throw new Error("Failed to delete mail");
          }
          dispatch(messageActions.setSentMessages(sentMessages.filter(msg => msg.name !== message.name)));
      } catch (error) {
          console.error("Error deleting mail:", error);
      }
  };
  

    return (
        <>
          <h1 className='text-center'>Sent Mails</h1>
          {sentMessages && sentMessages.map((message) => {
            return (
              <div key={message.name}>
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="1">
                          <Accordion.Header>To: {message.receiver}</Accordion.Header>
                          <Accordion.Body>
                            <h5>Subject: {message.mailSubject}</h5>
                            <p>{message.mailContent}</p>
                            <Button variant="danger" onClick={() => handleDelete(message)}>
                          DELETE
                        </Button>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      );
        };
export default Sent; 