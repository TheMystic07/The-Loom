import { useState } from "react";
import loom from "../assets/loom.png";
import hangar from "../assets/hangar.png";
import custom from "../assets/custom.png";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "../../components/ui/card";
  

export default function NavMap() {
  const [mapDetails, setMapDetails] = useState([
    {
      image: loom,
      id: 1,
      title: "Loom City",
      description: "Main Playground",
    },
    { image: hangar, id: 2, title: "Hangar", description: "Project Showcase" },
    { image: custom, id: 3, title: "Room", description: "Meeting Room" },
  ]);
  const navigate = useNavigate();

  const changeMap = (_id) => {
    if (_id == 1) {
      navigate("/loom");
    } else if (_id == 2) {
      navigate("/hangar");
    } else if (_id == 3) {
      navigate("/custom");
    }
  };

  return (
    <div className="bg-black h-screen flex flex-col pt-8 gap-10 ">
      <div className=" mx-20">
        <h1 className="text-white text-7xl font-semibold border-b-2 border-white">
          Exploration Area
        </h1>
      </div>
      <div className=" mx-20 p-8 rounded-lg border-2 border-white border-solid">
        <div className="flex gap-12">
          {mapDetails.map((val, key) => {
            return (
              <button
                key={key}
                className="flex flex-col gap-4 border-2 border-white border-solid w-[400px] h-[360px] items-center rounded-lg p-4 transition-transform duration-300 ease-in-out transform hover:scale-105"
                onClick={() => {
                  changeMap(val.id);
                }}
              >
                <img
                  src={val.image}
                  className="w-96 rounded-md border-2 border-white "
                />
                <div className="flex w-96 flex-col gap-2  px-4">
                  <h1 className="text-4xl text-white font-semibold text-ellipsis overflow-hidden">
                    {val.title}
                  </h1>
                  <h1 className="text-xl text-white font-medium text-ellipsis overflow-hidden">
                    {val.description}
                  </h1>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="bg-white h-16 flex justify-center items-center font-semibold fixed bottom-4 inset-x-0">
        @ArweaveHackerHouse 2024
      </div>
    </div>
  );
}
