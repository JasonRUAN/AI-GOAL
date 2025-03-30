"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetOneGoal } from "@/hooks/useGetOneGoal";
import { GoalFields } from "@/types/move";
import {
    CalendarDays,
    Clock,
    Coins,
    MessageSquare,
    ThumbsUp,
    Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useCurrentAccount } from "@mysten/dapp-kit";

interface Witness {
    address: string;
    name: string;
    avatar: string;
    hasVoted: boolean;
}

interface Update {
    date: string;
    content: string;
    proof: string;
}

interface Comment {
    user: string;
    avatar: string;
    date: string;
    content: string;
}
interface GoalDetailProps {
    id: string;
}

export function GoalDetail({ id }: GoalDetailProps) {
    const account = useCurrentAccount();
    const address = account?.address;

    const { data, isPending: loading, error } = useGetOneGoal({ goalId: id });
    if (error) {
        toast.error(`get goal failed: ${error.message}`);
        return;
    }

    if (loading) {
        return <div className="text-center py-12">加载中...</div>;
    }

    if (!data) {
        return <div className="text-center py-12">未找到目标信息</div>;
    }

    const goal = data as GoalFields;
    console.log(JSON.stringify(goal, null, 2));

    const goalData = goal.fields;
    const isCreator = goalData.creator === address;

    const witnesses = goalData.witnesses;
    const isWitness = witnesses.some((witness) => witness === address);

    console.log(`isCreator: ${isCreator}, isWitness: ${isWitness}`);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 目标信息卡片 */}
                <div className="lg:col-span-2">
                    <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-2xl">
                                        {goalData.title}
                                    </CardTitle>
                                    <CardDescription className="flex items-center mt-2">
                                        {/* <Avatar className="h-6 w-6 mr-2">
                                            <AvatarImage
                                                src={goalData.creator.avatar}
                                                alt={goalData.creator.name}
                                            />
                                            <AvatarFallback>
                                                {goalData.creator.name[0]}
                                            </AvatarFallback>
                                        </Avatar> */}
                                        由{" "}
                                        <span
                                            title={goalData.creator}
                                            onClick={() => {
                                                navigator.clipboard.writeText(
                                                    goalData.creator
                                                );
                                                toast.success("地址已复制", {
                                                    position: "top-right",
                                                });
                                            }}
                                            className="cursor-pointer text-blue-500 hover:text-orange-600"
                                        >
                                            {goalData.creator.slice(0, 6) +
                                                "..." +
                                                goalData.creator.slice(-4)}
                                        </span>{" "}
                                        创建
                                    </CardDescription>
                                </div>
                                <Badge
                                    variant={
                                        goalData.status === 1
                                            ? "secondary"
                                            : goalData.status === 2
                                            ? "default"
                                            : "destructive"
                                    }
                                >
                                    {goalData.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <p className="text-gray-700 dark:text-gray-300">
                                {goalData.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex flex-col items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <CalendarDays className="h-5 w-5 text-blue-500 mb-2" />
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        开始日期
                                    </span>
                                    <span className="font-medium">
                                        {format(
                                            new Date(
                                                Number(goalData.created_at)
                                            ),
                                            "yyyy-MM-dd"
                                        )}
                                    </span>
                                </div>
                                <div className="flex flex-col items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    <CalendarDays className="h-5 w-5 text-purple-500 mb-2" />
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        结束日期
                                    </span>
                                    <span className="font-medium">
                                        {format(
                                            new Date(Number(goalData.deadline)),
                                            "yyyy-MM-dd"
                                        )}
                                    </span>
                                </div>
                                <div className="flex flex-col items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <Coins className="h-5 w-5 text-green-500 mb-2" />
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        保证金
                                    </span>
                                    <span className="font-medium">
                                        {Number(goalData.amount) / 10 ** 9} SUI
                                    </span>
                                </div>
                                <div className="flex flex-col items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                    <Clock className="h-5 w-5 text-yellow-500 mb-2" />
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        剩余天数
                                    </span>
                                    <span className="font-medium">
                                        {Math.max(
                                            Math.ceil(
                                                (Number(goalData.deadline) -
                                                    Date.now()) /
                                                    (1000 * 60 * 60 * 24)
                                            ),
                                            0
                                        )}{" "}
                                        天
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">
                                        完成进度
                                    </span>
                                    <span>{goalData.progress_percentage}%</span>
                                </div>
                                <Progress
                                    value={goalData.progress_percentage}
                                    className="h-2"
                                />
                            </div>

                            {/* 重新设计的 AI 建议部分 */}
                            <div className="space-y-2">
                                <div className="flex items-center text-sm">
                                    <span className="font-medium">AI 建议</span>
                                </div>
                                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                                    <p className="text-blue-600 dark:text-blue-300 leading-relaxed">
                                        {goalData.ai_suggestion || "暂无建议"}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium mb-3 flex items-center">
                                    <Users className="h-5 w-5 mr-2 text-blue-500" />
                                    见证人 ({goalData.witnesses.length})
                                </h3>
                                {/* <div className="flex flex-wrap gap-3">
                                    {goalData.witnesses.map(
                                        (witness: any, index: number) => (
                                            <div
                                                key={`witness-${index}`}
                                                className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg"
                                            >
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage
                                                        src={witness.avatar}
                                                        alt={witness.name}
                                                    />
                                                    <AvatarFallback>
                                                        {witness.name[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="text-sm font-medium">
                                                        {witness.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate w-20">
                                                        {witness.address}
                                                    </div>
                                                </div>
                                                {witness.hasVoted && (
                                                    <Badge
                                                        variant="outline"
                                                        className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                    >
                                                        已投票
                                                    </Badge>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div> */}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            {isCreator && (
                                <Button variant="outline">更新进度</Button>
                            )}
                            {isWitness && (
                                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                                    <ThumbsUp className="mr-2 h-4 w-4" />{" "}
                                    确认完成
                                </Button>
                            )}
                            {!isCreator && !isWitness && (
                                <Button variant="outline" disabled>
                                    需要见证人身份
                                </Button>
                            )}
                        </CardFooter>
                    </Card>

                    <Tabs defaultValue="updates" className="mt-8">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="updates">进度更新</TabsTrigger>
                            <TabsTrigger value="comments">评论</TabsTrigger>
                        </TabsList>
                        {/* <TabsContent value="updates" className="mt-4 space-y-4">
                            {goalData.updates.map(
                                (update: any, index: number) => (
                                    <Card key={`update-${index}`}>
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between">
                                                <CardTitle className="text-base">
                                                    {update.date}
                                                </CardTitle>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    查看证明
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p>{update.content}</p>
                                        </CardContent>
                                    </Card>
                                )
                            )}
                        </TabsContent>
                        <TabsContent
                            value="comments"
                            className="mt-4 space-y-4"
                        >
                            {goalData.comments.map(
                                (comment: any, index: number) => (
                                    <div
                                        key={`comment-${index}`}
                                        className="flex space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                    >
                                        <Avatar>
                                            <AvatarImage
                                                src={comment.avatar}
                                                alt={comment.user}
                                            />
                                            <AvatarFallback>
                                                {comment.user[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <h4 className="font-medium">
                                                    {comment.user}
                                                </h4>
                                                <span className="text-sm text-gray-500">
                                                    {comment.date}
                                                </span>
                                            </div>
                                            <p className="mt-1">
                                                {comment.content}
                                            </p>
                                        </div>
                                    </div>
                                )
                            )}
                            <div className="flex items-center space-x-2">
                                <Avatar>
                                    <AvatarFallback>你</AvatarFallback>
                                </Avatar>
                                <Input
                                    placeholder="添加评论..."
                                    className="flex-1"
                                />
                                <Button size="sm">
                                    <MessageSquare className="h-4 w-4 mr-2" />{" "}
                                    发送
                                </Button>
                            </div>
                        </TabsContent>*/}
                    </Tabs>
                </div>

                {/* 侧边栏 */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>目标状态</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">
                                    创建时间
                                </span>
                                <span>
                                    {format(
                                        new Date(Number(goalData.created_at)),
                                        "yyyy-MM-dd"
                                    )}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">
                                    截止时间
                                </span>
                                <span>
                                    {format(
                                        new Date(Number(goalData.deadline)),
                                        "yyyy-MM-dd"
                                    )}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">
                                    剩余时间
                                </span>
                                {Math.max(
                                    Math.ceil(
                                        (Number(goalData.deadline) -
                                            Date.now()) /
                                            (1000 * 60 * 60 * 24)
                                    ),
                                    0
                                )}{" "}
                                天
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">
                                    保证金
                                </span>
                                <span>
                                    {Number(goalData.amount) / 10 ** 9} SUI
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">
                                    见证人数量
                                </span>
                                <span>{goalData.witnesses.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">
                                    已投票见证人
                                </span>
                                {/* <span>
                                    {
                                        goalData.witnesses.filter(
                                            (w: any) => w.hasVoted
                                        ).length
                                    }
                                </span> */}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
