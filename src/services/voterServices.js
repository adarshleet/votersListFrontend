import { API } from "../api/api";
import { axiosInstance } from "./axiosInstance";


export const getVoterByWard = async (wardNo) => {
  try {
    const res = await axiosInstance.get(API.voterCountByWard(wardNo));
    return res.data;
  } catch (err) {
    console.error("Error fetching ward voters:", err);
    throw err;
  }
};



export const getVotersByBooth = async (boothNumber, page = 1, limit = 20, search = "") => {
  try {
    const res = await axiosInstance.get(
      API.votersByBooth(boothNumber, page, limit, search)
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching voters by booth:", err);
    throw err;
  }
};


export const getPoliticalStatusVoters = async (
  boothNumber,
  filter,      // marked | unmarked | all
  party = "",
  page = 1,
  limit = 20,
  search = ""
) => {
  try {
    const url = API.getPoliticalStatus(
      boothNumber,
      search,  // correct
      party,   // correct
      filter,  // correct
      page,    // correct
      limit    // correct
    );

    const res = await axiosInstance.get(url);
    return res.data;

  } catch (err) {
    console.error("Error fetching political status voters:", err);
    throw err;
  }
};



export const updateBulkPoliticalStatus = async (voterIds, selectedParty, updatedBy = "admin") => {
  try {
    const payload = {
      updates: voterIds.map((id) => ({
        voterId: id,
        party: selectedParty,
        updatedBy,
      }))
    };

    const res = await axiosInstance.post("/voter/political-status", payload);
    return res.data;

  } catch (err) {
    console.error("Bulk update error:", err);
    throw err;
  }
};


export const getVotingStatus = async (
  boothNumber,
  filter,      // marked | unmarked | all
  party = "",
  page = 1,
  limit = 20,
  search = ""
) => {
  try {
    const url = API.getVotingStatus(
      boothNumber,
      search,  // correct
      party,   // correct
      filter,  // correct
      page,    // correct
      limit    // correct
    );

    const res = await axiosInstance.get(url);
    return res.data;

  } catch (err) {
    console.error("Error fetching voting status voters:", err);
    throw err;
  }
};



export const updateBulkVotingStatus = async (voterIds, hasVoted, updatedBy = "admin") => {
  try {
    const payload = {
      updates: voterIds.map((id) => ({
        voterId: id,
        hasVoted: hasVoted,
        updatedBy,
      }))
    };

    const res = await axiosInstance.post("/voter/voted-status", payload);
    return res.data;

  } catch (err) {
    console.error("Bulk update error:", err);
    throw err;
  }
};