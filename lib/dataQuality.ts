export type QualityIssue = {
  type: string;
  column?: string;
  count: number;
  message: string;
};

export type DataQualityReport = {
  totalRows: number;
  totalColumns: number;
  missingCells: number;
  duplicateRows: number;
  emptyColumns: number;
  invalidNumericValues: number;
  qualityScore: number;
  issues: QualityIssue[];
};

function isEmpty(value: string | undefined): boolean {
  return value === undefined || value.trim() === "";
}

function isNumeric(value: string): boolean {
  if (value.trim() === "") {
    return false;
  }

  return !Number.isNaN(Number(value));
}

export function analyzeDataQuality(
  headers: string[],
  rows: string[][]
): DataQualityReport {
  const totalRows = rows.length;
  const totalColumns = headers.length;

  let missingCells = 0;
  let duplicateRows = 0;
  let emptyColumns = 0;
  let invalidNumericValues = 0;

  const issues: QualityIssue[] = [];

  /*
   * 1. Check missing values
   */
  rows.forEach((row) => {
    headers.forEach((_, columnIndex) => {
      if (isEmpty(row[columnIndex])) {
        missingCells++;
      }
    });
  });

  if (missingCells > 0) {
    issues.push({
      type: "Missing Values",
      count: missingCells,
      message: `${missingCells} missing value(s) found in the dataset.`,
    });
  }

  /*
   * 2. Check duplicate rows
   */
  const rowMap = new Map<string, number>();

  rows.forEach((row) => {
    const normalizedRow = headers.map(
      (_, index) => row[index] ?? ""
    );

    const rowKey = JSON.stringify(normalizedRow);

    rowMap.set(rowKey, (rowMap.get(rowKey) ?? 0) + 1);
  });

  rowMap.forEach((count) => {
    if (count > 1) {
      duplicateRows += count - 1;
    }
  });

  if (duplicateRows > 0) {
    issues.push({
      type: "Duplicate Rows",
      count: duplicateRows,
      message: `${duplicateRows} duplicate row(s) found.`,
    });
  }

  /*
   * 3. Check completely empty columns
   */
  headers.forEach((header, columnIndex) => {
    const allEmpty = rows.every((row) =>
      isEmpty(row[columnIndex])
    );

    if (allEmpty) {
      emptyColumns++;

      issues.push({
        type: "Empty Column",
        column: header,
        count: 1,
        message: `Column "${header}" contains no data.`,
      });
    }
  });

  /*
   * 4. Detect numeric columns and invalid numeric values
   *
   * A column is considered numeric if at least 50%
   * of its non-empty values are numeric.
   */
  headers.forEach((header, columnIndex) => {
    const values = rows
      .map((row) => row[columnIndex] ?? "")
      .filter((value) => !isEmpty(value));

    if (values.length === 0) {
      return;
    }

    const numericCount = values.filter(isNumeric).length;

    const numericRatio = numericCount / values.length;

    if (numericRatio >= 0.5) {
      const invalidCount = values.filter(
        (value) => !isNumeric(value)
      ).length;

      if (invalidCount > 0) {
        invalidNumericValues += invalidCount;

        issues.push({
          type: "Invalid Numeric Values",
          column: header,
          count: invalidCount,
          message: `Column "${header}" contains ${invalidCount} invalid numeric value(s).`,
        });
      }
    }
  });

  /*
   * 5. Calculate quality score
   *
   * This is a heuristic score for the DataPilot demo.
   */
  let qualityScore = 100;

  if (totalRows > 0 && totalColumns > 0) {
    const totalCells = totalRows * totalColumns;

    const missingPenalty =
      (missingCells / totalCells) * 40;

    const duplicatePenalty =
      (duplicateRows / totalRows) * 25;

    const emptyColumnPenalty =
      (emptyColumns / totalColumns) * 20;

    const invalidNumericPenalty =
      (invalidNumericValues / totalCells) * 15;

    qualityScore =
      100 -
      missingPenalty -
      duplicatePenalty -
      emptyColumnPenalty -
      invalidNumericPenalty;
  }

  qualityScore = Math.round(
    Math.max(0, Math.min(100, qualityScore))
  );

  return {
    totalRows,
    totalColumns,
    missingCells,
    duplicateRows,
    emptyColumns,
    invalidNumericValues,
    qualityScore,
    issues,
  };
}