import React, { useState } from 'react';

const Login = ({ onLogin }) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!username || !password) {
			setError('Both fields are required!');
			return;
		}
		setError('');
		onLogin(username, password);
	};

	return (
		<div className="login-container southern-banner">
			<form className="login-form" onSubmit={handleSubmit}>
				<img src="https://seo.nlx.org/southernco/img/logo.svg" alt="SouthernCompany Logo" />
				<h2>Dashboard Login</h2>
				{error && <p className="error">{error}</p>}
				<input
					type="text"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button style={{ width: "35%" }} type="submit">Login</button>
			</form>
		</div>
	);
};

export default Login;
