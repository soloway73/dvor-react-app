import { AuthInitializer } from './components/Auth/AuthInitializer';
import { AppRoutes } from './App.routes';
import './styles/variables.css';
import './styles/global.css';

function App() {
  return (
    <AuthInitializer>
      <AppRoutes />
    </AuthInitializer>
  );
}

export default App;
