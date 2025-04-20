import { BrowserRouter, Route, Routes } from 'react-router';
import Home from './pages/Home';
import LiveDirections from './components/LiveDirections';
import { ToastContainer } from 'react-toastify';


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/directions" element={<LiveDirections />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  )
}

export default App
