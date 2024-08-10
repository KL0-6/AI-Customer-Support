import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

interface Message 
{
    sender: string;
    contents: string;
}

const Page = () => 
{
    const [messages, setMessages] = useState<Message[]>([]);
    const input_ref = useRef<HTMLTextAreaElement | null>(null);
    const chat_ref = useRef<HTMLDivElement | null>(null);

    // Initialize basic messages
    useEffect(() => 
    {
        const first_messages: Message[] = [
            {
                sender: "server",
                contents: "I am JDP, your Headstarter AI support bot. I can answer your questions about the Headstarter fellowship and help you find the right track for your goals.\nHow can I help you?"
            }
        ];
        setMessages(first_messages);
    }, []);

    useEffect(() => 
    {
        if (chat_ref.current) {
            chat_ref.current.scrollTop = chat_ref.current.scrollHeight;
        }
    }, [messages]);

    const AddMessage = async (message: string, from: string) => 
    {
        setMessages(prevMessages => 
        [
            ...prevMessages,
            {
                sender: from,
                contents: message
            }
        ]);

        try 
        {
            const previousMessagesText = messages
                .filter(msg => msg.sender === "client")
                .map(msg => msg.contents)
                .join("\n");

            const response = await fetch("https://kl0-6.com/api/chat", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    data: `CHAT HISTORY:${previousMessagesText}\nCURRENT MESSAGE:${message}`
                })
            });

            const text = await response.text();

            setMessages(prevMessages => [
                ...prevMessages,
                {
                    sender: "server",
                    contents: text
                }
            ]);
        } catch (error) 
        {
            setMessages(prevMessages => 
            [
                ...prevMessages,
                {
                    sender: "server",
                    contents: "Sorry! The chatbot is unavailable right now!"
                }
            ]);
        }
    };

    const SendMessage = () => 
    {
        if (!input_ref.current || !input_ref.current.value) return;

        AddMessage(input_ref.current.value, "client");
        input_ref.current.value = "";
    };

    const FormatMessage = (message: string) => 
    {
        return <ReactMarkdown>{message}</ReactMarkdown>;
    };

    return (
        <div className="flex justify-between flex-col max-w-lg w-full h-full bg-gray-100">

            <div className="w-full h-24 bg-gradient-to-r from-sky-400 to-sky-500">
                <div className="grid place-items-center h-full">
                    <p className="w-full text-white p-2" style={{ fontSize: "min(min(5vh, 5vw), 30px)" }}>Customer Support Agent</p>
                </div>
            </div>

            <div className="flex flex-col justify-end h-fit overflow-hidden">
                <div ref={chat_ref} className="overflow-y-auto" style={{ height: "40em" }} aria-live="polite">
                    {messages.map((info, index) => (
                        <div className={`flex ${info.sender === "server" ? "justify-start" : "justify-end"} mb-2`} key={index}>
                            <div className={`${info.sender === "server" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"} rounded-lg max-w-96 p-2 m-1`}>
                                {FormatMessage(info.contents)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-row justify-between bg-gray-100" style={{ height: "14%" }}>
                <textarea className="w-full rounded-lg p-2 m-2 resize-none overflow-auto text-base md:text-lg" style={{ fontSize: "max(min(3vh, 3vw), 20px)", minHeight: "4em", maxHeight: "8em" }} ref={input_ref} placeholder="Prompt..." />
                <button className="border-2 p-2 m-2 ml-0 rounded-lg text-base md:text-lg" style={{ minWidth: "120px", maxWidth: "200px" }} onClick={SendMessage}>
                    Send
                </button>
            </div>

        </div>
    );
};

export default Page;
