import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { useAuth } from "../hooks/useAuth";
import "../styles/room.scss";
import { ref, set, push } from "firebase/database";
import { database } from "../services/firebase";

type RoomParams = {
  id: string;
};

export function Room() {
  const [roomId, setRoomId] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const { user } = useAuth();

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

    const question = {
      content: newQuestion,
      author: {
        name: user?.name,
        avatar: user.avatar,
      },
      isHighLighted: false,
      isAnswered: false,
    };
    //métodos do firebase para slavar uma lista de perguntas
   const questionRef = ref(database, `rooms/${roomId}/questions`);
   const newQuestionRef = push(questionRef);
     set(newQuestionRef, {
         question      
    })
    //limpando a textarea
    setNewQuestion('');
  }

  // foi necessário virificar antes de o id da sala não é nulo por causa do typescript
  useEffect(() => {
    if (params.id) {
      setRoomId(params.id);
      console.log(roomId);
    }
    return;
  }, []);

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
          <h1>Sala react</h1>
          <span>4 perguntas</span>
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={(e) => {setNewQuestion(e.target.value)}}
            value={newQuestion}
          />

          <div className="form-footer">
            <span>
              Para enviar uma pergunta, <button>faça seu login</button>.
            </span>
            <Button type="submit" disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>
      </main>
    </div>
  );
}
