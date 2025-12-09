export const BASE_URL = 'https://voterslistbackend.onrender.com/api/';

export const API = {
  voterCountByWard : (wardNo) => `/voter/by-ward/${wardNo}`,
  boothsByWard: (wardNo) => `/booth/getBooths/${wardNo}`,
  votersByBooth: (boothNumber, page, limit, search) =>`/voter/by-booth/${boothNumber}?page=${page}&limit=${limit}&search=${search || ""}`,
  TRIPS: "/trips",
};
