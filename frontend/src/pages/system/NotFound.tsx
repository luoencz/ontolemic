import { Link } from 'react-router-dom';

export default function NotFound() {
	return (
		<div
			style={{
				height: '100vh',
				display: 'grid',
				placeItems: 'center',
			}}
		>
			<main style={{ textAlign: 'center', padding: 24 }}>
				<h1 style={{ margin: '0 0 12px' }}>
					Oops! This route leads to nowhere.
				</h1>
				<p style={{ margin: '8px 0 0' }}>
					<Link to="/" style={{ textDecoration: 'none' }}>
						Maybe you should turn back.
					</Link>
				</p>
			</main>
		</div>
	);
}




