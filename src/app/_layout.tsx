import { Slot } from "expo-router";
import { ToastProvider } from "react-native-toast-notifications";
import AuthProvider from "../providers/AuthProvider";

export default function RootLayout() {
  return (
    <>
      <ToastProvider placement="top">
        <AuthProvider>
          <Slot />
        </AuthProvider>
      </ToastProvider>
    </>
  );
}
