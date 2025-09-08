export default function Maintenance() {
	return (
		<div
			style={{
				height: '100vh',
				display: 'grid',
				placeItems: 'center',
			}}
		>
			<main style={{ textAlign: 'center', padding: 24 }}>
				<h1 style={{ margin: '0 0 12px' }}>Temporarily unavailable</h1>
				<p style={{ margin: '8px 0 0' }}>
					We&apos;re performing some maintenance. Please check back soon.
				</p>
				<p style={{ margin: '24px 0 0', fontSize: 12, opacity: 0.7 }}>
					Developers: append <code>?maintenance=1</code> to the URL or set cookie
					<code>maintenance_override=1</code> to preview the page.
				</p>
			</main>
		</div>
	);
}


