import React, { useEffect } from 'react'
import { Accordion } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { messageActions } from '../../Store';
import useHttp from '../Hooks/use-http';
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

    const handleDelete = async (msg) => {
        try {
          console.log("Deleting mail:", msg.name);
          let response = await fetch(
            `https://mail-748ee-default-rtdb.firebaseio.com/mail/${user}/${msg.name}.json`,
            {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              }
            }
          );
          if (response.ok) {
            console.log("Deleted successfully");
            dispatch(messageActions.setSentMessages(sentMessages.filter(message => message.name !== msg.name)));
          } else {
            throw new Error("Failed to delete mail");
          }
        } catch (error) {
          console.log("Error deleting mail:", error);
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