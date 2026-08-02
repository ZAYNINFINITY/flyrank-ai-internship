import { useSearchParams } from "next/navigation";

export function useDoorEntry(): string | null {
  const searchParams = useSearchParams();
  return searchParams.get("via");
}
