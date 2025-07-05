import { Button } from "@/components/ui/button";

export default function Topbar() {
  return (
    <header className="flex justify-between items-center p-4 border-b bg-white">
      <h2 className="text-xl font-medium">Dashboard</h2>
      <div className="flex gap-4 items-center">
        <Button variant="outline">Dark Mode</Button>
        <img
          src="https://i.pravatar.cc/40"
          alt="avatar"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </header>
  );
}
