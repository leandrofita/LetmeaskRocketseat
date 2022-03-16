import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import logoImg from "../assets/images/logo.svg";
import deleteImage from "../assets/images/delete.svg";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
//import { useAuth } from "../hooks/useAuth";
import "../styles/room.scss";
import { Question } from "../components/Question";
import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";
import { ref, remove } from "firebase/database";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  //const { user } = useAuth();
  const [roomId, setRoomId] = useState("");
  const {title, questions} = useRoom(roomId)
  
async function handleDeleteQuestion(questionId: string) {
  if(window.confirm('Tem certeza de que deseja excluir essa pergunta?')) {
    const questionRef = ref(database, `rooms/${roomId}/questions/${questionId}`)
    await remove(questionRef);
  }
}
  
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
            >
            <button
            type="button"
            onClick={()=> {handleDeleteQuestion(question.id)}}
            >
              <img src={deleteImage} alt="remover pergunta"/>
            </button>
            </Question>
          )
        })}

        </div>
      </main>
    </div>
  );
}
