import { useState } from "react";
import { useEffect } from "react";
import Login from "../components/Login";
import axios from "axios";
import Cookies from "js-cookie"
import Dashboard from "../components/Dashboard";

const Admin = () => {

  
  const [user, setUser] = useState(null);
  useEffect(()=>{
    const getUser = async()=>{
      const token = Cookies.get("token");
      if(!token){
        console.log("Auth me stats: No token yet")
        return ;
      }
      try{
        const response = await axios.get("http://localhost:3000/api/admin/me", {
          withCredentials: true,
        })
        console.log("Auth me status: ", response.status)
        setUser(response.data.admin);
      }catch(error){
        console.error("Auth me error : ", error);
      }
    }
    getUser();
  }, [])

  if(!user) return  <Login setUser = {setUser}/>
  return (
    <div>
      <Dashboard user = {user} setUser={setUser}/>
    </div>
  );
};

export default Admin;
