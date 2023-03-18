import './styles.css';
import { useEffect, useState } from 'react';
import { User, Bookmark, Cart, ArrowDown } from 'components/svg';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import classNames from 'classnames';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateUserInfo } from 'reducers/auth';

function Header() {
	const [showAccountOptions, setShowAccountOptions] = useState(false);
	const [showAdminOptions, setShowAdminOptions] = useState(false);

	const userInfo = useSelector(state => state.auth.userInfo);

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useLocation();

	useEffect(() => {
		const hamburger = document.querySelector('.hamburger');
		const navLink = document.querySelectorAll('.header-link');
		const childItem = document.querySelectorAll('.header-item__user__options__item');

		hamburger.addEventListener('click', mobileMenu);
		navLink.forEach(n => n.addEventListener('click', closeMenu));
		childItem.forEach(n => n.addEventListener('click', closeMenu));

		return () => {
			hamburger.removeEventListener('click', mobileMenu);
			navLink.forEach(n => n.removeEventListener('click', closeMenu));
			childItem.forEach(n => n.removeEventListener('click', closeMenu));
		};
	});

	useEffect(() => {
		setShowAccountOptions(false);
		setShowAdminOptions(false);
	}, [location]);

	function mobileMenu() {
		const hamburger = document.querySelector('.hamburger');
		const navMenu = document.querySelector('.header-menu');
		hamburger.classList.toggle('active');
		navMenu.classList.toggle('active');
	}

	function closeMenu() {
		const hamburger = document.querySelector('.hamburger');
		const navMenu = document.querySelector('.header-menu');
		hamburger.classList.remove('active');
		navMenu.classList.remove('active');
	}

	const handleLogout = () => {
		navigate('/');
		dispatch(updateUserInfo({}));
		localStorage.removeItem('accessToken');
		showAccountOptions(false);
		showAdminOptions(false);
	};

	return (
		<div className='header'>
			<Link to='/' className='header-logo'>
				NOS RAZE
			</Link>
			<ul className='header-menu'>
				<li className='header-item'>
					<Link to={_.isEmpty(userInfo) ? '/login' : '/webshop'} className='header-link'>
						<Cart />
						<span>Webshop</span>
					</Link>
				</li>

				<li className='header-item'>
					<Link to='functions' className='header-link'>
						<Bookmark />
						<span>Chức năng</span>
					</Link>
				</li>

				{!_.isEmpty(userInfo) && userInfo.role === 'admin' && (
					<li className='header-item'>
						<div
							className='header-link-account'
							onClick={() => {
								setShowAdminOptions(!showAdminOptions);
								setShowAccountOptions(false);
							}}
						>
							<User />
							<span>Trang quản trị</span>
							<ArrowDown />
						</div>
						<div className={classNames('header-item__user__options', { 'show': showAdminOptions })}>
							<div className='header-item__user__options__item' onClick={() => navigate('/item-manager')}>
								Vật phẩm
							</div>
							<div className='header-item__user__options__item' onClick={() => navigate('/user-manager')}>
								Tài khoản
							</div>
							<div className='header-item__user__options__item' onClick={() => navigate('/post-manager')}>
								Bài viết
							</div>
							<div
								className='header-item__user__options__item'
								onClick={() => navigate('/all-history-transaction')}
							>
								Tất cả lịch sử giao dịch
							</div>
						</div>
					</li>
				)}

				<li className='header-item'>
					{_.isEmpty(userInfo) ? (
						<div className='header-link' onClick={() => navigate('/login')}>
							<User />
							<span>Đăng nhập</span>
						</div>
					) : (
						<>
							<div
								className='header-link-account'
								onClick={() => {
									setShowAccountOptions(!showAccountOptions);
									setShowAdminOptions(false);
								}}
							>
								<User />
								<span>Tài khoản</span>
								<ArrowDown />
							</div>
							<div className={classNames('header-item__user__options', { 'show': showAccountOptions })}>
								<div>
									<span>Coin:</span>
									<span style={{ marginLeft: '4px', color: 'red', fontWeight: '600' }}>
										{userInfo.coin}
									</span>
								</div>
								<div
									className='header-item__user__options__item'
									onClick={() => navigate('/user-detail')}
								>
									Thông tin tài khoản
								</div>
								<div
									className='header-item__user__options__item'
									onClick={() => navigate('/my-history-transaction')}
								>
									Lịch sử giao dịch
								</div>
								<hr />
								<div className='header-item__user__options__item' onClick={handleLogout}>
									Đăng xuất
								</div>
							</div>
						</>
					)}
				</li>
			</ul>
			<div className='hamburger'>
				<span className='bar'></span>
				<span className='bar'></span>
				<span className='bar'></span>
			</div>
		</div>
	);
}

export default Header;
