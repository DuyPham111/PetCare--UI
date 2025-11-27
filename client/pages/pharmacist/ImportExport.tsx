import PharmacistHeader from "@/components/PharmacistHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function ImportExport() {
    const { user } = useAuth();
    if (!user || user.role !== 'pharmacist') return <Navigate to="/login" />;

    const exportCsv = () => alert('Export CSV — mock');
    const importCsv = () => alert('Import CSV dialog — mock');

    return (
        <div className="min-h-screen bg-gray-50">
            <PharmacistHeader />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-3">Import / Export</h1>
                <p className="text-muted-foreground mb-6">Export or import medication & prescription data (UI only)</p>

                <Card className="p-6 border border-border max-w-xl">
                    <div className="flex flex-col gap-3">
                        <Button onClick={exportCsv} className="bg-primary text-white">Export CSV</Button>
                        <Button variant="outline" onClick={importCsv}>Import CSV</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
