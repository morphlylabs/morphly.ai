import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import SignIn from "../../../components/sign-in";
import SignUp from "../../../components/sign-up";

export default function SignInPage() {
  return (
    <div className="mt-3 flex w-full flex-col items-center justify-center">
      <Tabs defaultValue="sign-in" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sign-in">Sign In</TabsTrigger>
          <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="sign-in">
          <SignIn />
        </TabsContent>
        <TabsContent value="sign-up">
          <SignUp />
        </TabsContent>
      </Tabs>
    </div>
  );
}
