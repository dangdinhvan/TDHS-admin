import './styles.css';
import axios from 'axios';
import { BASE_URL } from 'constants';
import { useEffect, useRef, useState } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import PaginationComponent from 'components/pagination';

export default function UserManager() {
	const [usersData, setUsersData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [totalPage, setTotalPage] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);
	const [showModalAddCoin, setShowModalAddCoin] = useState(false);
	const [loadingTrade, setLoadingTrade] = useState(false);
	const [coinInputValue, setCoinInputValue] = useState(1);
	const [userEdit, setUserEdit] = useState({});
	const [searchInputValue, setSearchInputValue] = useState('');

	const accessToken = localStorage.getItem('accessToken');

	const apiCallPerPage = useRef(20);

	useEffect(() => {
		getUsers(currentPage, searchInputValue);
	}, [currentPage]);

	useEffect(() => {
		setCurrentPage(1);
		getUsers(1, searchInputValue);
	}, [searchInputValue]);

	const getUsers = async (currentPage, input) => {
		setLoading(true);

		let params = { page: currentPage, limit: apiCallPerPage.current };

		if (input) {
			params = { ...params, user: input };
		}

		axios
			.get(`${BASE_URL}/v1/users`, {
				params: params,
				headers: { 'Authorization': `Bearer ${accessToken}` },
			})
			.then(response => {
				setUsersData(response.data.users.results);
				setTotalPage(response.data.users.totalPages);
			})
			.catch(error => console.log(error))
			.finally(() => setLoading(false));
	};

	const handleShowModalAddCoin = user => {
		setShowModalAddCoin(true);
		setUserEdit(user);
	};

	const handleAddCoin = () => {
		setLoadingTrade(true);
		const data = { coin: coinInputValue };
		axios
			.patch(`${BASE_URL}/v1/users/${userEdit.id}`, data, {
				headers: { 'Authorization': `Bearer ${accessToken}` },
			})
			.then(() => toast.success('Cập nhật thành công'))
			.catch(() => {
				toast.error('Cập nhật thất bại');
			})
			.finally(() => {
				setLoadingTrade(false);
				setShowModalAddCoin(false);
				getUsers(currentPage);
			});
	};

	const handleSetAdmin = user => {
		const data = { role: 'admin' };
		setLoadingTrade(true);
		axios
			.patch(`${BASE_URL}/v1/users/${user.id}`, data, {
				headers: { 'Authorization': `Bearer ${accessToken}` },
			})
			.then(() => toast.success('Cập nhật thành công'))
			.catch(() => {
				toast.error('Cập nhật thất bại');
			})
			.finally(() => {
				getUsers(currentPage);
			});
	};

	const handleUnActive = user => {
		const data = { status: 'pending' };
		axios
			.patch(`${BASE_URL}/v1/users/${user.id}`, data, {
				headers: { 'Authorization': `Bearer ${accessToken}` },
			})
			.then(() => toast.success('Cập nhật thành công'))
			.catch(() => {
				toast.error('Cập nhật thất bại');
			})
			.finally(() => {
				getUsers(currentPage);
			});
	};

	const handleLockUser = user => {
		const data = { status: user.status !== 'ban' ? 'ban' : 'pending' };
		axios
			.patch(`${BASE_URL}/v1/users/${user.id}`, data, {
				headers: { 'Authorization': `Bearer ${accessToken}` },
			})
			.then(() => toast.success('Cập nhật thành công'))
			.catch(() => {
				toast.error('Cập nhật thất bại');
			})
			.finally(() => {
				getUsers(currentPage);
			});
	};

	return (
		<div className='user-manager'>
			<h3>Quản lý người dùng</h3>
			<Form.Control
				className='user-manager__search'
				placeholder='Tìm kiếm'
				type='text'
				value={searchInputValue}
				onChange={e => setSearchInputValue(e.target.value)}
			/>
			{loading ? (
				<p style={{ textAlign: 'center' }}>Loading...</p>
			) : (
				<>
					<Table striped bordered responsive className='user-manager__table'>
						<thead>
							<tr>
								<th style={{ textAlign: 'center' }}>#</th>
								<th>Tên người dùng</th>
								<th style={{ textAlign: 'center' }}>Nhân vật 1</th>
								<th style={{ textAlign: 'center' }}>Nhân vật 2</th>
								<th style={{ textAlign: 'center' }}>Nhân vật 3</th>
								<th style={{ textAlign: 'center' }}>Số coin</th>
								<th style={{ textAlign: 'center' }}>Vai trò</th>
								<th style={{ textAlign: 'center' }}>Trạng thái</th>
								<th style={{ textAlign: 'center' }}>Chức năng</th>
							</tr>
						</thead>
						<tbody>
							{usersData.map((item, index) => (
								<tr key={index}>
									<td style={{ textAlign: 'center' }}>{index + 1}</td>
									<td>{item.user}</td>
									<td style={{ textAlign: 'center' }}>{item.player1}</td>
									<td style={{ textAlign: 'center' }}>{item.player2}</td>
									<td style={{ textAlign: 'center' }}>{item.player3}</td>
									<td style={{ textAlign: 'center' }}>{item.coin}</td>
									<td style={{ textAlign: 'center' }}>{item.role}</td>
									<td style={{ textAlign: 'center' }}>{item.status}</td>
									<td style={{ textAlign: 'center' }} className='user-manager__table__actions'>
										<Button variant='warning' onClick={() => handleLockUser(item)}>
											{item.status !== 'ban' ? 'Lock' : 'Unlock'}
										</Button>
										<Button
											variant='dark'
											onClick={() => handleUnActive(item)}
											disabled={item.status !== 'active'}
										>
											Unactive
										</Button>
										<Button
											variant='danger'
											onClick={() => handleSetAdmin(item)}
											disabled={item.role === 'admin'}
										>
											Set admin
										</Button>
										{/* <Button variant='primary'>View</Button> */}
										<Button variant='success' onClick={() => handleShowModalAddCoin(item)}>
											Add coin
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
					{totalPage > 1 && (
						<PaginationComponent
							currentPage={currentPage}
							setCurrentPage={setCurrentPage}
							totalPage={totalPage}
						/>
					)}
				</>
			)}
			<Modal show={showModalAddCoin} onHide={() => setShowModalAddCoin(false)} centered>
				<Modal.Body>
					<h5 style={{ textAlign: 'center' }}>Cộng coin</h5>
					<hr />
					<div className='webshop__modal__title'>Số lượng coin</div>
					<Form.Control
						placeholder='Nhập số lượng'
						type='number'
						value={coinInputValue}
						onChange={e => setCoinInputValue(e.target.value)}
					/>
					<div className='user-detail__trade__buttons'>
						<Button onClick={handleAddCoin}>Xác nhận</Button>
						<Button variant='secondary' onClick={() => setShowModalAddCoin(false)}>
							Hủy bỏ
						</Button>
					</div>
				</Modal.Body>
			</Modal>
			{loadingTrade && <div className='loading-fixed'>Đang xử lý...</div>}
		</div>
	);
}
