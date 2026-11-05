import type { FC } from "react";
import { redirect } from "next/navigation";

const HomePage: FC = () => redirect("/marketplace");

export default HomePage;
