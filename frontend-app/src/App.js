import React, { useState, useRef } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

export const WebSocketDemo = () => {
  //Public API that will echo messages sent to it back to the client
  const [socketUrl] = useState("ws://localhost:3001/frontendCall");
  const messageHistory = useRef([]);

  const { readyState } = useWebSocket(socketUrl, {
    onMessage: (event) => {
      messageHistory.current = messageHistory.current.concat(event.data);
    },
  });

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div style={{padding:'50px'}}>
      <div>
        <span style={{ color: "green" }}>
          The WebSocket is currently {connectionStatus}
        </span>
      </div>

      <div  style={{padding:'50px'}}>
        <table>
          <thead>
            <tr>
              <th style={{width:'200px', textAlign:"center"}}>Time</th>
              <th style={{width:'200px',textAlign:"center"}}>Sucess rate (%)</th>
              <th style={{width:'200px',textAlign:"center"}}>Number of data decode</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {messageHistory.current.map((message, index) => (
              <tr
               style={{ height: "20px" }}
                key={index}
              >
                {console.log(message)}
                <td  style={{width:'200px',textAlign:"center"}}>{message ? JSON.parse(message).time : null}</td>
                <td  style={{width:'200px',textAlign:"center"}}>
                  {message ? JSON.parse(message).successRate : null}
                </td>
                <td  style={{width:'200px',textAlign:"center"}}>
                {message
                      ? JSON.stringify(JSON.parse(message).NumberOfData)
                      : null}
                </td>
                <td style={{ overflowX: "scroll" }}>
                  <div style={{ height: "150px", overflowY: "scroll" }}>
                    {message
                      ? JSON.stringify(JSON.parse(message).data)
                      : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function App() {
  return <WebSocketDemo />;
}

export default App;
