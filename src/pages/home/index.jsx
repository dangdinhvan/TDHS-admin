import './styles.css';
import homeBanner from 'assets/images/banner3.png';

export default function Home() {
	return (
		<div className='home'>
			<img src={homeBanner} />
			<h3>CHÀO MỪNG CÁC HIỆP SĨ ĐÃ ĐẾN VỚI SEVER HIỆP SĨ TÍ HON</h3>
			<div className='home-content'>
				<b>- SERVER NÀY DO ĐỘI NGŨ HIỆP SĨ TÍ HON PHÁT TRIỂN VÀ VẬN HÀNH!</b>
				<p>- Server này có nhiều chức năng mới lạ cũng như lượng tài nguyên đủ để anh em sử dụng.</p>
				<p>- Server nhiều item mới lạ sẽ sớm được cập nhật nếu đông đảo người chơi có nhu cầu!</p>
				<br />
				<p>
					** Server này do những người am hiểu nhất về từng chỉ số của game Hiệp Sĩ Online phát triển và vận
					hành...
				</p>
				<br />
				<div className='webshop__alert'>
					<p>
						1. Để sử dụng chức năng ĐỔI COIN hoặc MUA ĐỒ TRONG WEBSHOP, các bạn lưu ý phải ĐĂNG XUẤT / THOÁT
						GAME trước khi thực hiện.
					</p>
					<p>
						2. Tắt Auto + Reconnect trong game (nên THOÁT hẳn game / TẮT giả lập) trước khi thực hiện giao
						dịch để tránh trường hợp vật phẩm hoặc lượng chưa được add vào nhận vật mà các bạn đã đăng nhập
						sẽ bị mất vật phẩm và lượng vừa giao dịch.
					</p>
					<p>
						3. Sau khi thực hiện giao dịch mua đồ hoặc đổi coin trên web, hãy kiên nhận đợi 3-5s trước khi
						đăng nhập vào game.
					</p>
					<p>
						4. Các trường hợp không đọc kỹ lưu ý + thông báo trước khi giao dịch trên web mà bị mất vật phẩm
						hoặc lượng, tiền giao dịch chúng tôi sẽ không chịu trách nhiệm và không đền bù.
					</p>
				</div>
			</div>
		</div>
	);
}
