// // /*CREATED BY NIKITA S RAJ KAPINI(19/06/2025)*/

// // import React, { useState, useEffect, useRef } from 'react';
// // import './Sidebar.css';

// // const Sidebar: React.FC = () => {
// //   const [showDropdown, setShowDropdown] = useState(false);
// //   const dropdownRef = useRef<HTMLDivElement>(null);

// //   // Click outside to close dropdown
// //   useEffect(() => {
// //     const handleClickOutside = (event: MouseEvent) => {
// //       if (
// //         dropdownRef.current &&
// //         !dropdownRef.current.contains(event.target as Node)
// //       ) {
// //         setShowDropdown(false);
// //       }
// //     };
// //     document.addEventListener('mousedown', handleClickOutside);
// //     return () => document.removeEventListener('mousedown', handleClickOutside);
// //   }, []);

// //   const handleLogout = () => {
// //     localStorage.removeItem('token');
// //     window.location.href = '/';
// //   };

// //   return (
// //     <div className="compact-sidebar">
// //       <div className="avatar-section" ref={dropdownRef}>
// //         <img
// //           src="/profile.svg"
// //           alt="User Avatar"
// //           className="avatar-icon"
// //           onClick={() => setShowDropdown((prev) => !prev)}
// //         />
// //         {showDropdown && (
// //           <div className="avatar-dropdown">
// //             <button onClick={handleLogout}>Logout</button>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default Sidebar;


// /* CREATED BY NIKITA S RAJ KAPINI (19/06/2025) */
// /*UPDATED BY NIKITA S RAJ KAPINI (20/06/2025)*/

// import React, { useState, useEffect, useRef } from 'react';
// import './Sidebar.css';
// import { getUserEmailFromToken } from '../utils/userId';

// const Sidebar: React.FC = () => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const email = getUserEmailFromToken(); 

//   // Click outside to close dropdown
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setShowDropdown(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     window.location.href = '/';
//   };

//   const handleChangePassword = () => {
//     alert("Change Password feature coming soon!"); // placeholder for now
//     // TODO: Open modal or redirect to password change page
//   };

//   return (
//     <div className="compact-sidebar">
//       <div className="avatar-section" ref={dropdownRef}>
//         <img
//           src="/profile.svg"
//           alt="User Avatar"
//           className="avatar-icon"
//           onClick={() => setShowDropdown((prev) => !prev)}
//         />
//         {showDropdown && (
//           <div className="avatar-dropdown">
//             <div className="text_dropdown">My EduAssess Account</div>
//             {email && (
//               <div className="user-email" title={email}>
//                 {email.length > 25 ? email.slice(0, 22) + '...' : email}
//               </div>
//             )}
//             <button onClick={handleChangePassword}>Change Password</button>
//             <br></br>
//             <button onClick={handleLogout}>Logout</button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Sidebar;


/* CREATED BY NIKITA S RAJ KAPINI (19/06/2025) */
/* UPDATED BY NIKITA S RAJ KAPINI (20/06/2025) — Added Change Password Modal */

import React, { useState, useEffect, useRef } from 'react';
import './Sidebar.css';
import LogoutModal from './LogoutModal';
import { getUserEmailFromToken } from '../utils/userId';
import ChangePassword from './changepassword';

const Sidebar: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const email = getUserEmailFromToken();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <>
      <div className="compact-sidebar">
        <div className="avatar-section" ref={dropdownRef}>
          <img
            src="/profile.svg"
            alt="User Avatar"
            className="avatar-icon"
            onClick={() => setShowDropdown((prev) => !prev)}
          />
          {showDropdown && (
            <div className="avatar-dropdown">
              <div className="text_dropdown">My EduAssess Account</div>
              {email && (
                <div className="user-email" title={email}>
                  {email.length > 25 ? email.slice(0, 22) + '...' : email}
                </div>
              )}
              <button onClick={() => {
                setShowDropdown(false);
                setShowChangeModal(true);
              }}>
                Change Password
              </button>
              <button onClick={() => setShowModal(true)} className="logout-button">Logout</button>
              <LogoutModal
                isOpen={showModal}
                onConfirm={handleLogout}
                onCancel={() => setShowModal(false)}
            />
            </div>
          )}
        </div>
      </div>

      {showChangeModal && (
        <ChangePassword onClose={() => setShowChangeModal(false)} />
      )}
    </>
  );
};

export default Sidebar;
