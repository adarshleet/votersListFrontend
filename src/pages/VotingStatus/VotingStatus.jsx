import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Search,
  ChevronLeft,
  MapPin,
  Hash,
  CheckSquare,
  Square,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { getVotingStatus, updateBulkVotingStatus } from "../../services/voterServices";

const VotingStatus = () => {
  const [voters, setVoters] = useState([]);
  const [voteCount, setVoteCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // FILTER STATES
  const [mainFilter, setMainFilter] = useState("notVoted"); // voted | notVoted | all
  const [partyFilter, setPartyFilter] = useState("ALL");

  // PAGINATION
  const [page, setPage] = useState(1);
  const limit = 20;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const boothDetails = location.state;

  const loaderRef = useRef(null);

  // ===========================================================
  // FETCH DATA
  // ===========================================================
  const fetchData = useCallback(
    async (reset = false) => {
      if (loading) return;

      try {
        setLoading(true);

        const response = await getVotingStatus(
          boothDetails.boothNumber,
          mainFilter,
          partyFilter,
          page,
          limit,
          searchTerm
        );

        setVoteCount(response.total);

        setVoters((prev) =>
          reset ? response.results : [...prev, ...response.results]
        );

        setHasMore(response.results.length === limit);
      } catch (err) {
        console.error("Error loading voter list:", err);
      } finally {
        setLoading(false);
      }
    },
    [
      page,
      limit,
      searchTerm,
      mainFilter,
      partyFilter,
      boothDetails.boothNumber,
      loading,
    ]
  );

  useEffect(() => {
    fetchData(page === 1);
  }, [page, searchTerm, mainFilter, partyFilter]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, mainFilter, partyFilter]);

  // ===========================================================
  // INFINITE SCROLL OBSERVER
  // ===========================================================
  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loading &&
          voters.length >= limit
        ) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loading, hasMore, voters]);

  // ===========================================================
  // TOGGLE VOTE STATUS (INSTANT UPDATE)
  // ===========================================================
  const toggleSelect = async (id, currentStatus) => {
    try {
      await updateBulkVotingStatus([id], !currentStatus, "admin");

      // Update UI instantly
      setVoters((prev) =>
        prev.map((v) =>
          v._id === id ? { ...v, hasVoted: !currentStatus } : v
        )
      );

      // Refresh correct tab
      setPage(1);
      fetchData(true);
    } catch (err) {
      console.error("Vote toggle error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen flex flex-col">
        
        {/* HEADER */}
        <div className="sticky top-0 z-20 bg-white">
          <div className="bg-[#116d44] text-white p-4 pt-6 shadow-md rounded-b-lg flex items-center">
            <button className="p-1 mr-2 rounded-full" onClick={() => navigate(-1)}>
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold truncate">
              Voter List ({voteCount}) - Booth {boothDetails.boothNumber}
            </h1>
          </div>

          {/* MAIN FILTER */}
          <div className="flex justify-around bg-white shadow-sm border-b p-3">
            {["notVoted", "voted", "all"].map((item) => (
              <button
                key={item}
                className={`px-3 py-1 rounded-lg font-semibold ${
                  mainFilter === item
                    ? "bg-[#116d44] text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setMainFilter(item)}
              >
                {item === "notVoted"
                  ? "Not Voted"
                  : item === "voted"
                  ? "Voted"
                  : "All"}
              </button>
            ))}
          </div>

          {/* PARTY FILTER */}
          <div className="flex justify-around bg-gray-100 border-b p-2">
            {["ALL", "LDF", "UDF", "BJP", "UNKNOWN"].map((p) => (
              <button
                key={p}
                className={`px-2 py-1 rounded-lg text-sm font-semibold ${
                  partyFilter === p
                    ? "bg-[#116d44] text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setPartyFilter(p)}
              >
                {p}
              </button>
            ))}
          </div>

          {/* SEARCH */}
          <div className="p-4 bg-white shadow-sm border-b">
            <div className="flex items-center bg-gray-100 rounded-lg p-2 border border-gray-200">
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search by Name / Serial No..."
                className="bg-transparent w-full text-sm outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* LIST */}
        <div className="flex-1 overflow-y-scroll bg-gray-50 pb-24">
          <div className="p-4 space-y-3">
            {voters.map((voter) => {
              return (
                <div
                  key={voter._id}
                  className="bg-white border rounded-xl p-3 shadow-sm relative"
                >
                  {/* CHECKBOX */}
                  <button
  className="absolute top-3 right-3"
  onClick={() => toggleSelect(voter._id, voter.hasVoted)}
>
  {voter.hasVoted ? (
    <CheckSquare className="w-6 h-6 text-[#116d44]" />
  ) : (
    <Square className="w-6 h-6 text-gray-400" />
  )}
</button>


                  <div className="flex justify-between items-start border-b pb-2">
                    <h3 className="text-base font-bold">{voter.name}</h3>
                    <div className="flex items-center gap-1 text-sm font-bold bg-gray-100 px-2 py-0.5 rounded-full mr-7">
                      <Hash className="w-3 h-3 text-[#116d44]" />
                      {voter.serialNo}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm mt-2">
                    <div>
                      <span className="text-xs text-gray-500 uppercase">
                        Guardian
                      </span>
                      <p>{voter.guardian}</p>
                    </div>

                    <div className="flex gap-4">
                      <div>
                        <span className="text-xs text-gray-500 uppercase">Age</span>
                        <p>{voter.age}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 uppercase">Gender</span>
                        <p>{voter.gender}</p>
                      </div>
                    </div>

                    <div className="col-span-2 flex justify-between items-start">
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                        <div className="ml-2">
                          <span className="text-xs text-gray-500 uppercase">
                            Address
                          </span>
                          <p>
                            {voter.houseNo} {voter.houseName}
                          </p>
                        </div>
                      </div>

                      {voter.party && (
                        <span className="px-2 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-700">
                          {voter.party}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={loaderRef} className="text-center text-gray-500 py-4">
              {loading ? "Loading..." : !hasMore && "End of list"}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VotingStatus;
