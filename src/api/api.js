export const BASE_URL = 'https://voterslistbackend.onrender.com/api/';

export const API = {
  voterCountByWard : (wardNo) => `/voter/by-ward/${wardNo}`,
  boothsByWard: (wardNo) => `/booth/getBooths/${wardNo}`,
  votersByBooth: (boothNumber, page, limit, search) =>`/voter/by-booth/${boothNumber}?page=${page}&limit=${limit}&search=${search || ""}`,
  getPoliticalStatus: (
    boothNumber,
    search,
    party = "",
    filter = "",
    page = 1,
    limit = 20,
  ) =>
    `/voter/political-status/${boothNumber}?filter=${filter}${party ? `&party=${party}` : ""}&page=${page}&limit=${limit}&search=${search}`,

  getVotingStatus: (
    boothNumber,
    search,
    party = "",
    filter = "",
    page = 1,
    limit = 20,
  ) =>
    `/voter/voted-status/${boothNumber}?filter=${filter}${party ? `&party=${party}` : ""}&page=${page}&limit=${limit}&search=${search}`,

};
