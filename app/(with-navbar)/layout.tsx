import { Navbar } from "@/components/custom-ui/navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { defaultLocale, getLocaleConfig } from "@/consts/locales";
import { StudentData } from "@/types/student";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const locale = getLocaleConfig(defaultLocale);
  const studentData: StudentData = {
    // TODO: add actual user data fetch from login session/cookies/db
    classCode: "7F3A",
    studentCode: "K9X4",
    coins: 320,
  };

  return (
    <div className="flex w-screen h-screen flex-col px-6 gap-4">
      <Navbar studentData={studentData} />
      <div className="flex min-h-0 w-full grow">
        <ScrollArea className="size-full" dir={locale.direction}>
          {children}
        </ScrollArea>
      </div>
    </div>
  );
};

export default Layout;
