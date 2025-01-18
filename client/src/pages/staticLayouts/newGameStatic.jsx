function NewGameStatic() {


    return (

        <div
            className="flex overflow-hidden flex-col px-1.5 pb-2 mx-auto w-full h-full text-center text-black bg-yellow-950">
            <div
                className="flex overflow-hidden flex-col items-center h-full pt-0 pb-20 mt-1.5 border-2 border-solid bg-zinc-300 border-stone-600">
                <div
                    className="overflow-hidden self-stretch px-16 py-1.5 text-5xl whitespace-nowrap rounded-b-xl border-solid bg-stone-300 border-neutral-500 shadow-[0px_2px_2px_rgba(0,0,0,0.25)] font-metal">
                    Wer?Wolf
                </div>
                <div className="text-center p-8">
                    <button
                        onClick={null}
                        className="px-8 py-4 text-base text-white bg-blue-600 rounded-lg cursor-pointer mb-4 transition-colors hover:bg-blue-700"
                    >
                        Create New Game
                    </button>


                </div>
            </div>
        </div>
    );

}

export default NewGameStatic;
