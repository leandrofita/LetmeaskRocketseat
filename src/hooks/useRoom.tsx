import { off, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type QuestionType = {
  id: string;
  author: {
    avatar: string;
    name: string;
  };
  content: string;
  isAnswered: boolean;
  isHighLighted: boolean;
  likeCount: number;
  likeId: string | undefined; 
};

type FireBaseQuestions = Record<string, {
    author: {
    avatar: string;
    name: string;
    }
    content: string;
    isAnswered: boolean;
    isHighLighted: boolean;  
    likes: Record<string, {
      authorId: string;
    }>
}>

export function useRoom(roomId: string) {
  const {user} = useAuth();
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    // método para ler dados uma vez com um observador       
    onValue(ref(database, `rooms/${roomId}`), (snapshot) => {
      const room = (snapshot.val()) || 'Anonymous';
      const fireBaseQuestions: FireBaseQuestions = room.questions ?? {};
      //transformar o objeto recebido em array
      const parsedQuestions = Object.entries(fireBaseQuestions).map(([key, value]) => {
          return {
              id: key,
              content: value.content,
              author: value.author,
              isHighLighted: value.isHighLighted,
              isAnswered: value.isAnswered,
              likeCount: Object.values(value.likes ?? {}).length,
              likeId: Object.entries(value.likes ?? {}).find(([hey, like]) => like.authorId === user?.id)?.[0]
          }
      })
      setTitle(room.title);
      setQuestions(parsedQuestions);
      console.log("Questions:", questions)
    });
    //remoção dos listeners do firebase
    return () => {
      off(ref(database, `rooms/${roomId}`));
    }
       
}, [roomId, user?.id])

return {questions, title};


};


