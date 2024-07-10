import React, { useEffect, useState } from "react";
import { useMeetingAppContext } from "../MeetingAppContextDef";
import { ParticipantView } from "./ParticipantView";

const MemoizedParticipant = React.memo(
  ParticipantView,
  (prevProps, nextProps) => {
    return prevProps.participantId === nextProps.participantId;
  }
);

function ParticipantGrid({ participantIds, isPresenting }) {
  const { sideBarMode } = useMeetingAppContext();
  const isMobile = window.matchMedia("only screen and (max-width: 768px)").matches;

  // Filter participant IDs
  const [filteredParticipantIds, setFilteredParticipantIds] = useState([]);

  useEffect(() => {
    const filteredIds = participantIds.filter((id, index) => {
      if (participantIds.length % 2 === 0) {
        // Array length is even, use even indices
        return index % 2 === 0;
      } else {
        // Array length is odd, use odd indices
        return index % 2 !== 0;
      }
    });
    setFilteredParticipantIds(filteredIds);
  }, [participantIds]);

  const perRow =
    isMobile || isPresenting
      ? filteredParticipantIds.length < 4
        ? 1
        : filteredParticipantIds.length < 9
        ? 2
        : 3
      : filteredParticipantIds.length < 5
      ? 2
      : filteredParticipantIds.length < 7
      ? 3
      : filteredParticipantIds.length < 9
      ? 4
      : filteredParticipantIds.length < 10
      ? 3
      : filteredParticipantIds.length < 11
      ? 4
      : 4;

  return (
    <div
      className={`flex flex-col md:flex-row flex-grow m-3 items-center justify-center ${
        filteredParticipantIds.length < 2 && !sideBarMode && !isPresenting
          ? "md:px-16 md:py-2"
          : filteredParticipantIds.length < 3 && !sideBarMode && !isPresenting
          ? "md:px-16 md:py-8"
          : filteredParticipantIds.length < 4 && !sideBarMode && !isPresenting
          ? "md:px-16 md:py-4"
          : filteredParticipantIds.length > 4 && !sideBarMode && !isPresenting
          ? "md:px-14"
          : "md:px-0"
      }`}
    >
      <div className="flex flex-col w-full h-full">
        {Array.from(
          { length: Math.ceil(filteredParticipantIds.length / perRow) },
          (_, i) => {
            return (
              <div
                key={`participant-${i}`}
                className={`flex flex-1 ${
                  isPresenting
                    ? filteredParticipantIds.length === 1
                      ? "justify-start items-start"
                      : "items-center justify-center"
                    : "items-center justify-center"
                }`}
              >
                {filteredParticipantIds
                  .slice(i * perRow, (i + 1) * perRow)
                  .map((participantId) => {
                    return (
                      <div
                        key={`participant_${participantId}`}
                        className={`flex flex-1 ${
                          isPresenting
                            ? filteredParticipantIds.length === 1
                              ? "md:h-48 md:w-44 xl:w-52 xl:h-48 "
                              : filteredParticipantIds.length === 2
                              ? "md:w-44 xl:w-56"
                              : "md:w-44 xl:w-48"
                            : "w-full"
                        } items-center justify-center h-full ${
                          filteredParticipantIds.length === 1
                            ? "md:max-w-7xl 2xl:max-w-[1480px] "
                            : "md:max-w-lg 2xl:max-w-2xl"
                        } overflow-clip overflow-hidden p-1`}
                      >
                        <MemoizedParticipant participantId={participantId} />
                      </div>
                    );
                  })}
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}

export const MemoizedParticipantGrid = React.memo(
  ParticipantGrid,
  (prevProps, nextProps) => {
    return (
      JSON.stringify(prevProps.participantIds) ===
        JSON.stringify(nextProps.participantIds) &&
      prevProps.isPresenting === nextProps.isPresenting
    );
  }
);

export default ParticipantGrid;


