import { createContext, useContext, useEffect, useState } from "react";
import { dryrun } from "@permaweb/aoconnect";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [all, setAll] = useState([]);
  const [open,setOpen]=useState(false);

  const stripAnsiCodes = (str) =>
    str.replace(
      /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
      ""
    );

  const AllData = async () => {
    try {
      const messageId = await dryrun({
        process: "hF1fU8-VrvsPBLYY6VWqMxAa_rFocOnEvckkJBrcpoo",
        tags: [{ name: "Action", value: "Chat" }],
        data: `Send({Target="hF1fU8-VrvsPBLYY6VWqMxAa_rFocOnEvckkJBrcpoo",Action="Chat"})`,
      });
    //   console.log("AllData id : " + messageId);
    //   console.log("AllData data " + stripAnsiCodes(messageId.Output.data));
      const data = JSON.parse(stripAnsiCodes(messageId.Output.data));
      setAll(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    AllData();
  }, []);



  return (
    <AuthContext.Provider value={{ all, AllData ,open,setOpen}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth use outside of provider");
  }

  return authContextValue;
};
