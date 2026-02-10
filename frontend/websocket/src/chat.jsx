

// import { io } from "socket.io-client";
// import { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { FaArrowLeft, FaPaperPlane, FaSmile, FaImage } from "react-icons/fa";

// function Chatscreen() {
//   const [users, setUsers] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loggedUser, setLoggedUser] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [chatId, setChatId] = useState(null);

//   const token = localStorage.getItem("token");
//   const userData = localStorage.getItem("user");
//   const loggedUserInfo = userData ? JSON.parse(userData) : null;

//   // Initialize socket once
//   const socket = useRef(io("http://localhost:5000", { transports: ["websocket"] })).current;

//   // Fetch users
//   useEffect(() => {
//     if (loggedUserInfo) setLoggedUser(loggedUserInfo);

//     axios
//       .get("http://localhost:5000/expectloggeduser", { headers: { Authorization: `Bearer ${token}` } })
//       .then((res) => res.data.ok && setUsers(res.data.result))
//       .catch((err) => console.error(err));
//   }, [token]);

//   // Socket listener (once)
//   useEffect(() => {
//     socket.on("receiveMessage", (data) => {
//       if (data.chatID === chatId) setMessages((prev) => [...prev, data]);
//     });
//     return () => socket.off("receiveMessage");
//   }, [chatId, socket]);

//   // Open or create chat
//   const handleUserClick = async (user) => {
//     setSelectedUser(user);
//     try {
//       const res = await axios.post(
//         "http://localhost:5000/chatcreate",
//         { selectedUserId: user._id },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const newChatId = res.data.chat._id;
//       socket.emit("joinRoom", newChatId);
//       setChatId(newChatId);
//       setMessages(res.data.chat.messages || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Send message
//   const handleSendMessage = () => {
//     if (!newMessage.trim()) return;

//     const messageObj = {
//       chatID: chatId,
//       senderId: loggedUser.id,
//       senderName: loggedUser.firstName,
//       text: newMessage,
//       time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//     };

//     socket.emit("sendMessage", messageObj);
//     setMessages((prev) => [...prev, messageObj]);
//     setNewMessage("");
//   };

//   const filteredUsers = users.filter((u) => u.firstName.toLowerCase().includes(search.toLowerCase()));

//   return (
//     <div style={{ width: "400px", height: "600px", border: "1px solid #ccc", borderRadius: "10px", overflow: "hidden", fontFamily: "Arial, sans-serif", display: "flex", flexDirection: "column" }}>
//       {!selectedUser ? (
//         <>
//           <div style={{ display: "flex", alignItems: "center", padding: "10px", borderBottom: "1px solid #eee", background: "#f5f5f5" }}>
//             {loggedUser && <>
//               <img src={`https://i.pravatar.cc/40?u=${loggedUser.id}`} alt="profile" style={{ borderRadius: "50%", marginRight: "10px" }} />
//               <span style={{ fontWeight: "bold" }}>{loggedUser.firstName}</span>
//             </>}
//           </div>
//           <div style={{ padding: "10px", borderBottom: "1px solid #eee", display: "flex", alignItems: "center", background: "#fafafa" }}>
//             <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, padding: "8px", borderRadius: "20px", border: "1px solid #ccc", outline: "none" }} />
//           </div>
//           <div style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
//             {filteredUsers.map((user) => (
//               <div key={user._id} style={{ display: "flex", alignItems: "center", padding: "10px", borderBottom: "1px solid #eee", cursor: "pointer" }} onClick={() => handleUserClick(user)}>
//                 <img src={`https://i.pravatar.cc/40?u=${user._id}`} alt="profile" style={{ borderRadius: "50%", marginRight: "10px" }} />
//                 <span style={{ fontWeight: "bold" }}>{user.firstName}</span>
//               </div>
//             ))}
//           </div>
//         </>
//       ) : (
//         <>
//           <div style={{ display: "flex", alignItems: "center", padding: "10px", borderBottom: "1px solid #eee", background: "#f5f5f5" }}>
//             <FaArrowLeft onClick={() => setSelectedUser(null)} style={{ cursor: "pointer", marginRight: "10px" }} />
//             <img src={`https://i.pravatar.cc/40?u=${selectedUser._id}`} alt="profile" style={{ borderRadius: "50%", marginRight: "10px" }} />
//             <span style={{ fontWeight: "bold" }}>{selectedUser.firstName}</span>
//           </div>
//           <div style={{ flex: 1, padding: "10px", overflowY: "auto", background: "#e5ddd5", display: "flex", flexDirection: "column" }}>
//             {messages.length === 0 ? <div style={{ textAlign: "center", marginTop: "50%", color: "#777" }}>No messages yet</div> :
//               messages.map((msg, index) => (
//                 <div key={index} style={{
//                   alignSelf: msg.senderId === loggedUser.id ? "flex-end" : "flex-start",
//                   background: msg.senderId === loggedUser.id ? "#dcf8c6" : "skyblue",
//                   margin: "5px", padding: "8px 12px", borderRadius: "15px", maxWidth: "70%", boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
//                 }}>
//                   <div style={{ fontSize: "12px", fontWeight: "bold" }}>{msg.senderName}</div>
//                   <div style={{ fontSize: "14px" }}>{msg.text}</div>
//                   <div style={{ fontSize: "10px", textAlign: "right", color: "#777" }}>{msg.time}</div>
//                 </div>
//               ))}
//           </div>
//           <div style={{ display: "flex", alignItems: "center", padding: "10px", background: "#f5f5f5", borderTop: "1px solid #ddd" }}>
//             <FaSmile style={{ marginRight: "10px", cursor: "pointer" }} />
//             <FaImage style={{ marginRight: "10px", cursor: "pointer" }} />
//             <input type="text" placeholder="Type a message" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} style={{ flex: 1, padding: "8px 10px", borderRadius: "20px", border: "1px solid #ccc", outline: "none" }} />
//             <FaPaperPlane onClick={handleSendMessage} style={{ marginLeft: "10px", cursor: "pointer", color: "#0084ff" }} />
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default Chatscreen;


