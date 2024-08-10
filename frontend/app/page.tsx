"use client" // error message said so

import { useState, useEffect, useRef } from "react"
import ReactMarkdown from 'react-markdown'

export default function Page() 
{
    const [messages, SetMessages] = useState([]);
    const input_ref = useRef(null);

    // Initialize basic messages
    useEffect(()=>{
        let first_messages = [];
        first_messages.push({
            sender: "server",
            contents: "I am JDP, your Headstarter AI support bot. I can answer your questions about the Headstarter fellowship and help you find the right track for your goals.\nHow can I help you?"
        });

        SetMessages(first_messages);
    }, []);

    const AddMessage = async (message: string, from: String) => {
        SetMessages(prevMessages => 
        [
            ...prevMessages,
            {
                sender: from,
                contents: message
            }
        ]);

        try 
        {
            const response = await fetch("https://kl0-6.com/api/chat", 
            {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    data: message
                })
            });

            let text = await response.text();

            SetMessages(prevMessages => 
            [
                ...prevMessages,
                {
                    sender: "server",
                    contents: text
                }
            ]);

            console.log();

        } 
        catch (error) 
        {
            SetMessages(prevMessages => 
            [
                ...prevMessages,
                {
                    sender: "server",
                    contents: "Sorry! The chatbot is unavailable right now!"
                }
            ]);
        }
    }

    const SendMessage = () => {
        if (!input_ref || !input_ref.current.value)
            return;

        AddMessage(input_ref.current.value, "client");
    }

    // Return a message as HTML elements with links formatted
    const FormatMessage = (message: string) => 
    {
        // Enjoy the regex, partially built by hand, in prod prob best to remove the | localhost
        //const regex = /((?:http(?:s)?:\/\/.)(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b(?:[-a-zA-Z0-9@:%_\+.~#?&//=]*)|(?:http(?:s)?:\/\/(?:localhost):[0-9]{1,5}\b(?:[-a-zA-Z0-9@:%_\+.~#?&//=]*)))/g
        //let link_ready_messages: string[] = message.split(regex);

        return <ReactMarkdown children={message}></ReactMarkdown>;
    }
    
    return (
    <div className="flex justify-between flex-col max-w-lg w-full h-full bg-gray-100">
        <div className="w-full h-24 bg-gradient-to-r from-sky-400 to-sky-500">
            <div className="grid place-items-center h-full">
                <p className="w-full text-white p-2" style={{ fontSize: "min(min(5vh, 5vw), 30px)"}}>Customer Support Agent</p>
            </div>
        </div>
        <div className="flex flex-col justify-end h-fit overflow-hidden">
            <div className="overflow-y-auto scroll-auto" style={{height: "40em"}}>
            {
                messages.map(function(info, index) {
                    if (info.sender == "server") {
                        return (
                        <div className="grid place-items-start" key={index}>
                            <div className="foreign-message text-white rounded-lg max-w-96 p-2 ml-2 m-1">
                                {FormatMessage(info.contents)}
                            </div>
                        </div>)
                    }
                    else
                    {
                        return (
                        <div className="grid place-items-end" key={index}>
                            <div className="sender-message text-black rounded-lg max-w-96 p-2 ml-2 m-1">
                                {FormatMessage(info.contents)}
                            </div>
                        </div>)
                    }
                })
            }
            </div>
        </div>
        <div className="flex flex-row justify-between bg-gray-100" style={{ height: "14%" }}>
            <textarea className="w-full rounded-lg p-2 m-2" style={{ fontSize: "max(min(3vh, 3vw), 20px)"}} ref={input_ref} placeholder="Prompt..."/>
            <button className="border-2 p-2 m-2 ml-0 rounded-lg" style={{ minWidth: "20%", fontSize: "max(min(4vh, 4vw), 20px)"}} onClick={SendMessage}>
                Send
            </button>
        </div>
    </div>)
}