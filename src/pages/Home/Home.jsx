import React, { useEffect, useState } from 'react';
import { Users, List, Flag, ChevronRight } from 'lucide-react';
import { getVoterByWard } from '../../services/voterServices';
import { getBoothsByWard } from '../../services/boothServices';
import { useNavigate } from 'react-router-dom';

const VotersAppDashboard = () => { // Renamed from Home for clarity
  const [activeBooth, setActiveBooth] = useState(1);
  const [wardNo,setWardNo] = useState(12)
  const [totalVoters,setTotalVoters] = useState(0)
  const [boothData,setBoothData] = useState([])
  
  const navigate = useNavigate()

  //fetch booth details
  const fetchBoothDetails = async()=>{
    const response = await getBoothsByWard(wardNo)
    console.log(response,'ward biofg')
    setBoothData(response.booths)
    if (response.booths.length > 0) {
    setActiveBooth(response.booths[0].boothNumber);
  }
  }

  useEffect(()=>{
    const fetchData = async()=>{
        const response = await getVoterByWard(wardNo)
        setTotalVoters(response.data.totalVoters)
    }
    fetchData()
    fetchBoothDetails()
  },[])




  // Data for Booths (English & Malayalam)
//   const boothData = {
//     1: { id: 1, name: "GHS, Palayam", ml_name: "ജി.എച്ച്.എസ്, പാളയം" },
//     2: { id: 2, name: "LPS, Kowdiar", ml_name: "എൽ.പി.എസ്, കവടിയാർ" },
//     3: { id: 3, name: "Govt HSS, Pattom", ml_name: "ഗവ. എച്ച്.എസ്.എസ്, പട്ടം" }
//   };

const handleVoterListPage=()=>{
    navigate('/voters', { state: currentBooth })
}

const handlePoliticalStatusPage=()=>{
    navigate('/politicalStatus', { state: currentBooth })
}

const handleVotingStatusPage=()=>{
    navigate('/votingStatus', { state: currentBooth })
}



  const currentBooth = boothData.find(b => b.boothNumber === activeBooth);

  return (
    // Outer container for the entire screen background
    <div className="min-h-screen bg-gray-100 font-sans pb-10 flex justify-center">
      
      {/* Center Content Wrapper: 
        max-w-md: Sets a maximum width (around 28rem/448px), ideal for phone view.
        mx-auto: Centers the div horizontally on larger screens (PC).
        bg-white/bg-gray-50: Ensures the centered column looks like an app screen.
      */}
      <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen">
        
        {/* --- HEADER SECTION --- */}
        {/* Removed bg-[#FAF9F6] here and moved it to the outer container for a clean flow */}
        <div className="p-4 pb-2 border-b border-gray-200 bg-[#FAF9F6]">

          {/* Ward Info Card */}
          <div className="bg-[#116d44] text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-1">Ward No: {wardNo}</h2>
              <div className="mt-4 flex justify-between items-end">
                <div>
                  <p className="text-green-200 text-sm">Total Voters / ആകെ വോട്ടർമാർ</p>
                  <p className="text-3xl font-bold">{totalVoters}</p>
                </div>
                <Users className="w-8 h-8 opacity-80" />
              </div>
            </div>
            {/* Decorative Circle */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full"></div>
          </div>
        </div>

        {/* --- BOOTH TABS --- */}
        <div className="px-4 mt-6">
          <div className="bg-white rounded-t-xl border border-b-0 border-gray-300 flex overflow-hidden">
            {boothData.map(({boothNumber}) => (
              <button
                key={boothNumber}
                onClick={() => setActiveBooth(boothNumber)}
                className={`flex-1 py-3 text-lg font-bold transition-colors duration-200 ${
                  activeBooth == boothNumber
                    ? 'bg-[#116d44] text-white'
                    : 'bg-white text-gray-400 hover:bg-gray-50'
                }`}
              >
                {boothNumber}
              </button>
            ))}
          </div>
        </div>

        {/* --- MAIN CARD CONTAINER --- */}
        <div className="mx-4 bg-white border border-gray-300 border-t-0 rounded-b-xl p-5 shadow-sm min-h-[500px]">
          
          {/* 1. Booth Name Box */}
          <div className="border-2 border-green-700 rounded-xl p-4 mb-6 bg-white shadow-sm">
            <p className="text-green-800 font-bold text-sm uppercase tracking-wide mb-1">
              Booth {currentBooth?.boothNumber}
            </p>
            <p className=''>
                {currentBooth?.location}
            </p>
            {/* <h3 className="text-xl font-bold text-gray-800">{currentBooth.name}</h3> */}
            {/* <p className="text-gray-600 font-medium">{currentBooth.ml_name}</p> */}
          </div>

          {/* 2. Voters List Button */}
          <button className="cursor-pointer w-full bg-[#116d44] text-white rounded-2xl p-5 mb-3 shadow-md flex items-center justify-between group active:scale-95 transition-transform"
          onClick={()=>handleVoterListPage()}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <List className="w-7 h-7 text-black" />
              </div>
              <div className="text-left">
                <h4 className="text-lg font-bold">Voters List</h4>
                <p className="text-sm text-green-100 opacity-90">വോട്ടർ ലിസ്റ്റ്</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 opacity-70 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* 3. Mark Status Button */}
          <button className="w-full bg-[#116d44] text-white rounded-2xl p-5 shadow-md flex items-center justify-between group active:scale-95 transition-transform mb-3"
          onClick={()=>handlePoliticalStatusPage()}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Flag className="w-7 h-7  text-red-700" />
              </div>
              <div className="text-left">
                <h4 className="text-lg font-bold">Mark Political Status</h4>
                <p className="text-sm text-green-100 opacity-90">രാഷ്ട്രീയം അടയാളപ്പെടുത്തുക</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 opacity-70 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="w-full bg-[#116d44] text-white rounded-2xl p-5 shadow-md flex items-center justify-between group active:scale-95 transition-transform"
          onClick={()=>handleVotingStatusPage()}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Flag className="w-7 h-7  text-red-700" />
              </div>
              <div className="text-left">
                <h4 className="text-lg font-bold">Voting Status</h4>
                <p className="text-sm text-green-100 opacity-90">വോട്ടിംഗ് സ്റ്റാറ്റസ് </p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 opacity-70 group-hover:translate-x-1 transition-transform" />
          </button>

        </div>

        <div className="text-center mt-6 text-gray-400 text-xs">
          Election Wing • Kanhirathara
        </div>

      </div>
    </div>
  );
};

export default VotersAppDashboard