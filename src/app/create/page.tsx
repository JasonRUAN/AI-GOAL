import { CreateGoalForm } from "@/components/CreateGoalForm";

export default function CreateGoalPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-center mb-8">创建新目标</h1>
            <CreateGoalForm />
        </div>
    );
}
