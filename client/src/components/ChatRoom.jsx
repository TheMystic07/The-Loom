import { useState, useEffect } from 'react';
import { message, result, createDataItemSigner } from "@permaweb/aoconnect";
import { useActiveAddress } from 'arweave-wallet-kit';
import { useAuth } from "../store/auth";

function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const { all, AllData } = useAuth();
  const wallet_address = useActiveAddress();

  const toggleChatBox = () => {
    setIsOpen(!isOpen);
  };

  const sendMessages = async () => {
    try {
      const messageId = await message({
        process: "hF1fU8-VrvsPBLYY6VWqMxAa_rFocOnEvckkJBrcpoo",
        signer: createDataItemSigner(window.arweaveWallet),
        tags: [{ name: "Action", value: "Broadcast" }],
        data: `${newMessage}`,
      });
      console.log("sendMessages id : " + messageId);
      let res1 = await result({
        message: messageId,
        process: "hF1fU8-VrvsPBLYY6VWqMxAa_rFocOnEvckkJBrcpoo",
      });
      console.log("sendMessages data " + JSON.stringify(res1));
      setNewMessage(''); // Clear input after sending message
      await AllData(); // Manually refresh data after sending a message
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed z-10 bottom-0 left-0 m-4">
      <button
        className="bg-blue-500 text-white p-3 rounded-full shadow-lg"
        onClick={toggleChatBox}
      >
        Chat
      </button>

      {isOpen && (
        <div className="fixed bottom-20 left-4 w-[500px] h-96 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col">
          <div className="p-4 bg-blue-500 text-white flex justify-between items-center">
            <h3 className="text-lg">Chat Room</h3>
            <button onClick={toggleChatBox} className="text-white">
              &times;
            </button>
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
            {all.map((msg, index) => (
              <div key={index} className="mb-2">
                <strong>{msg.SentBy.substring(0, 6) + '....'} : </strong> {msg.Data}
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-gray-300 flex">
            <input
              type="text"
              className="flex-1 p-2 border border-gray-300 rounded-lg"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMessages();
                }
              }}
            />
            <button
              onClick={sendMessages}
              className="bg-blue-500 text-white p-2 rounded-lg ml-2"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBox;
