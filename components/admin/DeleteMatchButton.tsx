"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";

export function DeleteMatchButton({ slug }: { slug: string }) {
  const router = useRouter();

  async function onDelete() {
    if (!window.confirm(`Delete match "${slug}"? This cannot be undone.`)) {
      return;
    }
    const response = await fetch(`/api/admin/matches/${slug}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const data = await response.json();
      alert(data.error || "Delete failed");
      return;
    }
    router.refresh();
  }

  return (
    <Button type="button" variant="ghost" onClick={onDelete} className="text-red-700">
      Delete
    </Button>
  );
}
