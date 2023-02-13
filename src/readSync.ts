import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse/sync";

type ItemGroup = {
  key: string;
  value: string;
};

type Item = {
  id: string;
  groups: ItemGroup[];
};

export const handler = ({ event }: any) => {
  const id = event.id || "123";

  console.time();
  const directory = path.resolve(__dirname, "archives");

  const headers = ["id", "firstname", "lastname", "profession"];

  const archivesNames = fs.readdirSync(directory, { encoding: "utf-8" });

  console.log(archivesNames);

  const item: Item = {
    id: "123",
    groups: [],
  };

  archivesNames.map((archiveName) => {
    const fileContent = fs.readFileSync(`${directory}/${archiveName}`, {
      encoding: "utf-8",
    });

    const records = parse(fileContent, {
      delimiter: ";",
      columns: headers,
      on_record: (line) => {
        if (line.id !== id) {
          return;
        }

        return line;
      },
    });

    records.forEach((element: any) => {
      const elementFormatted: ItemGroup = {
        key: archiveName,
        value: JSON.stringify({ ...element, id: undefined }),
      };

      item.groups.push(elementFormatted);
    });
  });

  console.log(item);
  console.timeEnd();

  console.log("FFOOOOi");
  return item;
};
