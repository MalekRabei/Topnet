import React from "react";

export const NotificationAlertOptions = (type, title, message) => {
  let options = {
    place: "tc",
    message: (
      <div className="alert-text">
        <span className="alert-title" data-notify="title">
          {" "}
          {title}
        </span>
        <span data-notify="message">{message}</span>
      </div>
    ),
    type: type,
    icon: "ni ni-bell-55",
    autoDismiss: 7,
  };
  return options;
};

export default NotificationAlertOptions;
