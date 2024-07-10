import { useEffect, useMemo, useRef, useState } from 'react';
import { createMeeting, getToken, validateMeeting } from "../api";
import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
  useParticipant,
  Constants,
} from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";


function JoinScreen({ getMeetingAndToken, setMode }) {
  const [meetingId, setMeetingId] = useState(null);
  const [meetingId1, setMeetingId1] = useState(null);

  //Set the mode of joining participant and set the meeting id or generate new one
  const onClick = async (mode) => {
    setMode(mode);
    console.log("lolo : "+meetingId);

    await getMeetingAndToken(meetingId);
  };
  const onClick1 = async (mode) => {
    setMode(mode);
    console.log("fafa : "+meetingId1);
    await getMeetingAndToken(meetingId1);
  };
  return (
    <div className="container">
      <button onClick={() => onClick("CONFERENCE")}>Create Meeting</button>
      <br />
      <br />
      {" or "}
      <br />
      <br />
      <input
        type="text"
        placeholder="Enter Meeting Id"
        value={meetingId1}
        onChange={(e) => 
          setMeetingId1(e.target.value)
        }
      />
      <br />
      <br />
      <button onClick={() => onClick1("CONFERENCE")}>Join as Host</button>
      {" | "}
      <button onClick={() => onClick1("VIEWER")}>Join as Viewer</button>
    </div>
  );
}

function Container(props) {
  const [joined, setJoined] = useState(null);
  //Get the method which will be used to join the meeting.
  const { join } = useMeeting();
  const mMeeting = useMeeting({
    //callback for when a meeting is joined successfully
    onMeetingJoined: () => {
      setJoined("JOINED");
    },
    //callback for when a meeting is left
    onMeetingLeft: () => {
      props.onMeetingLeave();
    },
    //callback for when there is an error in a meeting
    onError: (error) => {
      alert(error.message);
    },
  });
  const joinMeeting = () => {
    setJoined("JOINING");
    join();
  };  

  return (
    <div className="container">
      <h3>Meeting Id: {props.meetingId}</h3>
      {joined && joined == "JOINED" ? (
        mMeeting.localParticipant.mode == Constants.modes.CONFERENCE ? (
          <SpeakerView />
        ) : mMeeting.localParticipant.mode == Constants.modes.VIEWER ? (
          <ViewerView />
        ) : null
      ) : joined && joined == "JOINING" ? (
        <p>Joining the meeting...</p>
      ) : (
        <button onClick={joinMeeting}>Join</button>
      )}
    </div>
  );
}
//importing hls.js
import Hls from "hls.js";

function ViewerView() {
  // States to store downstream url and current HLS state
  const playerRef = useRef(null);
  //Getting the hlsUrls
  const { hlsUrls, hlsState } = useMeeting();

  //Playing the HLS stream when the playbackHlsUrl is present and it is playable
  useEffect(() => {
    if (hlsUrls.playbackHlsUrl && hlsState == "HLS_PLAYABLE") {
      if (Hls.isSupported()) {
        const hls = new Hls({
          maxLoadingDelay: 1, // max video loading delay used in automatic start level selection
          defaultAudioCodec: "mp4a.40.2", // default audio codec
          maxBufferLength: 0, // If buffer length is/becomes less than this value, a new fragment will be loaded
          maxMaxBufferLength: 1, // Hls.js will never exceed this value
          startLevel: 0, // Start playback at the lowest quality level
          startPosition: -1, // set -1 playback will start from intialtime = 0
          maxBufferHole: 0.001, // 'Maximum' inter-fragment buffer hole tolerance that hls.js can cope with when searching for the next fragment to load.
          highBufferWatchdogPeriod: 0, // if media element is expected to play and if currentTime has not moved for more than highBufferWatchdogPeriod and if there are more than maxBufferHole seconds buffered upfront, hls.js will jump buffer gaps, or try to nudge playhead to recover playback.
          nudgeOffset: 0.05, // In case playback continues to stall after first playhead nudging, currentTime will be nudged evenmore following nudgeOffset to try to restore playback. media.currentTime += (nb nudge retry -1)*nudgeOffset
          nudgeMaxRetry: 1, // Max nb of nudge retries before hls.js raise a fatal BUFFER_STALLED_ERROR
          maxFragLookUpTolerance: .1, // This tolerance factor is used during fragment lookup.
          liveSyncDurationCount: 1, // if set to 3, playback will start from fragment N-3, N being the last fragment of the live playlist
          abrEwmaFastLive: 1, // Fast bitrate Exponential moving average half-life, used to compute average bitrate for Live streams.
          abrEwmaSlowLive: 3, // Slow bitrate Exponential moving average half-life, used to compute average bitrate for Live streams.
          abrEwmaFastVoD: 1, // Fast bitrate Exponential moving average half-life, used to compute average bitrate for VoD streams
          abrEwmaSlowVoD: 3, // Slow bitrate Exponential moving average half-life, used to compute average bitrate for VoD streams
          maxStarvationDelay: 1, // ABR algorithm will always try to choose a quality level that should avoid rebuffering
        });

        let player = document.querySelector("#hlsPlayer");

        hls.loadSource(hlsUrls.playbackHlsUrl);
        hls.attachMedia(player);
      } else {
        if (typeof playerRef.current?.play === "function") {
          playerRef.current.src = hlsUrls.playbackHlsUrl;
          playerRef.current.play();
        }
      }
    }
  }, [hlsUrls, hlsState, playerRef.current]);

  return (
    <div>
      {/* Showing message if HLS is not started or is stopped by HOST */}
      {hlsState != "HLS_PLAYABLE" ? (
        <div>
          <p>HLS has not started yet or is stopped</p>
        </div>
      ) : (
        hlsState == "HLS_PLAYABLE" && (
          <div>
            <video
              ref={playerRef}
              id="hlsPlayer"
              autoPlay={true}
              controls
              style={{ width: "100%", height: "100%" }}
              playsInline
              muted={true}
              playing
              onError={(err) => {
                console.log(err, "hls video error");
              }}
            ></video>
          </div>
        )
      )}
    </div>
  );
}

