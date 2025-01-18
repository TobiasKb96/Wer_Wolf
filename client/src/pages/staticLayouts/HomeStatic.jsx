function HomeStatic() {


    return (
        <div
            className="flex overflow-hidden flex-col px-1.5 pb-2 mx-auto w-full h-full text-center text-black bg-yellow-950 ">
            <div
                className="flex overflow-hidden flex-col items-center h-full pt-0 pb-20 mt-1.5 border-2 border-solid bg-zinc-300 border-stone-600">
                <div
                    className="overflow-visible self-stretch px-8 py-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl whitespace-nowrap rounded-b-xl border-solid bg-stone-300 border-neutral-500 shadow-[0px_2px_2px_rgba(0,0,0,0.25)] font-metal">
                    Wer?Wolf
                </div>
                <div className="mt-20">
                    Have you seen this wolf?
                </div>
                <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/7bc200703c17522024c30af85dfbbc318d63fe4394ede377db6f091f06d50f94?placeholderIfAbsent=true&apiKey=4207de095666434880eb8ceb2ef5bac3"
                    alt="Werewolf portrait"
                    className="object-contain mt-6 w-60 max-w-full aspect-[0.96] rounded-[215px]"
                />
                <div
                    className="mt-7"
                >
                    Notify authorities now
                </div>
                <button className="mt-4 px-6 py-3 text-lg text-white bg-yellow-800 rounded-md transition-colors hover:bg-yellow-900">

                    Learn more
                </button>
            </div>
        </div>
    );

}

export default HomeStatic;
