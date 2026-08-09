
import ContextProvider from "@/component/helper/Context";
import HotToast from "@/component/helper/HotToast";
import "./globals.css";


export const metadata = {
  title: "Ecom | New Era of Shopping",
  description: "Ecom | New Era of Shopping",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`overflow-x-hidden h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ContextProvider>
          <HotToast />
          <main>{children}</main>
        </ContextProvider>
      </body>
    </html>
  );
}

