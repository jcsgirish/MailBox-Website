import React, { useRef, useState } from 'react';
import './Inbox.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';

function removeSpecialChar(mail) {
  let newMail = '';
  for (let i = 0; i < mail.length; i++) {
    if (mail[i] !== '@' && mail[i] !== '.') {
      newMail += mail[i];
    }
  }
  return newMail;
}

function ComposeMail() {
  const user = removeSpecialChar(useSelector((state) => state.authentication.user));
  const receiver = useRef();
  const subject = useRef();
  const mailBody = useRef();
  const sender = useSelector((state) => state.authentication.user);

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  const handleSendMail = async (e) => {
    e.preventDefault();
    console.log('Sending email');
    console.log(receiver.current.value, subject.current.value, mailBody.current.value, sender);

    const newMail = {
      mailSubject: subject.current.value,
      mailContent: mailBody.current.value,
      Sender: sender,
      isReaded: false,
    };

    if (receiver.current.value.length > 0 && mailBody.current.value.length > 0 && subject.current.value.length > 0) {
      try {
        const response = await fetch(
          `https://mail-748ee-default-rtdb.firebaseio.com/mail/${removeSpecialChar(receiver.current.value)}.json`,
          {
            method: 'POST',
            body: JSON.stringify(newMail),
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          alert('Mail sent successfully');

          try {
            const sentMailResponse = await fetch(
              `https://mail-748ee-default-rtdb.firebaseio.com/sentmail/${user}.json`,
              {
                method: 'POST',
                body: JSON.stringify({ ...newMail, receiver: receiver.current.value }),
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );

            if (sentMailResponse.ok) {
              const sentMailData = await sentMailResponse.json();
              console.log(sentMailData);
              console.log('Sent to sent mail');
            } else {
              throw new Error('Failed to send to sent mail');
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          throw new Error('Failed to send mail');
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      alert('Please fill in all the data');
    }
  };

  return (
    <>
      <div className="App container">
        <h1 className="text-center"></h1>
        <input type="email" className="form-control" id="exampleInputEmail1" placeholder="To" ref={receiver} aria-describedby="emailHelp" />
        <br></br>
<input type="text" className="form-control" id="exampleInputSubject" placeholder="Subject" ref={subject} aria-describedby="textHelp" />
<br></br>
<textarea className='w-100' placeholder='Start Composing here' ref={mailBody}></textarea>
<br></br>

        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          wrapperClassName="my-wrapper"
          editorClassName="my-editor"
          toolbarClassName="my-toolbar"
        />
      </div>
      <div className="container text-center">
        <Button variant="primary" className="my-2 w-25" onClick={handleSendMail}>
          Send Mail
        </Button>
      </div>
    </>
  );
}

export default ComposeMail;
