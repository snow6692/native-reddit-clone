import { Slot } from "expo-router";
import { ToastProvider } from "react-native-toast-notifications";
import AuthProvider from "../providers/AuthProvider";
import QueryProvider from "../providers/QueryProvider";

export default function RootLayout() {
  return (
    <>
      <ToastProvider placement="top">
        <QueryProvider>
          <AuthProvider>
            <Slot />
          </AuthProvider>
        </QueryProvider>
      </ToastProvider>
    </>
  );
}
