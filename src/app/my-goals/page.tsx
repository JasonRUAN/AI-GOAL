"use client";

import { GoalCard } from "@/components/GoalCard";
import { Button } from "@/components/ui/button";
import { useGetMyGoals } from "@/hooks/useGetMyGoals";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function MyGoalsPage() {
    const router = useRouter();
    const { data: goals, isLoading } = useGetMyGoals();
    const [activeTab, setActiveTab] = useState("all");

    const filteredGoals = goals?.filter((goal) => {
        if (!goal) return false;
        if (activeTab === "all") return true;
        const status = goal.status;
        switch (activeTab) {
            case "active":
                return status === 0;
            case "completed":
                return status === 1;
            case "failed":
                return status === 2;
            default:
                return true;
        }
    });

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">我的目标</h1>
                <Button
                    onClick={() => router.push("/create")}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    创建新目标
                </Button>
            </div>

            <Tabs
                defaultValue="all"
                className="mb-8"
                onValueChange={setActiveTab}
            >
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">全部</TabsTrigger>
                    <TabsTrigger value="active">进行中</TabsTrigger>
                    <TabsTrigger value="completed">已完成</TabsTrigger>
                    <TabsTrigger value="failed">失败</TabsTrigger>
                </TabsList>
            </Tabs>

            {isLoading ? (
                <div className="flex justify-center items-center min-h-[200px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            ) : filteredGoals?.length === 0 ? (
                <div className="text-center py-12">
                    <h3 className="text-xl font-semibold mb-2">
                        {activeTab === "all"
                            ? "还没有创建任何目标"
                            : activeTab === "active"
                            ? "没有进行中的目标"
                            : activeTab === "completed"
                            ? "没有已完成的目标"
                            : "没有失败的目标"}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        {activeTab === "all"
                            ? "创建你的第一个目标，开始你的自我提升之旅"
                            : "继续努力，创建新的目标"}
                    </p>
                    <Button
                        onClick={() => router.push("/create")}
                        variant="outline"
                        className="mx-auto"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        创建目标
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGoals
                        .filter((goal) => goal !== null)
                        .map((goal) => (
                            <GoalCard key={goal.id} goal={goal} />
                        ))}
                </div>
            )}
        </div>
    );
}
