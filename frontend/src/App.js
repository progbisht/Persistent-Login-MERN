import Layout from "./components/Layout";
import Login from "./components/Login";
import Register from "./components/Register";
import LinkPage from "./components/LinkPage";
import Unauthorized from "./components/Unauthorized";
import RequireAuth from "./components/RequireAuth";
import Home from "./components/Home";
import Editor from "./components/Editor";
import Admin from "./components/Admin";
import Missing from "./components/Missing";
import {Routes, Route} from 'react-router-dom';
import PersistLogin from "./components/PersistLogin";


const ROLES = {
  'User' : 1000,
  'Editor' : 2000,
  'Admin' : 3000
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        <Route path="login" element={<Login/>} />
        <Route path="register" element={<Register/>} />
        <Route path="linkpage" element={<LinkPage/>} />
        <Route path="unauthorized" element={<Unauthorized/>}/>
      
      <Route element={<PersistLogin />}>
        <Route element={<RequireAuth allowedRoles={[ROLES.User]}/>}>
          <Route path="/" element={<Home/>} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.Editor]}/>}>
          <Route path="editor" element={<Editor/>} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]}/>}>
          <Route path="admin" element={<Admin/>} />
        </Route>
      </Route>
        <Route path="*" element={<Missing/>}/>
      
      </Route>
    </Routes>
  );
}

export default App;
