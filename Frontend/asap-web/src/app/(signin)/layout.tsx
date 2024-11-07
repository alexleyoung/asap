import { UserProvider } from "@/contexts/UserContext";

export default function layout({ children }: { children: React.ReactNode }) {
  return <UserProvider>{children}</UserProvider>;
}
