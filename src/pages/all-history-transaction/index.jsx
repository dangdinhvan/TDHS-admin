import './styles.css';
import axios from 'axios';
import { BASE_URL, convertTime } from 'constants';
import { useEffect, useRef, useState } from 'react';
import { Table } from 'react-bootstrap';
import PaginationComponent from 'components/pagination';
import { ArrowUp, ArrowDown } from 'components/svg';

export default function AllHistoryTransaction() {
	const [historyMomoData, setHistoryMomoData] = useState([]);
	const [loading1, setLoading1] = useState(true);
	const [totalPage1, setTotalPage1] = useState(1);
	const [currentPage1, setCurrentPage1] = useState(1);
	const [sort1, setSort1] = useState('desc');

	const [historyBuyItem, setHistoryBuyItem] = useState([]);
	const [loading2, setLoading2] = useState(true);
	const [totalPage2, setTotalPage2] = useState(1);
	const [currentPage2, setCurrentPage2] = useState(1);
	const [sort2, setSort2] = useState('desc');

	const [historyCardData, setHistoryCardData] = useState([]);
	const [loading3, setLoading3] = useState(true);
	const [totalPage3, setTotalPage3] = useState(1);
	const [currentPage3, setCurrentPage3] = useState(1);
	const [sort3, setSort3] = useState('desc');

	const [historyBankingData, setHistoryBankingData] = useState([]);
	const [loading4, setLoading4] = useState(true);
	const [totalPage4, setTotalPage4] = useState(1);
	const [currentPage4, setCurrentPage4] = useState(1);
	const [sort4, setSort4] = useState('desc');

	const accessToken = localStorage.getItem('accessToken');

	const apiCallPerPage = useRef(10);

	useEffect(() => {
		if (accessToken) {
			getHistoryMomoTransaction(currentPage1);
		}
	}, [currentPage1, sort1]);

	useEffect(() => {
		if (accessToken) {
			getHistoryBuyItem(currentPage2);
		}
	}, [currentPage2, sort2]);

	useEffect(() => {
		if (accessToken) {
			getHistoryCardTransaction(currentPage3);
		}
	}, [currentPage3, sort3]);

	useEffect(() => {
		if (accessToken) {
			getHistoryBankingTransaction(currentPage4);
		}
	}, [currentPage4, sort4]);

	const getHistoryMomoTransaction = current => {
		setLoading1(true);
		axios
			.get(`${BASE_URL}/v1/webshops/transaction`, {
				params: {
					page: current,
					limit: apiCallPerPage.current,
					type: 'momo',
					sortBy: `createdAt:${sort1}`,
				},
				headers: { 'Authorization': `Bearer ${accessToken}` },
			})
			.then(response => {
				setHistoryMomoData(response.data.results);
				setTotalPage1(response.data.totalPages);
			})
			.catch(error => console.log(error))
			.finally(() => setLoading1(false));
	};

	const getHistoryCardTransaction = current => {
		setLoading3(true);
		axios
			.get(`${BASE_URL}/v1/webshops/transaction`, {
				params: {
					page: current,
					limit: apiCallPerPage.current,
					type: 'card',
					sortBy: `createdAt:${sort3}`,
				},
				headers: { 'Authorization': `Bearer ${accessToken}` },
			})
			.then(response => {
				setHistoryCardData(response.data.results);
				setTotalPage3(response.data.totalPages);
			})
			.catch(error => console.log(error))
			.finally(() => setLoading3(false));
	};

	const getHistoryBankingTransaction = current => {
		setLoading4(true);
		axios
			.get(`${BASE_URL}/v1/webshops/transaction`, {
				params: {
					page: current,
					limit: apiCallPerPage.current,
					type: 'banking',
					sortBy: `createdAt:${sort4}`,
				},
				headers: { 'Authorization': `Bearer ${accessToken}` },
			})
			.then(response => {
				setHistoryBankingData(response.data.results);
				setTotalPage4(response.data.totalPages);
			})
			.catch(error => console.log(error))
			.finally(() => setLoading4(false));
	};

	const getHistoryBuyItem = current => {
		setLoading2(true);
		axios
			.get(`${BASE_URL}/v1/webshops/listHistories`, {
				params: {
					page: current,
					limit: apiCallPerPage.current,
					sortBy: `createdAt:${sort2}`,
				},
				headers: { 'Authorization': `Bearer ${accessToken}` },
			})
			.then(response => {
				setHistoryBuyItem(response.data.results);
				setTotalPage2(response.data.totalPages);
			})
			.catch(error => console.log(error))
			.finally(() => setLoading2(false));
	};

	const generateItemType = type => {
		switch (type) {
			case 3:
				return 'Vũ khí';
			case 4:
				return 'Thú cưỡi';
			case 7:
				return 'Ngọc';

			default:
				break;
		}
	};

	const changeSort1 = () => {
		if (sort1 === 'desc') {
			setSort1('asc');
		} else {
			setSort1('desc');
		}
	};

	const changeSort2 = () => {
		if (sort2 === 'desc') {
			setSort2('asc');
		} else {
			setSort2('desc');
		}
	};

	const changeSort3 = () => {
		if (sort3 === 'desc') {
			setSort3('asc');
		} else {
			setSort3('desc');
		}
	};

	const changeSort4 = () => {
		if (sort4 === 'desc') {
			setSort4('asc');
		} else {
			setSort4('desc');
		}
	};

	return (
		<div className='history-transaction'>
			<h3 style={{ marginBottom: '32px' }}>Lịch sử giao dịch momo</h3>
			{loading1 ? (
				<p style={{ textAlign: 'center' }}>Loading...</p>
			) : (
				<>
					<Table striped bordered responsive>
						<thead>
							<tr>
								<th style={{ textAlign: 'center' }}>#</th>
								<th style={{ textAlign: 'center' }}>Mã giao dịch</th>
								<th style={{ textAlign: 'center' }}>Trạng thái</th>
								<th style={{ textAlign: 'center', cursor: 'pointer' }} onClick={changeSort2}>
									Thời gian {sort2 === 'desc' ? <ArrowDown /> : <ArrowUp />}
								</th>
							</tr>
						</thead>
						<tbody>
							{!!historyMomoData.length ? (
								historyMomoData.map((item, index) => (
									<tr key={index}>
										<td style={{ textAlign: 'center' }}>{index + 1}</td>
										<td style={{ textAlign: 'center' }}>{item.requestId}</td>
										<td style={{ textAlign: 'center' }}>{item.status}</td>
										<td style={{ textAlign: 'center' }}>{convertTime(item.createdAt)}</td>
									</tr>
								))
							) : (
								<tr style={{ textAlign: 'center' }}>
									<td colSpan={4}>Chưa có giao dịch nào</td>
								</tr>
							)}
						</tbody>
					</Table>
					{totalPage1 > 1 && (
						<PaginationComponent
							currentPage={currentPage1}
							setCurrentPage={setCurrentPage1}
							totalPage={totalPage1}
						/>
					)}
				</>
			)}

			<hr />

			<h3 style={{ margin: '32px 0' }}>Lịch sử giao dịch thẻ điện thoại</h3>
			{loading3 ? (
				<p style={{ textAlign: 'center' }}>Loading...</p>
			) : (
				<>
					<Table striped bordered responsive>
						<thead>
							<tr>
								<th style={{ textAlign: 'center' }}>#</th>
								<th style={{ textAlign: 'center' }}>Mã giao dịch</th>
								<th style={{ textAlign: 'center' }}>Nhà mạng</th>
								<th style={{ textAlign: 'center' }}>Mệnh giá</th>
								<th style={{ textAlign: 'center' }}>Mã thẻ</th>
								<th style={{ textAlign: 'center' }}>Số serial</th>
								<th style={{ textAlign: 'center' }}>Trạng thái</th>
								<th style={{ textAlign: 'center', cursor: 'pointer' }} onClick={changeSort2}>
									Thời gian {sort2 === 'desc' ? <ArrowDown /> : <ArrowUp />}
								</th>
							</tr>
						</thead>
						<tbody>
							{!!historyCardData.length ? (
								historyCardData.map((item, index) => (
									<tr key={index}>
										<td style={{ textAlign: 'center' }}>{index + 1}</td>
										<td style={{ textAlign: 'center' }}>{item.requestId}</td>
										<td style={{ textAlign: 'center' }}>{item.data.telco}</td>
										<td style={{ textAlign: 'center' }}>{item.data.amount}</td>
										<td style={{ textAlign: 'center' }}>{item.data.code}</td>
										<td style={{ textAlign: 'center' }}>{item.data.serial}</td>
										<td style={{ textAlign: 'center' }}>{item.status}</td>
										<td style={{ textAlign: 'center' }}>{convertTime(item.createdAt)}</td>
									</tr>
								))
							) : (
								<tr style={{ textAlign: 'center' }}>
									<td colSpan={8}>Chưa có giao dịch nào</td>
								</tr>
							)}
						</tbody>
					</Table>
					{totalPage3 > 1 && (
						<PaginationComponent
							currentPage={currentPage3}
							setCurrentPage={setCurrentPage3}
							totalPage={totalPage3}
						/>
					)}
				</>
			)}

			<hr />

			<h3 style={{ margin: '32px 0' }}>Lịch sử giao dịch banking</h3>
			{loading4 ? (
				<p style={{ textAlign: 'center' }}>Loading...</p>
			) : (
				<>
					<Table striped bordered responsive>
						<thead>
							<tr>
								<th style={{ textAlign: 'center' }}>#</th>
								<th style={{ textAlign: 'center' }}>Mã giao dịch</th>
								<th style={{ textAlign: 'center' }}>Số tiền</th>
								<th style={{ textAlign: 'center' }}>Trạng thái</th>
								<th style={{ textAlign: 'center', cursor: 'pointer' }} onClick={changeSort2}>
									Thời gian {sort2 === 'desc' ? <ArrowDown /> : <ArrowUp />}
								</th>
							</tr>
						</thead>
						<tbody>
							{!!historyBankingData.length ? (
								historyBankingData.map((item, index) => (
									<tr key={index}>
										<td style={{ textAlign: 'center' }}>{index + 1}</td>
										<td style={{ textAlign: 'center' }}>{item.requestId}</td>
										<td style={{ textAlign: 'center' }}>{item.amount}</td>
										<td style={{ textAlign: 'center' }}>{item.status}</td>
										<td style={{ textAlign: 'center' }}>{convertTime(item.createdAt)}</td>
									</tr>
								))
							) : (
								<tr style={{ textAlign: 'center' }}>
									<td colSpan={5}>Chưa có giao dịch nào</td>
								</tr>
							)}
						</tbody>
					</Table>
					{totalPage4 > 1 && (
						<PaginationComponent
							currentPage={currentPage4}
							setCurrentPage={setCurrentPage4}
							totalPage={totalPage4}
						/>
					)}
				</>
			)}

			<h3 style={{ margin: '32px 0' }}>Lịch sử mua vật phẩm</h3>
			{loading2 ? (
				<p style={{ textAlign: 'center' }}>Loading...</p>
			) : (
				<>
					<Table striped bordered responsive>
						<thead>
							<tr>
								<th style={{ textAlign: 'center' }}>#</th>
								<th style={{ textAlign: 'center' }}>Id</th>
								<th style={{ textAlign: 'center' }}>User</th>
								<th style={{ textAlign: 'center' }}>Player</th>
								<th style={{ textAlign: 'center' }}>Tên vật phẩm</th>
								<th style={{ textAlign: 'center' }}>Loại vật phẩm</th>
								<th style={{ textAlign: 'center' }}>Giá</th>
								<th style={{ textAlign: 'center' }}>Số lượng</th>
								<th style={{ textAlign: 'center', cursor: 'pointer' }} onClick={changeSort2}>
									Thời gian {sort2 === 'desc' ? <ArrowDown /> : <ArrowUp />}
								</th>
							</tr>
						</thead>
						<tbody>
							{!!historyBuyItem.length ? (
								historyBuyItem.map((item, index) => (
									<tr key={index}>
										<td style={{ textAlign: 'center' }}>{index + 1}</td>
										<td style={{ textAlign: 'center' }}>{item.itemId}</td>
										<td style={{ textAlign: 'center' }}>{item?.user}</td>
										<td style={{ textAlign: 'center' }}>{item?.player}</td>
										<td style={{ textAlign: 'center' }}>{item?.name}</td>
										<td style={{ textAlign: 'center' }}>{generateItemType(item.typeItem)}</td>
										<td style={{ textAlign: 'center' }}>{item.unitPrice}</td>
										<td style={{ textAlign: 'center' }}>{item.quantity}</td>
										<td style={{ textAlign: 'center' }}>{convertTime(item.createdAt)}</td>
									</tr>
								))
							) : (
								<tr style={{ textAlign: 'center' }}>
									<td colSpan={9}>Chưa có giao dịch nào</td>
								</tr>
							)}
						</tbody>
					</Table>
					{totalPage2 > 1 && (
						<PaginationComponent
							currentPage={currentPage2}
							setCurrentPage={setCurrentPage2}
							totalPage={totalPage2}
						/>
					)}
				</>
			)}
		</div>
	);
}
