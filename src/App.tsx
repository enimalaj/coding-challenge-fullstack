import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import axios from 'axios'
import { Dashboard } from './pages/Dashboard';
import './App.css';
function App() {

  axios.defaults.headers.common = {
    "Authorization": 'Client-ID 31d8a92601d01ad'
  };
  
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
   <Dashboard />
    </QueryClientProvider>
  );
}

export default App;
