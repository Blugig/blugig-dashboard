import Pagelayout from "@/components/layout/PageLayout";

export default function Loading() {
    return (
        <Pagelayout title={"Loading"}>

            <div class='flex space-x-2 justify-center items-center bg-white h-screen dark:invert'>
                <span class='sr-only'>Loading...</span>
                <div class='h-8 w-8 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                <div class='h-8 w-8 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                <div class='h-8 w-8 bg-primary rounded-full animate-bounce'></div>
            </div>

        </Pagelayout>
    )
}