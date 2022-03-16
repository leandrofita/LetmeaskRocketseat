import { onValue, ref } from "firebase/database";
import { useContext, useEffect, useState } from "react";
import { database } from "../services/firebase";

type QuestionType = {
  id: string;
  author: {
    avatar: string;
    name: string;
  };
  content: string;
  isAnswered: boolean;
  isHighLighted: boolean;
};

type FireBaseQuestions = Record<string, {
    author: {
    avatar: string;
    name: string;
    }
    content: string;
    isAnswered: boolean;
    isHighLighted: boolean;    
}>

export function useRoom(roomId: string) {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    // método para ler dados uma vez com um observador
       
   return onValue(ref(database, `rooms/${roomId}`), (snapshot) => {
      const room = (snapshot.val()) || 'Anonymous';
      const fireBaseQuestions: FireBaseQuestions = room.questions;
      //transformar o objeto recebido em array
      const parsedQuestions = Object.entries(fireBaseQuestions).map(([key, value]) => {
          return {
              id: key,
              content: value.content,
              author: value.author,
              isHighLighted: value.isHighLighted,
              isAnswered: value.isAnswered
          }
      })
      setTitle(room.title);
      setQuestions(parsedQuestions);
    });
       
}, [roomId])

return {questions, title};


};


