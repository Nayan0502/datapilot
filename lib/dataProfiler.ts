
export type DataRow = Record<string, string>;

export type ColumnProfile = {
  name: string;
  type: "number" | "string";
  totalValues: number;
  missingValues: number;
  uniqueValues: number;
  min?: number;
  max?: number;
  average?: number;
};

export type DatasetProfile = {
  totalRows: number;
  totalColumns: number;
  columns: ColumnProfile[];
};

function isNumeric(value: string): boolean {
  if (value.trim() === "") return false;

  const number = Number(value);

  return Number.isFinite(number);
}

export function profileDataset(
  headers: string[],
  rows: string[][]
): DatasetProfile {
  const columns: ColumnProfile[] = headers.map(
    (header, columnIndex) => {
      const values = rows.map(
        (row) => row[columnIndex]?.trim() ?? ""
      );

      const nonEmptyValues = values.filter(
        (value) => value !== ""
      );

      const numericValues = nonEmptyValues
        .filter(isNumeric)
        .map(Number);

      const isNumberColumn =
        nonEmptyValues.length > 0 &&
        numericValues.length === nonEmptyValues.length;

      const uniqueValues = new Set(nonEmptyValues).size;

      const profile: ColumnProfile = {
        name: header,
        type: isNumberColumn ? "number" : "string",
        totalValues: values.length,
        missingValues: values.filter(
          (value) => value === ""
        ).length,
        uniqueValues,
      };

      if (isNumberColumn && numericValues.length > 0) {
        const total = numericValues.reduce(
          (sum, value) => sum + value,
          0
        );

        profile.min = Math.min(...numericValues);
        profile.max = Math.max(...numericValues);
        profile.average = total / numericValues.length;
      }

      return profile;
    }
  );

  return {
    totalRows: rows.length,
    totalColumns: headers.length,
    columns,
  };
}