function SpeakerView() {
  //Get the participants and HLS State from useMeeting
  const { participants, hlsState } = useMeeting();

  //Filtering the host/speakers from all the participants
  const speakers = useMemo(() => {
    const speakerParticipants = [...participants.values()].filter(
      (participant) => {
        return participant.mode == Constants.modes.CONFERENCE;
      }
    );
    return speakerParticipants;
  }, [participants]);
  return (
    <div>
      <p>Current HLS State: {hlsState}</p>
      {/* Controls for the meeting */}
      <Controls />

      {/* Rendring all the HOST participants */}
      {speakers.map((participant) => (
        <ParticipantView participantId={participant.id} key={participant.id} />
      ))}
    </div>
  );
}

// function Container(){
  

//   const mMeeting = useMeeting({
//     onMeetingJoined: () => {
//       //Pin the local participant if he joins in CONFERENCE mode
//       if (mMeetingRef.current.localParticipant.mode == "CONFERENCE") {
//         mMeetingRef.current.localParticipant.pin();
//       }
//       setJoined("JOINED");
//     },
    
//   });

//   //Create a ref to meeting object so that when used inside the
//   //Callback functions, meeting state is maintained
//   const mMeetingRef = useRef(mMeeting);
//   useEffect(() => {
//     mMeetingRef.current = mMeeting;
//   }, [mMeeting]);

//   return <>...</>;
// }


function ParticipantView(props) {
  const micRef = useRef(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(props.participantId);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  //Playing the audio in the <audio>
  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <div>
      <p>
        Participant: {displayName} | Webcam: {webcamOn ? "ON" : "OFF"} | Mic:{" "}
        {micOn ? "ON" : "OFF"}
      </p>
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />
      {webcamOn && (
        <ReactPlayer
          //
          playsinline // extremely crucial prop
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          //
          url={videoStream}
          //
          height={"300px"}
          width={"300px"}
          onError={(err) => {
            console.log(err, "participant video error");
          }}
        />
      )}
    </div>
  );
}
function Controls() {
  const { leave, toggleMic, toggleWebcam, startHls, stopHls } = useMeeting();
  return (
    <div>
      <button onClick={() => leave()}>Leave</button>
      &emsp;|&emsp;
      <button onClick={() => toggleMic()}>toggleMic</button>
      <button onClick={() => toggleWebcam()}>toggleWebcam</button>
      &emsp;|&emsp;
      <button
        onClick={() => {
          //Start the HLS in SPOTLIGHT mode and PIN as
          //priority so only speakers are visible in the HLS stream
          startHls({
            layout: {
              type: "SPOTLIGHT",
              priority: "PIN",
              gridSize: "20",
            },
            theme: "LIGHT",
            mode: "video-and-audio",
            quality: "high",
            orientation: "landscape",
          });
        }}
      >
        Start HLS
      </button>
      <button onClick={() => stopHls()}>Stop HLS</button>
    </div>
  );
}

function MeetingView(props) {
  const [joined, setJoined] = useState(null);
  //Get the method which will be used to join the meeting.
  //We will also get the participants list to display all participants
  const { join, participants } = useMeeting({
    //callback for when meeting is joined successfully
    onMeetingJoined: () => {
      setJoined("JOINED");
    },
    //callback for when meeting is left
    onMeetingLeft: () => {
      props.onMeetingLeave();
    },
  });
  const joinMeeting = () => {
    setJoined("JOINING");
    join();
  };

  return (
    <div className="container">
      <h3>Meeting Id: {props.meetingId}</h3>
      {joined && joined == "JOINED" ? (
        <div>
          <Controls />
          //For rendering all the participants in the meeting
          {[...participants.keys()].map((participantId) => (
            <ParticipantView
              participantId={participantId}
              key={participantId}
            />
          ))}
        </div>
      ) : joined && joined == "JOINING" ? (
        <p>Joining the meeting...</p>
      ) : (
        <button onClick={joinMeeting}>Join</button>
      )}
    </div>
  );
}

