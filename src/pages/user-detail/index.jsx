import './styles.css';
import { Card, Button, Form, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BASE_URL } from 'constants';

export default function UserDetail() {
	const [loadingTrade, setLoadingTrade] = useState(false);
	const [playerForBuy, setPlayerForBuy] = useState('');

	const userInfo = useSelector(state => state.auth.userInfo);

	const navigate = useNavigate();

	const [showModalTrade, setShowModalTrade] = useState(false);
	const [tradeType, setTradeType] = useState('vang');
	const [coinInputValue, setCoinInputValue] = useState(1);

	const accessToken = localStorage.getItem('accessToken');

	const caculateTradeResult = () => {
		return tradeType === 'vang' ? coinInputValue * 5000 : coinInputValue * 0.5;
	};

	const handleTrade = () => {
		setLoadingTrade(true);
		const data = {
			'type': tradeType,
			'player': playerForBuy,
			'value': parseInt(caculateTradeResult()),
		};

		axios
			.post(`${BASE_URL}/v1/webshops/buyMoneyInGame`, data, {
				headers: { 'Authorization': `Bearer ${accessToken}` },
			})
			.then(() => {
				toast.success('Trao đổi thành công');
				setShowModalTrade(false);
			})
			.catch(() => {
				toast.error('Trao đổi thất bại');
			})
			.finally(() => setLoadingTrade(false));
	};

	return (
		<div className='user-detail'>
			<h3>Thông tin tài khoản</h3>
			<Card>
				<Card.Body>
					<div style={{ fontWeight: '600' }}>
						<span>Coin:</span>
						<span style={{ color: 'red', marginLeft: '4px' }}>{userInfo.coin}</span>
					</div>
					<hr></hr>
					<div className='user-detail__buttons'>
						<Button variant='warning' onClick={() => navigate('/functions')}>
							Nạp coin
						</Button>
						<Button variant='success' onClick={() => navigate('/my-history-transaction')}>
							Lịch sử giao dịch
						</Button>
						<Button variant='primary' onClick={() => setShowModalTrade(true)}>
							Đổi vàng hoặc kim cương
						</Button>
					</div>
					<hr></hr>
					<div style={{ margin: '20px 0 12px' }}>Tài khoản:</div>
					<Form.Control value={userInfo.user} disabled />
					<div style={{ margin: '20px 0 12px' }}>Vai trò:</div>
					<Form.Control value={userInfo.role} disabled />
					<div style={{ margin: '20px 0 12px' }}>Trạng thái tài khoản:</div>
					<Form.Control value={userInfo.status} disabled />
				</Card.Body>
			</Card>
			<Modal show={showModalTrade} onHide={() => setShowModalTrade(false)} centered>
				<Modal.Body>
					<h5 style={{ textAlign: 'center' }}>Đổi vàng hoặc kim cương</h5>
					<hr />
					<p style={{ color: 'red', fontWeight: '600' }}>
						CHÚ Ý: Để thực hiện chức năng này, tài khoản của bạn cần ĐĂNG XUẤT khỏi game
					</p>
					<Form.Select onChange={e => setTradeType(e.target.value)}>
						<option value='vang'>Vàng</option>
						<option value='kimcuong'>Kim Cương</option>
					</Form.Select>
					<div className='webshop__modal__title'>Áp dụng cho nhân vật</div>
					<Form.Select onChange={e => setPlayerForBuy(e.target.value)}>
						<option value=''>--- Chọn nhân vật ---</option>
						{userInfo.player1 !== '' && <option value={userInfo.player1}>{userInfo.player1}</option>}
						{userInfo.player2 !== '' && <option value={userInfo.player2}>{userInfo.player2}</option>}
						{userInfo.player3 !== '' && <option value={userInfo.player3}>{userInfo.player3}</option>}
					</Form.Select>
					<div className='webshop__modal__title'>Số lượng coin</div>
					<Form.Control
						placeholder='Nhập số lượng'
						type='number'
						value={coinInputValue}
						onChange={e => setCoinInputValue(e.target.value)}
					/>
					<div className='webshop__modal__title'>
						Số lượng {tradeType === 'vang' ? 'vàng' : 'kim cương'} nhận được
					</div>
					<Form.Control type='number' value={caculateTradeResult()} disabled />
					<div className='user-detail__trade__buttons'>
						<Button onClick={handleTrade}>Xác nhận</Button>
						<Button variant='secondary' onClick={() => setShowModalTrade(false)}>
							Hủy bỏ
						</Button>
					</div>
				</Modal.Body>
			</Modal>
			{loadingTrade && <div className='loading-fixed'>Đang xử lý...</div>}
		</div>
	);
}
