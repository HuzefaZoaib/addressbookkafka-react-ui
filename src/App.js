import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './components/Layout';
import Home from './components/Home';
import Addressess from './components/Addresses';
import AddressAdd from './components/AddressAdd-ReactFormHook';
import { SystemCheck } from "./components/SystemCheck";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="systemCheck" element={<SystemCheck />} />
          <Route path="list" element={<Addressess />} />
          {/* <Route path="*" element={<NoPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
