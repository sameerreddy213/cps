// src/components/StartDiscussionModal.tsx
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { api } from "../lib/api";

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
    <Modal show={show} onHide={onClose} backdrop="static" centered>
      <Modal.Header closeButton style={{ borderBottom: '2px solid #0d6efd' }}>
        <Modal.Title>Start a Discussion</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ border: '1px solid #dee2e6' }}>
        <Form>
          <Form.Check
            type="radio"
            label="General Discussion"
            checked={type === "general"}
            onChange={() => setType("general")}
            style={{ border: '1px solid #dee2e6', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}
          />
          <Form.Check
            type="radio"
            label="Question-Specific"
            checked={type === "question"}
            onChange={() => setType("question")}
            className="mb-3"
            style={{ border: '1px solid #dee2e6', padding: '10px', borderRadius: '5px' }}
          />

          {type === "general" ? (
            <>
              <Form.Group>
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="What's on your mind?"
                  style={{ border: '2px solid #0d6efd', borderRadius: '8px' }}
                />
              </Form.Group>
            </>
          ) : (
            <>
              <Form.Group>
                <Form.Label>Topic</Form.Label>
                <Form.Control
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Graph Theory"
                  style={{ border: '2px solid #0d6efd', borderRadius: '8px' }}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Question Index</Form.Label>
                <Form.Control
                  type="number"
                  value={questionIndex}
                  onChange={(e) => setQuestionIndex(e.target.value === "" ? "" : Number(e.target.value))}
                  style={{ border: '2px solid #0d6efd', borderRadius: '8px' }}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Question Text</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  style={{ border: '2px solid #0d6efd', borderRadius: '8px' }}
                />
              </Form.Group>
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer style={{ borderTop: '2px solid #0d6efd' }}>
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
