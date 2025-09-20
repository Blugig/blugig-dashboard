import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";


export default function UpdateJobProgress({ currentProgress = 0, onProgressUpdate }) {
    const [progress, setProgress] = useState([currentProgress]);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleProgressChange = (value) => {
        setProgress(value);
    };

    const handleUpdateProgress = async () => {
        setIsUpdating(true);
        try {
            const progressValue = progress[0];

            if (onProgressUpdate) {
                await onProgressUpdate(progressValue);
            }

            toast.success(`Progress updated to ${progressValue}%`);
        } catch (error) {
            toast.error("Failed to update progress");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* Current Progress */}
            <Card className="p-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            Progress
                        </span>
                        <span className="text-lg font-bold text-blue-600">{currentProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${currentProgress}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {currentProgress < 30 ? 'Just started' :
                            currentProgress < 60 ? 'In progress' :
                                currentProgress < 90 ? 'Nearly complete' :
                                    'Almost finished'}
                    </p>
                </div>
            </Card>

            <Card className="p-4">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Update Progress</span>
                        <span className="text-sm font-medium text-blue-600">{progress[0]}%</span>
                    </div>

                    <Slider
                        value={progress}
                        onValueChange={handleProgressChange}
                        max={100}
                        step={5}
                        className="w-full"
                    />

                    <Button
                        onClick={handleUpdateProgress}
                        disabled={isUpdating}
                        size="sm"
                        className="w-full"
                    >
                        {isUpdating ? "Updating..." : "Update"}
                    </Button>
                </div>
            </Card>
        </div>
    );
}