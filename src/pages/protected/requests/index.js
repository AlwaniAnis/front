import { useEffect, useState } from "react";
import Modal from "../../../ui/Modal";
import styles from "../../../styles/form.module.scss";
import requestStyles from "../../../styles/requests.module.scss";
import CreateRequestDto, { createRequestSchema } from "@/models/requestDto";
import requestsService from "@/services/requests.service";
import useAuth from "@/hooks/useAuth";
import ListRequestCard from "@/ui/list.request.card";
import Dropdown from "@/ui/dropdown";
import Pagination from "@/ui/Pagination";
import useIsAdmin from "@/hooks/useIsAdmin";

export default function RequestsPage() {
  const { isAuthenticated, loading } = useAuth();
  const [formData, setFormData] = useState(new CreateRequestDto());
  const [errors, setErrors] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [total, setTotal] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isAdmin = useIsAdmin();
  // _______________________
  const [modalAction, setModalAction] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [note, setNote] = useState("");
  //------------------------
  const [filter, setFilter] = useState({
    searchTerm: "",
    status: "All",
    urgencyLevel: "All",
    userId: "",
  });
  const [page, setPage] = useState(1); // Current page for pagination
  const [take, setTake] = useState(3); // Number of requests to fetch per page
  function handleAction(req, action) {
    setSelectedRequest(req);
    setModalAction(action);
  }
  function submitNote() {
    if (modalAction == "accept") {
      requestsService.validateRequest(selectedRequest.id, note).then(() => {
        fetchRequests();
        setModalAction("");
        setNote("");
      });
    } else {
      requestsService.rejectRequest(selectedRequest.id, note).then(() => {
        fetchRequests();
        setModalAction("");
        setNote("");
      });
    }
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data:", formData); // Log the form data for debugging
    try {
      await createRequestSchema.validate(formData, { abortEarly: false });
      setErrors({});
      try {
        const response = formData.id
          ? await requestsService.updateRequest(formData.id, formData)
          : await requestsService.createRequest(formData);
        fetchRequests();
        console.log("Request created:", response);
        setErrorMessage(""); // Clear any previous error messages
      } catch (error) {
        setErrorMessage("Failed to create request.");
        console.error("Error creating request", error);
      }
      setFormData(new CreateRequestDto());
      setIsOpen(false);
    } catch (err) {
      const errorObj = {};
      err.inner.forEach((e) => {
        errorObj[e.path] = e.message;
      });
      setErrors(errorObj);
    }
  };

  // Fetch requests on component mount and whenever filter or pagination changes
  useEffect(() => {
    if (isAuthenticated && !loading) {
      fetchRequests();
    }
  }, [page, take, isAuthenticated, loading]);

  const fetchRequests = async (p) => {
    setIsLoading(true);
    try {
      const data = await requestsService.getRequests(
        {
          ...filter,
          status: filter.status == "All" ? "" : filter.status,
          urgencyLevel: filter.urgencyLevel == "All" ? "" : filter.urgencyLevel,
        },
        p ? p : page,
        take
      );
      if (p) setPage(p);
      // Fetch all requests with pagination
      setRequests(data.data);
      setTotal(data.total); // Set the total number of requests
    } catch (error) {
      setErrorMessage("Failed to load requests.");
      console.error("Error fetching requests", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={requestStyles.page}>
      <div className={requestStyles.filterContainer}>
        <div className={styles.field}>
          <label>Search Term</label>
          <input
            name="searchTerm"
            value={filter.searchTerm}
            onChange={(e) =>
              setFilter({ ...filter, searchTerm: e.target.value })
            }
          />
        </div>

        <div className={styles.field}>
          <Dropdown
            defaultValue={filter.status}
            label="Satus"
            options={["All", "pending", "validated", "rejected"]}
            onSelect={(status) => setFilter({ ...filter, status })}
            placeholder="Choose a status"
          />
        </div>

        <div className={styles.field}>
          <Dropdown
            defaultValue={filter.urgencyLevel}
            label="Urgency Level"
            options={["All", "Normal", "Urgent", "Critical"]}
            onSelect={(urgencyLevel) => setFilter({ ...filter, urgencyLevel })}
            placeholder="Choose a level"
          />
        </div>

        {/* {isAdmin && ( // admin will use list of users
          <div className={styles.field}>
            <label>User</label>
            <input
              name="userId"
              value={filter.userId}
              onChange={(e) => setFilter({ ...filter, userId: e.target.value })}
            />
          </div>
        )} */}

        <button
          onClick={() => fetchRequests(1)} // Trigger filter application
          className={requestStyles.filterButton}
        >
          Apply Filter
        </button>
      </div>

      <div className={requestStyles.header}>
        <h2>
          My Requests <br></br>
          <i> TOTAL :{total}</i>
        </h2>
        <button
          onClick={() => setIsOpen(true)}
          className={requestStyles.addButton}
        >
          + New Request
        </button>
      </div>

      {isLoading && <p>Loading requests...</p>}
      {/* we should add order by section here */}
      <div className={requestStyles.grid}>
        {requests.map((req, i) => (
          <ListRequestCard
            onAction={(action) => handleAction(req, action)}
            key={i}
            req={req}
            edit={() => {
              setFormData(req);
              setIsOpen(true);
            }}
            _delete={() => {
              if (
                window.confirm("Are you sure you want to delete this request?")
              ) {
                requestsService
                  .deleteRequest(req.id)
                  .then(() => {
                    fetchRequests();
                    console.log("Request deleted", req.id);
                  })
                  .catch((error) => {
                    console.error("Error deleting request", error);
                    setErrorMessage("Failed to delete request.");
                  });
              }
            }}
          />
        ))}
      </div>
      <Pagination
        page={page}
        take={take}
        total={total}
        onPageChange={(newPage) => setPage(newPage)}
      />
      {errorMessage && <p className={requestStyles.error}>{errorMessage}</p>}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h3>Create Request</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <p className={styles.error}>{errors.title}</p>}
          </div>

          <div className={styles.field}>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && (
              <p className={styles.error}>{errors.description}</p>
            )}
          </div>

          <div className={styles.field}>
            <label>Category</label>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
            {errors.category && (
              <p className={styles.error}>{errors.category}</p>
            )}
          </div>

          <div className={styles.field}>
            <Dropdown
              defaultValue={formData.urgencyLevel}
              label="Urgency Level"
              options={["Normal", "Urgent", "Critical"]}
              onSelect={(urgencyLevel) =>
                setFormData((prev) => ({ ...prev, urgencyLevel }))
              }
              placeholder="Choose a level"
            />

            {/* <select
              name="urgencyLevel"
              value={formData.urgencyLevel}
              onChange={handleChange}
            >
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
              <option value="Critical">Critical</option>
            </select> */}
            {errors.urgencyLevel && (
              <p className={styles.error}>{errors.urgencyLevel}</p>
            )}
          </div>

          <button type="submit">Submit</button>
        </form>
      </Modal>
      <Modal isOpen={modalAction} onClose={() => setModalAction("")}>
        <h3>
          {modalAction === "accept" ? "Accept Request" : "Reject Request"}
        </h3>
        <textarea
          placeholder="Enter a note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ width: "100%", height: "100px", marginTop: "10px" }}
        />
        <button onClick={submitNote} style={{ marginTop: "10px" }}>
          Submit
        </button>
      </Modal>
    </div>
  );
}
