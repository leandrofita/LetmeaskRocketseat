import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { useAuth } from "../hooks/useAuth";
import "../styles/room.scss";
import { ref, set, push, get, child, onValue } from "firebase/database";
import { database } from "../services/firebase";
import { Question } from "../components/Question";

type RoomParams = {
  id: string;
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

type Question = {
    id: string;
    author: {
        avatar: string;
        name: string;
        }
        content: string;
        isAnswered: boolean;
        isHighLighted: boolean;

}

export function Room() {
  const [roomId, setRoomId] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState('');

  
  // foi necessário virificar antes de o id da sala não é nulo por causa do typescript
  //o useEffect atualizará a sala sempre que o ID for modificado manualmente
  useEffect(() => {
    if (params.id) {
      setRoomId(params.id);
    }
    return;
  }, [roomId]);

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

  //recebndo o id da sal através da URL
  const params = useParams<RoomParams>();

  function handleSendQuestion(event: FormEvent) {
      event.preventDefault();
    if (newQuestion.trim() === "") {
      return;
    }
    if (!user) {
      throw new Error("You must be logged in");
    }

   /*  const question = {
      content: newQuestion,
      author: {
        name: user?.name,
        avatar: user.avatar,
      },
      isHighLighted: false,
      isAnswered: false,
    }; */

    //métodos do firebase para slavar uma lista de perguntas
   const questionRef = ref(database, `rooms/${roomId}/questions`);
   const newQuestionRef = push(questionRef);
     set(newQuestionRef, {
        content: newQuestion,
        author: {
          name: user?.name,
          avatar: user.avatar,
        },
        isHighLighted: false,
        isAnswered: false,    
    })
    //limpando a textarea
    setNewQuestion('');
  }


  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={(e) => {setNewQuestion(e.target.value)}}
            value={newQuestion}
          />

          <div className="form-footer">
            {user ? (
            <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
            </div>) : (
                <span>
                Para enviar uma pergunta, <button>faça seu login</button>.
              </span>
            )}
            <Button type="submit" disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>
        <div className="question-list">
        {questions.map(question => {
          return(
            <Question
            key={question.id}
            content={question.content}
            author={question.author}
            />
          )
        })}

        </div>
      </main>
    </div>
  );
}
