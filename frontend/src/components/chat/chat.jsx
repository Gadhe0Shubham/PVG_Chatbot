import React from "react";
import "./chat.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faUser } from "@fortawesome/free-solid-svg-icons";

export default function Chat(props) {
  const { data, onAction } = props;
  
  // Safety check for data
  if (!data || typeof data !== 'object') {
    return <div></div>;
  }
  
  if (data["created_by"] === "server") {
    return (
      <div className="w-full flex items-start p-3 mb-2">
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-3 mt-1">
          <FontAwesomeIcon className="text-white text-sm" icon={faRobot} />
        </div>
        <div className="flex-1 max-w-xs">
          <div className="chat-message-server flex items-center justify-start p-3">
            <p className="whitespace-normal">{data.message || "No message"}</p>
          </div>
          {data["related"] && data["related"] !== null && (
            <div className="mt-2 flex flex-wrap">
              {Object.values(data["related"]).map((value, index) => (
                <button
                  key={index}
                  className="direct-btn"
                  onClick={() => {
                    onAction(value["tag"], value["text"]);
                  }}
                >
                  {value["text"]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } else if (data["created_by"] === "client") {
    return (
      <div className="w-full flex items-start p-3 mb-2 justify-end">
        <div className="flex-1 max-w-xs flex justify-end">
          <div className="chat-message-client flex items-center justify-end p-3">
            <p className="whitespace-normal">{data.message || "No message"}</p>
          </div>
        </div>
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center ml-3 mt-1">
          <FontAwesomeIcon className="text-white text-sm" icon={faUser} />
        </div>
      </div>
    );
  }
  return <div></div>;
}
