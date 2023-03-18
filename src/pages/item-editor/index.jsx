import './styles.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BASE_URL } from 'constants';

export default function ItemEditor() {
	const { id, type } = useParams();

	const [itemName, setItemName] = useState('');
	const [itemId, setItemId] = useState('');
	const [itemType, setItemType] = useState('');
	const [part, setPart] = useState('');
	const [clazz, setClazz] = useState('');
	const [iconId, setIconId] = useState('');
	const [level, setLevel] = useState('');
	const [itemData, setItemData] = useState('');
	const [color, setColor] = useState('');
	const [price, setPrice] = useState('');
	const [content, setContent] = useState('');
	const [image, setImage] = useState('');

	const accessToken = localStorage.getItem('accessToken');

	const navigate = useNavigate();

	useEffect(() => {
		if (id) {
			getItemInfo();
		}
	}, []);

	const getItemInfo = () => {
		axios
			.get(`${BASE_URL}/v1/webshops/${type}/${id}`, {
				headers: { 'Authorization': `Bearer ${accessToken}` },
			})
			.then(response => {
				setItemName(response.data.name);
				setItemId(response.data.itemId);
				setItemType(response.data.type);
				setPart(response.data.part);
				setClazz(response.data.clazz);
				setLevel(response.data.level);
				setItemData(response.data.data);
				setColor(response.data.color);
				setPrice(response.data.price);
				setContent(response.data.content);
				setImage(response.data.image);

				if (type === '3') {
					setIconId(response.data.iconId);
				} else if (type === '4') {
					setIconId(response.data.icon);
				} else if (type === '7') {
					setIconId(response.data.imgId);
				}
			})
			.catch(error => console.log(error));
	};

	const handleCreateOrUpdate = () => {
		let data = {};

		if (type === '3') {
			data = {
				'name': itemName,
				'itemId': itemId, //n
				'type': itemType, //n
				'part': part, //n
				'clazz': clazz, //n
				'iconId': iconId, //n
				'level': level, //n
				'data': itemData,
				'color': color, //n
				'price': price, //n
				'content': content,
				'image': image,
			};
		} else if (type === '4') {
			data = {
				'itemId': itemId,
				'name': itemName,
				'content': content,
				'image': image,
				'price': price,
				'icon': iconId,
			};
		} else {
			data = {
				'itemId': itemId,
				'name': itemName,
				'content': content,
				'image': image,
				'price': price,
				'imgId': iconId,
			};
		}

		if (id) {
			axios
				.patch(`${BASE_URL}/v1/webshops/${type}/${id}`, data, {
					headers: { 'Authorization': `Bearer ${accessToken}` },
				})
				.then(response => {
					toast.success('cập nhật vật phẩm thành công');
					navigate('/item-manager');
				})
				.catch(() => {
					toast.error('cập nhật vật phẩm thất bại');
				});
		} else {
			axios
				.post(`${BASE_URL}/v1/webshops/${type}`, data, {
					headers: { 'Authorization': `Bearer ${accessToken}` },
				})
				.then(response => {
					toast.success('Tạo vật phẩm thành công');
					navigate('/item-manager');
				})
				.catch(() => {
					toast.error('Tạo vật phẩm thất bại');
				});
		}
	};

	const uploadImg = file => {
		const img = new FormData();
		img.append('file', file[0]);
		img.append('upload_preset', 'nt7j7qsd');

		axios
			.post('https://api.cloudinary.com/v1_1/tecinus/image/upload', img)
			.then(response => setImage(response.data.url))
			.catch(() => {
				toast.error('upload ảnh thất bại');
			});
	};

	return (
		<div className='item-editor'>
			<h3 style={{ marginBottom: '32px' }}>{!id ? 'Tạo mới vật phẩm' : 'Chỉnh sửa vật phẩm'}</h3>
			<div className='mb-4'>
				<div className='mb-2'>Tên vật phẩm</div>
				<Form.Control
					placeholder='Nhập tên vật phẩm'
					value={itemName}
					onChange={e => setItemName(e.target.value)}
				/>
			</div>

			<div className='mb-4'>
				<div className='mb-2'>itemId</div>
				<Form.Control placeholder='Nhập itemId' value={itemId} onChange={e => setItemId(e.target.value)} />
			</div>

			{type === '3' && (
				<>
					<div className='mb-4'>
						<div className='mb-2'>Type</div>
						<Form.Control
							placeholder='Nhập type'
							value={itemType}
							onChange={e => setItemType(e.target.value)}
						/>
					</div>

					<div className='mb-4'>
						<div className='mb-2'>Part</div>
						<Form.Control placeholder='Nhập part' value={part} onChange={e => setPart(e.target.value)} />
					</div>

					<div className='mb-4'>
						<div className='mb-2'>Clazz</div>
						<Form.Control placeholder='Nhập clazz' value={clazz} onChange={e => setClazz(e.target.value)} />
					</div>

					<div className='mb-4'>
						<div className='mb-2'>Level</div>
						<Form.Control placeholder='Nhập Level' value={level} onChange={e => setLevel(e.target.value)} />
					</div>

					<div className='mb-4'>
						<div className='mb-2'>Option trong game</div>
						<Form.Control
							placeholder='Nhập option trong game'
							value={itemData}
							onChange={e => setItemData(e.target.value)}
						/>
					</div>

					<div className='mb-4'>
						<div className='mb-2'>Màu sắc</div>
						<Form.Control
							placeholder='Nhập màu sắc'
							value={color}
							onChange={e => setColor(e.target.value)}
						/>
					</div>
				</>
			)}

			<div className='mb-4'>
				<div className='mb-2'>IconId</div>
				<Form.Control placeholder='Nhập iconId' value={iconId} onChange={e => setIconId(e.target.value)} />
			</div>

			<div className='mb-4'>
				<div className='mb-2'>Ảnh vật phẩm</div>
				<div className='item-editor__image-wrapper'>
					{image && <img src={image} />}
					<Dropzone
						onDrop={acceptedFiles => uploadImg(acceptedFiles)}
						multiple={false}
						accept={{ 'image/png': ['.png', '.jpeg', '.jpg', '.gif'] }}
					>
						{({ getRootProps, getInputProps }) => (
							<div
								{...getRootProps()}
								className='post-editor__upload-image mt-n6 mb-3 text-dark position-relative'
							>
								<input {...getInputProps()} />
								<Button variant='success'>Tải ảnh</Button>
							</div>
						)}
					</Dropzone>
				</div>
			</div>

			<div className='mb-4'>
				<div className='mb-2'>Giá coin</div>
				<Form.Control placeholder='Nhập giá coin' value={price} onChange={e => setPrice(e.target.value)} />
			</div>

			<div className='mb-4'>
				<div className='mb-2'>Mô tả vật phẩm</div>
				<Form.Control
					placeholder='Nhập tên vật phẩm'
					value={content}
					onChange={e => setContent(e.target.value)}
					as='textarea'
					rows={7}
				/>
			</div>

			<Button className='d-block mx-auto' onClick={handleCreateOrUpdate}>
				{id ? 'Cập nhật' : 'Tạo vật phẩm'}
			</Button>
		</div>
	);
}
