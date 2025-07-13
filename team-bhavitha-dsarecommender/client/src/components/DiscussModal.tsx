// src/components/StartDiscussionModal.tsx
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { api } from "../lib/api";
import "./customModal.css"; // Make sure this is imported

interface Props {
  show: boolean;
  onClose: () => void;
  onRefresh: () => void;
  username: string;
  userRole?: string;
}

const StartDiscussionModal = ({ show, onClose, onRefresh, username }: Props) => {
  const [type, setType] = useState<"general" | "question">("general");
  const [text, setText] = useState("");
  const [topic, setTopic] = useState("");
  const [questionIndex, setQuestionIndex] = useState<number | "">("");
  const [questionText, setQuestionText] = useState("");

  const handleSubmit = async () => {
    try {
      if (type === "general") {
        await api.post("/discuss/general", { username, text });
      } else {
        await api.post("/discuss/create-or-get", {
          topic,
          questionIndex: Number(questionIndex),
          questionText,
          username,
        });
      }
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Failed to create discussion", err);
      alert("Failed to create discussion");
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered className="custom-modal">
      <Modal.Header closeButton>
        <Modal.Title className="modal-title-text">Start a Discussion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Check
            type="radio"
            label="General Discussion"
            checked={type === "general"}
            onChange={() => setType("general")}
            className="discussion-radio"
          />
          <Form.Check
            type="radio"
            label="Question-Specific"
            checked={type === "question"}
            onChange={() => setType("question")}
            className="discussion-radio mb-3"
          />

          {type === "general" ? (
            <Form.Group>
              <Form.Label className="form-label-custom">Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="form-control-dark"
                placeholder="What's on your mind?"
              />
            </Form.Group>
          ) : (
            <>
              <Form.Group>
                <Form.Label className="form-label-custom">Topic</Form.Label>
                <Form.Control
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="form-control-dark"
                  placeholder="e.g., Graph Theory"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label className="form-label-custom">Question Index</Form.Label>
                <Form.Control
                  type="number"
                  value={questionIndex}
                  onChange={(e) =>
                    setQuestionIndex(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className="form-control-dark"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label className="form-label-custom">Question Text</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="form-control-dark"
                />
              </Form.Group>
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StartDiscussionModal;
