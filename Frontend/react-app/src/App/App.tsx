import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import HomePage from './Pages/HomePage';
import RegisterPage from './Pages/RegisterPage';
import StudentPage from './Pages/StudentPage';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<HomePage />} />
				<Route path="login" element={<LoginPage />} />
				<Route path="register" element={<RegisterPage />} />
				<Route path="student" element={<StudentPage />} />
				<Route path="*" element={<h1>404 PAGE NOT FOUND</h1>} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
