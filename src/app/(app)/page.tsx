import { redirect } from 'next/navigation';

export default function AppHomePage() {
  // The main entry point for the app is now the chat list.
  redirect('/chat');
}
