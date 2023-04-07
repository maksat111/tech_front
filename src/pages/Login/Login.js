import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineLoading, AiOutlineUser, AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLock } from 'react-icons/ai';
import './Login.css'
import { loginPost } from '../../config/axios';
import { message } from 'antd';
import Logo from '../../images/logo.png';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState("password");
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await loginPost(username, password);
            localStorage.setItem('turkmenExpress-admin', JSON.stringify(res.data));
            message.success('Successfully!');
            setLoading(false);
            window.location.pathname = '/dashboard';
        } catch (err) {
            err.response?.data?.detail ? message.error(err.response.data.detail) : message.error('ошибка, попробуйте еще раз, пожалуйста');
            setLoading(false);
        }
    }

    return (
        <div className='login_page'>
            <form className="login-container" onSubmit={handleSubmit}>
                <img src={Logo} alt='logo' />
                <h2>Добро пожаловать!</h2>
                <p>Введите свой пароль, чтобы использовать приложение!</p>

                <div className='input-container'>
                    <AiOutlineUser className='icon' />
                    <input style={{ width: "395px" }} placeholder="Имя пользователя" onChange={(e) => setUsername(e.target.value)} required />
                </div>

                <div className='input-container'>
                    <AiOutlineLock className='icon' />
                    <input type={type} placeholder="Пароль" onChange={(e) => setPassword(e.target.value)} required />
                    {type == 'password' ? <AiOutlineEye className='icon' style={!password ? { color: 'white' } : { color: "rgb(73, 73, 231)" }} onClick={() => setType("text")} />
                        : <AiOutlineEyeInvisible className='icon' onClick={() => setType("password")} />
                    }
                </div>

                <button className='login_button' type="submit">{loading ? <AiOutlineLoading className='loading-spin' /> : "Войти"}</button>
            </form>
        </div>
    )
}

export default Login;