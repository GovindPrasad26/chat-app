import { Navigate, useNavigate } from "react-router-dom"
import LoggedUser from "./profileuser"
import { useEffect } from "react"
function Protect({children}){
          let navigate=useNavigate()
    useEffect(()=>{
        if(localStorage.getItem("token")){
             LoggedUser().then((res)=>{
                console.log(res,'jkfwkfe')
       localStorage.setItem("User",res.data.firstName)
                console.log("protect")
             }).catch((error)=>{
                console.log(error)
             })
        }else{
           navigate('/signin')
        }
    })
    return(<div>
   {children}
    </div>)
}
export default Protect;