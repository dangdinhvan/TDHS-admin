import axios from 'axios';
import { BASE_URL } from 'constants';
import { useEffect, useRef, useState } from 'react';
import { Form, Table, Modal, Button } from 'react-bootstrap';
import './styles.css';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import PaginationComponent from 'components/pagination';

export default function Webshop() {
	const [itemType, setItemType] = useState('3');
	const [webshopData, setWebshopData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [totalPage, setTotalPage] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);
	const [showModal, setShowModal] = useState(false);
	const [playerForBuy, setPlayerForBuy] = useState('');
	const [quantity, setQuantity] = useState(1);
	const [plus, setPlus] = useState(15);
	const [itemId, setItemId] = useState('');
	const [loadingBuy, setLoadingBuy] = useState(false);
	const [searchInputValue, setSearchInputValue] = useState('');

	const accessToken = localStorage.getItem('accessToken');
	const userInfo = useSelector(state => state.auth.userInfo);

	const apiCallPerPage = useRef(20);

	const navigate = useNavigate();

	useEffect(() => {
		if (!accessToken) {
			navigate('/login');
		}
	}, []);

	useEffect(() => {
		setCurrentPage(1);
		setSearchInputValue('');
		getItems(1, '');
	}, [itemType]);

	useEffect(() => {
		getItems(currentPage, searchInputValue);
	}, [currentPage]);

	useEffect(() => {
		setCurrentPage(1);
		getItems(1, searchInputValue);
	}, [searchInputValue]);

	const getItems = async (currentPage, input) => {
		setLoading(true);
		let params = { page: currentPage, limit: apiCallPerPage.current, sortBy: 'itemId:acs' };

		if (input) {
			params = { ...params, name: input };
		}

		axios
			.get(`${BASE_URL}/v1/webshops/${itemType}`, {
				params: params,
				headers: { 'Authorization': `Bearer ${accessToken}` },
			})
			.then(response => {
				setWebshopData(response.data.results);
				setTotalPage(response.data.totalPages);
			})
			.catch(error => console.log(error))
			.finally(() => setLoading(false));
	};

	const handleBuy = id => {
		setShowModal(true);
		setItemId(id);
	};

	const handleBuyItem = () => {
		setLoadingBuy(true);

		const data = {
			'item': itemType,
			'itemId': itemId,
			'player': playerForBuy,
			'quantity': quantity,
			'isLock': true,
			'plus': plus,
		};

		axios
			.post(`${BASE_URL}/v1/webshops/addItemToPlayer`, data, {
				headers: { 'Authorization': `Bearer ${accessToken}` },
			})
			.then(response => {
				toast.success('Mua thành công');
				setShowModal(false);
			})
			.catch(err => {
				if (err.response.status == 402) {
					toast.error('Bạn không đủ tiền thanh toán');
				} else {
					toast.error('Mua thất bại');
				}
			})
			.finally(() => setLoadingBuy(false));
	};

	return (
		<div className='webshop'>
			<h3>WEBSHOP</h3>
			<div className='webshop__alert'>
				<p>
					1. Để sử dụng chức năng ĐỔI COIN hoặc MUA ĐỒ TRONG WEBSHOP, các bạn lưu ý phải ĐĂNG XUẤT / THOÁT
					GAME trước khi thực hiện.
				</p>
				<p>
					2. Tắt Auto + Reconnect trong game (nên THOÁT hẳn game / TẮT giả lập) trước khi thực hiện giao dịch
					để tránh trường hợp vật phẩm hoặc lượng chưa được add vào nhận vật mà các bạn đã đăng nhập sẽ bị mất
					vật phẩm và lượng vừa giao dịch.
				</p>
				<p>
					3. Sau khi thực hiện giao dịch mua đồ hoặc đổi coin trên web, hãy kiên nhận đợi 3-5s trước khi đăng
					nhập vào game.
				</p>
				<p>
					4. Các trường hợp không đọc kỹ lưu ý + thông báo trước khi giao dịch trên web mà bị mất vật phẩm
					hoặc lượng, tiền giao dịch chúng tôi sẽ không chịu trách nhiệm và không đền bù.
				</p>
			</div>
			<div className='webshop__top'>
				<Form.Select className='webshop__select' onChange={e => setItemType(e.target.value)}>
					<option value='3'>Vũ khí</option>
					{/* <option value='1'>Vàng</option> */}
					<option value='4'>Thú cưỡi</option>
					<option value='7'>Ngọc</option>
				</Form.Select>
				<Form.Control
					className='webshop__search'
					placeholder='Tìm kiếm'
					type='text'
					value={searchInputValue}
					onChange={e => setSearchInputValue(e.target.value)}
				/>
			</div>

			{loading ? (
				<p style={{ textAlign: 'center' }}>Loading...</p>
			) : (
				<>
					<Table striped bordered responsive>
						<thead>
							<tr>
								<th style={{ textAlign: 'center' }}>#</th>
								<th>Tên vật phẩm</th>
								<th style={{ textAlign: 'center', width: '10%' }}>Hình ảnh</th>
								<th style={{ textAlign: 'center', width: '10%' }}>Giá coin</th>
								<th style={{ textAlign: 'center' }}>Mô tả</th>
								<th style={{ textAlign: 'center' }}>Actions</th>
							</tr>
						</thead>
						<tbody>
							{webshopData.map((item, index) => (
								<tr key={index}>
									<td style={{ textAlign: 'center' }}>{index + 1}</td>
									<td>{item.name}</td>
									<td style={{ textAlign: 'center' }}>
										<img className='item-image' src={item.image} />
									</td>
									<td style={{ textAlign: 'center' }}>{item.price}</td>
									<td style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}>{item.content}</td>
									<td style={{ textAlign: 'center' }}>
										<div className='webshop__buy-item' onClick={() => handleBuy(item.itemId)}>
											Mua
										</div>
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
			<Modal show={showModal} onHide={() => setShowModal(false)} centered>
				<Modal.Body>
					<h5 style={{ textAlign: 'center' }}>Mua vật phẩm</h5>
					<hr />
					<p style={{ color: 'red', fontWeight: '600' }}>
						CHÚ Ý: Để thực hiện chức năng này, tài khoản của bạn cần ĐĂNG XUẤT khỏi game
					</p>
					<div className='webshop__modal__title'>Áp dụng cho nhân vật</div>
					<Form.Select onChange={e => setPlayerForBuy(e.target.value)}>
						<option value=''>--- Chọn nhân vật ---</option>
						{userInfo.player1 !== '' && <option value={userInfo.player1}>{userInfo.player1}</option>}
						{userInfo.player2 !== '' && <option value={userInfo.player2}>{userInfo.player2}</option>}
						{userInfo.player3 !== '' && <option value={userInfo.player3}>{userInfo.player3}</option>}
					</Form.Select>
					<div className='webshop__modal__title'>Số lượng</div>
					<Form.Control
						placeholder='Nhập số lượng'
						type='number'
						value={quantity}
						onChange={e => setQuantity(e.target.value)}
					/>
					<div className='webshop__modal__title'>Cường hóa</div>
					<Form.Control
						placeholder='Nhập cường hóa'
						type='number'
						value={plus}
						onChange={e => setPlus(e.target.value)}
						disabled
					/>
					<Button
						className='webshop__modal__buy-button'
						onClick={handleBuyItem}
						disabled={playerForBuy === ''}
					>
						Mua
					</Button>
				</Modal.Body>
			</Modal>
			{loadingBuy && <div className='loading-fixed'>Đang xử lý...</div>}
		</div>
	);
}
