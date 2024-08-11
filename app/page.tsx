import { UserInput } from "../components/UserInputForm";

const Page = () => {
  return <UserInput apiKey={process.env.GEMINI_API_KEY as string} />;
};

export default Page;
