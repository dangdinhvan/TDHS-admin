import './styles.css';
import axios from 'axios';
import { BASE_URL } from 'constants';
import { useEffect, useRef, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PaginationComponent from 'components/pagination';

export default function PostManager() {
	const [postsData, setPostsData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [totalPage, setTotalPage] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);
	const [deletePostClick, setDeletePostClick] = useState(true);

	const accessToken = localStorage.getItem('accessToken');

	const apiCallPerPage = useRef(20);

	const navigate = useNavigate();

	useEffect(() => {
		if (accessToken) {
			getPosts(currentPage);
		}
	}, [currentPage, deletePostClick]);

	const getPosts = async current => {
		setLoading(true);
		axios
			.get(`${BASE_URL}/v1/posts`, {
				params: {
					page: current,
					limit: apiCallPerPage.current,
				},
				headers: { 'Authorization': `Bearer ${accessToken}` },
			})
			.then(response => {
				setPostsData(response.data.results);
				setTotalPage(response.data.totalPages);
			})
			.catch(error => console.log(error))
			.finally(() => setLoading(false));
	};

	const deletePost = id => {
		axios
			.delete(`${BASE_URL}/v1/posts/${id}`, {
				headers: { 'Authorization': `Bearer ${accessToken}` },
			})
			.then(response => {
				setDeletePostClick(!deletePostClick);
				toast.success('Xóa bài thành công');
			})
			.catch(error => toast.error('Xóa bài thất bại'))
			.finally(() => setLoading(false));
	};

	return (
		<div className='post-manager'>
			<h3>Quản lý bài viết</h3>
			<Button className='post-manager__create' onClick={() => navigate('/post-editor')}>
				Tạo bài viết
			</Button>
			{loading ? (
				<p style={{ textAlign: 'center' }}>Loading...</p>
			) : (
				<>
					<Table striped bordered responsive>
						<thead>
							<tr>
								<th style={{ textAlign: 'center' }}>#</th>
								<th>Tiêu đề bài viết</th>
								<th style={{ textAlign: 'center' }}>Actions</th>
							</tr>
						</thead>
						<tbody>
							{postsData.map((item, index) => (
								<tr key={index}>
									<td style={{ textAlign: 'center' }}>{index + 1}</td>
									<td className='post-manager__content'>{item.title}</td>
									<td style={{ textAlign: 'center', width: '12%' }}>
										<Link to={`/post-editor/${item.id}`}>Chi tiết</Link>
										<span style={{ margin: '0 4px' }}>|</span>
										<Link style={{ color: 'red' }} onClick={() => deletePost(item.id)}>
											Xóa
										</Link>
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
		</div>
	);
}
