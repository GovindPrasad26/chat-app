import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ForgotPassword from "../authentatcation/reset";
// import LoginForm from "./authentication/login";
import SignUpForm from "../authentatcation/signup";
import LoginForm from "../authentatcation/login";
import Chatscreen from "./chat";

function App() {
  return (
  
      <div>
      

        {/* Routes */}
        <Routes>
          <Route path='/signup' element={<LoginForm />} />
          <Route path="/signin" element={<SignUpForm />} />
          <Route path="*" element={<LoginForm />} /> {/* Redirect unknown paths to Sign In */}
          <Route path='/forgot' element={<ForgotPassword/>}/>
          <Route path='/home' element={<Chatscreen/>}/>
        </Routes>
      </div>
   
  );
}

export default App;

// import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import Login from "./logins";
// import SignUpForm from "./signups";
// import WHtup from "./whtup";
// import Protect from "./protecteroute";
// function App() {
//   return (
//     <>
//        {/* 🔥 always mounted → API calls successfully */}

//       <Routes>
//         <Route path="/signin" element={<Login />} />
//         <Route path="/signup" element={<SignUpForm />} />


//         <Route path="/whtup" element={<Protect>
//           <WHtup/>
//         </Protect>} />

//         <Route path="*" element={<Login />} />
        
//       </Routes>
//     </>
//   );
// }

// export default App;
