import { useState, useEffect } from 'react';
import './styles.css';
import { BASE_URL } from '../../constants';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { updateUserInfo } from 'reducers/auth';

export default function Register() {
	const [emailInput, setEmailInput] = useState('');
	const [passwordInput1, setPasswordInput1] = useState('');
	const [passwordInput2, setPasswordInput2] = useState('');
	const [active, setActive] = useState(false);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		if (emailInput && passwordInput1 && passwordInput2 && passwordInput1 === passwordInput2) {
			setActive(true);
		} else {
			setActive(false);
		}
	}, [emailInput, passwordInput1, passwordInput2]);

	const handleRegister = () => {
		const data = { 'user': emailInput, 'password': passwordInput2 };
		axios
			.post(`${BASE_URL}/v1/auth/register`, data)
			.then(response => {
				dispatch(updateUserInfo({ ...response.data.user }));
				localStorage.setItem('accessToken', `${response?.data?.tokens?.access?.token}`);
				toast.success('Đăng ký thành công');
				navigate('/webshop');
			})
			.catch(() => {
				toast.error('Tài khoản đã tồn tại');
			});
	};

	return (
		<div className='register'>
			<h3>Đăng ký</h3>
			<div className='login__item'>
				<div className='login__label'>Tài khoản</div>
				<Form.Control
					placeholder='Tài khoản'
					value={emailInput}
					onChange={e => setEmailInput(e.target.value)}
				/>
			</div>
			<div className='login__item'>
				<div className='login__label'>Mật khẩu</div>
				<Form.Control
					placeholder='Mật khẩu'
					type='password'
					value={passwordInput1}
					onChange={e => setPasswordInput1(e.target.value)}
				/>
			</div>
			<div className='login__item'>
				<div className='login__label'>Nhập lại mật khẩu</div>
				<Form.Control
					placeholder='Nhập lại mật khẩu'
					type='password'
					value={passwordInput2}
					onChange={e => setPasswordInput2(e.target.value)}
				/>
				{passwordInput2 && passwordInput1 !== passwordInput2 && (
					<p style={{ color: 'red' }}>Mật khẩu chưa khớp</p>
				)}
			</div>
			<Button onClick={handleRegister} disabled={!active}>
				Đăng nhập
			</Button>
		</div>
	);
}
