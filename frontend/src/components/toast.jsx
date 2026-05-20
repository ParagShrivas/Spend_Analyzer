// components/Toast.jsx

import React, { useEffect } from "react";
import "../css/toast.css";

const Toast = ({
     type = "success",
     message = "Toast Message",
     show,
     setShow,
}) => {

     // Auto Close
     useEffect(() => {

          if (show) {

               const timer = setTimeout(() => {
                    setShow(false);
               }, 3000);

               return () => clearTimeout(timer);

          }

     }, [show]);

     // Icons
     const icons = {
          success: "fa-circle-check",
          warning: "fa-triangle-exclamation",
          error: "fa-circle-xmark",
          info: "fa-circle-info",
     };

     if (!show) return null;

     return (
          <div className={`toast-box ${type}`}>

               <div className="toast-left">

                    <i
                         className={`fa-solid ${icons[type]}`}
                    ></i>

                    <p>{message}</p>

               </div>

               <i
                    className="fa-solid fa-xmark close-icon"
                    onClick={() => setShow(false)}
               ></i>

          </div>
     );
};

export default Toast;