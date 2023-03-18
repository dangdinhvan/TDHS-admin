import './styles.css';
import homeBanner from 'assets/images/banner3.png';

export default function Home() {
	return (
		<div className='home'>
			<img src={homeBanner} />
			<h3>CHÀO MỪNG CÁC BẠN ĐẾN VỚI NSORAZE</h3>
			<div className='home-content'>
				<b>- SERVER NÀY KHÔNG DO ĐỘI NGŨ RAZE PHÁT TRIỂN VÀ VẬN HÀNH!</b>
				<p>- Server này có nhiều chức năng mới lạ cũng như lượng tài nguyên đủ để anh em sử dụng.</p>
				<p>- Server nhiều item mới lạ sẽ sớm được cập nhật nếu đông đảo người chơi có nhu cầu!</p>
				<p>
					- Các chức năng như <b> Luyện bí kíp, Nhiệm vụ, Nhiệm vụ danh vọng, Mắt,... </b>sẽ sớm được cập nhật
					nếu đông đảo người chơi có nhu cầu!
				</p>
				<br />
				<p>** Server này do những người am hiểu nhất về từng chỉ số của game Ninja School phát triển và vận hành...</p>
			</div>
		</div>
	);
}
