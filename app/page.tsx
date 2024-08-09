"use client" // error message said so

import { useState, useEffect, useRef } from "react"

export default function Page() 
{
    const [messages, SetMessages] = useState([]);
    const input_ref = useRef(null);

    // Initialize basic messages
    useEffect(()=>{
        let first_messages = [];
        first_messages.push({
            sender: "server",
            contents: "Hi, my name is Sarah! How may I help you today?"
        });

        first_messages.push({
            sender: "server",
            contents: "Today only, we are offering 20% off on all clothing items!"
        });

        first_messages.push({
            sender: "client",
            contents: "Hello! Those deals look awesome! Can you please direct me to the clothing section?"
        });

        first_messages.push({
            sender: "server",
            contents: "Sure! Please visit this link: https://localhost:3000/clothing"
        });
        first_messages.push({
            sender: "server",
            contents: "Sure! Please visit this link: https://localhost.com/clothing"
        });

        SetMessages(first_messages);
    }, []);

    const AddMessage = (message: string, from: String) => {
        let message_list = [...messages];

        message_list.push({
            sender: from,
            contents: message
        });

        SetMessages(message_list);
    }

    const SendMessage = () => {
        if (!input_ref || !input_ref.current.value)
            return;

        AddMessage(input_ref.current.value, "client");
    }

    // Return a message as HTML elements with links formatted
    const FormatMesage = (message: string) => {
        // Enjoy the regex, partially built by hand, in prod prob best to remove the | localhost
        const regex = /((?:http(?:s)?:\/\/.)(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b(?:[-a-zA-Z0-9@:%_\+.~#?&//=]*)|(?:http(?:s)?:\/\/(?:localhost):[0-9]{1,5}\b(?:[-a-zA-Z0-9@:%_\+.~#?&//=]*)))/g
        let link_ready_messages: string[] = message.split(regex);

        return <p>{link_ready_messages.map(function(entry, index) {
            if (entry.length > 0 && entry.match(regex)) { // This is incredibly bad but ok!
                return <a key={index} href={entry} className="underline">{entry}</a>
            } else if (entry.length > 0) {
                return entry;
            }
        })}</p>;
    }
    
    return (
    <div className="flex justify-between flex-col max-w-lg max-h-full/50 w-full h-full bg-gray-100">
        <div className="w-full h-24 bg-gradient-to-r from-sky-400 to-sky-500">
            <div className="grid place-items-center h-full">
                <p className="w-full text-white p-2" style={{ fontSize: 'max(min(5vh, 3.5vw), 20px)'}}>Customer Support Agent</p>
            </div>
        </div>
        <div className="flex flex-col justify-end h-full">
            {messages.map(function(info, index) {
                if (info.sender == "server") {
                    return <div className="grid place-items-start" key={index}>
                        <div className="foreign-message text-white rounded-lg max-w-96 p-2 ml-2 m-1">
                            {FormatMesage(info.contents)}
                        </div>
                    </div>
                }

                return <div className="grid place-items-end" key={index}>
                    <div className="sender-message text-black rounded-lg max-w-96 p-2 ml-2 m-1">
                        {FormatMesage(info.contents)}
                    </div>
                </div>
        })}
        </div>
        <div className="flex flex-row justify-between bg-gray-100" style={{ height: '14%' }}>
            <textarea className="w-full rounded-lg p-2 m-2" style={{ fontSize: 'max(min(3vh, 3vw), 20px)'}} ref={input_ref} placeholder="Prompt..."/>
            <button className="border-2 p-2 m-2 ml-0 rounded-lg" style={{ minWidth: '20%', fontSize: 'max(min(4vh, 4vw), 20px)'}} onClick={SendMessage}>
                Send
            </button>
        </div>
    </div>)
}