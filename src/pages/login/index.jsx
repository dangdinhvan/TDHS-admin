import './styles.css';
import { Form, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { BASE_URL } from 'constants';
import { useDispatch } from 'react-redux';
import { updateUserInfo } from 'reducers/auth';

export default function Login() {
	const [emailInput, setEmailInput] = useState('');
	const [passwordInput, setPasswordInput] = useState('');
	const [active, setActive] = useState(false);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		if (emailInput && passwordInput) {
			setActive(true);
		} else {
			setActive(false);
		}
	}, [emailInput, passwordInput]);

	const handleLogin = () => {
		const data = { 'user': emailInput, 'password': passwordInput };
		axios
			.post(`${BASE_URL}/v1/auth/login`, data)
			.then(response => {
				dispatch(updateUserInfo({ ...response.data.user }));
				localStorage.setItem('accessToken', `${response.data.tokens.access.token}`);
				toast.success('Đăng nhập thành công', { toastId: 'asdasdas' });
				navigate('/');
			})
			.catch(() => {
				toast.error('Đăng nhập thất bại');
			});
	};

	return (
		<div className='login'>
			<h3>Đăng nhập</h3>
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
					value={passwordInput}
					onChange={e => setPasswordInput(e.target.value)}
				/>
			</div>
			<Button onClick={handleLogin} disabled={!active}>
				Đăng nhập
			</Button>
			<hr />
			<div>
				Bạn chưa có tài khoản. <Link to='/register'>Hãy Đăng ký</Link>
			</div>
		</div>
	);
}
