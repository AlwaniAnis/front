// requestService.js

import api from "@/config/api";

class RequestService {
  // Create a new request
  async createRequest(createRequestDto) {
    try {
      const response = await api.post("/requests", createRequestDto);
      return response.data; // Return the newly created request
    } catch (error) {
      console.error("Error creating request", error);
      throw error;
    }
  }

  // Retrieve all requests (with optional filters and pagination)
  async getRequests(filter = {}, page = 1, limit = 10) {
    try {
      const params = { ...filter, page, limit };
      const response = await api.get("/requests", { params });
      return response.data; // Return the list of requests
    } catch (error) {
      console.error("Error fetching requests", error);
      throw error;
    }
  }

  // Retrieve a single request by ID
  async getRequestById(id) {
    try {
      const response = await api.get(`/requests/${id}`);
      return response.data; // Return the details of the specific request
    } catch (error) {
      console.error("Error fetching request", error);
      throw error;
    }
  }

  // Update a request by ID
  async updateRequest(id, updateRequestDto) {
    try {
      const response = await api.patch(`/requests/${id}`, updateRequestDto);
      return response.data; // Return the updated request
    } catch (error) {
      console.error("Error updating request", error);
      throw error;
    }
  }

  // Delete a request by ID
  async deleteRequest(id) {
    try {
      const response = await api.delete(`/requests/${id}`);
      return response.data; // Return confirmation of deletion
    } catch (error) {
      console.error("Error deleting request", error);
      throw error;
    }
  }

  // Reject a request (Admin only)
  async rejectRequest(id, note) {
    try {
      const response = await api.patch(`/requests/${id}/reject`, { note });
      return response.data; // Return the rejected request
    } catch (error) {
      console.error("Error rejecting request", error);
      throw error;
    }
  }

  // Validate a request (Admin only)
  async validateRequest(id, note) {
    try {
      const response = await api.patch(`/requests/${id}/validate`, { note });
      return response.data; // Return the validated request
    } catch (error) {
      console.error("Error validating request", error);
      throw error;
    }
  }
}

export default new RequestService();
