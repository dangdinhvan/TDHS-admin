import './styles.css';
import { Table } from 'react-bootstrap';

export default function MomoRecharge({ isMomo = true }) {
	return (
		<div className='momo-recharge'>
			<Table striped bordered hover responsive>
				<thead>
					<tr>
						<td colSpan={2} style={{ fontWeight: '700', textAlign: 'center' }}>
							{isMomo ? 'Nạp ngọc qua momo' : 'Nạp ngọc qua internet banking'}
						</td>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Nội dung chuyển khoản:</td>
						<td>user nạp ngọc</td>
					</tr>
					<tr>
						<td>{isMomo ? 'Số điện thoại nhận tiền:' : 'Số tài khoản nhận tiền:'}</td>
						<td>123456</td>
					</tr>
					<tr>
						<td>Chủ tài khoản:</td>
						<td>admin</td>
					</tr>
				</tbody>
			</Table>
			<hr />
			<p>Lưu ý: Thời gian xử lý từ {isMomo ? '1-3' : '2-5'} phút</p>
			<p>(*) Cần ghi đúng nội dung chuyển khoản</p>
			<p>(*) Kiểm tra số điện thoại nhận tiền và chủ tài khoản</p>
			<p>(***) Những thẻ bị điền sai thông tin chúng tôi sẽ không chịu trách nhiệm và không bồi thường.</p>
		</div>
	);
}
