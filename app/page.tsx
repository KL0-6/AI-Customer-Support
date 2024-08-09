
export default function Page() 
{
    return (
    <div className="flex justify-between flex-col max-w-lg max-h-full/50 w-full h-full bg-gray-100">
        <div className="w-full h-24 bg-gradient-to-r from-sky-400 to-sky-500">
            <div className="grid place-items-center h-full">
                <p className="w-full text-white p-2" style={{ fontSize: 'max(min(5vh, 3.5vw), 20px)'}}>Customer Support Agent</p>
            </div>
        </div>
        <div className="flex flex-col justify-end h-full">
            <div className="grid place-items-start">
                <div className="foreign-message text-white rounded-lg max-w-96 p-2 ml-2 m-1">
                    <p>Hi, my name is Sarah! How may I help you today?</p>
                </div>
            </div>
            <div className="grid place-items-start">
                <div className="foreign-message text-white rounded-lg max-w-96 p-2 ml-2 m-1">
                    <p>Today only, we are offering 20% off on all clothing items!</p>
                </div>
            </div>
            <div className="grid place-items-end">
                <div className="sender-message text-black rounded-lg max-w-96 p-2 ml-2 m-1">
                    <p>Hello! Those deals look awesome! Can you please direct me to the clothing section?</p>
                </div>
            </div>
            <div className="grid place-items-start">
                <div className="foreign-message text-white rounded-lg max-w-96 p-2 ml-2 m-1">
                    <p>Sure! Please visit this link: <a href="#" className="underline">clothing</a></p>
                </div>
            </div>
        </div>
        <div className="flex flex-row justify-between bg-gray-100" style={{ height: '14%' }}>
            <textarea className="w-full rounded-lg p-2 m-2" style={{ fontSize: 'max(min(3vh, 3vw), 20px)'}}>
                Test
            </textarea>
            <button className="border-2 p-2 m-2 ml-0 rounded-lg" style={{ minWidth: '20%', fontSize: 'max(min(4vh, 4vw), 20px)' }}>
                Send
            </button>
        </div>
    </div>)
}