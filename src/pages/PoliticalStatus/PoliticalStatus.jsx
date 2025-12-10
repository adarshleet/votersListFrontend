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
import {
  getPoliticalStatusVoters,
  updateBulkPoliticalStatus,
} from "../../services/voterServices";

const PoliticalStatus = () => {
  const [voters, setVoters] = useState([]);
  const [voteCount, setVoteCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // FILTER STATES
  const [mainFilter, setMainFilter] = useState("unmarked");
  const [partyFilter, setPartyFilter] = useState("LDF");

  // PAGINATION
  const [page, setPage] = useState(1);
  const limit = 20;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // BULK SELECTION
  const [selectedVoters, setSelectedVoters] = useState([]);

  // POPUP
  const [showPopup, setShowPopup] = useState(false);
  const [selectedParty, setSelectedParty] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const boothDetails = location.state;

  const loaderRef = useRef(null);

  // ===========================================================
  // FETCH DATA (Clean, Stable, Page-Aware)
  // ===========================================================
  const fetchData = useCallback(
    async (reset = false) => {
      if (loading) return;

      try {
        setLoading(true);

        const response = await getPoliticalStatusVoters(
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

  // ===========================================================
  // LOAD DATA WHEN PAGE OR FILTERS CHANGE
  // ===========================================================
  useEffect(() => {
    fetchData(page === 1); // reset list when starting on page 1
  }, [page, searchTerm, mainFilter, partyFilter]);

  // ===========================================================
  // RESET PAGE WHEN FILTERS OR SEARCH CHANGE
  // ===========================================================
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
        if (entries[0].isIntersecting && !loading && voters.length >= limit) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loading, hasMore, voters]);

  // ===========================================================
  // TOGGLE VOTER SELECTION
  // ===========================================================
  const toggleSelect = (id) => {
    setSelectedVoters((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  // ===========================================================
  // SUBMIT BULK STATUS
  // ===========================================================
  const submitPoliticalStatus = async () => {
    if (!selectedParty) return alert("Choose a party");

    try {
      await updateBulkPoliticalStatus(selectedVoters, selectedParty, "admin");

      setShowPopup(false);
      setSelectedVoters([]);
      setPage(1);
      fetchData(true);
    } catch (err) {
      console.error("Bulk Update Error:", err);
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

          {/* FILTER TABS */}
          <div className="flex justify-around bg-white shadow-sm border-b p-3">
            {["unmarked", "marked"].map((item) => (
              <button
                key={item}
                className={`px-3 py-1 rounded-lg font-semibold ${
                  mainFilter === item ? "bg-[#116d44] text-white" : "bg-gray-200"
                }`}
                onClick={() => {
                  setMainFilter(item);
                  setPartyFilter("LDF");
                }}
              >
                {item === "unmarked" ? "Unmarked" : "Marked"}
              </button>
            ))}
          </div>

          {mainFilter === "marked" && (
            <div className="flex justify-around bg-gray-100 border-b p-2">
              {["LDF", "UDF", "BJP", "UNKNOWN"].map((p) => (
                <button
                  key={p}
                  className={`px-2 py-1 rounded-lg text-sm font-semibold ${
                    partyFilter === p ? "bg-[#116d44] text-white" : "bg-gray-200"
                  }`}
                  onClick={() => setPartyFilter(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          )}

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
              const isSelected = selectedVoters.includes(voter._id);

              return (
                <div
                  key={voter._id}
                  className="bg-white border rounded-xl p-3 shadow-sm relative"
                >
                  {/* Checkbox */}
                  <button
                    className="absolute top-3 right-3"
                    onClick={() => toggleSelect(voter._id)}
                  >
                    {isSelected ? (
                      <CheckSquare className="w-6 h-6 text-[#116d44]" />
                    ) : (
                      <Square className="w-6 h-6 text-gray-400" />
                    )}
                  </button>

                  {/* Header */}
                  <div className="flex justify-between items-start border-b pb-2">
                    <h3 className="text-base font-bold">{voter.name}</h3>
                    <div className="flex items-center gap-1 text-sm font-bold bg-gray-100 px-2 py-0.5 rounded-full mr-7">
                      <Hash className="w-3 h-3 text-[#116d44]" />
                      {voter.serialNo}
                    </div>
                  </div>

                  {/* Details */}
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
                        <span className="text-xs text-gray-500 uppercase">
                          Gender
                        </span>
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

                      {voter.politicalStatus && (
                        <span className="px-2 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-700">
                          {voter.politicalStatus}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* LOAD MORE / END MESSAGE */}
            <div ref={loaderRef} className="text-center text-gray-500 py-4">
              {loading ? "Loading..." : !hasMore && "End of list"}
            </div>
          </div>
        </div>

        {/* ACTION BAR */}
        {selectedVoters.length > 0 && (
          <div
            className="fixed bottom-0 left-0 w-full bg-[#116d44] text-white py-4 text-center font-bold shadow-xl cursor-pointer text-lg"
            onClick={() => setShowPopup(true)}
          >
            Mark Party ({selectedVoters.length} Selected)
          </div>
        )}

        {/* POPUP */}
        {showPopup && (
          <div className="fixed inset-0 bg-gray-400/40 flex justify-center items-center z-40">
            <div className="bg-white p-5 rounded-xl w-80 shadow-xl">
              <h2 className="text-lg font-bold mb-2">Select Party</h2>
              <p className="text-sm text-gray-600 mb-3">
                Total Selected: {selectedVoters.length}
              </p>

              <div className="space-y-2 mb-4">
                {["LDF", "UDF", "BJP", "UNKNOWN"].map((p) => (
                  <button
                    key={p}
                    className={`w-full py-2 rounded-lg border ${
                      selectedParty === p
                        ? "bg-[#116d44] text-white"
                        : "bg-gray-100"
                    }`}
                    onClick={() => setSelectedParty(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                className="w-full bg-[#116d44] text-white py-2 rounded-lg font-bold"
                onClick={submitPoliticalStatus}
              >
                Submit
              </button>

              <button
                className="w-full mt-2 text-gray-600"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PoliticalStatus;
