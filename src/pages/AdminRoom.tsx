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
import { useRoom } from "../hooks/useRoom";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const [roomId, setRoomId] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const { user } = useAuth();
  const {title, questions} = useRoom(roomId)
  

  
  // foi necessário virificar antes de o id da sala não é nulo por causa do typescript
  //o useEffect atualizará a sala sempre que o ID for modificado manualmente
  useEffect(() => {
    if (params.id) {
      setRoomId(params.id);
    }
    return;
  }, [roomId]);

 

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
          <div>
          <RoomCode code={roomId} />
          <Button isOutlined>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

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
