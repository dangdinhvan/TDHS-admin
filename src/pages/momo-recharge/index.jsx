import './styles.css';
import { Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';



export default function MomoRecharge({ isMomo = true }) {
const userInfo = useSelector(state => state.auth.userInfo);
	return (
		<div className='momo-recharge'>
			<Table striped bordered hover responsive>
				<thead>
					<tr>
						<td colSpan={2} style={{ fontWeight: '700', textAlign: 'center' }}>
							{isMomo ? 'Nạp coin qua momo' : 'Nạp coin qua internet banking'}
						</td>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Nội dung chuyển khoản:</td>
						<td>{userInfo.user}</td>
					</tr>
					<tr>
						<td>{isMomo ? 'Số điện thoại nhận tiền:' : 'Số tài khoản nhận tiền:'}</td>
						<td>0963225935</td>
					</tr>
					<tr>
						<td>Chủ tài khoản:</td>
						<td>PHAN THỊ NGỌC HUYỀN</td>
					</tr>
				</tbody>
			</Table>
			<hr />
			<p>Lưu ý: Thời gian xử lý từ {isMomo ? '1-3' : '2-5'} phút</p>
			<p>(*) Cần ghi đúng nội dung chuyển khoản</p>
			<p>(*) Kiểm tra số điện thoại nhận tiền và chủ tài khoản</p>
			<p>(***) Những thẻ hoặc nội dung chuyển bị điền sai thông tin chúng tôi sẽ không chịu trách nhiệm và không bồi thường.</p>
		</div>
	);
}
