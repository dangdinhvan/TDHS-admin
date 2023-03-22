import axios from 'axios';
import { BASE_URL } from 'constants';
import { useEffect, useRef, useState } from 'react';
import { Form, Table, Modal, Button } from 'react-bootstrap';
import './styles.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import PaginationComponent from 'components/pagination';

export default function ItemManager() {
	const [itemType, setItemType] = useState('3');
	const [webshopData, setWebshopData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [totalPage, setTotalPage] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);
	const [showModal, setShowModal] = useState(false);
	const [itemId, setItemId] = useState('');
	const [searchInputValue, setSearchInputValue] = useState('');
	const [loadingDelete, setLoadingDelete] = useState(false);

	const accessToken = localStorage.getItem('accessToken');

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
		let params = { page: currentPage, limit: apiCallPerPage.current, sortBy: 'updatedAt:desc' };

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

	const handleDelItem = id => {
		setShowModal(true);
		setItemId(id);
	};

	const handleConfirm = () => {
		setLoadingDelete(true);
		axios
			.delete(`${BASE_URL}/v1/webshops/${itemType}/${itemId}`, {
				headers: { 'Authorization': `Bearer ${accessToken}` },
			})
			.then(() => {
				toast.success('Xóa thành công');
				getItems(currentPage, searchInputValue);
			})
			.catch(() => {
				toast.error('Xóa thất bại');
			})
			.finally(() => setLoadingDelete(false));
	};

	return (
		<div className='webshop'>
			<h3>Quản lý vật phẩm</h3>
			<div className='webshop__top'>
				<Button onClick={() => navigate(`/item-editor/${itemType}`)}>Tạo mới vật phẩm</Button>
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
								<th style={{ textAlign: 'center' }}>Hình ảnh</th>
								<th style={{ textAlign: 'center' }}>Giá coin</th>
								<th style={{ textAlign: 'center' }}>Mô tả</th>
								<th style={{ textAlign: 'center' }}>Actions</th>
							</tr>
						</thead>
						<tbody>
							{webshopData.map((item, index) => (
								<tr key={index}>
									<td style={{ textAlign: 'center' }}>{index + 1}</td>
									<td>{item.name}</td>
									<td style={{ textAlign: 'center', width: '10%' }}>
										<img className='item-image' src={item.image} />
									</td>
									<td style={{ textAlign: 'center', width: '10%' }}>{item.price}</td>
									<td style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}>{item.content}</td>
									<td style={{ textAlign: 'center', width: '10%' }}>
										<span
											className='item-manager__action-item edit'
											onClick={() => navigate(`/item-editor/${itemType}/${item.id}`)}
										>
											Sửa
										</span>
										<span> | </span>
										<span
											className='item-manager__action-item delete'
											onClick={() => handleDelItem(item.id)}
										>
											Xóa
										</span>
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
					<h5 style={{ textAlign: 'center' }}>Bạn có chắc muốn xóa vật phẩm này không</h5>
					<div className='item-manager__modal__button'>
						<Button variant='primary' onClick={handleConfirm}>
							Xóa
						</Button>
						<Button variant='secondary' onClick={() => setShowModal(false)}>
							Hủy
						</Button>
					</div>
				</Modal.Body>
			</Modal>
			{loadingDelete && <div className='loading-fixed'>Đang xử lý...</div>}
		</div>
	);
}
