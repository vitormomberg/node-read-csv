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

export const handler = async ({ event }: any) => {
  console.time("lambda");
  const directory = path.resolve(__dirname, "archives");

  const headers = ["id", "firstname", "lastname", "profession"];

  const archivesNames = fs.readdirSync(directory, { encoding: "utf-8" });

  console.log(archivesNames);

  const item: Item = {
    id: "123",
    groups: [],
  };

  const promises = archivesNames.map((archiveName) => {
    return new Promise(async (resolve, reject) => {
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
            reject(error);
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
        console.log("finalizou");
        console.log(item);
        console.timeEnd();
        resolve(item);
      });
    });
  });

  const teste = await Promise.all(promises);
  console.log(teste);
  console.log("FFOOOOi");
  console.timeEnd("lambda");
  return item;
};
handler({ event: { id: "510098" } });
