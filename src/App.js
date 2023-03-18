import axios from 'axios';
import { BASE_URL } from 'constants';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { updateUserInfo } from 'reducers/auth';
import './App.css';
import _ from 'lodash';

import Footer from 'components/footer';
import Header from 'components/header';
import Functions from 'pages/functions';
import Home from 'pages/home';
import Login from 'pages/login';
import MobileRecharge from 'pages/mobile-recharge';
import MomoRecharge from 'pages/momo-recharge';
import MyHistoryTransaction from 'pages/my-history-transaction';
import PostEditor from 'pages/post-edittor';
import PostManager from 'pages/post-manager';
import Register from 'pages/register';
import UserDetail from 'pages/user-detail';
import UserManager from 'pages/user-manager';
import Webshop from 'pages/webshop';
import AllHistoryTransaction from 'pages/all-history-transaction';
import ItemManager from 'pages/item-manager';
import ItemEditor from 'pages/item-editor';

function App() {
	const accessToken = localStorage.getItem('accessToken');
	const userInfo = useSelector(state => state.auth.userInfo);

	const dispatch = useDispatch();

	useEffect(() => {
		if (accessToken) {
			axios
				.get(`${BASE_URL}/v1/auth/jwt`, {
					headers: { 'Authorization': `Bearer ${accessToken}` },
				})
				.then(response => {
					dispatch(updateUserInfo(response.data.user));
				})
				.catch(error => console.log(error));
		}
	}, []);

	return (
		<div className='App'>
			<div>
				<Header />
				<div className='App-content'>
					<Routes>
						{!_.isEmpty(userInfo) && userInfo.role === 'admin' && (
							<>
								<Route path='/item-manager' element={<ItemManager />} />
								<Route path='/user-manager' element={<UserManager />} />
								<Route path='/post-manager' element={<PostManager />} />
								<Route path='/post-editor' element={<PostEditor />} />
								<Route path='/post-editor/:id' element={<PostEditor />} />
								<Route path='/all-history-transaction' element={<AllHistoryTransaction />} />
								<Route path='/item-editor/:type' element={<ItemEditor />} />
								<Route path='/item-editor/:type/:id' element={<ItemEditor />} />
							</>
						)}
						<Route path='/user-detail' element={<UserDetail />} />
						<Route path='/my-history-transaction' element={<MyHistoryTransaction />} />
						<Route path='/webshop' element={<Webshop />} />
						<Route path='/functions' element={<Functions />} />
						<Route path='/momo-recharge' element={<MomoRecharge />} />
						<Route path='/banking' element={<MomoRecharge isMomo={false} />} />
						<Route path='/mobile-recharge' element={<MobileRecharge />} />
						<Route path='/login' element={<Login />} />
						<Route path='/register' element={<Register />} />
						<Route path='/' element={<Home />} />
						<Route path='*' element={<Home />} />
					</Routes>
				</div>
			</div>
			<Footer />
		</div>
	);
}

export default App;
