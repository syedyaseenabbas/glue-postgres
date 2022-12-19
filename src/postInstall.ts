import { copyToTarget } from "./copyToTarget";
//@ts-ignore
import services from "../meta/services.json";

export async function postInstall(targetFolder: string) {
  const postgres = services.filter((service: any) => {
    return service.name === "postgres";
  })[0];
  if (postgres.directory) {
    await copyToTarget(
      `${process.cwd()}/node_modules/@gluestack/postgres/${postgres.directory}`,
      targetFolder,
    );
  }
}
