import useIsAdmin from "@/hooks/useIsAdmin";
import requestStyles from "../styles/requests.module.scss";
import {
  FaCheck,
  FaTimes,
  FaEdit,
  FaTrash,
  FaTimesCircle,
  FaClock,
  FaEye,
  FaPage4,
  FaFile,
  FaFileAlt,
} from "react-icons/fa";
import moment from "moment";
import Modal from "./Modal";
import { useState } from "react";

export default function ListRequestCard({ _delete, edit, req, onAction }) {
  const isAdmin = useIsAdmin();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div key={req.id} className={requestStyles.card}>
      <div
        className={requestStyles.statusBadge + " " + requestStyles[req.status]}
      >
        {req.status === "validated" ? (
          <FaCheck />
        ) : req.status === "rejected" ? (
          <FaCheck />
        ) : (
          <FaClock />
        )}
        <span>{req.status}</span>{" "}
      </div>{" "}
      {req.status != "pending" && (
        <button
          className={requestStyles.noteConsultationBtn}
          onClick={toggleModal}
        >
          <FaFileAlt />{" "}
        </button>
      )}
      <div className={requestStyles.cardHeader}>
        <h3>
          {req.title}
          <br></br>
          <i>{moment(req.createdAt).format("L")}</i>{" "}
        </h3>
        <span
          className={`${requestStyles.badge} ${
            requestStyles[req.urgencyLevel.toLowerCase()]
          }`}
        >
          {req.urgencyLevel}
        </span>
      </div>
      <p className={requestStyles.description}>{req.description}</p>
      <p className={requestStyles.meta}>
        <strong>Category:</strong> <span>#{req.category}</span>
      </p>
      <div className={requestStyles.actions}>
        {isAdmin && (
          <>
            {" "}
            <button
              onClick={() => onAction("accept")}
              className={requestStyles.accept}
            >
              Accept
            </button>
            <button
              onClick={() => onAction("reject")}
              className={requestStyles.reject}
            >
              Reject
            </button>
          </>
        )}
        <button onClick={edit} className={requestStyles.edit}>
          <FaEdit />
        </button>
        <button onClick={_delete} className={requestStyles.delete}>
          <FaTrash />
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <h2>Note</h2>
        <p>{req.note || "No note available."}</p>
      </Modal>
    </div>
  );
}
