import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoalCard } from "@/components/goal-card";
import {
    ArrowRight,
    Target,
    Users,
    Award,
    Shield,
    Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
    // 创建唯一标识的数据
    const features = [
        {
            id: "feature-1",
            icon: <Target className="h-10 w-10 text-blue-500" />,
            title: "设定目标",
            description: "创建你想要实现的小目标，借助AI帮你规划完成路径",
        },
        {
            id: "feature-2",
            icon: <Sparkles className="h-10 w-10 text-pink-500" />,
            title: "AI规划",
            description: "获取AI规划师的个性化建议，帮助你更好地实现目标",
        },
        {
            id: "feature-3",
            icon: <Users className="h-10 w-10 text-purple-500" />,
            title: "邀请见证人",
            description: "邀请朋友作为你目标的见证人，共同见证你的成长",
        },
        {
            id: "feature-4",
            icon: <Shield className="h-10 w-10 text-green-500" />,
            title: "锁定保证金",
            description: "通过智能合约锁定保证金，确保你对目标的承诺",
        },
        {
            id: "feature-5",
            icon: <Award className="h-10 w-10 text-yellow-500" />,
            title: "完成验证",
            description: "目标完成后，见证人投票确认，你将收回保证金",
        },
    ];

    const goals = [
        {
            id: "goal-1",
            title: "每天跑步5公里",
            duration: "30天",
            stake: "1 SUI",
            witnesses: 3,
            status: "进行中",
            progress: 40,
        },
        {
            id: "goal-2",
            title: "完成前端开发课程",
            duration: "60天",
            stake: "2 SUI",
            witnesses: 2,
            status: "进行中",
            progress: 75,
        },
        {
            id: "goal-3",
            title: "一个月减重5公斤",
            duration: "30天",
            stake: "3 SUI",
            witnesses: 4,
            status: "已完成",
            progress: 100,
        },
    ];

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Hero Section */}
            <section className="flex flex-col items-center text-center mb-20">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight relative">
                        设定目标，
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                            兑现承诺
                        </span>
                    </h1>
                </div>
                <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                    通过区块链技术和朋友见证，让你的每一个小目标都能顺利达成
                </p>
                <div className="mt-10 flex flex-wrap gap-4 justify-center">
                    <Link href="/create">
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        >
                            开始设定目标 <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                    <Button size="lg" variant="outline">
                        了解更多
                    </Button>
                </div>
            </section>

            {/* Features Section */}
            <section className="mb-20">
                <h2 className="text-3xl font-bold text-center mb-12">
                    如何运作
                </h2>
                <div className="flex flex-nowrap overflow-x-auto gap-8 pb-4">
                    {features.map((feature) => (
                        <Card
                            key={feature.id}
                            className="backdrop-blur-sm bg-white/10 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 flex-shrink-0 w-[300px]"
                        >
                            <CardHeader>
                                <div className="mb-4">{feature.icon}</div>
                                <CardTitle>{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Example Goals Section */}
            <section className="mb-20">
                <h2 className="text-3xl font-bold text-center mb-12">
                    热门目标展示
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {goals.map((goal) => (
                        <GoalCard key={goal.id} goal={goal} />
                    ))}
                </div>
                <div className="text-center mt-10">
                    <Button variant="outline">
                        查看更多目标 <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative overflow-hidden rounded-3xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />
                <div className="relative px-6 py-16 text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        准备好实现你的目标了吗？
                    </h2>
                    <p className="text-xl mb-10 max-w-2xl mx-auto">
                        加入我们的平台，通过区块链技术和社交激励，让你的每一个小目标都能顺利达成。
                    </p>
                    <Link href="/create">
                        <Button
                            size="lg"
                            className="bg-white text-blue-600 hover:bg-gray-100"
                        >
                            立即开始 <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
