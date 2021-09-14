import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import "./chat.scss";
import { process } from '../store/action/index'

import { to_Decrypt, to_Encrypt } from "../aes.js";

const ChatPage = ({ username, roomname, socket }) => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const dispatch = useDispatch();

  const dispatchProcess = (encryt, msg, cipher) => {
    dispatch(process(encryt, msg, cipher));
  };

  const sendData = () => {
    if (text !== "") {
      const ans = to_Encrypt(text);
      socket.emit("chat", ans);
      setText("");
    }
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.on("message", (data) => {
      const ans = to_Decrypt(data.text, data.username);
      console.log(ans)
      dispatchProcess(false, ans, data.text);
      let temp = messages;
      temp.push({
        userId: data.userId,
        username: data.username,
        text: ans,
      });

      setMessages([...temp]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat">
      <div className="userName">
        <h2>
          {username}
          <span style={styles.roomname}>加入了{roomname}</span>
        </h2>
      </div>
      <div className="chatMessage">
        {messages.map((item, index) => {
          if (item.username === username) {
            return (
              <div className="message" key={index}>
                <p>{item.text}</p>
                <span>{item.username}</span>
              </div>
            );
          } else {
            return (
              <div className="message messRight" key={index}>
                <p>{item.text}</p>
                <span>{item.username}</span>
              </div>
            );
          }
        })}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="send">
        <input
          placeholder="请输入信息"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendData();
            }
          }}
        />
        <button onClick={sendData}>发送</button>
      </div>
    </div>
  );
};

const styles = {
  roomname: {
    fontSize: "0.7rem",
  },
};

export default ChatPage;
