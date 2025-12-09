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
