import TimeSlotManager from "@/components/custom/TimeSlotManager";
import Pagelayout from "@/components/layout/PageLayout";

export default function ManageTimeSlots() {
    return (
        <Pagelayout title={"Manage TimeSlots for Book one-on-one"}>
            <TimeSlotManager />
        </Pagelayout>
    )
}