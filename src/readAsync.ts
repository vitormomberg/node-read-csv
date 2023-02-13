import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";

type ItemGroup = {
  key: string;
  value: string;
};

type Item = {
  id: string;
  groups: ItemGroup[];
};

export const handler = ({ event }: any) => {
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

    parse(
      fileContent,
      {
        delimiter: ";",
        columns: headers,
        on_record: (line, context) => {
          if (line.id !== "510098") {
            return;
          }

          return line;
        },
      },
      (error, result) => {
        console.timeLog();

        if (error) {
          console.error(error);
        }

        result.forEach((element: any) => {
          const elementFormatted: ItemGroup = {
            key: archiveName,
            value: JSON.stringify({ ...element, id: undefined }),
          };

          item.groups.push(elementFormatted);
        });
      }
    ).on("end", function () {
      console.timeEnd();
      console.log("finalizou");
      console.log(item);
    });
  });

  console.log("FFOOOOi");
  return item;
};
// handler({ event: { id: "510098" } });
