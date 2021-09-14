import React, { useState } from 'react';
import './home.scss'
import { Link } from 'react-router-dom';

const HomePage = ({socket}) => {
    const [username, setUsername] = useState('')
    const [roomname, setRoomname] = useState('')

    const sendData = () => {
        if (username !== '' && roomname !== '') {
            socket.emit('joinRoom', { username, roomname })
        } else {
            alert('房间号与用户名为必填项');
            window.location.reload();
        }
    }

    return (
        <div className='homepage'>
            <input placeholder="请输入你的用户名" value={username} onChange={e => setUsername(e.target.value)}></input>
            <input placeholder="请输入房间号" value={roomname} onChange={e => setRoomname(e.target.value)}></input>
            <Link to={`/chat/${roomname}/${username}`}>
                <button onClick={sendData}>加入</button>
            </Link>
        </div>
    )
}

export default HomePage
