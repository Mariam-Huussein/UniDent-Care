"use client";

import { store } from "@/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        {children}
        <Toaster
          toastOptions={{
            className: "border border-gray-200 font-medium !shadow-sm",
            success: {
              className: "border-l-4 border-l-green-500",
            },
            error: {
              className: "border-l-4 border-l-red-500",
            },
          }}
        />
      </Provider>
    </QueryClientProvider>
  );
}