export default function VideoChat(){
const [meetingId,setMeetingId]=useState(null);
const [isVideoMeetOpen, setIsVideoMeetOpen] = useState(false);
const [token,setToken]=useState("");
const [validateResponse,setValidateResponse]=useState(null);
const [mode, setMode] = useState("CONFERENCE");
const authToken ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI0ODUzZGU5NS1hMDZlLTRmYjktYmQyZS1kZmZiMDI4YjQ4ZjMiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcyMDQ3Mjk3NCwiZXhwIjoxNzIxMDc3Nzc0fQ.90aBORjiOEVkqdGgmMrFY0WfLmn9KVvtFkA1Lw80mms";

    const dam =()=>{

    }
    const getMeetingAndToken = async (id) => {
      if(id==null){
      const {meetingId,err} =
         await createMeeting({ token: authToken }) ;
      setMeetingId(meetingId);
      }
      else {
        setMeetingId(id);
      }
    };
    const custom=(id)=>{
      setMeetingId(id);
    }

    const onMeetingLeave = () => {
      setMeetingId(null);
    };

    const toggleVideoBox = () => {
      console.log("hiiiiiiiiiiiiiiiiiiiiiiiii");
        setIsVideoMeetOpen(!isVideoMeetOpen);
      };

      
      const gettingToken = async (e) => {
        e.preventDefault();
        try {
          const tok=await getToken();
          setToken(tok);
        } catch (error) {
          console.log("Token ERROR : " + error);
        }
      };

      const createVideoMeeting = async () => {
        // e.preventDefault();
        try {
          const { meetingId, err } =await createMeeting({token});
          if (meetingId) {
            setMeetingId(meetingId);
          }
        } catch (error) {
          console.log("Meeting ERROR : " + error);
        }
      };

      const Validate = async () => {
        // e.preventDefault();
        try {
          const { meetingId, err }  =await validateMeeting({
            roomId: meetingId,
            token,
          });
          setValidateResponse(meetingId);
          
        } catch (error) {
          console.log("Validate ERROR : " + error);
        }
      };


//     return(
//         <div className="fixed z-10 bottom-0 right-0 m-4">
//       <button
//         className="bg-blue-500 text-white p-3 rounded-full shadow-lg"
//         onClick={toggleVideoBox}
//       >
//         Video
//       </button>

     
//       {isVideoMeetOpen && (
// <MeetingProvider
//   config={{
//     meetingId: "asag-sbep-wkjj" ,
//     micEnabled: true,
//     webcamEnabled: true,
//     name: "Ashu",
//     participantId: "xyz",
//     multiStream: true,
//     mode: "CONFERENCE", // "CONFERENCE" || "VIEWER"
//     metaData: {},
//   }}
//   token={"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI0ODUzZGU5NS1hMDZlLTRmYjktYmQyZS1kZmZiMDI4YjQ4ZjMiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIiwiYWxsb3dfbW9kIl0sImlhdCI6MTcyMDQ2ODcyNSwiZXhwIjoxNzIwNDY5MzI1fQ.abILEaOsdZdlRXpl5V_nDON9-a5bXgwVEAh2cHHWFLs" }
//   joinWithoutUserInteraction // Boolean
// >


//         {/* <div className="fixed bottom-20 right-4 w-[500px] h-80 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col">
//           <button className='bg-orange-300' onClick={gettingToken}>Token</button>
//           <h1 className='p-4 flex-1 overflow-y-auto'>Token : {token}</h1>
//           <button className='bg-orange-300' onClick={createVideoMeeting}>Meeting</button>
//           <h1 className='p-4 flex-1 overflow-y-auto'>Meeting : {meeting}</h1>
//           <button className='bg-orange-300' onClick={Validate}>Validate</button>
//           <h1 className='p-4 flex-1 overflow-y-auto'>Validate : {validateResponse}</h1>
//         </div> */}


// <MeetingConsumer
//   {...{
//     onParticipantJoined: (participant) => {
//       setParticipant(participant);
//     },
//     //All Event Callbacks can be specified here
//   }}
// >
//   {({
//     meetingId,
//     //All Properties can be specified here

//     join,
//     leave,
//     //All methods can be specified here
//   }) => {
//     return <MeetingView />;
//   }}
// </MeetingConsumer>
  
// </MeetingProvider> )}
//     </div>
//     )
return( 
  <div className="fixed z-10 bottom-0 right-0 m-4">
        <button
          className="bg-blue-500 text-white p-3 rounded-full shadow-lg"
          onClick={toggleVideoBox}
        >
          Video
        </button>
        {isVideoMeetOpen && (
        authToken && meetingId ? (
          <MeetingProvider
            config={{
              meetingId,
              micEnabled: true,
              webcamEnabled: true,
              name: "C.V. Raman",
              //This will be the mode of the participant CONFERENCE or VIEWER
              mode: mode,
            }}
            token={authToken}
          >
            <MeetingConsumer>
              {() => (
                <Container meetingId={meetingId} onMeetingLeave={onMeetingLeave} />
              )}
            </MeetingConsumer>
          </MeetingProvider>
        ) : (
          <JoinScreen getMeetingAndToken={getMeetingAndToken} setMode={setMode} />
        )
      )}</div>);
}