import { io } from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, FaPaperPlane, FaSmile, FaImage, FaSearch, 
  FaEllipsisV, FaCheckDouble, FaUserCircle, FaSignOutAlt, 
  FaUserCog, FaLaptop, FaMobileAlt 
} from "react-icons/fa";

function Chatscreen() {
  const navigate = useNavigate();
  
  // State Management
  const [view, setView] = useState("chat"); // 'chat' or 'account'
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loggedUser, setLoggedUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatId, setChatId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deviceList, setDeviceList] = useState([]);

  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");
  const loggedUserInfo = userData ? JSON.parse(userData) : null;

  const socket = useRef(null);
  const scrollRef = useRef();
  const menuRef = useRef();

  // Initialization & Socket Connection
  useEffect(() => {
    socket.current = io("https://chat-app-n7hn.onrender.com", { transports: ["websocket"] });
    if (loggedUserInfo) setLoggedUser(loggedUserInfo);

    // Fetch Users
    axios
      .get("https://chat-app-n7hn.onrender.com/expectloggeduser", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.data.ok && setUsers(res.data.result))
      .catch((err) => console.error(err));

    // Close dropdown on outside click
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      socket.current.disconnect();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [token]);

  // Handle Incoming Messages (Prevents Double Printing)
  useEffect(() => {
    if (!socket.current) return;
    socket.current.on("receiveMessage", (data) => {
      // Logic: Only append if the message belongs to this chat AND isn't from me
      if (data.chatID === chatId && data.senderId !== loggedUserInfo?.id) {
        setMessages((prev) => [...prev, data]);
      }
    });
    return () => socket.current.off("receiveMessage");
  }, [chatId, loggedUserInfo?.id]);

  // Auto-scroll messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Actions
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const openAccountCentre = async () => {
    setMenuOpen(false);
    try {
      const res = await axios.get("https://chat-app-n7hn.onrender.com/account/devices", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.ok) {
        setDeviceList(res.data.devices);
        setView("account");
        setSelectedUser(null); // Clear active chat on mobile view
      }
    } catch (err) {
      console.error("Error fetching devices", err);
    }
  };

  const handleUserClick = async (user) => {
    setView("chat");
    setSelectedUser(user);
    try {
      const res = await axios.post(
        "https://chat-app-n7hn.onrender.com/chatcreate",
        { selectedUserId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newChatId = res.data.chat._id;
      socket.current.emit("joinRoom", newChatId);
      setChatId(newChatId);
      setMessages(res.data.chat.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !chatId) return;
    const messageObj = {
      chatID: chatId,
      senderId: loggedUser.id,
      senderName: loggedUser.firstName,
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    socket.current.emit("sendMessage", messageObj);
    setMessages((prev) => [...prev, messageObj]); // Local update
    setNewMessage("");
  };

  const filteredUsers = users.filter((u) => u.firstName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="app-viewport">
      <div className="main-chat-card">
        
        {/* SIDEBAR: Hidden on mobile if viewing chat or account details */}
        <div className={`sidebar-section ${(selectedUser || view === "account") ? "hide-on-mobile" : ""}`}>
          <div className="sidebar-header">
            <div className="user-profile-info">
              <img src={`https://i.pravatar.cc/100?u=${loggedUser?.id}`} alt="me" className="avatar-img" />
              <span className="logged-user-name">{loggedUser?.firstName || "User"}</span>
            </div>
            
            <div className="menu-container" ref={menuRef}>
              <FaEllipsisV className="menu-icon" onClick={() => setMenuOpen(!menuOpen)} />
              {menuOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-item user-label">
                    <FaUserCircle /> <span>{loggedUser?.firstName}</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item" onClick={openAccountCentre}>
                    <FaUserCog /> <span>Account Centre</span>
                  </div>
                  <div className="dropdown-item logout" onClick={handleLogout}>
                    <FaSignOutAlt /> <span>Logout</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="search-container">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Search contacts..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
            </div>
          </div>

          <div className="contacts-list">
            {filteredUsers.map((user) => (
              <div key={user._id} className="contact-item" onClick={() => handleUserClick(user)}>
                <img src={`https://i.pravatar.cc/100?u=${user._id}`} alt="p" className="avatar-img" />
                <div className="contact-detail">
                  <span className="contact-name">{user.firstName}</span>
                  <p className="contact-preview">Click to chat</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN DISPLAY AREA */}
        <div className={`chat-section ${(!selectedUser && view === "chat") ? "hide-on-mobile" : ""}`}>
          
          {/* VIEW: ACCOUNT CENTRE */}
          {view === "account" ? (
            <div className="account-container">
              <div className="header-bar">
                <FaArrowLeft className="back-btn" onClick={() => setView("chat")} />
                <h2>Account Centre</h2>
              </div>
              <div className="account-content">
                <h3>Linked Devices</h3>
                <p>History of devices used to access your account.</p>
                <div className="device-list">
                  {deviceList.map((dev, idx) => (
                    <div key={idx} className="device-card">
                      <div className="dev-icon">
                        {dev.deviceType === "mobile" ? <FaMobileAlt /> : <FaLaptop />}
                      </div>
                      <div className="dev-info">
                        <strong>{dev.os} • {dev.browser}</strong>
                        {/* <span>IP: {dev.ipAddress}</span> */}
                        <small>{new Date(dev.loginAt).toLocaleString()}</small>
                      </div>
                      {idx === 0 && <span className="active-badge">Active</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* VIEW: CHAT INTERFACE */
            selectedUser ? (
              <>
                <div className="header-bar">
                  <FaArrowLeft className="back-btn" onClick={() => setSelectedUser(null)} />
                  <img src={`https://i.pravatar.cc/100?u=${selectedUser._id}`} alt="p" className="avatar-img" />
                  <span className="chat-name">{selectedUser.firstName}</span>
                </div>

                <div className="messages-area">
                  {messages.map((msg, index) => (
                    <div key={index} className={`msg-row ${msg.senderId === loggedUser.id ? "sent" : "received"}`}>
                      <div className="bubble">
                        <p>{msg.text}</p>
                        <div className="meta">
                          <span>{msg.time}</span>
                          {msg.senderId === loggedUser.id && <FaCheckDouble className="tick" />}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={scrollRef} />
                </div>

                <div className="footer-input">
                  <FaSmile className="icon" />
                  <FaImage className="icon" />
                  <input 
                    type="text" 
                    placeholder="Type a message..." 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button className="send-btn" onClick={handleSendMessage}>
                    <FaPaperPlane />
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <FaUserCircle size={80} color="#e5e7eb" />
                <h3>Welcome, {loggedUser?.firstName}</h3>
                <p>Select a contact to start messaging.</p>
              </div>
            )
          )}
        </div>
      </div>

      <style jsx>{`
        .app-viewport {
          height: 100vh; width: 100vw; background: #d1d5db;
          display: flex; justify-content: center; align-items: center;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .main-chat-card {
          width: 95%; max-width: 1200px; height: 90vh;
          display: flex; background: #fff; border-radius: 12px;
          overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
        }

        /* Sidebar */
        .sidebar-section { width: 350px; border-right: 1px solid #e5e7eb; display: flex; flex-direction: column; background: #f9fafb; }
        .sidebar-header { padding: 15px 20px; background: #f3f4f6; display: flex; align-items: center; justify-content: space-between; }
        .user-profile-info { display: flex; align-items: center; gap: 10px; }
        .avatar-img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; background: #eee; }
        .logged-user-name { font-weight: 600; font-size: 15px; color: #111827; }
        .menu-icon { cursor: pointer; color: #4b5563; }

        /* Dropdown */
        .menu-container { position: relative; }
        .dropdown-menu {
          position: absolute; right: 0; top: 30px; width: 200px;
          background: #fff; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
          z-index: 50; padding: 5px 0; border: 1px solid #e5e7eb;
        }
        .dropdown-item { padding: 10px 15px; display: flex; align-items: center; gap: 10px; font-size: 14px; cursor: pointer; }
        .dropdown-item:hover { background: #f3f4f6; }
        .dropdown-item.user-label { font-weight: 700; color: #4f46e5; pointer-events: none; }
        .dropdown-item.logout { color: #ef4444; }
        .dropdown-divider { height: 1px; background: #e5e7eb; margin: 4px 0; }

        .search-container { padding: 10px 15px; }
        .search-input-wrapper { background: #fff; border: 1px solid #e5e7eb; border-radius: 9999px; display: flex; align-items: center; padding: 0 12px; }
        .search-input-wrapper input { width: 100%; border: none; padding: 8px; outline: none; background: transparent; }

        .contacts-list { flex: 1; overflow-y: auto; }
        .contact-item { display: flex; padding: 12px 20px; cursor: pointer; border-bottom: 1px solid #f3f4f6; transition: 0.2s; }
        .contact-item:hover { background: #f3f4f6; }
        .contact-detail { margin-left: 12px; }
        .contact-name { font-weight: 600; font-size: 15px; display: block; }
        .contact-preview { font-size: 12px; color: #6b7280; }

        /* Main Section */
        .chat-section { flex: 1; display: flex; flex-direction: column; background: #fff; }
        .header-bar { height: 65px; padding: 0 20px; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; background: #fff; }
        .chat-name { font-weight: 700; margin-left: 12px; font-size: 16px; }
        .back-btn { cursor: pointer; margin-right: 15px; color: #4f46e5; }

        /* Account Centre */
        .account-container { flex: 1; display: flex; flex-direction: column; background: #f9fafb; }
        .account-content { padding: 30px; overflow-y: auto; }
        .device-list { margin-top: 20px; display: flex; flex-direction: column; gap: 12px; }
        .device-card { background: #fff; padding: 15px; border-radius: 12px; border: 1px solid #e5e7eb; display: flex; align-items: center; gap: 15px; }
        .dev-icon { width: 45px; height: 45px; background: #eef2ff; color: #4f46e5; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .dev-info { display: flex; flex-direction: column; flex: 1; }
        .dev-info span { font-size: 12px; color: #6b7280; }
        .dev-info small { font-size: 11px; color: #9ca3af; }
        .active-badge { background: #dcfce7; color: #166534; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 9999px; }

        /* Messaging */
        .messages-area { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; background: #f3f4f6; }
        .msg-row { display: flex; width: 100%; }
        .msg-row.sent { justify-content: flex-end; }
        .bubble { max-width: 70%; padding: 10px 14px; border-radius: 12px; position: relative; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .sent .bubble { background: #4f46e5; color: #fff; border-bottom-right-radius: 2px; }
        .received .bubble { background: #fff; color: #111827; border-bottom-left-radius: 2px; }
        .meta { display: flex; justify-content: flex-end; align-items: center; gap: 4px; font-size: 10px; margin-top: 4px; opacity: 0.8; }
        .tick { color: #10b981; }

        .footer-input { padding: 15px 20px; display: flex; align-items: center; gap: 12px; border-top: 1px solid #e5e7eb; }
        .footer-input input { flex: 1; background: #f3f4f6; border: none; padding: 10px 15px; border-radius: 9999px; outline: none; }
        .send-btn { background: #4f46e5; color: #fff; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
        .send-btn:hover { background: #4338ca; transform: scale(1.05); }

        .empty-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; color: #9ca3af; }

        /* Responsive Mobile */
        @media (max-width: 850px) {
          .main-chat-card { width: 100%; height: 100vh; border-radius: 0; }
          .sidebar-section { width: 100%; }
          .hide-on-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default Chatscreen;