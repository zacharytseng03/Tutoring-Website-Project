import { useNavigate } from 'react-router-dom';

interface NavBarProp {
	Student?: string;
}

export default function NavBarComponent(prop: NavBarProp) {
	const navigate = useNavigate();

	const logOut = () => {
		localStorage.removeItem('email');
		navigate('/login');
	};

	const logOutElement = (
		<h1 className="navbar-brand" role="button" onClick={logOut}>
			Log out
		</h1>
	);

	const logInRegisterElement = (
		<div className="row">
			<a className="navbar-brand" href="login">
				Login
			</a>
			<a className="navbar-brand" href="register">
				Register
			</a>
		</div>
	);

	return (
		<nav className="navbar navbar-light px-5 bg-light">
			<div className="container">
				<h1 className="navbar-brand">
					{prop.Student ? `Student: ${prop.Student}` : 'Home'}
				</h1>
				<h1 className="navbar-brand">Tutoring Website</h1>
				{prop.Student ? logOutElement : logInRegisterElement}
			</div>
		</nav>
	);
}
