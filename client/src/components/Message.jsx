import React, { useEffect } from "react";
import { assets } from "../assets/assets";
import moment from "moment";
import Markdown from "react-markdown";
import Prism from "prismjs";

const Message = ({ message }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [message.content]);

  return (
    <div>
      {message.role === "user" ? (
        /* USER MESSAGE */
        <div className="flex items-start justify-end my-4 gap-2">
          <div
            className="flex flex-col gap-2 px-4 py-3
                       bg-white dark:bg-[#0B3C5D]
                       border border-gray-200 dark:border-[#1B6CA8]
                       rounded-2xl rounded-tr-sm
                       max-w-2xl shadow-sm"
          >
            <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
              {message.content}
            </p>

            <span className="text-xs text-gray-500 dark:text-gray-300 text-right">
              {moment(message.timestamp).fromNow()}
            </span>
          </div>

          <img
            src={assets.user_icon}
            alt="user"
            className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600"
          />
        </div>
      ) : (
        /* AI MESSAGE */
        <div className="flex items-start my-4 gap-2">
          <div
            className="flex flex-col gap-2 px-4 py-3
                       bg-white dark:bg-[#083A37]
                       border border-gray-200 dark:border-[#1F7A74]
                       rounded-2xl rounded-tl-sm
                       max-w-2xl shadow-sm"
          >
            {/* AI text / markdown response */}
            <div className="text-sm text-gray-900 dark:text-white reset-tw leading-relaxed">
              <Markdown>{message.content}</Markdown>
            </div>

            <span className="text-xs text-gray-500 dark:text-gray-300">
              {moment(message.timestamp).fromNow()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
