import { getNotes } from "@/lib/actions/notes";
import { MainLayout } from "@/components/main-layout";

export default async function Home() {
  const notes = await getNotes();

  return <MainLayout initialNotes={notes} />;
}
