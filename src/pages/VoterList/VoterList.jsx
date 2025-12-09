import React, { useEffect, useState, useRef, useCallback } from "react";
import { Search, ChevronLeft, MapPin, Hash, BarChart2 } from "lucide-react";
import { getVotersByBooth } from "../../services/voterServices";
import { useLocation, useNavigate } from "react-router-dom";

const VotersList = () => {
  const [voters, setVoters] = useState([]);
  const [voteCount, setVoteCount] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const boothDetails = location.state;

  const loaderRef = useRef(null);

  // 🔥 FETCH DATA FUNCTION
  const fetchData = useCallback(
    async (reset = false) => {
      if (loading) return;

      try {
        setLoading(true);

        const response = await getVotersByBooth(
          boothDetails.boothNumber,
          page,
          limit,
          searchTerm
        );

        setVoteCount(response.total);

        // If reset → replace data else append
        setVoters((prev) =>
          reset ? response.voters : [...prev, ...response.voters]
        );

        setHasMore(response.voters.length === limit);
      } catch (err) {
        console.error("Error fetching voters:", err);
      } finally {
        setLoading(false);
      }
    },
    [page, limit, searchTerm, boothDetails.boothNumber, loading]
  );

  // 👉 Load on first render + when page changes
  useEffect(() => {
    fetchData(page === 1); // reset when page=1
  }, [page, searchTerm]);

  // 🔎 SEARCH DEBOUNCING
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchData(true);
    }, 400);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  // 🔥 INFINITE SCROLL OBSERVER
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


  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen flex flex-col">

        {/* HEADER */}
        <div className="sticky top-0 z-10 bg-white">
          <div className="bg-[#116d44] text-white p-4 pt-6 shadow-md rounded-b-lg flex items-center">
            <button className="p-1 mr-2 rounded-full">
              <ChevronLeft onClick={() => navigate(-1)} className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold truncate">
              വോട്ടർ ലിസ്റ്റ് ({voteCount})
            </h1>
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

        {/* VOTER LIST */}
        <div className="flex-1 overflow-y-scroll bg-gray-50 pb-10">
          <div className="p-4 space-y-3">
            {voters.map((voter) => (
              <div
                key={voter._id}
                className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm"
              >
                {/* HEADER */}
                <div className="flex justify-between items-start border-b pb-2">
                  <h3 className="text-base font-bold">{voter.name}</h3>
                  <div className="flex items-center gap-1 text-sm font-bold bg-gray-100 px-2 py-0.5 rounded-full">
                    <Hash className="w-3 h-3 text-[#116d44]" />
                    {voter.serialNo}
                  </div>
                </div>

                {/* GRID DATA */}
                <div className="grid grid-cols-2 gap-3 text-sm mt-2">
                  <div>
                    <span className="text-xs text-gray-500 uppercase">
                      Guardian
                    </span>
                    <p>{voter.guardian}</p>
                  </div>

                  <div className="flex gap-4">
                    <div>
                      <span className="text-xs text-gray-500 uppercase">
                        Age
                      </span>
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
                    {/* <button className="text-xs text-[#116d44] bg-green-50 px-2 py-1 rounded-lg flex items-center">
                      <BarChart2 className="w-3 h-3 mr-1" /> Mark Status
                    </button> */}
                  </div>
                </div>
              </div>
            ))}

            {/* LOADING / END INDICATOR */}
            <div ref={loaderRef} className="py-3 text-center text-gray-500">
  {loading && "Loading..."}
  {!loading && !hasMore && page > 1 && "End of list"}
</div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default VotersList;
