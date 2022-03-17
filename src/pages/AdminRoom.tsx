import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logoImg from "../assets/images/logo.svg";
import deleteImage from "../assets/images/delete.svg";
import checkImg from "../assets/images/check.svg";
import answerImg from "../assets/images/answer.svg";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
//import { useAuth } from "../hooks/useAuth";
import "../styles/room.scss";
import { Question } from "../components/Question";
import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";
import { ref, remove, update } from "firebase/database";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  //const { user } = useAuth();
  const [roomId, setRoomId] = useState("");
  const { title, questions } = useRoom(roomId);
  const navigate = useNavigate();

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Tem certeza de que deseja excluir essa pergunta?")) {
      const questionRef = ref(
        database,
        `rooms/${roomId}/questions/${questionId}`
      );
      await remove(questionRef);
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    const questionRef = ref(
      database,
      `rooms/${roomId}/questions/${questionId}`
    );
    await update(questionRef, {
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    const questionRef = ref(
      database,
      `rooms/${roomId}/questions/${questionId}`
    );
    await update(questionRef, {
      isHighLighted: true,
    });
  }

  async function handleEndRoom() {
    const roomRef = ref(database, `rooms/${roomId}`);
    update(roomRef, {
      endedAt: new Date(),
    });
    navigate("/");
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
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighLighted={question.isHighLighted}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        handleCheckQuestionAsAnswered(question.id);
                      }}
                    >
                      <img
                        src={checkImg}
                        alt="marcar pergunta como respondida"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleHighlightQuestion(question.id);
                      }}
                    >
                      <img src={answerImg} alt="Dar destaque à pergunta " />
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => {
                    handleDeleteQuestion(question.id);
                  }}
                >
                  <img src={deleteImage} alt="remover pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
