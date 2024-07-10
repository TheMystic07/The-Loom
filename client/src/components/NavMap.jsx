import { useState } from "react"
import loom from "../assets/loom.png";
import { useNavigate, Link } from "react-router-dom";

export default function NavMap(){
    const [mapDetails,setMapDetails]=useState([{id:1,title:"Better",description:"dadhaubfja bfjabf fajwfjafma fawbfuabwfk afkjbaqufbakj"},
        {id:2,title:"lol",description:"dadh faf aff af fa f af  h eth et ufbakj"},
        {id:3,title:"]dad",description:"dadh faf aff af fa f af  h eth et ufbakj"}
    ]);
    const navigate = useNavigate();

    const changeMap=(_id)=>{
        if (_id==1){
navigate("/loom");
        }
        else if(_id==2){
            navigate("/hangar");

        }else if (_id==3){
            navigate("/custom");

        }
            


    }
    return (
        <div className="bg-black h-screen flex flex-col pt-8 gap-10 ">
            <div className="bg-green-500 mx-20">
          <h1 className="text-white text-7xl font-semibold border-b-2 border-white">Exploration Area</h1>
            </div>
            <div className="bg-red-500 mx-20 p-8 rounded-lg border-2 border-white border-solid">

<div className="flex gap-12">
    {
        mapDetails.map((val,key)=>{

            return(
                <button className="flex flex-col gap-4 bg-blue-400 w-[400px] h-[360px] items-center rounded-lg p-4  " onClick={()=>{changeMap(val.id)}}>
                    <img src={loom} className="w-96 rounded-md bg-green-700" />
                    <div className="flex w-96 flex-col bg-orange-600 px-4">
                    <h1 className="text-4xl font-semibold text-ellipsis overflow-hidden">{val.title}</h1>
                    <h1 className="text-xl font-medium text-ellipsis overflow-hidden">{val.description}</h1>
                        </div>
                 
   
                </button> 
            )
        })
    }
   
</div>
            </div>
        </div>
    )
}