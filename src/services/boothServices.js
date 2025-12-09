import { API } from "../api/api";
import { axiosInstance } from "./axiosInstance";


export const getBoothsByWard = async (wardNo) => {
  try {
    const res = await axiosInstance.get(API.boothsByWard(wardNo));
    return res.data;
  } catch (err) {
    console.error("Error fetching booths:", err);
    throw err;
  }
};
