import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { content } = await request.json();

        if (!content) {
            return NextResponse.json(
                { error: "请提供目标内容" },
                { status: 400 }
            );
        }

        // 解析content中的标题和描述
        const titleMatch = content.match(/目标标题：(.*?)(\n|$)/);
        const descriptionMatch = content.match(/目标描述：(.*?)(\n|$)/);

        const title = titleMatch ? titleMatch[1] : "";
        const description = descriptionMatch ? descriptionMatch[1] : "";

        if (!title || !description) {
            return NextResponse.json(
                { error: "内容格式不正确，无法提取标题或描述" },
                { status: 400 }
            );
        }

        // 这里可以集成实际的 AI API，如 OpenAI 等
        // 示例实现：基于目标内容生成简单建议
        const suggestion = generateSuggestion(title, description);

        return NextResponse.json({ suggestion });
    } catch (error) {
        console.error("生成建议出错:", error);
        return NextResponse.json(
            { error: "服务器错误，无法生成建议" },
            { status: 500 }
        );
    }
}

// 模拟 AI 生成建议的函数
function generateSuggestion(title: string, description: string): string {
    // 提取目标关键词
    const keywords = [...title.split(" "), ...description.split(" ")]
        .filter((word) => word.length > 2)
        .map((word) => word.toLowerCase());

    // 基于不同类型的目标提供不同建议
    if (
        keywords.some((word) => ["跑步", "运动", "健身", "锻炼"].includes(word))
    ) {
        return `为了达成你的${title}目标，建议你：\n\n1. 制定每周详细的锻炼计划，逐步增加强度\n2. 购买一个运动追踪设备记录进度\n3. 找一位运动伙伴增加坚持动力\n4. 在休息日进行适当拉伸，避免运动损伤\n5. 保持充分水分和良好饮食习惯`;
    }

    if (
        keywords.some((word) => ["学习", "读书", "技能", "知识"].includes(word))
    ) {
        return `针对你的${title}目标，我有以下建议：\n\n1. 将大目标拆分为每天可完成的小任务\n2. 使用番茄工作法提高学习效率\n3. 找到适合自己的学习时间，保持规律\n4. 定期复习和测试，巩固知识点\n5. 加入学习社区，与他人分享进度`;
    }

    if (
        keywords.some((word) =>
            ["戒烟", "戒酒", "戒糖", "不良习惯"].includes(word)
        )
    ) {
        return `关于${title}，这些方法可能对你有帮助：\n\n1. 记录触发不良习惯的场景和情绪\n2. 找到健康的替代活动\n3. 告诉朋友和家人你的目标，寻求支持\n4. 使用渐进式方法，不要操之过急\n5. 奖励自己的每一步进步，哪怕很小`;
    }

    // 默认建议
    return `关于你的"${title}"目标，以下建议可能有帮助：\n\n1. 制定具体、可衡量、可实现、相关和有时限的目标计划\n2. 将大目标分解为小的可执行步骤\n3. 建立定期检查进度的机制\n4. 寻找志同道合的伙伴或加入相关社区\n5. 记录你的进步，并在达成小目标时给予自己适当奖励`;
}
