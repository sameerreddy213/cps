import { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { api } from "../lib/api";
import "./customModal.css";
interface AssignTaskModalProps {
  show: boolean;
  onClose: () => void;
  username: string;
  onSuccess?: () => void;
}

export default function AssignTaskModal({ show, onClose, username, onSuccess }: AssignTaskModalProps) {
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDesc, setAssignmentDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleAssign = async () => {
    if (!assignmentTitle || !assignmentDesc || !file) {
      alert("All fields are required!");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("username", username);
      formData.append("title", assignmentTitle);
      formData.append("description", assignmentDesc);
      formData.append("file", file);

      await api.post("/assignments", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Task assigned successfully!");
      onClose();
      setAssignmentTitle("");
      setAssignmentDesc("");
      setFile(null);
      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert("Failed to assign task.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered className="custom-modal">
      <Modal.Header closeButton>
        <Modal.Title>Assign Task to {username}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={assignmentTitle}
              onChange={(e) => setAssignmentTitle(e.target.value)}
              placeholder="Assignment title"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={assignmentDesc}
              onChange={(e) => setAssignmentDesc(e.target.value)}
              placeholder="Describe the task..."
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Upload File (PDF/Image)</Form.Label>
            <Form.Control
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) {
                  setFile(selectedFile);
                }
              }}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleAssign} disabled={uploading}>
          {uploading ? "Uploading..." : "Assign"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
