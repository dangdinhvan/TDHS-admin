import Editor from '@draft-js-plugins/editor';
import createImagePlugin from '@draft-js-plugins/image';
import '@draft-js-plugins/image/lib/plugin.css';
import axios from 'axios';
import { EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import 'draft-js/dist/Draft.css';
import { useEffect, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import './styles.css';
import { BASE_URL } from 'constants';
import { stateFromHTML } from 'draft-js-import-html';

const imagePlugin = createImagePlugin();
const plugins = [imagePlugin];

export default function PostEditor() {
	const [editorState, setEditorState] = useState(EditorState.createEmpty());
	const [content, setContent] = useState('');
	const [postTitle, setPostTitle] = useState('');

	const { id } = useParams();

	const editor = useRef(null);

	const accessToken = localStorage.getItem('accessToken');

	useEffect(() => {
		if (id) {
			axios
				.get(`${BASE_URL}/v1/posts/${id}`, {
					headers: { 'Authorization': `Bearer ${accessToken}` },
				})
				.then(response => {
					const contentData = stateFromHTML(response.data.content);
					const data = EditorState.createWithContent(contentData);
					setEditorState(data);
					setPostTitle(response.data.title);
				})
				.catch(error => console.log(error));
		}
	}, [id]);

	useEffect(() => {
		const html = convertContentToHTML();
		setContent(html);
	}, [editorState]);

	const convertContentToHTML = () => {
		const contentState = editorState.getCurrentContent();
		return stateToHTML(contentState);
	};

	const onChange = data => {
		setEditorState(data);
	};

	const uploadImg = file => {
		const img = new FormData();
		img.append('file', file[0]);
		img.append('upload_preset', 'nt7j7qsd');

		axios
			.post('https://api.cloudinary.com/v1_1/tecinus/image/upload', img)
			.then(response => addImage(response.data.url))
			.catch(() => {
				toast.error('upload ảnh thất bại');
			});
	};

	const addImage = url => {
		const initialEditorState = editorState;
		const newEditorState = imagePlugin.addImage(initialEditorState, url);
		setEditorState(newEditorState);
	};

	const handleCreatePost = () => {
		const data = { content: content, title: postTitle };
		axios
			.post(`${BASE_URL}/v1/posts`, data, { headers: { 'Authorization': `Bearer ${accessToken}` } })
			.then(response => toast.success('Tạo bài viết thành công'))
			.catch(() => {
				toast.error('Tạo bài viết thất bại');
			});
	};

	const handleUpdatePost = () => {
		const data = { content: content, title: postTitle };
		axios
			.patch(`${BASE_URL}/v1/posts/${id}`, data, { headers: { 'Authorization': `Bearer ${accessToken}` } })
			.then(() => toast.success('Cập nhật bài viết thành công'))
			.catch(() => {
				toast.error('Cập nhật bài viết thất bại');
			});
	};

	return (
		<div className='post-editor'>
			<h3 style={{ marginBottom: '32px' }}>{!id ? 'Tạo bài viết' : 'Chi tiết bài viết'}</h3>
			<div className='mb-4'>
				<div className='mb-2'>Tiêu đề bài viết</div>
				<Form.Control
					placeholder='Nhập tiêu đề'
					value={postTitle}
					onChange={e => setPostTitle(e.target.value)}
				/>
			</div>

			<Dropzone
				onDrop={acceptedFiles => uploadImg(acceptedFiles)}
				accept={{ 'image/png': ['.png', '.jpeg', '.jpg', '.gif'] }}
			>
				{({ getRootProps, getInputProps }) => (
					<div
						{...getRootProps()}
						className='post-editor__upload-image mt-n6 mb-3 text-dark position-relative'
					>
						<input {...getInputProps()} />
						<Button variant='success'>Thêm ảnh</Button>
					</div>
				)}
			</Dropzone>

			<div>
				<div className='mb-2'>Nội dung bài viết</div>
				<div className='richtext-editor'>
					<Editor
						editorState={editorState}
						onChange={onChange}
						plugins={plugins}
						ref={editor}
						placeholder='Nhập nội dung'
					/>
				</div>
			</div>

			{id ? (
				<Button className='post-editor__create-post' onClick={handleUpdatePost}>
					Cập nhật bài viết
				</Button>
			) : (
				<Button className='post-editor__create-post' onClick={handleCreatePost}>
					Tạo bài viết
				</Button>
			)}
		</div>
	);
}
