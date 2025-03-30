import { format } from "date-fns";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Coins, Users } from "lucide-react";
import { GoalDetail } from "@/types/move";
import Link from "next/link";

export function GoalCard({ goal }: { goal: GoalDetail }) {
    const getStatusColor = (status: number) => {
        switch (status) {
            case 1:
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
            case 2:
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
            default:
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
        }
    };

    const getStatusText = (status: number) => {
        switch (status) {
            case 1:
                return "已完成";
            case 2:
                return "失败";
            default:
                return "进行中";
        }
    };

    return (
        <Card className="w-full backdrop-blur-sm bg-white/10 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{goal.title}</CardTitle>
                    <Badge className={getStatusColor(goal.status)}>
                        {getStatusText(goal.status)}
                    </Badge>
                </div>
                <CardDescription className="line-clamp-1">
                    {goal.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    {goal.progress_percentage !== undefined && (
                        <>
                            <div className="flex justify-between text-sm">
                                <span>目标进度</span>
                                <span>{goal.progress_percentage}%</span>
                            </div>
                            <Progress
                                value={goal.progress_percentage}
                                className="h-2"
                            />
                        </>
                    )}
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                            截止日期:{" "}
                            {format(
                                new Date(Number(goal.deadline)),
                                "yyyy-MM-dd"
                            )}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Coins className="h-4 w-4" />
                        <span>保证金: {Number(goal.amount) / 10 ** 9} SUI</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>见证人: {goal.witnesses?.length}人</span>
                    </div>
                </div>

                {goal.ai_suggestion && (
                    <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-sm mb-1">
                                    AI 建议
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {goal.ai_suggestion}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                        variant="outline"
                        className="flex-1 text-sm py-1 h-8"
                    >
                        更新进度
                    </Button>
                    <Button
                        variant="outline"
                        className="flex-1 text-sm py-1 h-8"
                        asChild
                    >
                        <Link href={`/goals/${goal.id}`}>查看详情</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
