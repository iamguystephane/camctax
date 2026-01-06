import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from 'next/link';

export default function WizardHeader() {
  return (
    <header className="bg-white border-b h-16 flex items-center px-4 md:px-8 sticky top-0 z-10">
      <Link href="/">
        <Button variant="ghost" size="sm" className="mr-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Exit
        </Button>
      </Link>
      <div className="font-display font-bold text-lg">
        Onboarding
      </div>
    </header>
  );
}
