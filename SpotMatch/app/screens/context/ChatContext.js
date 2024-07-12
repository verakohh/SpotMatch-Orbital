import React, { createContext, useContext, useReducer, useState } from 'react';
import { FIREBASE_AUTH } from '../../../firebase'; // Ensure this path is correct

const ChatContext = createContext();

const INITIAL_STATE = {
  chatId: "null",
  user: {},
  messages: []
};

const chatReducer = (state, action) => {
  const currentUser = FIREBASE_AUTH.currentUser;
  switch (action.type) {
    case "CHANGE_USER":
      console.log("Current User ID:", currentUser.uid);
      console.log("Matched User ID:", action.payload.userId);

      const chatId = currentUser.uid > action.payload.userId
        ? `${currentUser.uid}_${action.payload.userId}`
        : `${action.payload.userId}_${currentUser.uid}`;

      return {
        ...state,
        user: action.payload,
        chatId: chatId,
      };
    case "SET_MESSAGES":
      return {
        ...state,
        messages: action.payload
      };
    default:
      return state;
  }
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);
  const [messages, setMessages] = useState([]);

  return (
    <ChatContext.Provider value={{ data: state, dispatch, messages, setMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  return useContext(ChatContext);
};
